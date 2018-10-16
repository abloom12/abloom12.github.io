function getGoals(personId, selectedId, getDataOnly) {
    //Gross.  I hate you IE.  Checks if "new" button is pushed
    var tarId = "";
    if (event != null) {
        if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
            if (event.srcElement != undefined) {
                tarId = event.srcElement.id;
                if (tarId !== undefined) {
                    if (tarId.indexOf("goalNew") > -1) {
                        $.goals.saveButton = true;
                    }
                }
            }
        } else {
            // do nothing
        }
    }

    //clear these in case of a page reload.
    //if new global variable is checked do below 
    var goalDate = $('#goalsdatebox').val();
    if (goalDate == undefined) {
        var newDate = new Date();
        goalDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    }
    $.goals.objectivesWithAbsent = [];
    var start = new Date();
        $.locs = [];
        $.goalcards = [];
        $.prompts = [];
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getGoalsByDate/",
            data: '{"token":"' + $.session.Token + '", "personId":"' + personId + '", "goalDate":"' + goalDate + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
                var end = new Date();
                var diff = end - start;
                var goalidpresent = res.indexOf("goalid");
                if (getDataOnly == true) {
                    buildGoalsCard(res, selectedId, getDataOnly);
                    loadCardForHistActivity($.tempGoalIdHist, $.tempObjIdHist, $.tempActivityIdHist);
                } else {
                    if (goalidpresent == -1) {
                        var rosterhelp = "";
                        var goalshelp = "";
                        goalshelp = " helpfadeinslow";
                        var splash = "<div id='goalshelp' class='rosterhelp rosterhelpright" + goalshelp + "'><span class='helptext'>Select someone on the right side.</span></div>" +
                            "<div class='hrtriangleright" + goalshelp + "'></div>" + "</div>";
                        splash = splash + "<div class='wrapper'><div class='content'><div class='left-side'>" +
                            "<div class='hrtriangleleft" + rosterhelp +
                            "'></div><div id='rosterhelp' class='rosterhelp rosterhelpleft" + rosterhelp +
                            "'><span class='helpheader'>Get started:</span><hr class='hrhelp'><span class='helptext'>Select the Roster Icon here. Add people to the right side by clicking or tapping them.</span></div><div class='left-side-stuff'><div class='headline'>Outcomes and Services</div><br>" +
                            "This interface is designed to allow you to enter data quickly and accurately so you can focus on spending your time assisting those in need of your help." +
                            "<br><br></div></div><div class='right-side'>" + "</div></div>";
                        $(".actioncenter").html(splash);
                        addOrRemoveHelpScreenImage();
                        $("#" + personId).removeClass("highlightselected");
                        $("#roostertoolbar").removeClass("currentConsumerDisplayName");
                        $("#roostertoolbar").html("");
                        $(".helptext").text("Previous consumer had no outcomes for date selected. Please select someone from the right.").css("font-size", "12px");
                        $("#goalshelp").addClass("noOutcomesMessageBox");
                        //$(".helptext").display("block");
                    } else {
                        $(".currentConsumerDisplayName").css("display", "block");
                        populateDemoData(buildGoalsCard(res, selectedId, getDataOnly), res);                        
                        if ($.goals.justSaved) {
                            $(".goalsavedbox").text("Record Saved");
                            $.goals.justSaved = false;
                        }                        
                        //deals with css3 functionality that does not exist in IE
                        if ($.browser.mozilla || $.browser.msie) {
                            $(".cardback").addClass("forceflip");
                            $("#flip" + selectedId + " .cardfront").addClass("forceflip");
                            $("#flip" + selectedId + " .cardback").removeClass("forceflip");
                            if ($.goals.saveButton == true  ||  $.goals.deleteButton == true) {
                                $("#flip" + selectedId + " .cardfront").addClass("forceflip");
                                $("#flip" + selectedId + " .cardback").removeClass("forceflip");
                            } 
                        }
                    }
                    refilterAfterSave();
                }
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
}

