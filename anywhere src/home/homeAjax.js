function getStaffActivity(callback) {
    var rowId = 1,
        todaysClockInTime = "",
        lastClockOut = "",
        timeClockDate = getDBDateNow(),
        timeOverlapError = false;
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getStaffActivity/",
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + timeClockDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res;
            try {
                res = JSON.stringify(response);
                callback(null, res);
            }
            catch (e) {
                callback("Could not retrieve Staff Activity", null);
            }
            /*
            var res = JSON.stringify(response);
            callback(null, res);
            */
            //alert('success: ' + res + res.length);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
            callback(error, null);
        },
        complete: function (jqXHR, status) {
            showDownArrow(); //alert('Status: ' + status + '\njqXHR: ' + JSON.stringify(jqXHR)); 
        }
    });
}

function clockInStaff() {
    var locationId = '';
    var locationId = readCookie('defaultTimeClockLocationValue');    
    if (locationId == null || locationId == '') {
        locationId = 0;
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/clockInStaff/",
        data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: !' + res + ' ' + $.session.Token);
            if (res.indexOf('517') > -1) {
                $('#alerttimestamp').text('You do not have an active staff location assigned to you.');
            }
            if (res.indexOf('611') > -1) {
                $('#alerttimestamp').text('You are not assigned as Day Service Staff');
            }
            if (res.indexOf('612') > -1) {
                $('#alerttimestamp').text('You do not have an active staff location assigned to you.');
            }
            if (res.indexOf('610') > -1) {
                $('#alerttimestamp').text('You are already clocked in!');
            }
            if (res.indexOf('613') > -1) {
                window.timeOverlapError = true;
            } else {
                window.timeOverlapError = false;  //needed to reset previous error value
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
        },
        complete: function (jqXHR, status) {
            getStaffActivity(processStaffActivity);
        }
    });
}

function clockOutStaff() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/clockOutStaff/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n'+ xhr.responseText); },
        complete: function (jqXHR, status) {
            getStaffActivity(processStaffActivity);
        }
    });
}

function updateStaffClockTime(tagid, isStartTime, loc) {
    //if ($.session.DenyClockUpdate == true) {
    //    return;
    //}
    if (!validateStaffTime(tagid, $('#' + tagid).val())) {
        getStaffActivity(processStaffActivity);
        return;
    }
    if ($.session.initialTimeOut != "") {
        var checkedAgainstTime = $.session.initialTimeOut;
    }
    if ($.session.initialTimeIn != "") {
        var checkedAgainstTime = $.session.initialTimeIn;
    }
    var orgTagName = tagid;
    if (orgTagName.indexOf("out") > -1) orgTagName = orgTagName.replace("out", "in"); //orgTag is time in. Even if Out.
    var orgTime = convertTimeToMilitary($('#' + orgTagName).attr('org'));
    var newTime = convertTimeToMilitary($('#' + tagid).val());
    if (orgTime == "aN:aN") orgTime = $('#' + orgTagName).attr('org');
    if (newTime == "aN:aN") newTime = $('#' + tagid).val();
    //alert("tagid=" + tagid + " " + orgTime + " " + newTime + " " + loc + " rawTag=" + $('#'+tagid).val() + " " + $('#'+tagid).attr('org'));
    if (orgTime == "00:00") {
        var newtag = $('#' + tagid).attr('orgtag');
        orgTime = TwelveTo24($('#' + newtag).attr('org'));
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/updateStaffClockTime/",
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + getDBDateNow() + '", "orginalTime":"' + orgTime + '", "newTime":"' + newTime +
            '", "isClockIn":"' + isStartTime + '", "checkedAgainstTime":"' + checkedAgainstTime + '","location":"' + loc + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
            //check is c# catch error is generated, if so set error text
            if (res.indexOf('613') > -1) {
                window.timeOverlapError = true;
            } else {
                window.timeOverlapError = false;  //needed to reset previous error value
            }
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n'+ xhr.responseText); },
        complete: function (jqXHR, status) {
            getStaffActivity(processStaffActivity);

            // the length is 1 because the one row being clicked still exists at this point.  If more than one exist you are still clocked in
            if ($('clockrow').length == 1) {
                $('#alerttimestamp').text('You are not clocked in.');
            }
        }
    });
    $.session.initialTimeOut = "";
    $.session.initialTimeIn = "";
}

function getDBDateNow() {
    var d = new Date();
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-");
    //return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join("-");
}

function getLocationNameFromId(id) {
    for (var i in $.session.locations) {
        if ($.session.locationids[i] == id) return $.session.locations[i];
    }
}

//Get stuff that is needed because it was in 1.0
function getSystemMessagesAndCustomLinks(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getSystemMessagesAndCustomLinks/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function getSystemMessagesAndCustomLinksSuccess(response, status, xhr) {
            var res;
            try {
                res = JSON.stringify(response);
                callback(null, res);
            }
            catch(e) {
                callback("Could not retrieve messages and link", null)
            }
            
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });
}
//ANYW_Dashboard_GetSingleEntryCountInfo
function getSingleEntryCountInfo(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getSingleEntryCountInfo/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            callback(error, null)
        },
    });
}

//ANYW_Dashboard_GetRemainingGoalsCount
function getRemainingGoalsCountForDashboard(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getRemainingGoalsCountForDashboard/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            callback(error, null);
        },
    });
}

function getSingleEntryAdminApprovalNumbers(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getSingleEntryAdminApprovalNumbers/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            callback(error, null)
        },
    });
}

