var displayTimeSelect = "Y";
var validateError = "";
var numberOfCards = 4;

function processStaffActivity(err, res, callback) {
    if (err) {
        console.log(err);
        return;
    }
    var rowId = 1;
    var todaysClockInTime = "";
    var lastClockOut = "";
    var timeClockDate = getDBDateNow();
    var timeOverlapError = false;
    var optionsHtml = [];
    var parentNode = $('#timeclockdropdown'); // <-- change to your parent node name for clock data
    var errors = 0;
    $('ErrDesc', res).each(function () {
        errors++;
        tmpErrDesc = $(this).text();
        $('#alerttimestamp').text(tmpErrDesc);//
    });
    if (errors == 0) {
        $('result', res).each(function () {
            tmpStaffId = $('Staff_ID', this).text();
            tmpLocId = $('Location_ID', this).text();
            tmpStartTime = $('Start_Time', this).text();
            tmpStopTime = $('Stop_Time', this).text();
            tmpDescription = $('Description', this).text();
            tmpCode = $('location_code', this).text();
            $.session.StaffLocId = tmpLocId;
            if (tmpStartTime == "23:59:59") {
                tmpStartTime = "00:00:00";
            }
            if (tmpStopTime == "23:59:59") {
                tmpStopTime = "00:00:00";
            }
            startTime = convertMilitaryTimeToAMPM(tmpStartTime);
            stopTime = convertMilitaryTimeToAMPM(tmpStopTime);
            if (stopTime == '00:00 AM' || stopTime == ': AM' || stopTime == '00: AM') {
                stopTime = "";
            }
            pushStr = "<clockrow id='" + rowId +
                "' class='clockrow'><clocktext class='clocktext boxcenter'><stafflocation id='stafflocation" + rowId +
                "' class='stafflocationnorm roundededge'";
            pushStr = pushStr + " onClick='popLocationStaffClock(event);'";
            pushStr = pushStr + " locid=" + tmpLocId + " >" + tmpDescription + tmpCode + "</stafflocation>";
            pushStr = pushStr +
                '<locationpopupbox id="locationpop" class="homelocationpop" style="display:none;"><locationscrollbox class="locationscrollbox"></locationscrollbox></locationpopupbox>'
            pushStr = pushStr + "<input id=timein" + rowId + " class='timein roundededge'";
            if ($.session.DenyStaffClockUpdate == false) {
                pushStr = pushStr + " onChange=updateStaffClockTime('timein" + rowId + "',0,'" + tmpLocId +
                    "') onClick=popDayStaffTimeBox('timein" + rowId + "',event)";
            } else {
                pushStr = pushStr + " readonly ";
            }
            if (startTime == 'aN:aN AM') {
                startTime = tmpStartTime;
            }
            pushStr = pushStr + " value='" + startTime + "' org='" + startTime + "'></input>";
            pushStr = pushStr + "<input id=timeout" + rowId + " class='timeout roundededge'";
            if ($.session.DenyStaffClockUpdate == false) {
                pushStr = pushStr + " onChange=updateStaffClockTime('timeout" + rowId + "',1,'" + tmpLocId +
                    "') onClick=popDayStaffTimeBox('timeout" + rowId + "',event)";
            } else {
                pushStr = pushStr + " readonly ";
            }
            if (stopTime == 'aN:aN AM') {
                stopTime = tmpStopTime;
            }
            pushStr = pushStr + " value='" + stopTime + "' org='" + stopTime + "' orgtag='timein" + rowId +
                "'></input><stafflocationdelete id='stafflocationdelete' tagid='timein" + rowId + "' isStartTime='3' loc='" + tmpLocId + "' class='stafflocationdelete'><xtext>X</xtext></stafflocationdelete></clocktext></clockrow>";
            optionsHtml.push(pushStr);
            if (rowId >= 0) todaysClockInTime = startTime;
            lastClockOut = stopTime;
            rowId++;
        });
    } else { }
    optionsHtml = optionsHtml.join('');
    parentNode.html(optionsHtml).find("stafflocationdelete").each(function (ind, el) {
        $(el).click(function () {
            var t = $(this);
            var tagid = t.attr("tagid");
            var isStartTime = t.attr("isStartTime");
            var loc = t.attr("loc");
            Anywhere.promptYesNo("Are you sure you wish to delete this clock in?", function() {
                updateStaffClockTime(tagid, isStartTime, loc);
            })
        });
    });
    //if user is not clocked in
    $('#alerttimestamp').css("color", "#FC9983");
    if (todaysClockInTime == '' || $('#alerttimestamp').text() == '') {
        if (errors == 0) {
            var t = $('#alerttimestamp').text().length;
            if ($('#alerttimestamp').text().length < 3) {
                $('#alerttimestamp').text('You are not clocked in.');
            }
        }
        //$('#alerttimestamp').css("color", "rgb(112, 177, 216)");
    } else {
        var text = $('#alerttimestamp').text();
        if ($('#alerttimestamp').text() == 'You are not clocked in.' && lastClockOut == "") {
            //Added line below, removed line below it for ticket #21517. Looks like it work. 9/28/15
            $('#alerttimestamp').text('');
            $('#alerttimestamp').text('Clocked in at: ' + todaysClockInTime);
            $('#alerttimestamp').css("color", "rgb(112, 177, 216)");
        } else if (text.indexOf("Clocked in at:") != -1) {
            $('#alerttimestamp').text('You are not clocked in.');
        }

    }
    if (lastClockOut == '') {
        $('#clockbuttontext').text('Clock Out');
    } else {
        $('#clockbuttontext').text('Clock In');
    }
    if (rowId == 1) {
        $('#clockbuttontext').text('Clock In');
    }
    if (errors > 0) {
        $('#clockbutton').css("opacity", "0");
        $('#clockbutton').css("display", "none");
    }
    if (validateError.length > 0) {
        $('#alerttimestamp').css("color", "#FC9983");
        $('#alerttimestamp').text(validateError);
        validateError = "";
    }
    if (window.timeOverlapError == true) {
        $('#alerttimestamp').css("color", "#FC9983");
        $('#alerttimestamp').text("Time overlap error");
    }
    //optionsHtml = optionsHtml.join('');
    //parentNode.html(optionsHtml); */
    if (rowId > 1) {
        popTimeClock(event);
    }
    if (readCookie('stafftimeclock') == "0") {
        popTimeClock(event);
    }
    if(callback) callback();
}