function saveGoals(goalId, objectiveId, activityId, objdate, success, goalnote, promptType,
    promptNumber, personId, locationId, locationSecondaryId, goalStartTime, goalEndTime, goalCILevel) {
    if (goalStartTime == "::00") goalStartTime = "";
    if (goalEndTime == "::00") goalEndTime = "";
    var overlay = null,
        message = null;

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

    message.html("Saving...");
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/saveGoal/",
        data: '{"token":"' + $.session.Token + '", "objectiveId":"' + personId +
            '", "objectiveId":"' + objectiveId + '", "activityId":"' + activityId +
            '", "date":"' + objdate + '", "success":"' + success + '", "goalnote":"' +
            goalnote + '", "promptType":"' + promptType + '", "promptNumber":"' +
            promptNumber + '", "locationId":"' + locationId +
            '", "locationSecondaryId":"' + locationSecondaryId + '", "goalStartTime":"' + goalStartTime +
            '", "goalEndTime":"' + goalEndTime + '", "goalCILevel":"' + goalCILevel + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            overlay.remove();
            var res = JSON.stringify(response);
            
            if (!response.saveGoalResult.match("Error")) {
                $.goals.justSaved = true;
                getGoals($.userId, goalId + "-" + objectiveId);
                var list = $.pages.rosterconsumerlist.split("</consumer>");
                getRemainingDailyGoals(list);
                $.goals.tmpEvent = null;                
            }
            else {
                $.fn.PSmodal({
                    body: "Outcome could not be saved. Please verify your start time, end time, and all other data.",
                    immediate: true,
                    buttons: [

                        {
                            text: "OK",
                            callback: function () {
                            }
                        }
                    ]
                });
            }
        },
        error: function (xhr, status, error) {
            overlay.remove();
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function deleteGoal(activityId, goalId, objectiveId) {
    //clear these in case of a page reload.
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/deleteGoal/",
        data: '{"token":"' + $.session.Token + '", "activityId":"' + activityId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            getGoals($.userId, goalId + "-" + objectiveId);
            var list = $.pages.rosterconsumerlist.split("</consumer>");
            getRemainingDailyGoals(list);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getGoalSpecificLocationInfo(activityId, goalId, objId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getGoalSpecificLocationInfo/",
        data: '{"token":"' + $.session.Token + '", "activityId":"' + activityId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            var tmpLocId = '';
            var tmpLocName = '';
            var tmpSecLocId = '';
            var tmpSecLocName = '';
            $('result', res).each(function () {
                tmpLocId = $('Location_ID', this).text();
                tmpLocName = $('location_code', this).text();
                tmpSecLocId = $('Locations_Secondary_ID', this).text();
                tmpSecLocName = $('secondary_location', this).text();
            });
            setGoalsLocationId(tmpLocId, tmpLocName, goalId, objId);
            if (tmpSecLocId == "") {
                tmpSecLocId = 0;
                tmpSecLocName = 'No Secondary Location';
            }
            setGoalsSubLocationId(tmpSecLocId, tmpSecLocName, goalId, objId);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getIdsWithGoals(list) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getUserIdsWithGoals/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            var match = false;
            $('.consumerselected', list).each(function () {
                var tmpId = this.id;
                var htmlId = "#" + tmpId;
                var n = res.indexOf("<ID>"+tmpId+"</ID>");
                if (n == -1) {             
                    $(this).addClass("idnotlinkedtogoal");
                    $(this).removeClass("notselectedbuthasgoals");
                }
                else {
                    $(".consumerbodybox").addClass("smallconsumerbodybox");
                    $(htmlId).addClass("notselectedbuthasgoals");
                }
            });
            if ($(".notselectedbuthasgoals")[0]){
                // do nothing for standard helptext
            } else {
                $('.notselectedbuthasgoals', list).each(function () {
                    var tmpId2 = this.id;
                    if (tmpId2 == $.session.selectedConsumerIdForGoalsDateBack) {
                        match = true;
                    }
                });
                if ($.session.selectedConsumerIdForGoalsDateBack == "" || match == false) {
                    addToActionCenter();
                }
                $(".helptext").text("No available consumer outcomes for date selected.").css("font-size", "12px");
                $("#goalshelp").addClass("noOutcomesMessageBoxTwo");
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function addToActionCenter() {
    var rosterhelp = "";
    var goalshelp = "";
    goalshelp = " helpfadeinslow";
    var splash = "<div id='goalshelp' class='rosterhelp rosterhelpright" + goalshelp + "'><span class='helptext'>Select someone on the right side.</span></div>" +
        "<div class='hrtriangleright" + goalshelp + "'></div>" + "</div>";
    splash = splash + "<div class='wrapper'><div class='content'><div class='left-side'>" +
        "<div class='hrtriangleleft" + rosterhelp +
        "'></div><div id='rosterhelp' class='rosterhelp rosterhelpleft" + rosterhelp +
        "'><span class='helpheader'>Get started:</span><hr class='hrhelp'><span class='helptext'>Select the Roster Icon here. Add people to the right side by clicking or tapping them.</span></div><div class='left-side-stuff'><div class='headline'>Outcomes and Services</div><br>" +
        "This interface is designed to allow you to enter data quickly and accurately so you can focus on spending your time assisting those in need of your help." +
        "<br><br></div></div><div class='right-side'>" + "</div></div>";
    $(".actioncenter").html(splash);
    addOrRemoveHelpScreenImage();
    $("#roostertoolbar").removeClass("currentConsumerDisplayName");
    $("#roostertoolbar").html("");
}

function getUserIdsWithGoalsByDate(list) {
    var goalsCheckDate = $('#goalsdatebox').val();
    if (goalsCheckDate == undefined) {
        var newDate = new Date();
        goalsCheckDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    }
    if (goalsCheckDate == $.format.date(new Date(), 'MMM dd, yyyy')) {
        $('.consumerselected', list).each(function () {
            var tmpId = this.id;
            var htmlId = "#" + tmpId;
            $(htmlId).removeClass("idnotlinkedtogoal");
            $(htmlId).removeClass("notselectedbuthasgoals");
        });
        $("#actioncenter").html("");
        $("#roostertoolbar").css("display", "block");
        getIdsWithGoals(list);
    } else {
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getUserIdsWithGoalsByDate/",
            data: '{"token":"' + $.session.Token + '", "goalsCheckDate":"' + goalsCheckDate + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
                var match = false;
                $('.consumerselected', list).each(function () {
                    var tmpId = this.id;
                    var htmlId = "#" + tmpId;
                    var n = res.indexOf("<id>" + tmpId + "</id>");

                    if (n == -1) {
                        $(this).addClass("idnotlinkedtogoal");
                        if ($(this).hasClass("notselectedbuthasgoals")) {
                            $(this).removeClass("notselectedbuthasgoals");
                        }
                    }
                    else {
                        $(".consumerbodybox").addClass("smallconsumerbodybox");
                        $(htmlId).removeClass("idnotlinkedtogoal");
                        $(htmlId).addClass("notselectedbuthasgoals");
                    }
                });

                $('.notselectedbuthasgoals', list).each(function () {
                    var tmpId2 = this.id;
                    if (tmpId2 == $.session.selectedConsumerIdForGoalsDateBack) {
                        match = true;
                    }
                });

                if ($.session.selectedConsumerIdForGoalsDateBack == "" || match == false) {
                    var rosterhelp = "";
                    var goalshelp = "";
                    goalshelp = " helpfadeinslow";
                    var splash = "<div id='goalshelp' class='rosterhelp rosterhelpright" + goalshelp + "'><span class='helptext'>Select someone on the right side.</span></div>" +
                        "<div class='hrtriangleright" + goalshelp + "'></div>" + "</div>";
                    splash = splash + "<div class='wrapper'><div class='content'><div class='left-side'>" +
                        "<div class='hrtriangleleft" + rosterhelp +
                        "'></div><div id='rosterhelp' class='rosterhelp rosterhelpleft" + rosterhelp +
                        "'><span class='helpheader'>Get started:</span><hr class='hrhelp'><span class='helptext'>Select the Roster Icon here. Add people to the right side by clicking or tapping them.</span></div><div class='left-side-stuff'><div class='headline'>Outcomes and Services</div><br>" +
                        "This interface is designed to allow you to enter data quickly and accurately so you can focus on spending your time assisting those in need of your help." +
                        "<br><br></div></div><div class='right-side'>" + "</div></div>";
                    $(".actioncenter").html(splash);
                    addOrRemoveHelpScreenImage();
                    $("#roostertoolbar").html("")
                } else {
                    getGoals($.session.selectedConsumerIdForGoalsDateBack);
                }
                
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            }
        });
    }    
}

function getDaysBackForEditingGoals() {
    var tempDays = '';
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getDaysBackForEditingGoals/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $('result', res).each(function () {
                if ($.session.applicationName == 'Advisor') {
                    $.session.daysBackGoalsEdit = $('setting_value', this).text();
                } else {
                    $.session.daysBackGoalsEdit = $('setting_value', this).text();
                }                
            });
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function getViewableGoalIdsByPermission() {
    var tmpId = '';
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getViewableGoalIdsByPermission/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $('results', res).each(function () {
                tmpId = $('ID', this).text();
                $.session.viewableGoalTypeIds.push(tmpId);
            });
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function getRemainingDailyGoals(list) {
    var checkDate = $('#goalsdatebox').val();
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getRemainingDailyGoals/",
        data: '{"token":"' + $.session.Token + '", "checkDate":"' + checkDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $('.consumerselected', list).each(function () {
                var tmpId = this.id;
                var htmlId = "#" + tmpId;
                var n = res.indexOf("<ID>" + tmpId + "</ID>");
                if (n != -1) {
                    $(this).addClass("resultserrorboxdailygoals");
                } else {
                    $(this).removeClass("resultserrorboxdailygoals");
                }
            });            
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

//Need to put a call to the database to get customer specific CI values for new drop down. 
function getGoalsCommunityIntegrationLevelDropdownAjax(goalId, objId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getGoalsCommunityIntegrationLevel/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $.session.ciDropDownResponse = res;
            //assignCommunityIntegrationDropdownData(res, goalId, objId);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Get whether or not community integration is required. 
function getGoalsCommunityIntegrationRequiredAjax() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getGoalsCommunityIntegrationRequired/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var results = '';//JSON.parse(response.getGoalsCommunityIntegrationRequiredResult);
            if (results.length) {
                if (results[0].Setting_Value == "Y") {
                    $.session.communityIntegrityRequired = true;
                }
                else {
                    $.session.communityIntegrityRequired = false;
                }
            }
            else $.session.communityIntegrityRequired = "n/a";
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getOutcomeTypeForFilterAjax(saveData, callback) {
    /*
    var selectedDate = $('#goalsdatebox').val();
        if (selectedDate == undefined || selectedDate.trim() == "") {
        var newDate = new Date();
        selectedDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    }
    else {
        selectedDate = moment(selectedDate).format("YYYY-MM-DD");
    }*/
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getOutcomeTypeForFilter/",
        data: JSON.stringify(saveData),
        //data: '{"token":"' + $.session.Token + '", "selectedDate":"' + selectedDate + '", "consumerId":"' + consumerId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var results = JSON.parse(response.getOutcomeTypeForFilterResult);
            callback(results);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}