function getLocationsForDashboardDayServices(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getDashboardDayServicesLocations/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getLocationsForDashboardAbsent(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getLocations/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (res.match("Error getting Locations")) {
                callback("Error getting locations", null);
            }
            else {
                var arr = [];
                $("location", res).each(function (ind, el) {
                    var tmpName = $('Name', this).text();
                    var tmpId = $('ID', this).text();
                    var tmpRes = $('Residence', this).text();

                    arr.push({
                        text: tmpName,
                        id: tmpId,
                        residence: tmpRes,
                    });
                });
                arr.push({
                    text: "ALL",
                    id: "000",
                    residence: "Y",
                })
                $.session.absentLocationsArray = arr;
                callback(null, arr);
            }
            //callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getConsumerGroupsForDashboardAbsent(locationId, callback) {
    var data = {};
    data.token = $.session.Token;
    data.locationId = locationId;
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getConsumerGroups/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (res.match("Error getting Custom Groups")) {
                callback("Error getting Custom Groups", null);
            }
            else {
                var arr = [];
                $('group', res).each(function () {
                    var tmpCode = $('GroupCode', this).text();
                    var tmpId = $('RetrieveID', this).text();
                    var tmpName = $('GroupName', this).text();
                    arr.push({
                        text: tmpName,
                        id: tmpId,
                        code: tmpCode,
                    });
                });
                //console.log(data);
                arr = arr.filter(function (el) {
                    //console.log(el.code, el.code == "ALL" || el.code == "CST");
                    return el.code == "ALL" || el.code == "CST";
                })
                callback(null, arr);
            }
            //callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getClockedInDayServicesAtLocationCountsAjax(locationId, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getClockedInDayServicesAtLocationCounts/",
        data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getClockedInConsumerNamesDayServicesAjax(locationId, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getClockedInConsumerNamesDayServices/",
        data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getClockedInStaffNamesDayServicesAjax(locationId, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getClockedInStaffNamesDayServices/",
        data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getInfalLoginCredentialsAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getInfalLoginCredentials/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.parse(response.getInfalLoginCredentialsResult);
            if (res[0] && res[0].App_Password) ID = res[0].App_Password;
            if (ID = 0) {
                //go  get ssn and use it to get emp id from infal, pass it along and then update user application cred table
            }
            callback(null, res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getHoursWorked(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getCompanyWorkWeekAndHours/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //var res = JSON.parse(response.getCompanyWorkWeekAndHoursResult);
            var res = response.getCompanyWorkWeekAndHoursResult;
            //var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getWorkWeeks(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getWorkWeeks/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //var res = JSON.parse(response.getWorkWeeksResult);
            var res = response.getWorkWeeksResult;
            //var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getSchedulingPeriodsAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getSchedulingPeriods/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //var res = JSON.parse(response.getWorkWeeksResult);
            var res = response.getSchedulingPeriodsResult;
            //return console.log(res);
            //var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getSchedulingPeriodsDetailsAjax(filterData, callback) {//Filter data to include token, startDate, endDate
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getSchedulingPeriodsDetails/",
        data: JSON.stringify(filterData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //var res = JSON.parse(response.getWorkWeeksResult);
            var res = response.getSchedulingPeriodsDetailsResult;
            //var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function getAbsentWidgetFilterDataAjax(filterData, callback) {//filterData to include token, absentDate, absentLocationId, absentGroupCode
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getAbsentWidgetFilterData/",
        data: JSON.stringify(filterData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = JSON.parse(response.getAbsentWidgetFilterDataResult);

                callback(null, res);
            }
            catch (e) {
                callback("Could not parse Absent Widget Filter", null);
            }
            
        },
        error: function (xhr, status, error) {
            callback(error, null);
        }
    });
}

function changeFromPSIAjax(userId, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/changeFromPSI/",
        data: '{"token":"' + $.session.Token + '", "userID":"' + userId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //errorMessage = "";
            //alert('success: ' + res);
            eraseCookie('psiuser');
            var overlay = document.createElement('div');
            if ($('permissions', res).is('*') && (checkforErrors(res) == 0)) {
                eraseCookie('psi');
                createCookie('psi', res, 1);
                success = true;
                document.location.href = 'anywhere.html';
            } else if (res.indexOf('609') > -1) {
                //$("#error").css("display", "block");
                //checkForErrors();
                customPasswordChange()
            } else {
                $("#error").css("opacity", "1");
                $("#error").css("display", "block");
                if ($("#error").hasClass("hippaRestriction")) {
                    $(".err").css("top", "350px");
                    $(".errortext").css("top", "-22px");
                    $(".errorpic").css("top", "0px");
                    $("#errortext").text("Password cannot match a recently used password");
                } else if ($("#error").hasClass("userInputError")) {
                    $(".err").css("top", "350px");
                    $(".errortext").css("top", "-22px");
                    $(".errorpic").css("top", "0px");
                    $("#errortext").text("Invalid username or password");
                } else if (res.indexOf('608') > -1) {
                    $("#errortext").text("This user name does not exist in demographics.");
                } else {
                    $("#errortext").text("Login unsuccessful");
                }
            }
        },
        error: function (xhr, status, error) {
            //alert(
            //   "There was a problem connecting to the database. Please click OK to continue. If the problem persists, please contact Primary Solutions." +
            //   xhr.status + '\n' + xhr.responseText);
        },
        complete: function () {
            // hide gif here, eg:
            $('body').css('cursor', 'auto');
        }
    });
}    //postError("100", "This is a tricky error", "DEBUG");