function homeServiceLoad(myFirstLoad) {
    if (readCookie('psiuser') != null) {
        $.session.isPSI = true;
        setUpAdminPermissions();
        $("#firstName").text('PSI');
        $("#firstName").click(function () {
            displayChangeUser();
        });
        $("#lastName").text('');
    }
    firstLoad = true;
    // Was targeting consumerpane to hide, change to target Outerconsumerpane - Ash 8/23
    $("#outerconsumerpane").hide();
    //$(".consumerpane").css("display", "none");
    $('#gear').attr("src", "./Images/new-icons/settings2.png");
    $('settings').removeClass("settings").addClass("settings2");
    $("#actionbanner").html("");
    if (myFirstLoad == true && $.session.isPSI == true && false) {
    //if (myFirstLoad == true) {
        //$.session.UserId = tmpSpec;
        var overlay = $("<div>")
        .addClass("modaloverlay")
        .css({
            "backgroundColor": "rgba(0, 0, 0, 0.15)"
        }).appendTo($("body"));

        $.ajax({
            type: "GET",
            url: "./home/autologin.html?RNG=" + +(new Date()),
            success: function (HTMLresponse, status, xhr) {
                //buildAbsentCard({ card: $("<div>").replaceWith(HTMLresponse), overlay: overlay, values: values, multi: true });
                var card = $("<div>").replaceWith(HTMLresponse);
                getPSIUserOptionListAjax(function (err, data) {
                    overlay.click(function () {
                        $(this).remove();
                    }).append(card);

                    card.click(function (e) {
                        e.stopPropagation();
                    }).bind("remove", function () {
                        overlay.remove();
                    });
                    data.forEach(function (user) {
                        var li = $("<li>").text([user.last_name, +',' +user.first_name ].join(", "));
                        li.click(function () {
                            $.session.UserId = user.user_id;
                            homeServiceLoad(false);
                            card.trigger("remove");
                        });
                        $("#autologinlist").append(li);
                        //$("#autologinlist").append("<li>" )
                    })
                })
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        })
        return;
    }
    var dashContainer = $("<div>").attr("class", "dashboard-container"),
        divs = [],
        myPromises = [],
        myFunctions = [],
        myFinishedFunctions = [],
        overlay = null,
        message = null;

    $("#actioncenter").append(dashContainer);
    $("#singlebutton").addClass("buttonhighlight");
    
    function getHTMLThenReplay(URL, target, callback) {
        return new Promise(function (fulfill, reject) {
            $.ajax({
                type: "GET",
                url: URL + "?RNG=" + +(new Date()),
                success: function (response, status, xhr) {
                    target.replaceWith(response);
                    if (callback) callback(response);
                    fulfill();
                    //Put here for time being. It puts the title in fater plus it does not show it changing from a default.
                    if ($.session.SEViewAdminWidget === true) {
                        $("#dashsingentrylabel").html("My Unapproved Time Entries");
                    } else {
                        $("#dashsingentrylabel").html("My Unsubmitted Time Entries");
                    }
                },
                error: function (xhr, status, error) {
                    reject(error);
                }
            });
        });
    }

    function addFunction(func, ind) {
        if(ind != undefined) {
            myFunctions.splice(ind, 0, func);
        }
        else {
            myFunctions.push(func);
        }
    }

    function checkFunctions(desc) {
        myFinishedFunctions.push(desc);
        if (desc.toUpperCase() == "ERROR") {
            //overlay.remove();
            throw "Something stopped working with this; please check the stack. " + myFinishedFunctions.join(", ");
        }
        if (myFinishedFunctions.length < myFunctions.length) {
            message.html("Loaded " + myFinishedFunctions.length + " out of " + myFunctions.length);
            //console.log("almost done " + myFinishedFunctions.join(", "));
        }
        else if (myFinishedFunctions.length == myFunctions.length) {
            overlay.remove();
            //console.log("done " + myFinishedFunctions.join(", "));
        }
        else if (myFinishedFunctions.length > myFunctions.length) {
            //console.log("...Wait, what? " + myFinishedFunctions.join(", "));
        }
    }

    // Absent Widget
    if (true && infalOnly == false) {
        (function immediatelyInvokedAnonymousFunction() {
            var firstRun = true;
            var div = $("<div id='absentTarget'>");
            divs.push(div);
            myPromises.push(getHTMLThenReplay("./home/modules/absent.html", div));
            addFunction(function () {
                var coreFunctionality = function () {
                    $("#dashboardAbsentResults").html("Loading...");
                    getLocationsForDashboardAbsent(function (err, data) {
                        if (err) {
                            checkFunctions("error");
                            $("#dashboardAbsentResults").html("Could not load absent data");
                            throw err;
                        }
                        else {
                            $("#dashboardAbsentLocationDropdown").PSlist(data, {
                                callback: function (location) {
                                    //console.log(location);
                                    $("#dashboardAbsentLocationDropdown").text(location.text);
                                    getConsumerGroupsForDashboardAbsent(location.id, function (err, data) {
                                        if (err) {
                                            checkFunctions("error");
                                            $("#dashboardAbsentResults").html("Could not load absent data");
                                            throw err;
                                        }
                                        else {
                                            $("#dashboardAbsentGroupDropdown").PSlist(data, {
                                                callback: function (group) {
                                                    $("#dashboardAbsentGroupDropdown").text(group.text);
                                                    if (firstRun) {
                                                        checkFunctions("Absent");
                                                        firstRun = false;
                                                    }
                                                    var absentDate = $('#dashboardAbsentDateDropdown').html();
                                                    absentDate = absentDate.replace(/ /g, '');
                                                    getAbsentWidgetFilterDataAjax({
                                                        token: $.session.Token,
                                                        absentDate: moment(absentDate).format('YYYY-MM-DD'),
                                                        absentLocationId: parseInt(location.id, 10),
                                                        absentGroupCode: group.code,
                                                        custGroupId: group.id,
                                                    }, function (err, data) {
                                                        if (err) {
                                                            $("#dashboardAbsentResults").html("Could not load absent data");
                                                        }
                                                        else {
                                                            if (!data.length) {
                                                                $("#dashboardAbsentResults").html("No absences found for this date, location, and group.");
                                                            }
                                                            else {
                                                                //console.log(data);
                                                                $("#dashboardAbsentResults").html("");
                                                                var absentObj = {};
                                                                data.forEach(function (el) {
                                                                    var name = [el.FN, el.LN].join(" ");
                                                                    var loc = el.shortDesc;
                                                                    if (loc == undefined) {
                                                                        test = $.session.absentLocationsArray;
                                                                        for (i = 0; i < $.session.absentLocationsArray.length; i++) {
                                                                            testTwo = $.session.absentLocationsArray[i].id;
                                                                            if ($.session.absentLocationsArray[i].id == el.locId) {
                                                                                loc = $.session.absentLocationsArray[i].text;
                                                                            }
                                                                        }
                                                                    }
                                                                    var locId = el.locId;
                                                                    var locLabel = [loc, locId].join("{;}");
                                                                    if (!absentObj[locLabel]) absentObj[locLabel] = [];
                                                                    absentObj[locLabel].push(name);
                                                                });
                                                                var locs = Object.keys(absentObj).sort();
                                                                locs.forEach(function (locLabel) {
                                                                    var loc = locLabel.split("{;}")[0];
                                                                    var absentResultsWrap = $("#dashboardAbsentResults");
                                                                    var resultsHeader = $("<p class='results-header'>" + [loc, absentObj[locLabel].length].join(" - ") + "</p>");
                                                                    var results = $("<ul>").attr("class", "absent-results");
                                                                    var consumers = absentObj[locLabel];
                                                                    resultsHeader.appendTo(absentResultsWrap)
                                                                    results.appendTo(absentResultsWrap);
                                                                    consumers.forEach(function (consumer) {
                                                                        results.append("<li>" + consumer + "</li>");
                                                                    });
                                                                });
                                                                $("#totalConsumers").html("<p class='total-consumers'>Total Consumers: " + data.length + "</p>");
                                                                //$("#dashboardAbsentResults").html("We golden.");
                                                            }
                                                        }
                                                        //console.log(err, data);
                                                    })
                                                    //function getAbsentWidgetFilterDataAjax(filterData, callback) {//filterData to include token, absentDate, absentLocationId, absentGroupCode
                                                }
                                            }).trigger("PSlist-call", [data[0]]);
                                        }
                                    })
                                }
                            }).trigger("PSlist-call", [data[data.length - 1]]);
                        }
                    });
                }
                $("#dashboardAbsentDateDropdown").html(moment().format('MM / DD / YYYY')).click(function () {
                    var currVal = moment($("#dashboardAbsentDateDropdown").html()).toDate();
                    var opt = {
                        dateFormat: 'mm/dd/yy',
                        theme: 'wp',
                        accent: 'steel',
                        display: 'bubble',
                        mode: 'scroller',
                        preset: 'date',
                        onSelect: function (valueText, inst) {
                            $(this).html(valueText);
                            coreFunctionality();
                        },
                        onShow: function () {
                            $(this).scroller('setDate', new Date(currVal.getFullYear(), currVal.getMonth(),
                                currVal.getDate()), false);
                        }
                    }
                    $(this).mobiscroll().date(opt).mobiscroll('show');
                })
                coreFunctionality();
            });
        })();
    }

    // Messages, Custom Links, & InfalTimeClock Widget
    if ($.session.infalOnly) {
        (function anonymousFunction() {
            var div = $("<div id='systemMessagesTarget'>");
            divs.push(div);
            myPromises.push(getHTMLThenReplay("./home/modules/systemmessages.html", div));
            if ($.session.applicationName == 'Gatekeeper' && $.session.infalHasConnectionString == true) {
                (function anonymousFunction() {
                    var div = $("<div id='infalTimeClockTarget'>");
                    divs.push(div);
                    myPromises.push(getHTMLThenReplay("./home/modules/infal.html", div));
                    addFunction(function () {
                        buildInfalTimeClock(function (err) {
                            if (err) checkFunctions("error");
                            else checkFunctions("Infal Timeclock");
                        });
                    });
                })();
            }
            if ($.session.applicationName != 'Gatekeeper') {
                (function anonymousFunction() {
                    var div = $("<div id='customLinkTarget'>");
                    divs.push(div);
                    myPromises.push(getHTMLThenReplay("./home/modules/customlinks.html", div));
                })();
                addFunction(function () {
                    getSystemMessagesAndCustomLinks(function (err, res) {
                        if (err) {
                            console.log(err);
                            $("#dashsystemmessagewidget .dashboarderror").show();
                            checkFunctions("error");
                            return;
                        }
                        setCustomLinks(res, $("#customLinksUL"));
                        showSystemMessages(res, $("#systemMessagesUL"));
                        checkFunctions("System Messages and Links");
                    });
                })
            }
        })();
    }
    else {
        (function anonymousFunction() {
            var div = $("<div id='systemMessagesTarget'>");
            divs.push(div);
            myPromises.push(getHTMLThenReplay("./home/modules/systemmessages.html", div));
            if ($.session.applicationName == 'Gatekeeper' && $.session.infalHasConnectionString == true) {
                (function anonymousFunction() {
                    var div = $("<div id='infalTimeClockTarget'>");
                    divs.push(div);
                    myPromises.push(getHTMLThenReplay("./home/modules/infal.html", div));
                    addFunction(function () {
                        buildInfalTimeClock(function (err) {
                            if (err) checkFunctions("error");
                            else checkFunctions("Infal Timeclock");
                        });
                    });
                })();
            }
            if ($.session.applicationName != 'Gatekeeper') {
                (function anonymousFunction() {
                    var div = $("<div id='customLinkTarget'>");
                    divs.push(div);
                    myPromises.push(getHTMLThenReplay("./home/modules/customlinks.html", div));
                })();
                addFunction(function () {
                    getSystemMessagesAndCustomLinks(function (err, res) {
                        if (err) {
                            console.log(err);
                            $("#dashsystemmessagewidget .dashboarderror").show();
                            checkFunctions("error");
                            return;
                        }
                        setCustomLinks(res, $("#customLinksUL"));
                        showSystemMessages(res, $("#systemMessagesUL"));
                        checkFunctions("System Messages and Links");
                    });
                });
            }
        })();
    }    

    // Single Entry - Unsubmitted Time Entries Widget
    if ($.session.applicationName != 'Gatekeeper') {
        if ($.session.SingleEntryView && $.session.singleEntryPermission == "Anywhere_SingleEntry") {
            (function anonymousFunction() {
                var div = $("<div id='singleEntryCountTarget'>");
                divs.push(div);
                myPromises.push(getHTMLThenReplay("./home/modules/singleentrycount.html", div));
                addFunction(function () {
                    getSingleEntryCountInfo(function (err, res) {
                        if (err) {
                            console.log(err);
                            $("#dashsingleentrywidget .dashboarderror").show();
                            checkFunctions("error");
                            return;
                        }
                        showSingleEntryCount(res, $("#SElists"));
                        checkFunctions("Single Entry");
                    });
                });
            })();
        }
        
        if($.session.ViewAdminSingleEntry === true) {
            if ($.session.SEViewAdminWidget === true) {//TODO needs added to if  $.session.singleEntryPermission == "Anywhere_SingleEntry"
                (function anonymousFunction() {
                    var div = $("<div id='adminSingleEntryCountTarget'>");
                    divs.push(div);
                    myPromises.push(getHTMLThenReplay("./home/modules/adminsingleentrycount.html", div));
                    addFunction(function () {
                        getSingleEntryAdminApprovalNumbers(function (err, res) {
                            if (err) {
                                console.log(err);
                                $("#admindashsingleentrywidget .dashboarderror").show();
                                checkFunctions("error");
                                return;
                            }
                            showAdminSingleEntryCount(res, $("#dashboardAdminEmployees"), $("#AdminSElists"));
                            checkFunctions("Admin Single Entry");
                            //if ($.session.SEViewAdminWidget === true) {
                            //    $("#dashsingentrylabel").html("My Unapproved Time Entries.");
                            //} else {
                            //    $("#dashsingentrylabel").html("My Unsubmitted Time Entries.");
                            //}
                        });
                    });
                })();                
            }
        }
    }

    // Employee Day Service Time Clock Widget
    if ($.session.DayServiceUpdate && ($.session.dayServicesPermission == "Anywhere_DayServices")) {
        (function anonymousFunction() {
            var div = $("<div id='timeClockTarget'>");
            divs.push(div);
            myPromises.push(getHTMLThenReplay("./home/modules/timeclock.html", div));
            addFunction(function () {
                getStaffActivity(function (err, res) {
                    if (err) {
                        checkFunctions("error");
                    }
                    else {
                        processStaffActivity(err, res, function () {

                            checkFunctions("Day Services Time Clock");
                        })
                    }
                    
                })
            });
        })();

    }

    // Hours Worked Widget
    if ($.session.SEViewAdminWidget === true || ($.session.DayServiceUpdate && ($.session.dayServicesPermission == "Anywhere_DayServices"))) {
        (function anonymousFunction() {
            var div = $("<div id='hoursworkedTarget'>");
            divs.push(div);
            myPromises.push(getHTMLThenReplay("./home/modules/hoursworked.html", div));
            addFunction(function () {
                getWorkWeeks(function (err, weeksObj) {
                    if (err) {
                        checkFunctions("error");
                    }
                    else {
                        var weeks = [];
                        weeks.push({
                            start: moment(weeksObj.curr_start_date),
                            end: moment(weeksObj.curr_end_date),
                            type: "currweek",
                        });
                        weeks.push({
                            start: moment(weeksObj.prev_start_date),
                            end: moment(weeksObj.prev_end_date),
                            type: "prevweek",
                        });
                        weeks[0].text = weeks[0].start.format("MM/DD/YYYY") + " - " + weeks[0].end.format("MM/DD/YYYY");
                        weeks[1].text = weeks[1].start.format("MM/DD/YYYY") + " - " + weeks[1].end.format("MM/DD/YYYY");
                        var hasRun = false;
                        $("#dashboardHoursWorkedDropdown").PSlist(weeks, {
                            callback: function (week) {
                                getHoursWorked(function (err, hoursArr) {
                                    if (err) {
                                        console.error(err);
                                        //checkFunctions("error");
                                    }
                                    else {
                                        $("#dashboardHoursWorkedDropdown").text(week.text);
                                        $("#hoursWorkedLists").html("");
                                        var count = 0;
                                        var hoursObj = {};
                                        hoursArr.forEach(function (obj) {
                                            var date = moment(obj.workdate).format("MM/DD/YYYY");
                                            var location = obj.location;
                                            if (obj.hours == "") {
                                                obj.hours = 0;
                                            }
                                            if (!hoursObj[date]) hoursObj[date] = {};
                                            if (!hoursObj[date][location]) hoursObj[date][location] = 0;
                                            hoursObj[date][location] += (parseFloat(obj.check_hours) || parseFloat(obj.hours));
                                            //console.log(parseFloat(obj.check_hours), parseFloat(obj.hours));
                                            /*
                                            if (obj.hours.trim() == "" || obj.hours.trim() == ".") hoursObj[date][location] += parseFloat(obj.check_hours);
                                            else hoursObj[date][location] += parseFloat(obj.hours);
                                            */
                                        });
                                        var myDate = moment(week.start);
                                        //console.log(myDate, week.end, myDate.isAfter(week.end))
                                        while (!myDate.isAfter(week.end)) {
                                            var dateText = myDate.format("MM/DD/YYYY");
                                            var dateHours = 0;
                                            if (hoursObj[dateText]) {
                                                var locations = Object.keys(hoursObj[dateText]).sort();
                                                locations.forEach(function (location) {
                                                    count += hoursObj[dateText][location];
                                                    dateHours += hoursObj[dateText][location];
                                                })
                                                $("#hoursWorkedLists").append("<div class='addunderline'>" + myDate.format("dddd, MMMM D") + " - " + dateHours.toFixed(2) + " hours</div>");
                                                locations.forEach(function (location) {
                                                    $("#hoursWorkedLists").append("<div><span>" + location + ' - ' +"</span><span>" + hoursObj[dateText][location].toFixed(2) + " hours</span></div>");
                                                });
                                                $("#hoursWorkedLists").append("<br />");
                                            }
                                            myDate.add(1, "d");
                                        }
                                        delete myDate;
                                        $("#hoursWorkedTotal").text(count.toFixed(2) + " Hours");
                                        if (hasRun == false) {
                                            hasRun = true;
                                            checkFunctions("Hours Worked");
                                        }
                                    }
                                });
                            },
                        }).trigger("PSlist-call", [weeks[0]]);
                        
                    }
                });
            });
        })()
    }

    
    // Only show this widget if the Scheduling module in Advisor's modules table is turned on (where module_name = 'Scheduling' and (install_date <= today or install_date is null) and (license_expiration > today or license_expiration is null)).
    // My Schedule Widget
    if ($.session.applicationName != 'Gatekeeper' && $.session.schedulingPermission == "Scheduling") {
        (function anonymousFunction() {
            var div = $("<div id='scheduleTarget'>");
            divs.push(div);
            myPromises.push(getHTMLThenReplay("./home/modules/schedule.html", div));
            addFunction(function () {
                getSchedulingPeriodsAjax(function (err, weeks) {
                    if (err) {
                        checkFunctions("error");
                    }
                    else {
                        //if (!weeks.length) return checkFunctions("error");
                        weeks = weeks.filter(function (el) {
                            el.text = moment(el.start_date).format("MM/DD/YYYY") + " - " + moment(el.end_date).format("MM/DD/YYYY");
                            return el;
                        })
                        var currweek = weeks.filter(function (el) { return el.is_curr_date === "1"; })[0];
                        //If there is no current week, then use the first date available that's in the future. 
                        if (currweek == undefined) {
                            var i = weeks.length - 1;
                            while (i >= 0) {
                                var t = weeks[i];
                                if (moment().diff(moment(t.start_date), "days") < 0) {
                                    currweek = t;
                                    i = -1;
                                }
                                else i--;
                            }
                        }
                        if (currweek == undefined) currweek = weeks[0];
                        if (currweek != undefined) {
                            var hasRun = false;
                            $("#dashboardScheduleWeekDropdown").PSlist(weeks, {
                                callback: function (week) {
                                    try {
                                        getSchedulingPeriodsDetailsAjax({
                                            token: "" + $.session.Token,
                                            startDate: moment(week.start_date).format("YYYY-MM-DD"),
                                            endDate: moment(week.end_date).format("YYYY-MM-DD"),
                                        }, function (err, periodsData) {
                                            //console.log(periodsData);
                                            var mainObj = {};
                                            $("#dashboardScheduleWeekDropdown").text(week.text);
                                            var locations = [];
                                            periodsData.forEach(function (el) {
                                                //locations.push("Test");
                                                var location = el.location;
                                                var date = moment(el.service_date).format("YYYY/MM/DD");
                                                //console.log(date);
                                                var hours = el.difftime;
                                                var start = el.start_time;
                                                var end = el.end_time;
                                                var startAndEnd = [start, end].join(" - ");
                                                var initials = el.initials.trim();
                                                //console.log(el);
                                                if (locations.indexOf(el.location) === -1) locations.push(el.location);
                                                if (!mainObj[el.location]) mainObj[el.location] = {};
                                                if (!mainObj[el.location][date]) mainObj[el.location][date] = {};
                                                if (!mainObj[el.location][date][startAndEnd]) mainObj[el.location][date][startAndEnd] = { initials: [], time: parseFloat(hours) };
                                                if (initials != "") {
                                                    mainObj[el.location][date][startAndEnd].initials.push(initials);
                                                }
                                            });
                                            //console.log(mainObj);
                                            locations.sort();
                                            locations.unshift("ALL");
                                            $("#dashboardScheduleLocationDropdown").PSlist(locations, {
                                                callback: function (text) {
                                                    //console.log(text);
                                                    var hours = 0;
                                                    var stepThrough = [];
                                                    var organizedByDate = {};
                                                    if (text == "ALL") {
                                                        Object.keys(mainObj).forEach(function (locationKey) {
                                                            stepThrough.push({ data: mainObj[locationKey], name: locationKey });
                                                        })
                                                    }
                                                    else stepThrough.push({ data: mainObj[text], name: text });
                                                    //console.log(stepThrough)
                                                    stepThrough.forEach(function (objs) {
                                                        var location = objs.data;
                                                        var name = objs.name;
                                                        console.log(location, name);
                                                        //if(!organizedByDate[period.])
                                                        Object.keys(location).forEach(function (date) {
                                                            var loc = location[date];
                                                            //console.log(loc);
                                                            if (!organizedByDate[date]) organizedByDate[date] = {};
                                                            Object.keys(loc).sort().forEach(function (timeframe) {
                                                                if (!organizedByDate[date][timeframe]) organizedByDate[date][timeframe] = {};
                                                                organizedByDate[date][timeframe][name] = loc[timeframe];
                                                                //console.log(loc[timeframe])
                                                            });
                                                            //if(!organizedByDate[date][loc])
                                                            //console.log(moment(date).format("dddd, MMMM D"))

                                                        })
                                                    });
                                                    $("#scheduleWorkedLists").html("");
                                                    Object.keys(organizedByDate).sort().forEach(function (date) {
                                                        //console.log(moment(date).format("dddd, MMMM D"));
                                                        var dateFull = moment(date).format("dddd, MMMM D");
                                                        var holder = $("<div>");
                                                        holder.append($("<div>" + dateFull + "</div>").css("textDecoration", "underline"));
                                                        //console.log(Object.keys(organizedByDate[date]));
                                                        Object.keys(organizedByDate[date]).sort().forEach(function (timeframe) {
                                                            var times = timeframe.split(" - ");
                                                            var start = times[0].split(":");
                                                            var end = times[1].split(":");
                                                            var startTime = moment().hour(parseInt(start[0], 10)).minute(parseInt(start[1], 10));
                                                            var endTime = moment().hour(parseInt(end[0], 10)).minute(parseInt(end[1], 10));
                                                            var firstLine = $("<div>");
                                                            var timeDesc = $("<span>").css("display", "inline-block").text(startTime.format("h:mma") + " to " + endTime.format("h:mma"));
                                                            //console.log(organizedByDate[date][timeframe])
                                                            var locations = Object.keys(organizedByDate[date][timeframe]).sort();
                                                            var oneLoc = locations[0];
                                                            //firstLine.append(" - " + oneLoc + " - " + organizedByDate[date][timeframe][oneLoc].initials.join(", "))
                                                            var html = "&nbsp;- " + oneLoc;
                                                            if (organizedByDate[date][timeframe][oneLoc].initials.length) html = "&nbsp;- " + oneLoc + " - " + organizedByDate[date][timeframe][oneLoc].initials.join(", ");
                                                            //console.log(organizedByDate[date][timeframe][oneLoc].initials.length, organizedByDate[date][timeframe][oneLoc].initials);
                                                            var detailsDesc = $("<span>").css("display", "inline-block").html(html);
                                                            firstLine.append(timeDesc).append(detailsDesc);
                                                            hours += organizedByDate[date][timeframe][oneLoc].time;
                                                            holder.append(firstLine);
                                                            //i = 1 because we've already done this once in the array manually, we don't need to start from the beginning.
                                                            for (var i = 1; i < locations.length; i++) {
                                                                var myLoc = locations[i]
                                                                timeDesc.css("width", "30%");
                                                                detailsDesc.css("width", "65%");
                                                                holder.append($("<span>").css("display", "inline-block").css("width", "30%"));
                                                                html = "&nbsp;- " + myLoc;
                                                                if (organizedByDate[date][timeframe][myLoc].initials.length) html = "&nbsp;- " + myLoc + " - " + organizedByDate[date][timeframe][myLoc].initials.join(", ");
                                                                holder.append($("<span>").css("display", "inline-block").css("width", "65%").html(html));
                                                            }
                                                        });
                                                        $("#scheduleWorkedLists").append(holder).append("<br />");
                                                    })
                                                    $("#dashboardScheduleLocationDropdown").text(text);
                                                    $("#scheduleHoursTotal").text(hours.toFixed(2) + " Hours");
                                                }
                                            }).trigger("PSlist-call", [locations[0]]);
                                            if (hasRun == false) {
                                                hasRun = true;
                                                checkFunctions("Schedule");
                                            }
                                        })
                                    }
                                    catch (e) {
                                        console.log(e);
                                        if (hasRun == false) {
                                            hasRun = true;
                                            checkFunctions("error");
                                        }
                                    }

                                }
                            }).trigger("PSlist-call", [currweek]);
                        }
                        else {
                            checkFunctions("Schedule");
                        }
                    }
                })
                //checkFunctions("Schedule");
            });
        })()
    }

    // Remaining Daily Services Widget
    if ($.session.GoalsView && $.session.outcomesPermission == "Anywhere_Outcomes") {
        (function anonymousFunction() {
            var div = $("<div id='goalsTarget'>");
            divs.push(div);
            myPromises.push(getHTMLThenReplay("./home/modules/goals.html", div));
            addFunction(function () {
                remainingDailyServicesWidgetAjax.populateFilteredList('%', '%', '%');
                checkFunctions("Outcomes");
                remainingDailyServicesWidget.init();
            });
        })();
    }

    // Day Services Clocked In Widget
    if ($.session.DayServiceView && ($.session.dayServicesPermission == "Anywhere_DayServices")) {
        (function anonymousFunction() {
            var div = $("<div id='clockedInTarget'>");
            divs.push(div);
            myPromises.push(getHTMLThenReplay("./home/modules/clockedin.html", div));
            addFunction(function () {
                var d = new Date();
                var AMorPM = "AM";
                var hours = d.getHours();
                if (hours >= 12) {
                    AMorPM = "PM";
                    if (hours != 12) hours -= 12;
                }
                $("#dayServicesCurrentTime").html(leftpadTime(hours + "") + ":" + leftpadTime(d.getMinutes() + "") + " " + AMorPM);
                getLocationsForDashboardDayServices(function (err, res) {
                    if (err) {
                        console.log(err);
                        $("#dashdsclockedin .dashboarderror").show();
                        checkFunctions("error");
                        return;
                    }
                    var $dashboardClockedInLocations = $("#dashboardClockedInLocations");
                    var myLocations = [];
                    $('location', res).each(function () {
                        var ID = $('ID', this).text();
                        var name = $('Name', this).text();
                        var residence = $("Residence", this).text();
                        var text = "";
                        if (residence == "Y") {
                            text = "<img class='houseicon' src='./images/new-icons/icon_house.png'>" + name;
                        }
                        else {
                            text = "<img class='buildingicon' src='./images/new-icons/icon_building.png'>" + name;
                        }
                        myLocations.push({
                            name: name,
                            text: text,
                            ID: ID
                        });
                    });
                    var defaultLocation = null;
                    //JDL 08/04/2016 - This is a temporary function. Until we have a solid way to get the default location, use this
                    function getDefaultLocation(callback) {
                        callback(null);
                    }
                    getDefaultLocation(function (id) {
                        defaultLocation = myLocations.filter(function (location) {
                            return location.ID == id;
                        });
                        if (!defaultLocation.length) defaultLocation = myLocations[0];
                        else defaultLocation = defaultLocation[0];

                        //For now, setting defaultLocation to a null location just in case - JDL 10/03/16
                        defaultLocation = {
                            name: null,
                            text: null,
                            ID: null
                        };

                        function setLocation(location) {
                            if (location.ID == null) return;
                            $dashboardClockedInLocations.html(location.name);
                            var myPromises = [];

                            myPromises.push((function () {
                                return new Promise(function (fulfill, reject) {
                                    getClockedInConsumerNamesDayServicesAjax(location.ID, function (err, res) {
                                        if (err) {
                                            return reject(err);
                                        }
                                        fulfill({
                                            type: "consumer",
                                            data: res
                                        });
                                    });
                                });
                            })());
                            myPromises.push((function () {
                                return new Promise(function (fulfill, reject) {
                                    getClockedInStaffNamesDayServicesAjax(location.ID, function (err, res) {
                                        if (err) {
                                            return reject(err);
                                        }
                                        fulfill({
                                            type: "staff",
                                            data: res
                                        });
                                    });
                                });
                            })());
                            Promise.all(myPromises).then(function success(data) {
                                $("#dashboardConsumersClockedInList").html("");
                                $("#dashboardStaffClockedInList").html("");
                                data.forEach(function (obj) {
                                    var res = obj.data;
                                    // #23087 - Dashboard: Day Services Clocked In widget - split the widget in half, and show clocked in consumers
                                    if (obj.type == "consumer") {
                                        $("#dashboardConsumersClockedInCount").html(": " + $('clockedinconsumername', res).length);
                                        $('clockedinconsumername', res).each(function () {
                                            var li = $("<li>").appendTo($("#dashboardConsumersClockedInList")).html($(this).text());
                                        });
                                    }
                                    else if (obj.type == "staff") {
                                        $("#dashboardStaffClockedInCount").html(": " + $('staffclockedinname', res).length);
                                        $('staffclockedinname', res).each(function () {
                                            var li = $("<li>").appendTo($("#dashboardStaffClockedInList")).html($(this).text());
                                        });
                                    }

                                });
                            }, function error(err) {
                                console.log(err);
                            });
                        }
                        $dashboardClockedInLocations.PSlist(myLocations, {
                            callback: function (item) {
                                setLocation(item);
                            },
                            _blank: "<img class='houseicon' src='./images/new-icons/icon_house.png'>"
                        });
                        setLocation(defaultLocation);
                        checkFunctions("Day Services Clocked In");
                    });
                });
            });
        })();
    }

    for (var i = 0; i < divs.length; i++) {
        (function (div) {
            dashContainer.append(div);
        })(divs[i]);
    }

    Promise.all(myPromises).then(function success(data) {
        $(document).trigger("moduleLoad");
        if ($.session.infalOnly && $.mobile) {
            $("#dashinfaltimeclockwidget").css("zoom", parseInt($("#actioncenter").css("width"), 10) / parseInt($("#dashinfaltimeclockwidget").css("width"), 10));
        }
        setTimeout(function () {
            addFunction(function () {
                if (typeof getRosterLocations != "undefined") {
                    getRosterLocations(function (err) {
                        if (err) {
                            console.log(err);
                            checkFunctions("error");
                            return;
                        }
                        checkFunctions("Roster Locations");
                    });
                }
                else {
                    checkFunctions("Infal Roster Locations");
                }
            }, 0);
            overlay = $("<div>").css({
                "backgroundColor": "rgba(0, 0, 0, 0.55)",
                "position": "absolute",
                "top": "0",
                "bottom": "0",
                "left": "0",
                "right": "0",
                "zIndex": "9999"
            });
            
            var box = $("<div>").css({
                "position": "fixed",
                "top": "50%",
                "left": "50%",
                "transform": "translate(-50%, -50%)",
            }).appendTo(overlay);

            var gif = $("<img>").appendTo(box).prop("src", "Images/gears.svg");
            message = $("<div>").css({
                "fontSize": "18px",
                "color": "#fff"
            }).appendTo(box);
            $("body").append(overlay);
            myFunctions.forEach(function (func, index) {
                setTimeout(function () {
                    func();
                }, (index + 1) * 300);
            });
        }, 300);
        
    }, function error(data) {
        console.log(data);
    });
}

function pad(x) {
    return x < 10 ? '0' + x : x;
}

function ticktock() {
    var d = new Date();
    var h = pad(d.getHours());
    var m = pad(d.getMinutes());
    var s = pad(d.getSeconds());
    var current_time = [h, m].join(':');
}

function anywhere() {
    window.location = "anywhere.html";
}

function popCalendar(event) {
    if ($("#calendardropdown").css("opacity") == "0") {
        $("#calendardropdown").css("opacity", "1").css("display", "block");
    } else {
        $("#calendardropdown").css("opacity", "0").css("display", "none");
    }
}

function popTimeClock(event) {
}

function startMessage() {
    if ($('#messageinput').val() == 'Add a new message...') {
        $('#messageinput').val('');
    }
}

function swapMessageBoxes() {
    if ($("#messageboxsmall").css("opacity") == "0") {
        $("#messageboxsmall").css("opacity", "1").css("display", "block");
        $("#messageinput").css("opacity", "0").css("display", "none");
        $("#messagetypebox").css("opacity", "0").css("display", "none");
        $("#closemessageinput").css("opacity", "0").css("display", "none");
    } else {
        $("#messageboxsmall").css("opacity", "0").css("display", "none");
        $("#messageinput").css("opacity", "1").css("display", "block");
        $("#messagetypebox").css("opacity", "1").css("display", "block");
        $("#closemessageinput").css("opacity", "1").css("display", "block");
    }
}

function punchClock() {
    if ($('#clockbuttontext').text() == 'Clock In') {
        clockInStaff();
    } else {
        clockOutStaff();
    }
}

function showDownArrow() {
    if ($("clockrow").length == 0) {
        $("#downarrow").css("opacity", "0").css("display", "none");
    } else {
        $("#downarrow").css("opacity", "1").css("display", "block");
    }
}

function validateTime(startTime, stopTime) {
    var validTime = 1;
    if (startTime > stopTime && stopTime != "00:00:00") {
        validTime = 0;
    }
    return validTime;
}
///////////////////  Pop the display boxes ///////////////////////////////////
// Get time in and time out values for day service consumer rows:
function popDayStaffTimeBox(tagname, event) {
    var obj = $("#" + tagname);
    obj.blur();
    $(".timein").blur();
    $(".timeout").blur();
    if ($.session.DenyStaffClockUpdate == true) {
        return;
    }
    var now = new Date();
    var nonFormattedTime = "";
    originalText = $('#' + tagname).val();
    nonFormattedTime = originalText;
    if (tagname.indexOf('out') != -1) {
        if (originalText != "") {
            originalText = convertTimeToMilitary(originalText);
            $.session.initialTimeOut = originalText;
            $.session.initialTimeIn = "";
        }        
    }
    if (tagname.indexOf('in') != -1) {
        originalText = convertTimeToMilitary(originalText);
        $.session.initialTimeIn = originalText;
        $.session.initialTimeOut = "";
    }
    setupTimeInputBox(obj, event);
    return false;
}

function validateStaffTime(tagname, valueText) {
    if (valueText.length > 8) {
        return false;
    }
    var rowid = "",
        timein = "",
        timeout = "";
    if (tagname.indexOf('out') > -1) {
        rowid = tagname.substring(7);
        timein = $('#timein' + rowid).val().replace(' ', '');
        timein = convertTimeToMilitary(timein);
        timeout = $('#' + tagname).val().replace(' ', '');
        timeout = convertTimeToMilitary(timeout);
    }
    if (tagname.indexOf('in') > -1) {
        rowid = tagname.substring(6);
        timeout = $('#timeout' + rowid).val().replace(' ', '');
        timeout = convertTimeToMilitary(timeout);
        timein = $('#' + tagname).val().replace(' ', '');
        timein = convertTimeToMilitary(timein);
    }
    timein = timein.replace(':', '');
    timeout = timeout.replace(':', '');
    if (timeout.length < 2) return true;
    if (timeout < timein && timeout != '00:00:00' && timeout != '0000:00' && timeout != '00:00') {
        validateError = 'In time can not be greater than out time.';
        window.timeOverlapError = false;  //ensures error message above takes priority over time overlap error
        return false;
    }
    return true;
}

function getTimeClockInput(objId, rowId) {
    var obj = $("#" + objId),
        text = obj.text();
    obj.text('');
    var pushStr = "<select id='tempLocation' class='staffLocations' >";
    //make selected item the one on top
    for (var i in $.session.locations) {
        if ($.session.StaffLocId == $.session.locationids[i]) {
            pushStr = pushStr + "<option value=" + $.session.locationids[i] + ">" + $.session.locations[
                i] + "</option>";
        }
    }
    //and now the others
    for (var i in $.session.locations) {
        if ($.session.StaffLocId != $.session.locationids[i]) {
            pushStr = pushStr + "<option value=" + $.session.locationids[i] + ">" + $.session.locations[
                i] + "</option>";
        }
    }
    pushStr = pushStr + "</select>";
    $(pushStr).appendTo(obj).val(text).focus().change(function () {
        var newText = $('#tempLocation option:selected').text();
        var newValue = $('#tempLocation option:selected').val();
        obj.text(newText).attr('locid', newValue);
    });
}

function getTimeClockInput2(event) {
    var tar = event.target.id;
    var optionsHtml = [];
    var locations = $('#locationpop');
    var pushStr = '';
    var rowid = tar[tar.length - 1];
    var last = $.session.locations.length - 1;
    if (tar.length == 0) {
        tar = $(event.target).parent().attr('id'); //like to due to the text of the link being clicked on.
    }
    var top = $("#" + tar).offset().top;
    for (var i in $.session.locations) {
        //if ($.session.StaffLocId != $.session.locationids[i]) {
        pushStr = pushStr + "<a href='#' class='loclink' onClick=updateStaffClockTime('timein" +
            rowid + "',2,'" + $.session.locationids[i] + "') >" + $.session.locations[i] +
            "</a>";
        //}
    }
    locations.html(pushStr).css("display", "block");
    $('#arr').css("top", top + 20);
}

function textFieldEdit(objId) {
    var text = $('#' + objId).text();
    $('#' + objId).text('');
    $('<input type="text" value="' + text +
        '" id="temptxt" class="daytextedit" maxlength="8"/>').appendTo($('#' + objId)).val(
        text).select().blur(function () {
            var newText = $('#temptxt').attr('value');
            $('#' + objId).text(newText); //, find('input:text').remove();
        });
}

function popLocation(event) {
    if ($.session.locations.length < 2) return;
    if ($.session.DenyStaffClockUpdate) return;
    if ($("#locationpop").css("display") == "none") {
        getTimeClockInput2(event);
        $("#locationpop").css("display", "block");
        $("#arr").css("display", "block");
    } else {
        clearPops(event);
    }
}

function clearPops(event) {
    //  alert("clicked: " + event.target.id + " nodeName=" + event.target.nodeName + "\n " + $(event.target).parent().attr('id') + " " + $(event.target).parent().parent().parent().attr('id'));
    //  alert(event.srcElement.nodeName + " " + event.srcElement.id);
    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
        if (event.srcElement.nodeName == "STAFFLOCATION" || event.srcElement.id ==
            "locationdownarrow" || event.srcElement.nodeName == "DEFAULTSELECTION") {
            //do nothing
        } else {
            $("#locationpop, #arr").css("display", "none");
        }
    } else {
        if (event.target.nodeName == "STAFFLOCATION" || event.target.id == "locationdownarrow" ||
            event.target.nodeName == "DEFAULTSELECTION") {
            //do nothing
        } else {
            $([
                "#locationdefault1pop", 
                "#locationdefault2pop", 
                "#locationdefault3pop",
                "#locationdefault4pop",
                "#locationdefault5pop", 
                "#locationpop", 
                "#arr", 
                "#locationdefault1arr", 
                "#locationdefault2arr", 
                "#locationdefault3arr"
            ].join(", ")).css("display", "none");
        }
    }
}

//Sets the customlinks from res string to variables to be displayed
function setCustomLinks(res, $listTarget) {
    $('custom', res).each(function () {
        var tempLinkName = $('linkname', this).text(),
            tempLinkAddress = $('linkaddress', this).text(),
            tempLinkTarget = $('linktarget', this).text();
        if (tempLinkAddress.indexOf('\\\\') > -1) {
            tempLinkAddress = tempLinkAddress.replace('\\\\', "");
        }
        var a = $("<a>").text(tempLinkName);
        var li = $("<li>");
        if (tempLinkName.match("CaraSolva")) {
            
            a.attr("href", "#").click(function () {
                var data = {};
                data.token = $.session.Token;
                $.ajax({
                    type: "POST",
                    url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                        "/" + $.webServer.serviceName + "/CaraSolvaURL/",
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response, status, xhr) {
                        //console.log(response);
                        if (response && response.CaraSolvaURLResult) {
                            window.open(response.CaraSolvaURLResult, "_blank");
                        }
                    },
                });
                return false;
            })
        }
        else {
            a.attr("href", tempLinkAddress).attr("target", "_blank");
        }
        li.append(a);
        //var li = $("<li>").append($("<a>").text(tempLinkName).attr("href", tempLinkAddress).attr("target", "_blank"));
        $listTarget.append(li)
    });
}

//Generic way to show system messages for now
function showSystemMessages(res, $listTarget) {
    $('systemmessages', res).each(function () {
        var message = $('message', this).text();
        if (message != "") {
            var li = $("<li>").append($("<span>").text(message).append($("<br /><br />")));
            $listTarget.append(li)
        }
    });
}

function showRemainingGoals(res, $goalsCount, $listTarget, $goalsConsumerCount) {
    var people = {},
        count = 0,
        consumerCount = 0;
    $('result', res).each(function () {
        count++;
        var ID = $("ID", this).text(),
            oid = $("oid", this).text(),
            first_name = $("first_name", this).text(),
            last_name = $("last_name", this).text(),
            fullName = [first_name, last_name].join(" ");
        if (!people[fullName]) people[fullName] = 0;
        people[fullName]++;
    });
    $goalsCount.text(count);
    var names = Object.keys(people);
    //names.sort();
    names.forEach(function (name) {
        consumerCount++;
        var li = $("<li>").text(name + " - " + people[name]);
        $listTarget.append(li);
    });
    $goalsConsumerCount.text(consumerCount);
}

function showSingleEntryCount(res, $target) {
    var stats = {},
        types = {
            "A": "Needs Approval",
            //"I": "I",
            "P": "Pending",
            "R": "Rejected",
            //"S": "S"
        },
        arr = [];
    $('result', res).each(function () {
        var startDate = moment($("startdate", this).text()).format("MM/DD/YYYY"),
            endDate = moment($("enddate", this).text()).format("MM/DD/YYYY"),
            dateRange = [startDate, endDate].join(" - "),
            dateTime = +(new Date($("startdate", this).text())),
            status = $("Anywhere_Status", this).text();

        if (!stats[status]) {
            stats[status] = {};
        }
        if (!stats[status][dateTime]) {
            stats[status][dateTime] = {
                count: 0,
                date: new Date($("startdate", this).text()),
                text: dateRange
            }
            arr.push(stats[status][dateTime]);
        }
        stats[status][dateTime].count++;
    });
    Object.keys(types).forEach(function (code) {
        var div = $("<div>").appendTo($target);
        var header = $("<h4>").text(types[code]).appendTo(div);
        var ul = $("<ul>").appendTo(div);
        var test = stats[code];
        var dates = "";
        if (stats[code] != undefined) {
            dates = Object.keys(stats[code]);
            dates.sort().reverse();
            dates.forEach(function (myDate) {
                var text = stats[code][myDate].text;
                var li = $("<li>").text(text + " - " + stats[code][myDate].count).appendTo(ul).click(function () {
                    var userId = $.session.UserId,

                            startD = new Date(text.split(" - ")[0].replace(/[^\/\d]/g, '')),
                            endD = new Date(text.split(" - ")[1].replace(/[^\/\d]/g, '')),
                            startDate, endDate;

                    startDate = (startD.getFullYear() + '-' + (startD.getMonth() + 1) + '-' + startD.getDate()),
                            endDate = (endD.getFullYear() + '-' + (endD.getMonth() + 1) + '-' + endD.getDate());

                    window.dashboardUnapprovedEntryFunction = function () {
                        getSingleEntryByDate(userId, startDate, endDate, code, buildSingleEntryTable);
                    };
                    (function () {
                        window.dashboardUnapprovedEntryFunction();
                    })();
                    

                }).css({
                    "cursor": "pointer",
                    "textDecoration": "underline",
                    "listStyle": "none"
                })
            })
        }        
        
    })
    
}

function showAdminSingleEntryCount(res, $dropdownTarget, $dataTarget) {
    var stats = {},
        types = {
            "A": "Needs Approval",
            //"I": "I",
            "P": "Pending",
            "R": "Rejected",
            //"S": "S"
        },
        realNames = {},
        arr = [];

    $('result', res).each(function () {
        var startDate = new Date($("startdate", this).text()).toLocaleDateString(),
            endDate = new Date($("enddate", this).text()).toLocaleDateString(),
            dateRange = [startDate, endDate].join(" - "),
            dateTime = +(new Date($("startdate", this).text())),
            status = $("Anywhere_Status", this).text(),
            userId = $("userId", this).text(),
            personId = $("People_ID", this).text(),
            firstName = $("first_name", this).text(),
            lastName = $("last_name", this).text(),
            fullName = [firstName, lastName].join(" ");

        realNames[fullName] = userId;

        if (!stats[fullName]) {
            stats[fullName] = {};
        }

        if (!stats[fullName][status]) {
            stats[fullName][status] = {};
        }
        if (!stats[fullName][status][dateTime]) {
            stats[fullName][status][dateTime] = {
                count: 0,
                date: new Date($("startdate", this).text()),
                text: dateRange,
                userId: userId,
                personId: personId
            }
            arr.push(stats[fullName][status][dateTime]);
        }

        stats[fullName][status][dateTime].count++;
        //console.log(obj);
    });
    var names = Object.keys(stats).sort();
    names.push("ALL");
    $dropdownTarget.PSlist(names, {
        callback: function (name) {
            //console.log(name);
            $dropdownTarget.text(name);
            $dataTarget.html("");
            //console.log(stats[name]);
            if (name == "ALL") {
                var obj = {};
                names.forEach(function (name) {
                    //console.log(name);
                    if (name != "ALL") {
                        Object.keys(types).forEach(function (code) {
                            if (!obj[code]) obj[code] = {};
                            var myStats = stats[name];
                            if (myStats[code]) {
                                //console.log(stats, name, myStats, code, myStats[code])
                                var dates = Object.keys(myStats[code]);
                                //dates.sort().reverse();
                                dates.forEach(function (myDate) {
                                    if (!obj[code][myDate]) obj[code][myDate] = { count: 0, text: myStats[code][myDate].text };
                                    obj[code][myDate].count += myStats[code][myDate].count;
                                });
                            }
                            
                        });
                    }
                });
                //console.log(obj);
                Object.keys(types).forEach(function (code) {
                    var div = $("<div>").appendTo($dataTarget);
                    var header = $("<h4>").text(types[code]).appendTo(div);
                    var ul = $("<ul>").appendTo(div);
                    var myStats = obj;
                    if (myStats[code]) {
                        var dates = Object.keys(myStats[code]);
                        dates.sort().reverse();
                        dates.forEach(function (myDate) {
                            
                            var text = myStats[code][myDate].text;
                            var li = $("<li>").text(text + " - " + myStats[code][myDate].count).appendTo(ul).click(function () {
                                var userId = $.session.UserId,
                                        startD = new Date(text.split(" - ")[0].replace(/[^\x00-\x7F]/g, "")),
                                        endD = new Date(text.split(" - ")[1].replace(/[^\x00-\x7F]/g, "")),
                                        startDate, endDate;

                                console.log(text.split(" - ")[0], startD, text.split(" - ")[1], endD, "Hi there")

                                startDate = (startD.getFullYear() + '-' + (startD.getMonth() + 1) + '-' + startD.getDate()),
                                        endDate = (endD.getFullYear() + '-' + (endD.getMonth() + 1) + '-' + endD.getDate());

                                var data = {
                                    startD: startD,
                                    endD: endD,
                                    dateText: text,
                                    statusText: types[code],
                                    status: code,
                                    employeeText: "ALL",
                                    employeeId: "",
                                    employeeUserName: ""
                                };

                                loadApp("adminsingleentry", data);

                            }).css({
                                "cursor": "pointer",
                                "textDecoration": "underline",
                                "listStyle": "none"
                            });
                        })
                    }
                    
                });
            }
            else {
                //$dataTarget.append(builder(stats[name]));
                Object.keys(types).forEach(function (code) {
                    var div = $("<div>").appendTo($dataTarget);
                    var header = $("<h4>").text(types[code]).appendTo(div);
                    var ul = $("<ul>").appendTo(div);
                    var myStats = stats[name];
                    if (myStats[code]) {
                        var dates = Object.keys(myStats[code]);
                        dates.sort().reverse();
                        dates.forEach(function (myDate) {
                            var text = myStats[code][myDate].text;
                            var li = $("<li>").text(text + " - " + myStats[code][myDate].count).appendTo(ul).click(function () {
                                var userId = $.session.UserId,
                                        startD = new Date(text.split(" - ")[0]),
                                        endD = new Date(text.split(" - ")[1]),
                                        startDate, endDate;

                                startDate = (startD.getFullYear() + '-' + (startD.getMonth() + 1) + '-' + startD.getDate()),
                                        endDate = (endD.getFullYear() + '-' + (endD.getMonth() + 1) + '-' + endD.getDate());

                                var data = {
                                    startD: startD,
                                    endD: endD,
                                    dateText: text,
                                    statusText: types[code],
                                    status: code,
                                    employeeText: name,
                                    employeeId: myStats[code][myDate].personId,
                                    employeeUserName: myStats[code][myDate].userId
                                };

                                loadApp("adminsingleentry", data);

                            }).css({
                                "cursor": "pointer",
                                "textDecoration": "underline",
                                "listStyle": "none"
                            })
                        })
                    }
                    
                });
            }
        }
    }).trigger("PSlist-call", ["ALL"]);
}

function buildInfalTimeClock(callback) {
    var tempID = readCookie('id');
    setTimeout( function setInfalId(err, idObj) {
        if (err) {
            console.log(error);
            throw "Error"
        }
        var ID;
        //if (idObj[0] && idObj[0].App_Password) ID = idObj[0].App_Password;
        if (idObj[0] && idObj[0].App_Username) ID = idObj[0].App_Username;
        else ID = idObj;
        //Ajax call, which then takes the response and passes it to the callback. First argument is an error IF the ajax errors; second is an array
        InfalGetJobsAjax({ "id": ID }, function InfalGetJobsAjaxCallback(err, jobs) {
            if (err) {
                console.log(err);
                $("#dashinfaltimeclockwidget .dashboarderror").show();
                if (callback) callback("error")
                throw "Error";
            }
            //Ajax call, which then takes the response and passes it to the callback. First argument is an error IF the ajax errors; second is an array
            InfalGetClockInsAndOutsAjax({ "id": ID }, function InfalGetClockInsAndOutsAjaxCallback(err, clocks) {
                if (err) {
                    console.log(err);
                    $("#dashinfaltimeclockwidget .dashboarderror").show();
                    if (callback) callback("error")
                    throw "Error";
                }
                //Using status to see if this is a clock In or Out scenario.
                //jobClockOut is just a cache of whatever job needs to be clocked out, so we don't have to step through the clocks again.
                var status = "clockin",
                    jobClockOut = null;

                //This removes any and all click functions assigned to the Clock Button.
                $("#infalclockbutton").off("click");
                $("#infaltimeclockdropdownholder").html("");

                clocks.forEach(function stepClock(clock) {
                    var row = $("<div>").addClass("clocktext");

                    var dropdown = $("<span>").css({
                        display: "inline-block",
                        borderRadius: "20px",

                        width: 145,
                        paddingBottom: "3px",
                        paddingLeft: "13px",
                        paddingRight: "13px",
                        paddingTop: "3px",
                        backgroundColor: "#509fd0",
                        margin: "0 6px 5px",
                        color: "white",
                        fontSize: "12px",
                        textAlign: "center",
                        fontFamily: "Arial",
                    }).appendTo(row).html(clock.Emp_Job_Description);

                    var startTime = $("<span>").css({
                        display: "inline-block",
                        borderRadius: "20px",
                        backgroundColor: "#509fd0",
                        color: "white",
                        paddingBottom: "3px",
                        paddingLeft: "13px",
                        paddingRight: "13px",
                        paddingTop: "3px",
                        width: "45px",
                        fontSize: "13.3333px",
                        textAlign: "center",
                        fontFamily: "Arial",
                        margin: "0 0 5px",
                    }).appendTo(row).html(clock.InTime);

                    var endTime = $("<span>").css({
                        display: "inline-block",
                        borderRadius: "20px",
                        backgroundColor: "#509fd0",
                        color: "white",
                        paddingBottom: "3px",
                        paddingLeft: "13px",
                        paddingRight: "13px",
                        paddingTop: "3px",
                        width: "45px",
                        fontSize: "13.3333px",
                        textAlign: "center",
                        fontFamily: "Arial",
                        margin: "0 5px 5px",
                    }).appendTo(row).html(clock.OutTime || "&nbsp;");

                    var noteButton = $("<span>").html("&nbsp;").css({
                        display: "inline-block",
                        backgroundImage: "url(./Images/new-icons/notes.png)",
                        borderRadius: "99px",
                        backgroundPosition: "center",
                        width: "27px",
                        height: "27px",
                        transform: "translate(0%, -25%)"
                    }).appendTo(row);

                    var noteBox = $("<textarea>").hide().bind("change", function () {
                        if ($(this).val() == "") {
                            noteButton.css("backgroundColor", "blue");
                        }
                        else {
                            noteButton.css("backgroundColor", "green");
                        }
                        clock.Memo = $(this).val();
                    }).val(clock.Memo || "").trigger("change");

                    noteButton.click(function () {
                        var readonly = !(clock.OutTime.trim() == "");

                        var overlay = $("<div>");
                        overlay.addClass("singleentryoverlay")

                        var wrapper = $("<div>").click(function (e) {
                            e.stopImmediatePropagation();
                        }).addClass("singleentrynotewindow");

                        var row1 = $("<div>");

                        var decoration = $("<span>");

                        var textarea = $("<textarea>").bind("keyup", function () {
                            decoration.removeClass("singleentrynotestextareaYes singleentrynotestextareaNo");
                            if (this.value !== "") {
                                decoration.addClass("singleentrynotestextareaYes");
                            }
                            else {
                                decoration.addClass("singleentrynotestextareaNo");
                            }
                        }).val(noteBox.val()).trigger("keyup");

                        row1.append(decoration).append(textarea);

                        var row2 = $("<div>").css({
                            "width": "100%",
                            "textAlign": "right"
                        });
                        var saveButton = $("<button>").text("Save").click(function () {
                            noteBox.val(textarea.val().trim()).trigger("change");
                            overlay.remove();
                        }).addClass("singleentrynotessave singleentrybutton");

                        var resetButton = $("<button>").text("Reset").click(function () {
                            textarea.val("").trigger("keyup").focus();
                        }).addClass("singleentrynotesreset singleentrybutton");

                        var cancelButton = $("<button>").text("Cancel").click(function () {
                            overlay.remove();
                        }).addClass("singleentrynotescancel singleentrybutton");

                        if (readonly) {
                            textarea.attr("disabled", true);
                            row2.append(cancelButton);
                        }
                        else {
                            row2.append(saveButton).append(resetButton).append(cancelButton);
                        }


                        wrapper.append(row1).append(row2);
                        overlay.append(wrapper);
                        $("body").append(overlay);
                        textarea.focus();
                    });

                    $("#infaltimeclockdropdownholder").prepend(row);
                    if (clock.OutTime.trim() == "") {
                        status = "clockout";
                        jobClockOut = clock;
                        $("#infalTimeClockMessage").html("Clocked in at: " + clock.InTime);
                    }
                });

                if (callback) callback();

                if (status == "clockin") {
                    $("#infalTimeClockMessage").html("You are not clocked in.");
                    $("#infalclockbuttontext").html("Clock In");
                    if (!jobs.length) {
                        //console.log("No jobs found.");
                        $("#dashinfaltimeclockwidget .dashboarderror").show();
                    }
                    else if (jobs.length == 1) {
                        $("#infalclockbutton").on("click", function infalClockInSingleJobClick() {
                            var infalGetLocationSingleJob = function (position) {
                                var fullDate = moment(new Date()),
                                    inDate = fullDate.format("MM/DD/YYYY"),
                                    startTime = fullDate.format("hh:mm"),
                                    startAMPM = fullDate.format("A");
                                var obj = {
                                    empIdString: ID + "",
                                    jobIdString: jobs[0].Job_Description_No + "",
                                    latInString: "0",
                                    longInString: "0",
                                    inDate: inDate,
                                    StartTime: startTime + "",
                                    StartAMPM: startAMPM + ""
                                }
                                if (position) {
                                    var latitude = position.coords.latitude;
                                    var longitude = position.coords.longitude;

                                    obj.latInString = latitude;
                                    obj.longInString = longitude;
                                }
                                InfalClockInAjax(obj, function infalClockInCallback() {
                                    buildInfalTimeClock();
                                });
                            };
                            if (location.protocol === "https:" || location.hostname === "localhost") {
                                getDeviceLocation(infalGetLocationSingleJob);
                            }
                            else {
                                infalGetLocationSingleJob();
                            }
                        });
                    }
                    else {
                        $("#infalclockbutton").on("click", function infalClockInMultipleJobsClick() {
                            $("#infalTimeClockMessage").html("Please choose a job.");
                            $("#infalclockbutton").off("click");
                            var row = $("<div>").addClass("clocktext");

                            var dropdown = $("<span>").css({
                                display: "inline-block",
                                borderRadius: "20px",

                                width: 145,
                                paddingBottom: "3px",
                                paddingLeft: "13px",
                                paddingRight: "13px",
                                paddingTop: "3px",
                                backgroundColor: "#509fd0",
                                margin: "0 6px 5px",
                                color: "white",
                                fontSize: "12px",
                                textAlign: "center",
                                fontFamily: "Arial",
                            }).appendTo(row).html("&nbsp;").PSlist(jobs, {
                                callback: function InfalPSListCallback(item) {
                                    var infalGetLocationMultipleJobs = function (position) {
                                        /*
                                var fullDate = new Date(),
                                    inDate = ((fullDate.getMonth() + 1) + '/' + fullDate.getDate() + '/' + fullDate.getFullYear()),
                                    startTime = getFormattedTime(fullDate),
                                    startAMPM = getAMPM(fullDate);
                                    */
                                        var fullDate = moment(new Date()),
                                            inDate = fullDate.format("MM/DD/YYYY"),
                                            startTime = fullDate.format("hh:mm"),
                                            startAMPM = fullDate.format("A");
                                        var obj = {
                                            empIdString: ID + "",
                                            jobIdString: item.Job_Description_No + "",
                                            latInString: "0",
                                            longInString: "0",
                                            inDate: inDate,
                                            StartTime: startTime + "",
                                            StartAMPM: startAMPM + ""
                                        }
                                        if (position) {
                                            var latitude = position.coords.latitude;
                                            var longitude = position.coords.longitude;

                                            obj.latInString = latitude;
                                            obj.longInString = longitude;
                                        }
                                        InfalClockInAjax(obj, function infalClockInCallback() {
                                            buildInfalTimeClock();
                                        });
                                    };
                                    if (location.protocol === "https:" || location.hostname === "localhost") {
                                        getDeviceLocation(infalGetLocationMultipleJobs);
                                    }
                                    else {
                                        infalGetLocationMultipleJobs();
                                    }
                                }
                            });

                            var startTime = $("<span>").css({
                                display: "inline-block",
                                borderRadius: "20px",
                                backgroundColor: "#509fd0",
                                color: "white",
                                paddingBottom: "3px",
                                paddingLeft: "13px",
                                paddingRight: "13px",
                                paddingTop: "3px",
                                width: "45px",
                                fontSize: "13.3333px",
                                textAlign: "center",
                                fontFamily: "Arial",
                                margin: "0 0 5px",
                            }).appendTo(row).html("&nbsp;");

                            var endTime = $("<span>").css({
                                display: "inline-block",
                                borderRadius: "20px",
                                backgroundColor: "#509fd0",
                                color: "white",
                                paddingBottom: "3px",
                                paddingLeft: "13px",
                                paddingRight: "13px",
                                paddingTop: "3px",
                                width: "45px",
                                fontSize: "13.3333px",
                                textAlign: "center",
                                fontFamily: "Arial",
                                margin: "0 5px 5px",
                            }).appendTo(row).html("&nbsp;");

                            $("#infaltimeclockdropdownholder").prepend(row);
                        });
                    }
                }
                else {
                    $("#infalclockbuttontext").html("Clock Out");
                    $("#infalclockbutton").on("click", function infalClockOutCallbackClick() {
                        var infalGetLocationClockOut = function (position) {
                            var fullDate = moment(new Date()),
                                outDate = fullDate.format("MM/DD/YYYY"),
                                EndTime = fullDate.format("hh:mm"),
                                EndTimeAMPM = fullDate.format("A");

                            var obj = {
                                empIdString: ID,
                                jobIdString: jobClockOut.Emp_Job_Id,
                                recIdString: jobClockOut.ID,
                                latOutString: "0",
                                longOutString: "0",
                                outDate: outDate + "",
                                EndTime: EndTime + "",
                                EndTimeAMPM: EndTimeAMPM + "",
                                Memo: jobClockOut.Memo
                            }
                            if (position) {
                                var latitude = position.coords.latitude;
                                var longitude = position.coords.longitude;

                                obj.latOutString = latitude;
                                obj.longOutString = longitude;
                            }
                            InfalClockOutAjax(obj, function InfalClockOutCallback() {
                                buildInfalTimeClock();
                            });
                        }
                        if (location.protocol === "https:" || location.hostname === "localhost") {
                            getDeviceLocation(infalGetLocationClockOut);
                        }
                        else {
                            infalGetLocationClockOut();
                        }
                    });
                }
            });
        });

        if (tempID == null) {
            getInfalLoginCredentialsAjax(setInfalId);
        }
        else {
            setInfalId(null, tempID);
        }
    }, 3000);
}

function displayChangeUser() {
    var overlay = $("<div>")
        .addClass("modaloverlay")
        .css({
            "backgroundColor": "rgba(0, 0, 0, 0.15)"
        }).appendTo($("body"));


    $.ajax({
        type: "GET",
        url: "./home/autologin.html?RNG=" + +(new Date()),
        success: function (HTMLresponse, status, xhr) {
            //buildAbsentCard({ card: $("<div>").replaceWith(HTMLresponse), overlay: overlay, values: values, multi: true });
            var card = $("<div>").replaceWith(HTMLresponse);            
            getPSIUserOptionListAjax(function (err, data) {
                overlay.click(function () {
                    $(this).remove();
                }).append(card);

                card.click(function (e) {
                    e.stopPropagation();
                }).bind("remove", function () {
                    overlay.remove();
                });
                data.forEach(function (user) {
                    var li = $("<li>").text([user.last_name, user.first_name].join(", "));
                    li.click(function () {
                        $.session.UserId = user.user_id;
                        //homeServiceLoad(false);
                        changeFromPSIAjax(user.user_id)
                        card.trigger("remove");
                    });
                    $("#autologinlist").append(li);
                })
            })            
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    })
    return;
}