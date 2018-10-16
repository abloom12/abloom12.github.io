$.locs = [];
$.prompts = [];
$.goals = {};
$.goals.tempColor = "";
$.goals.tempPercent = "";
$.goalcards = [];
$.userId = "";
$.newHistId = 0;
$.globalTimeout = null;
$.goals.saveButton = false;
$.goals.deleteButton = false;
$.goals.diffUser = false;
$.goals.ciDropdownClicked = false;
$.goals.HistoryCard = false;
$.goals.NoteRequired = false;
$.goals.SetNoteToGreen = false;
$.goals.tmpEvent = null;
$.goals.tmpActivityId = "";
$.goals.previousGoalsNote = "";
$.goals.justSaved = false;
$.goals.objectivesWithAbsent = [];

/*
Goal.prototype.goalid = '';
Goal.prototype.goalst = '';
Goal.prototype.Objectives = '';
Goal.prototype.goalTypeDescription = '';*/
Objective.prototype.objid = '';
Objective.prototype.objstatement = '';
Objective.prototype.objmethod = '';
Objective.prototype.objrecurrance = '';
Objective.prototype.objsuccess = '';
Objective.prototype.objfreq = '';
Objective.prototype.objoccurance = '';
Objective.prototype.objtype = '';
Activity.prototype.activityId = '';
Activity.prototype.objectiveSuccess = '';
Activity.prototype.objectiveActivityNote = '';
Activity.prototype.promptType = '';
Activity.prototype.promptNumber = '';
Activity.prototype.locationsSecondaryId = '';
Activity.prototype.submittedByUserId = '';
Activity.prototype.objectiveStartTime = '';
Activity.prototype.objectiveEndTime = '';
Activity.prototype.objectiveCILevel = '';
Activity.prototype.absentRecordId = '';
var historicalPromptRequired = "N";
var historicalAttemptsRequired = "N";
var historicalNoteRequired = "N";

//CONSTRUCTORS
function Goal(goalid, goalst, goaltypeid, goaltypedescription, totalActivities) {
    this.goalid = goalid;
    this.goalst = goalst;
    this.goaltypeid = goaltypeid;
    this.goaltypedescription = goaltypedescription;
    this.Objectives = [];
    this.Results = [];
    this.CommunityIntegrationAndTimeObject = [];
    this.Attempts = 0;
    this.Note = "";
}

function Objective(objid, objstatement, objmethod, objrecurrance, objsuccess, objfreq, objoccurance, objtype,
    totalActivites) {
    this.objid = objid;
    this.objstatement = objstatement;
    this.objmethod = objmethod;
    this.objrecurrance = objrecurrance;
    this.objsuccess = objsuccess;
    this.objfreq = objfreq;
    this.objoccurance = objoccurance;
    this.objtype = objtype;
    this.totalActivities = totalActivites;
    this.Activity = [];
}

function Activity(activityId, objectiveId, objectiveSuccess, objectiveActivityNote, promptType,
    promptNumber, locationsSecondaryId, submittedByUserId, activityDate, objectiveStartTime, objectiveEndTime, objectiveCILevel, absentRecordId) {
    this.activityId = activityId;
    this.objectiveId = objectiveId;
    this.objectiveSuccess = objectiveSuccess;
    this.objectiveActivityNote = objectiveActivityNote;
    this.promptType = promptType;
    this.promptNumber = promptNumber;
    this.locationsSecondaryId = locationsSecondaryId;
    this.submittedByUserId = submittedByUserId;
    this.activityDate = activityDate;
    this.objectiveStartTime = objectiveStartTime;
    this.objectiveEndTime = objectiveEndTime;
    this.objectiveCILevel = objectiveCILevel;
    this.absentRecordId = absentRecordId;
}

function goalsLocation(locationId, locationName) {
    this.locationId = locationId;
    this.locationName = locationName;
    this.secondaryLocations = [];
}

function SecondaryLocation(secondaryLocationId, secondaryLocation) {
    this.secondaryLocationId = secondaryLocationId;
    this.secondaryLocation = secondaryLocation;
}

function Result(resultCode, desc, notesrequired, promptrequired, attemptsrequired, communityintegrationrequired, citimerequired) {
    this.resultCode = resultCode;
    this.desc = desc;
    this.notesrequired = notesrequired;
    this.promptrequired = promptrequired;
    this.attemptsrequired = attemptsrequired;
    this.communityintegrationrequired = communityintegrationrequired;
    this.citimerequired = citimerequired;
}

function CommunityIntegrationAndTimeObject(showTime, showCommunityIntegration) {
    this.showTime = showTime;
    this.showCommunityIntegration = showCommunityIntegration;
}

function Prompt(promptCode, promptCaption) {
    this.promptCode = promptCode;
    this.promptCaption = promptCaption;
}

//BUILD INITIAL CARD
// mostly loads splash screen and single select if only one consumer selected
function goalsLoad() {
    $("*").removeClass("highlightselected");
    //if ($.session.applicationName != 'Gatekeeper') {
    //    getGoalsCommunityIntegrationRequiredAjax();
    //}
    
    $("#goalssettingsbutton").addClass("buttonhighlight");
    var rosterhelp = "";
    var goalshelp = "";
    getDaysBackForEditingGoals();
    if ($.session.viewableGoalTypeIds.length == 0) {
        getViewableGoalIdsByPermission();
    }    
    if ($(".consumerselected").length == 0) { //no consumers selected.
        rosterhelp = " helpfadeinslow";
        tid = setInterval(strobe, 1000);
    } else {
        goalshelp = " helpfadeinslow";
        $("#goalssettingsbutton").addClass("buttonhighlight");
    }
    getGoalsCommunityIntegrationLevelDropdownAjax();
    // Set the day service action banner:
    $("#actionbanner").html("");
    $("#actionbanner").html( //"<dayserviceicon class='dayserviceicon'></dayserviceicon>" +
        "<button id='calendaricon' class='bannericon calendaricon' onClick=popGoalsCalendarDateBox('goalsdatebox')></button>" +
        "<dateinput id='datebox2' class='locationbox' onClick=popGoalsCalendarDateBox('goalsdatebox')><input id='goalsdatebox' class='headertext'></input></dateinput>" +
        "<div id='goalsfilterbox' class='goalsfilterbox' ></div>" +
        "<button class='bannericon filtericon' onClick='popfilterGoals()'></button>" +
        "<div id='goalsfilterbox' class='goalsfilterbox2' onClick='popfilterGoals()'><div id='goalsfiltertext' class='headertext'>All Services</div></div>" +
        "<div id='goalfilterpop' class='goalfilterpop'><a href='#' class='servicesLink' onClick=filterGoals('All')>All Services</a><a href='#' class='servicesLink' onClick=filterGoals('Complete')>Complete</a><a href='#' class='servicesLink' onClick=filterGoals('Incomplete')>Incomplete</a></div>" +
        //
        "<button class='bannericon filtericon' onClick='popfilterGoalsOccurance()'></button>" +
        "<div id='goalsfilterboxoccurance' class='goalsfilterbox2' onClick='popfilterGoalsOccurance()'><div id='goalsoccurancefiltertext' class='headertext'>All Occurrences</div></div>" +
        "<div id='goaloccurancefilterpop' class='goaloccurancefilterpop'>" +
            "<a href='#' class='servicesLink' onClick=filterGoalsOccurance('All')>All Occurrences</a>" +
            "<a href='#' class='servicesLink' onClick=filterGoalsOccurance('None')>No Frequency</a>" + 
            "<a href='#' class='servicesLink' onClick=filterGoalsOccurance('Hourly')>Hourly</a>" +
            "<a href='#' class='servicesLink' onClick=filterGoalsOccurance('Daily')>Daily</a>" +
            "<a href='#' class='servicesLink' onClick=filterGoalsOccurance('Weekly')>Weekly</a>" +
            "<a href='#' class='servicesLink' onClick=filterGoalsOccurance('Monthly')>Monthly</a>" +
            "<a href='#' class='servicesLink' onClick=filterGoalsOccurance('Yearly')>Yearly</a></div>" +
        //
        "<span id='goalsfilterboxholder' style='display:inherit'><button id='goalsfilterbutton' class='bannericon filtericon'></button>" +
        "<div id='goalsfilterboxoutcometype' class='goalsfilterbox2'><div id='goalsoutcometypefiltertext' class='headertext'>All Outcome Types</div></div></span>" +
        "");
    resizeHeaderText('#goalsoutcometypefiltertext', 17);
    // Set the calendar date to the current date:
    $("#goalsdatebox").text($.format.date(new Date($.pages.rosterdate), 'MM/dd/yy'));
    $("#goalsdatebox").val($.format.date(new Date(), 'MMM dd, yyyy'));
    $('#goalsdatebox').attr('readonly', true);
    //make splash screen
    var splash = "<div id='goalshelp' class='rosterhelp rosterhelpright" + goalshelp +
        "'><span class='helptext'>Select someone on the right side.</span></div>" +
        "<div class='hrtriangleright" +
        goalshelp + "'></div>" +
        "</div>";
    splash = splash + "<div class='wrapper'><div class='content'><div class='left-side'>" +
        "<div class='hrtriangleleft" + rosterhelp +
        "'></div><div id='rosterhelp' class='rosterhelp rosterhelpleft" + rosterhelp +
        "'><span class='helpheader'>Get started:</span><hr class='hrhelp'><span class='helptext'>Select the Roster Icon here. Add people to the right side by clicking or tapping them.</span></div><div class='left-side-stuff'><div class='headline'>Outcomes and Services</div><br>" +
        "This interface is designed to allow you to enter data quickly and accurately so you can focus on spending your time assisting those in need of your help." +
        "<br><br></div></div><div class='right-side'>" + "</div></div>";
    //$("#actionbanner").html("");
    $("#actioncenter").html(splash);
    addOrRemoveHelpScreenImage();
    //getGoals("10065");      // <---------------- remove when ready to go live.
    $("#roostertoolbar").html("");
    if ($.pages.rosterconsumerlist != "") {
        var list = $.pages.rosterconsumerlist.split("</consumer>");
        if (list.length <= 2) {
            $('.consumerselected', list).each(function () {                
                var tmpName = this.id;
                var name = this.innerText;
                $.session.singleLoadedConsumerId = tmpName;
                $.session.singleLoadedConsumerName = name;
                $("#roostertoolbar").html("Currently Selected:" + "<br />")
                $("#roostertoolbar").append("<p>" + name + "</p>");
                $("#roostertoolbar").addClass("currentConsumerDisplayName");
                boxAction(event);
                getIdsWithGoals(list);
                getRemainingDailyGoals(list);
            });
        }else if(list.length > 2){
            //pass the list to the ajax layer to do compare of returned ids
            getIdsWithGoals(list);
            getRemainingDailyGoals(list);
        }
    }
    $.session.singleLoadedConsumerId = "";
    $(document).trigger("moduleLoad");
    //addOrRemoveHelpScreenImage();      I believe this is redundant
}

// onclick for selecting consumer on right.  Calls getGoals from Ajax
function highlightPersonGoals(event) {
    var par = $(event.target);
    if ($(par).hasClass("consumerselected")) {
    } else {
        par = $(par).closest('consumer');
    }
    // Set the background color for persons:
    $("#consumerlist").children().css('background-color', '');
    // Get the id of the selected person:
    var consumerId = par.attr('id');
    //$.session.selectedConsumerIdForGoalsDateBack = consumerId;
    // Set the new background color of the person selected:
    //par.css('background-color', '#99CCFF');    

    $(".consumerselected").addClass("notselectedbuthasgoals");
    $(".idnotlinkedtogoal").removeClass("notselectedbuthasgoals");
       
    par.removeClass("notselected");
    par.addClass("highlightselected");
    //$.userId = consumerId;
    if ($.session.singleLoadedConsumerId != "") {
        $.userId = $.session.singleLoadedConsumerId;
        $("#" + $.session.singleLoadedConsumerId).addClass("highlightselected");
        var test = $(".highlightselected")
        $.session.singleLoadedConsumerName = $(".highlightselected")[0].innerText;
    } else {
        $.userId = consumerId;
    }
    $.session.selectedConsumerIdForGoalsDateBack = $.userId;
    if (event.currentTarget.innerText != "" && event.currentTarget.innerText != "Set") {
        var name = event.currentTarget.innerText;
        name = name.replace("Groups", "");
        $("#roostertoolbar").html("Currently Selected:" + "<br />");
        $("#roostertoolbar").append("<p>" + name + "</p>");
        $("#roostertoolbar").addClass("currentConsumerDisplayName");
    }
    else if ($.session.singleLoadedConsumerName != "") {
        name = $.session.singleLoadedConsumerName;
        name = name.replace("Groups", "");
        $("#roostertoolbar").html("Currently Selected:" + "<br />");
        $("#roostertoolbar").append("<p>" + name + "</p>");
        $("#roostertoolbar").addClass("currentConsumerDisplayName");
    }
    
    getGoals($.userId);
}

// Called in Ajax getGoals.  Appears to build structure of card.  
function buildGoalsCard(goalsResults, selectedId, getDataOnly) {
    var goalCard = "";
    var actHist = "";
    var goalPos = 0;
    var tempGoalCards = [];

    $("goal", goalsResults).each(function () {
        var tmpGoalid = $('goalid', this).text();
        var tmpGoalst = $('goalst', this).text();
        var tmpGoalTypeId = $('goaltypeid', this).text();
        var tmpGoalTypeDescription = $('goaltypedescription', this).text();

        var tmpObjId = "";
        var tmpObjSt = "";
        var tmpObjMethod = "";
        var tmpObjRecurrance = "";
        var tmpObjSuccess = "";
        var tmpObjFreq = "";
        var tmpObjOccurance = "";
        var tmpObjType = "";
        var intObjpos = 0;
        var gl = {
            goalid: tmpGoalid,
            goalst: tmpGoalst,
            goaltypeid: tmpGoalTypeId,
            goaltypedescription: tmpGoalTypeDescription,
            Objectives: [],
            Results: [],
            CommunityIntegrationAndTimeObject: [],
            Attempts: 0,
            Note: "",

        }
        //var gl = new Goal(tmpGoalid, tmpGoalst, tmpGoalTypeId, tmpGoalTypeDescription);
        /*
         * CTORS
function Goal(goalid, goalst, goaltypeid, goaltypedescription, totalActivities) {
    this.goalid = goalid;
    this.goalst = goalst;
    this.goaltypeid = goaltypeid;
    this.goaltypedescription = goaltypedescription;
    this.Objectives = [];
    this.Results = [];
    this.CommunityIntegrationAndTimeObject = [];
    this.Attempts = 0;
    this.Note = "";
}
         */

        $("objective", this).each(function () {
            tmpObjId = $('objid', this).text();
            tmpObjSt = $('objstatement', this).text();
            tmpObjMethod = $('objmethod', this).text();
            tmpObjRecurrance = $('objrecurrance', this).text();
            tmpObjSuccess = $('objsuccess', this).text();
            tmpObjFreq = $('objfreq', this).text();
            tmpObjOccurance = $('objoccurance', this).text();
            tmpObjType = $('objtype', this).text();
            var totalActivities = 0;
            var intActPos = 0;
            var ob = new Objective(tmpObjId, tmpObjSt, tmpObjMethod,
                tmpObjRecurrance, tmpObjSuccess, tmpObjFreq,
                tmpObjOccurance, tmpObjType, 0);
            gl.Objectives[intObjpos] = ob;
            $("activity", this).each(function () {
                var tmpActId = $('activity_id', this).text();
                var tmpObjId2 = $('objective_id', this).text();
                var tmpObjSeccess = $('objective_success', this).text();
                var tmpNote = $('objective_activity_note', this).text();
                var tmpPromptType = $('prompt_type', this).text();
                var tmpPromptNumber = $('prompt_number', this).text();
                var tmpLocationsSecondaryId = $(
                    'locations_secondary_id', this).text();
                var tmpSubmittedByUserId = $('submitted_by_user_id', this).text();
                var tmpActivityDate = $('objective_date', this).text();
                var tmpObjStartTime = $('objective_start_time', this).text();
                var tmpObjEndTime = $('objective_end_time', this).text();
                var tmpObjCILevel = $('objective_ci_level', this).text();
                var tmpAbsentRecordId = $('absent_record_id', this).text();
                var tmpObjectiveSuccessDescription = $('objective_success_description', this).text();
                var act = new Activity(tmpActId, tmpObjId2,
                    tmpObjSeccess, tmpNote, tmpPromptType,
                    tmpPromptNumber, tmpLocationsSecondaryId, tmpSubmittedByUserId, tmpActivityDate,
                    tmpObjStartTime, tmpObjEndTime, tmpObjCILevel, tmpAbsentRecordId);
                ob.Activity.push(act);
                if (tmpObjectiveSuccessDescription != 'Absent') {
                    totalActivities++;
                }
                
            });
            gl.Objectives[intObjpos].totalActivities = totalActivities;
            intObjpos++;
        }); //end objective
        $("successtype", this).each(function () {
            var tmpResultCode = $('objectivesuccess', this).text();
            var tmpDesc = $('objectivesuccessdescription', this).text();
            var tmpNotesrequired = $('objectivenotesrequired', this).text();
            var tmpPromptrequired = $('objectivepromptrequired', this).text();
            var tmpAttemptsrequired = $('objectiveattemptsrequired', this).text();
            var tmpCommunityIntegrationRequired = $('communityintegrationrequired', this).text();
            var tmpCITimeRequired = $('citimerequired', this).text();
            var result = new Result(tmpResultCode, tmpDesc, tmpNotesrequired,
                tmpPromptrequired, tmpAttemptsrequired, tmpCommunityIntegrationRequired, tmpCITimeRequired);
            gl.Results.push(result);
        });
        $("communityintegrationinfo", this).each(function () {
            var tmpShowTime = $('cishowtime', this).text();
            var tmpShowCommunityIntegration = $('showcommunityintegration', this).text();            
            var communityIntegrationAndTimeObject = new CommunityIntegrationAndTimeObject(tmpShowTime, tmpShowCommunityIntegration);
            gl.CommunityIntegrationAndTimeObject.push(communityIntegrationAndTimeObject);
        });

        if ($.session.applicationName == 'Gatekeeper') {
            var tmpShowTime = 'N';
            var tmpShowCommunityIntegration = 'N';
            var communityIntegrationAndTimeObject = new CommunityIntegrationAndTimeObject(tmpShowTime, tmpShowCommunityIntegration);
            gl.CommunityIntegrationAndTimeObject.push(communityIntegrationAndTimeObject);
        }

        goalPos++;
        tempGoalCards.push(gl);
    });
    (function () {
        var a = JSON.stringify(tempGoalCards);

        var fakeArr = tempGoalCards.sort(function (a, b) {
            let reA = /[^a-zA-Z]/g;
            let goalA = a.goaltypedescription.replace(reA, "").toUpperCase();
            let goalB = b.goaltypedescription.replace(reA, "").toUpperCase();

            if (goalA < goalB) return -1;
            if (goalA > goalB) return 1;
            return 0;
        });
        var b = JSON.stringify(tempGoalCards);
    })();
    $.goalcards = tempGoalCards;

    $("location", goalsResults).each(function () {
        var tmpLocationId = $('location_id', this).text();
        var tmpLocationName = $('locationname', this).text();
        var loc = new goalsLocation(tmpLocationId, tmpLocationName);
        var valid = true;
        $.locs.forEach(function (locb) {
            if (loc.locationId == locb.locationId) valid = false;
        });
        if (valid) {
            $("secondarylocation", this).each(function () {
                var tmpSecondaryLocationId = $('secondarylocation_id', this).text();
                var tmpSecondaryLocation = $('secondarylocation', this).text();
                if (tmpSecondaryLocationId.length > 0) { //remove blank rows
                    var sl = new SecondaryLocation(tmpSecondaryLocationId,
                        tmpSecondaryLocation);
                    loc.secondaryLocations.push(sl);
                }
            });
            $.locs.push(loc);
        }
    });

    $("prompt", goalsResults).each(function () {
        var tmpPromptCode = $('promptcode', this).text();
        var tmpPromptCapation = $('promptcaption', this).text();
        var prompt = new Prompt(tmpPromptCode, tmpPromptCapation);
        $.prompts.push(prompt);
    });

    if (getDataOnly == true) {
        return "complete";
    } else {
        return makeAllCards(selectedId);
    }
}

// seems to be essential.  Called by Ajax getGoals.  Probably should rename
function populateDemoData(goalsCards, goalsResults) {
    populateActionCenterWithGoals(goalsCards);
    knob();
    $("goal", goalsResults).each(function () {
        var tmpGoalid = $('goalid', this).text();
        var i = 0;
        var mostRecentUpdatedByUserName = '';
        var mostRecentUpdatedDate = '';
        var convertedMostRecentUpdatedDate = '';
        $("objective", this).each(function () {
            var objID = $('objid', this).text();
            var objdate = ""//$('objective_date', this).text();
            var checkDate = $('#goalsdatebox').val();
            var newDate = new Date(checkDate);
            selectedDate = (newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' + ('0' + newDate.getDate()).slice(-2));
            $("activity", this).each(function () {
                objective_date = $('objective_date', this).text();
                absent_record_id = $('absent_record_id', this).text();
                if (absent_record_id != "") {
                    objdate += objective_date;
                }
            });
            //if (selectedDate != objective_date) {
            if (objdate.indexOf(selectedDate) == -1) {
                //$(".goalnewsmb").show();
                $("#flip" + tmpGoalid + '-' + objID + " .goalnewsmb").show();
                absentReverseUnclickable('flip' + tmpGoalid + '-' + objID);
            }            
        });
        $("objective", this).each(function () {
            var tmpObjid = $('objid', this).text();
            //alert(tmpGoalid);
            $("activitydata", this).each(function () {
                mostRecentUpdatedByUserName = $('firstname', this).text() + " " + $('lastname', this).text();
                mostRecentUpdatedDate = $('mostrecentactivitydate', this).text();
            });
            if (mostRecentUpdatedByUserName == '' || mostRecentUpdatedByUserName == " " && mostRecentUpdatedDate == '') {
                mostRecentUpdatedByUserName = ''
            }
            if (mostRecentUpdatedDate != '') {
                convertedMostRecentUpdatedDate = new Date(mostRecentUpdatedDate);
                convertedMostRecentUpdatedDate = convertedMostRecentUpdatedDate.setDate(convertedMostRecentUpdatedDate.getDate() + 1);
                convertedMostRecentUpdatedDate = new Date(convertedMostRecentUpdatedDate);
                convertedMostRecentUpdatedDate = ((convertedMostRecentUpdatedDate.getMonth() + 1) + '/' + convertedMostRecentUpdatedDate.getDate() + '/' + convertedMostRecentUpdatedDate.getFullYear());                
            }
            if (mostRecentUpdatedDate != '' && mostRecentUpdatedByUserName == " ") {
                mostRecentUpdatedByUserName = 'Admin user';
            }
            if (mostRecentUpdatedDate == '') {
                convertedMostRecentUpdatedDate = '';
            }
            $("#lastactivityone" + tmpGoalid + "-" + tmpObjid).html('Updated by:' + '<br />').addClass("methodactivitysuccess");
            $("#lastactivitysmallone" + tmpGoalid + "-" + tmpObjid).html(mostRecentUpdatedByUserName + '<br />').addClass("methodactivitysuccesssmall");
            $("#lastactivitytwo" + tmpGoalid + "-" + tmpObjid).html('Updated on:' + '<br />').addClass("methodseccess").addClass("methodactivitysuccesssmall");
            $("#lastactivitysmalltwo" + tmpGoalid + "-" + tmpObjid).html(convertedMostRecentUpdatedDate).addClass("methodactivitysuccesssmall");
            outcomeType = $(".goalsrightheaderbox" + tmpGoalid + "-" + tmpObjid).html();
            $(".goalsrightheaderbox" + tmpGoalid + "-" + tmpObjid).html(outcomeType + ' - ' + mostRecentUpdatedByUserName + ' ' + convertedMostRecentUpdatedDate);
        }); // end objective
    });    
    $("goal", goalsResults).each(function () {
        var tmpGoalid = $('goalid', this).text();
        var i = 0;
        var objectiveStartDate = '';
        var objectiveEndDate = '';
        var bottomNumberForPercent = '';
        var topNumberForPercent = '';
        var percentSuccess = 'No attempt';
        var dateString = '';
        var convertedObjectiveStartDate = '';
        var convertedObjectiveEndDate = '';
        $("objective", this).each(function () {
            var percentSuccess = 'No attempt';
            var tmpObjid = $('objid', this).text();
            //alert(tmpGoalid);
            $("successpercentdata", this).each(function () {
                objectiveStartDate = $('startdate', this).text();
                objectiveEndDate = $('enddate', this).text();
                bottomNumberForPercent = $('bottomnumber', this).text();
                topNumberForPercent = $('topnumber', this).text();
            });
            if (objectiveStartDate != '') {
                convertedObjectiveStartDate = new Date(objectiveStartDate);
                convertedObjectiveStartDate = convertedObjectiveStartDate.setDate(convertedObjectiveStartDate.getDate() + 1);
                convertedObjectiveStartDate = new Date(convertedObjectiveStartDate);
                convertedObjectiveStartDate = ((convertedObjectiveStartDate.getMonth() + 1) + '/' + convertedObjectiveStartDate.getDate() + '/' + convertedObjectiveStartDate.getFullYear());
            }
            if (objectiveEndDate != '') {
                convertedObjectiveEndDate = new Date(objectiveEndDate);
                convertedObjectiveEndDate = convertedObjectiveEndDate.setDate(convertedObjectiveEndDate.getDate() + 1);
                convertedObjectiveEndDate = new Date(convertedObjectiveEndDate);
                convertedObjectiveEndDate = ((convertedObjectiveEndDate.getMonth() + 1) + '/' + convertedObjectiveEndDate.getDate() + '/' + convertedObjectiveEndDate.getFullYear());
            }
            if (convertedObjectiveStartDate != '' && convertedObjectiveEndDate != '') {
                dateString = convertedObjectiveStartDate + ' - ' + '<br />' + convertedObjectiveEndDate;
            } else if (convertedObjectiveStartDate != '' && convertedObjectiveEndDate == '') {
                dateString = convertedObjectiveStartDate + ' - ' + '<br />' + '00/00/0000';
            } else if (convertedObjectiveStartDate == '' && convertedObjectiveEndDate != '') {
                dateString = 'No start date' + ' - ' + '<br />' + convertedObjectiveEndDate;
            } else {
                dateString = 'Undefined';
            }
            
            if (((bottomNumberForPercent != '') && (topNumberForPercent != '')) && ((bottomNumberForPercent != 0) && (topNumberForPercent != 0))) {
                percentSuccess = topNumberForPercent / bottomNumberForPercent;
                percentSuccess = parseInt(percentSuccess * 100, 10);
            }
            $("#successes" + tmpGoalid + "-" + tmpObjid).html('Service dates:' + '<br />').addClass("methodsuccesses");
            $("#successessmallone" + tmpGoalid + "-" + tmpObjid).html(dateString + '<br />');
            $("#successestwo" + tmpGoalid + "-" + tmpObjid).html('Percent success:' + '<br />').addClass("methodseccess");
            if (percentSuccess == 'No attempt') {
                $("#successessmalltwo" + tmpGoalid + "-" + tmpObjid).html(percentSuccess);
            } else {
                $("#successessmalltwo" + tmpGoalid + "-" + tmpObjid).html(percentSuccess + '%');
            }
            
        }); // end objective
    });
}

// Only called by populateDemoData at the moment.  This allows the update of center cards without reloading everything, like the charts.  
function populateActionCenterWithGoals(goalsCards) {
    $("#actioncenter").html(goalsCards);
    //12/07/2016 JD here. I feel dirty doing it this way, but due to an issue with zIndexing, and that objects in the DOM can't stack on top of each other thanks to inheiritance,
    //it's better to do it this way than to rewrite EVERYTHING.
    //asdf

    var myFunc = function () {
        var obj = $(this);
        obj.attr("onclick", null);
        var tmpName = null, //$('captionname', this).text(),
            tmpCode = null; //$('code', this).text();
        var goal = obj.attr("goal"),
            objID = obj.attr("obj");
        if ($.goals.objectivesWithAbsent.indexOf(objID) != -1) {
            absentUnclickable('flip' + goal + '-' + objID);
            $("#flip" + goal + '-' + objID + " .goalnewsmb").hide();
        } 
        //var arr = [{ code: null, name: null, goal: goal, objID: objID, text: "&nbsp;" }];
        var arr = [];
        if ($.session.communityIntegrityRequired == "n/a") arr = [{ code: null, name: null, goal: goal, objID: objID, text: "&nbsp;" }];
        var tempArr = [];
        $("result", $.session.ciDropDownResponse).each(function () {
            tempArr.push({
                name: $('captionname', this).text(),
                code: $('code', this).text(),
                goal: goal,
                objID: objID,
                text: $('captionname', this).text()
            });
        });
        tempArr.sort(function (a, b) {
            var nameA = a.name.toUpperCase(),
                nameB = b.name.toUpperCase();

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        arr = arr.concat(tempArr);
        $(".goalsavedbox").text("");
        if(arr.length) {
            $("#goalscidropdown" + goal + "-" + objID).attr("onclick", null).PSlist(arr, {
                onclick: function () {
                    $(".goalsavedbox").text("");
                },
                callback: function (item) {
                    changeCILevel(item.code, item.name, item.goal, item.objID);
                }
            });
        }
    }
    $("#actioncenter objectiveData").each(myFunc);

    var checkDate = $('#goalsdatebox').val();
    var daysBetween = daysBetweenDates(checkDate);
    if (daysBetween > $.session.daysBackGoalsEdit || $.session.GoalsUpdate == false) {
        goalsEditFieldsUnclickable();
    } else {
        goalsEditFieldsClickableAll();
    }
}

function makeAllCards(selectedId, activityId) {
    var goalCards = "";
    var other = "";
    var hourly = "";
    var daily = "";
    var weekly = "";
    var monthly = "";
    var yearly = "";
    var daysBackDisplay = "";
    //$.goals.objectivesWithAbsent = [];
    for (var j = 0; j < $.goalcards.length; j++) {
        if ($.goalcards[j].Objectives.length == 0) {
            $.goalcards.splice(j, 1);
        }
    }
    
    var today = getTodaysDate();
    for (var i = 0; i < $.goalcards.length; i++) {
        var indexOf = $.session.viewableGoalTypeIds.indexOf($.goalcards[i].goaltypeid);
        if ($.session.viewableGoalTypeIds.indexOf($.goalcards[i].goaltypeid) == undefined || $.session.viewableGoalTypeIds.indexOf($.goalcards[i].goaltypeid) == -1) {//Needs moved up a level to where make card is called
            //Do nothing, because of lack of permission
        } else {
            //do another loop here over the objectives, change the 0 to j inside the [] beside Objectives
            for (var j = 0; j < $.goalcards[i].Objectives.length; j++) {
            
                if ($.goalcards[i].Objectives.length != 0) {
                    temp = $.goalcards[i].Objectives[j].objrecurrance;

                } else {
                    temp = "Other";
                }

                //pass in this temp value to the makeCard function to compare with the objrecurrance of each objective
                if (temp == 'H') {
                    hourly = hourly + makeCard($.goalcards[i], selectedId, activityId, temp);
                } else if (temp == 'D') {
                    daily = daily + makeCard($.goalcards[i], selectedId, activityId, temp);
                } else if (temp == 'W') {
                    weekly = weekly + makeCard($.goalcards[i], selectedId, activityId, temp);
                } else if (temp == 'M') {
                    monthly = monthly + makeCard($.goalcards[i], selectedId, activityId, temp);
                } else if (temp == 'Y') {
                    yearly = yearly + makeCard($.goalcards[i], selectedId, activityId, temp);
                } else {
                    other = other + makeCard($.goalcards[i], selectedId, activityId, temp);
                }
            }
                        
        }
        
    }    
    var goalCalendarDate = new Date($('#goalsdatebox').val());
    monthDate = new Date($('#goalsdatebox').val());
    //Full date MMM dd, yyyy
    var fullDate = $.format.date(goalCalendarDate, 'MMM dd, yyyy');
    //First and Last Day of week
    var firstdayWeek = new Date(goalCalendarDate.setDate(goalCalendarDate.getDate() - goalCalendarDate.getDay()));
    var formattedFirstDayWeek = $.format.date(firstdayWeek, 'MMM dd, yyyy');
    var lastdayWeek = new Date(goalCalendarDate.setDate(goalCalendarDate.getDate() - goalCalendarDate.getDay() + 6));
    var formattedLastDayWeek = $.format.date(lastdayWeek, 'MMM dd, yyyy');
    //First and Last Day of month
    //var firstDayMonth = new Date(goalCalendarDate.getFullYear(), goalCalendarDate.getMonth(), 1);
    var firstDayMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    var formattedFirstDayMonth = $.format.date(firstDayMonth, 'MMM dd, yyyy');
    //var lastDayMonth = new Date(goalCalendarDate.getFullYear(), goalCalendarDate.getMonth() + 1, 0);
    var lastDayMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    var formattedLastDayMonth = $.format.date(lastDayMonth, 'MMM dd, yyyy');
    //Year only
    var yearOnly = $.format.date(goalCalendarDate, 'yyyy');

    var displayDaysBack = $.session.daysBackGoalsEdit;
    daysBackDisplay = "<div id='dayBackDisplay'>*You may edit up to " + displayDaysBack + " days back from today</div>";

    //add the banner bar for each period, if there is data in that time period.
    if (hourly.length > 5) {
        hourly = "<div id='goalhour' class='goalline'>Hourly Activities" + " - " + fullDate + "</div>" + hourly;
    }
    if (daily.length > 5) {
        daily = "<div id='goalday' class='goalline'>Daily Activities" + " - " + fullDate + "</div>" + daily;
    }
    if (weekly.length > 5) {
        weekly = "<div id='goalweek' class='goalline'>Weekly Activities" + " - " + formattedFirstDayWeek + " thru " + formattedLastDayWeek + "</div>" + weekly;
    }
    if (monthly.length > 5) {
        monthly = "<div id='goalmonth' class='goalline'>Monthly Activities" + " - " + formattedFirstDayMonth + " thru " + formattedLastDayMonth + "</div>" + monthly;
    }
    if (yearly.length > 5) {
        yearly = "<div id='goalyear' class='goalline'>Yearly Activities" + " - " + yearOnly + "</div>" + yearly;
    }
    return daysBackDisplay + other + hourly + daily + weekly + monthly + yearly;
}

function makeCard(Goal, selectedId, activityId, temp) {
    var goalCard = "";
    var actId = 0; //1534
    var consumerId = $(".highlightselected")[0].id;
    if (typeof (activityId) !== "undefined") actId = activityId;
    for (var pos = 0; pos < Goal.Objectives.length; pos++) {
        var objRecurrance = Goal.Objectives[pos].objrecurrance;
        if (objRecurrance == temp && Goal.Objectives[pos] != "") {
            //get the objrecurrance from objective and compare to the value passed in
            // if a match do the work, if not skip all work
            var objectiveMethod = Goal.Objectives[pos].objmethod;
            if (objectiveMethod.indexOf("\\r\\n") != -1) {
                objectiveMethod = objectiveMethod.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
            } else {
                objectiveMethod = objectiveMethod;
            }
            if (objectiveMethod.indexOf("\\") != -1) {
                objectiveMethod = objectiveMethod.replace(/\\/g, " ");
            }
            var objectiveStatement = Goal.Objectives[pos].objstatement;
            if (objectiveStatement.indexOf("\\r\\n") != -1) {
                objectiveStatement = objectiveStatement.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
            } else {
                objectiveStatement = objectiveStatement;
            }
            if (objectiveStatement.indexOf("\\") != -1) {
                objectiveStatement = objectiveStatement.replace(/\\/g, " ");
            }
            var objectiveSuccess = Goal.Objectives[pos].objsuccess;
            if (objectiveSuccess.indexOf("\\r\\n") != -1) {
                objectiveSuccess = objectiveSuccess.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
            } else {
                objectiveSuccess = objectiveSuccess;
            }
            if (objectiveSuccess.indexOf("\\") != -1) {
                objectiveSuccess = objectiveSuccess.replace(/\\/g, " ");
            }
            //build knobb text
            var test = Goal.Objectives[pos].totalActivities;
            var knobbtext = setKnobbTextandColor(Goal.Objectives[pos].objfreq, Goal.Objectives[pos].totalActivities, Goal.Objectives[pos].objoccurance);
            goalCard = goalCard + "<div id='flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "'" + "class='flip' reocc='" + Goal.Objectives[pos].objrecurrance + "' >";
            var flipped = "";
            if (Goal.goalid + "-" + Goal.Objectives[pos].objid == selectedId) {
                if (typeof selectedId !== 'undefined') {
                    flipped = " flipped";
                }
            }
            goalCard = goalCard + "<div id='card' class='card" + flipped +
                "'><div id='cardfront' class='face front cardfront'>";
            //front of card
            goalCard = goalCard + "<div id='goalscard' class='goalscard'>" +
                "<div class='goalsleft'>" +
                "<div class='goalslefttop'><span class='goalsheaderbox'><span class='goalsheadertext'>Activities</span></span><span class='goalsknobbox'><input class='knob' data-width='100' data-displayInput=false data-linecap=round data-readOnly=true data-angleOffset=-180 data-fgColor='" +
                $.goals.tempColor + "' data-bgColor='#70b1d8' value='" + $.goals.tempPercent +
                "' /><div id='knobcenter' class='knobcenter goalsheadertext' style='background:" +
                $.goals.tempColor + ";'>" + knobbtext + "</div></span></div>";
                
            //Dynamic outcomes list
            goalCard = goalCard + "<div id='goalstoolbar' class='goalstoolbar'>";
            var goalhistselected = "";
            var goalshisteffect = "";
            for (var z = 0; z < Goal.Objectives[pos].Activity.length; z++) {
                goalhistselected = "";
                goalshisteffect = "";
                if (Goal.Objectives[pos].Activity[z].activityId == activityId) {
                    goalhistselected = " goalhistselected";
                }
                if (Goal.Objectives[pos].Activity[z].absentRecordId != "") {
                    $.goals.objectivesWithAbsent.push(Goal.Objectives[pos].objid);
                }
                if ($.newHistId == Goal.goalid + "-" + Goal.Objectives[pos].objid) {
                    $.newHistId = 0;
                    goalshisteffect = " goalshistfadeffect";
                    goalhistselected = " goalshistfadineffect";
                }
                var a = Goal.Objectives[pos].Activity[z].objectiveSuccess;
                if (Goal.Objectives[pos].Activity[z].promptType == "") {
                    Goal.Objectives[pos].Activity[z].promptType = 0;
                    goalCard = goalCard + "<div id='goalshist" + Goal.Objectives[pos].Activity[z].activityId +
                    "' class='goalshist" + goalhistselected + "' actid='" + Goal.Objectives[pos].Activity[
                        z].activityId + "' onClick=flipCardToExistingService('flip" + Goal.goalid + "-" + Goal
                        .Objectives[pos].objid + "',event," + Goal.goalid + "," + Goal
                        .Objectives[pos].objid + "," + Goal.Objectives[pos].Activity[z].activityId + 
                        ")><span id='histeffect" + Goal.Objectives[pos].Activity[z].activityId +
                        "' class='goalsprompt1 goalsprompttext" + goalshisteffect + "'>" + Goal.Objectives[
                         pos].Activity[z].objectiveSuccess + "</span><span class='prompttext'>" + Goal.Objectives[
                         pos].Activity[z].objectiveSuccess + Goal.Objectives[pos].Activity[z].promptNumber +
                         "<img src=\"./images/new-icons/result_Null.png\"></img>" + "<span></div>"
                } else {
                    goalCard = goalCard + "<div id='goalshist" + Goal.Objectives[pos].Activity[z].activityId +
                     "' class='goalshist" + goalhistselected + "' actid='" + Goal.Objectives[pos].Activity[
                         z].activityId + "' onClick=flipCardToExistingService('flip" + Goal.goalid + "-" + Goal
                        .Objectives[pos].objid + "',event," + Goal.goalid + "," + Goal
                        .Objectives[pos].objid + "," + Goal.Objectives[pos].Activity[z].activityId + 
                        ")><span id='histeffect" + Goal.Objectives[pos].Activity[z].activityId +
                        "' class='goalsprompt1 goalsprompttext" + goalshisteffect + "'>" + Goal.Objectives[
                         pos].Activity[z].objectiveSuccess + "</span><span class='prompttext'>" + Goal.Objectives[
                         pos].Activity[z].objectiveSuccess + Goal.Objectives[pos].Activity[z].promptNumber +
                     Goal.Objectives[pos].Activity[z].promptType + "<span></div>"; 
                }
            }
            goalCard = goalCard + "</div></div>";
            
            goalCard = goalCard + "<div class='goalsright'><div id='detailsbox' class='goalsdetailsbox' onclick=blowUpTextBox('flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "'," + "'serviceDetailBox')><span class='goalsrightheaderbox" + Goal.goalid + "-" + Goal.Objectives[pos].objid + " goalsrightheaderbox goalsheadertext'><span class='goalsheadertext'>" + Goal.goaltypedescription + "</span></span><span id ='servicedetailtext' class='goalsdetailtext detailsbox'>" +
                objectiveStatement + "</span></div>";   
                //Flip card
                //"<div class='goalsflipbox'  onclick=flipCard('flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "',event" + ");><span class='goalsarrowtext'>Enter New Activities</span><span class='goalsarrow'></span></div>" +
                //"<div class='goalsflipbox'  onclick=flipCard('flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "',event" + ");><span class='goalsarrow'></span></div>" +
            //Method/Success Container Box
            goalCard = goalCard + 
                "<div id='sucessmethodbox" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' class='sucessmethodbox'>" +
                "<div class='bannericon goalnewsmb'  onclick=flipCard('flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "',event" + ");><span class='newgoalcardtextsmb'> New </span></div>" +
                //"<span class='newgoalcardtextsmb'> New </span>" +
                //Method Box
                "' <div id='method' class='methodbox method' onclick=blowUpTextBox('flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "'," + "'methodBox')><span class='goalsdetailtext'><span class='methodseccess'>Method: </span>" +
                objectiveMethod + "</span></div>" +
                "<div id='successbutton' class='successbutton' onclick=blowUpTextBox('flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "'," + "'successBox')><div id='successbuttontext' class='successbuttontext'>Success</div> </div>" +
                "<div id='methodbutton' class='methodbutton' onclick=blowUpTextBox('flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "'," + "'methodBox')><div id='methodbuttontext' class='methodbuttontext'>Method</div> </div>" +
                
                //Success Box
                "<div id='success' class='methodbox success' onclick=blowUpTextBox('flip" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "'," + "'successBox')><span class='goalsdetailtext'><span class='methodseccess'>Success: </span>" +
                objectiveSuccess + "</span></div></div>" + "</div></div>";
                

                goalCard = goalCard + "</div>";
                //back of card --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                goalCard = goalCard + "<div id='cardback' class='face back cardback' goalid='" + Goal.goalid +
                    "' objid='" + Goal.Objectives[pos].objid + "'>";
                goalCard = goalCard + makeBackOfCard(Goal, selectedId, activityId, pos);
                goalCard = goalCard + "</div>";
                //goalCard of back of card
                goalCard = goalCard + "</div></div>";
                Goal.Objectives[pos] = "";
            }

        }
    return goalCard;   
}

function makeBackOfCard(Goal, selectedId, activityId, pos) {
    var retVar = "";
    //does this have an selected activity? if so, get it
    var activ = new Activity(0, 0, "", "", "", 0, 0);
    if (activityId > 0) {
        for (var a = 0; a < Goal.Objectives[pos].Activity.length; a++) {
            if (Goal.Objectives[pos].Activity[a].activityId == activityId) {
                activ = Goal.Objectives[pos].Activity[a];
            }
        }
    }
    //objective header
    var objectiveStatement = Goal.Objectives[pos].objstatement;
    if (objectiveStatement.indexOf("\\r\\n") != -1) {
        objectiveStatement = objectiveStatement.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
    } else {
        objectiveStatement = objectiveStatement;
    }
    if (objectiveStatement.indexOf("\\") != -1) {
        objectiveStatement = objectiveStatement.replace(/\\/g, " ");
    }
    retVar = retVar +
        "<div id='goalsrightheaderbox2' class='goalsrightheaderbox2'><span class='goalsheadertext2'>" +
        objectiveStatement + "</span></div>";
    //Old tool bar
    //location drop down
    var selectedLoc = 0;
    //var aa = 0;
    var primaryDefaultCheck = "";
    var locationPositon = "";
    var primaryLoc = "";
    var secondaryText = "";
    for (var a = 0; a < $.locs.length; a++) {
        selectedLoc = $.locs[a].locationId;
        //Trash Button
        retVar = retVar + "<button id='goalTrash" + Goal.goalid + "-" + Goal.Objectives[pos].objid +
        "' class='bannericon goalTrash' onclick='trashGoal(" + activityId + "," + Goal.goalid +
        "," + Goal.Objectives[pos].objid + ")'></button><span id='goalCardDeleteText" + Goal.goalid + "-" + Goal.Objectives[pos].objid +
        "' class='goalCardDeleteText'> Delete </span>";        
        if ($.session.defaultRosterLocation == $.locs[a].locationId) {
            primaryLoc = primaryLoc +
                "<div id='goalslocation' class='Sublocationbox'><div id='goalslocation" +
                Goal.goalid + "-" + Goal.Objectives[pos].objid + "' goalslocid='" + $.locs[a].locationId +
                "' class='goalsubloction' onclick='popGoalsLocation(event)'>" + $.locs[a].locationName +
                "</div></div>";
            primaryDefaultCheck = 1;
            locationPositon = a;
        }
        secondaryText =
                    "<div id='goalssublocation' class='Sublocationbox'><div id='sublocation" +
                    Goal.goalid + "-" + Goal.Objectives[pos].objid +
                    "' goalsseclocid='0' class='goalsubloction' onclick='popGoalsSecondaryLocation(event)'>No Secondary Location</div></div>";
    } //if nothing is found to match, pick 1st location
    if (selectedLoc == 0) {
        //alert("$.locs[0].locationName " + $.locs[1].locationName);
        if ($.locs.length == 0) {
            alert("Location undefined");
        } else {
            retVar = retVar +
            //"<div id='goalslocation' class='Sublocationbox'><span class='goalsheadertext'>Location:&nbsp;&nbsp;&nbsp;&nbsp;</span><div id='goalslocation" +
            "<div id='goalslocation' class='Sublocationbox'><div id='goalslocation" +
            Goal.goalid + "-" + Goal.Objectives[pos].objid +
            "' class='goalsubloction' onclick='popGoalsLocation(event)'>" + $.locs[0].locationName +
            "</div></div>";
            selectedLoc = $.locs[0].locationId;
        }
        
    }
    //in case this didn't set above
    if (primaryLoc.length < 4) {
        primaryLoc = primaryLoc +
            //"<div id='goalslocation' class='Sublocationbox'><span class='goalsheadertext goalsheadertextbonus'>Location:</span><div id='goalslocation" +
            "<div id='goalslocation' class='Sublocationbox'><div id='goalslocation" +
            Goal.goalid + "-" + Goal.Objectives[pos].objid + "' goalslocid='" + $.locs[0].locationId +
            "' class='goalsubloction' onclick='popGoalsLocation(event)'>" + $.locs[0].locationName +
            "</div></div>";
    }
    retVar = retVar + primaryLoc + secondaryText;
    var popupMenuItems = "";
    var selectedItem = "";
    secondaryText = "";
    //back of card
    retVar = retVar + buildResultBoxHtml(Goal, Goal.Objectives[pos].objid, activ); 
    retVar = retVar + "<button id='goalnotesbutton" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' onclick=displayGoalsNotesField('" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "') class='goalsnotesbutton'  style='display: block;'></button>";
    var defaultMessage = "";
    if (activ.objectiveSuccess.length > 0) {
        if (activ.objectiveActivityNote.length > 1) {
            defaultMessage = activ.objectiveActivityNote;
        } else {
            defaultMessage = "";
        }
    }
    if (defaultMessage.indexOf("\\r\\n") != -1) {
        defaultMessage = defaultMessage.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
    }
    if (defaultMessage.indexOf("\\") != -1) {
        defaultMessage = defaultMessage.replace(/\\/g, " ");
    }
    if (defaultMessage != "How did it go?" && defaultMessage != " " && defaultMessage != "") {
        $("#goalnotesbutton" + Goal.goalid + "-" + Goal.Objectives[pos].objid).css('background-color', 'green');
        $.goals.SetNoteToGreen = true;
    } else {
        $.goals.SetNoteToGreen = false;
    }
    retVar += "<objectiveData goal='" + Goal.goalid + "' obj='" + Goal.Objectives[pos].objid + "' style='display:none;'></objectiveData>";
    var t = true;
    if ($.session.applicationName != 'Gatekeeper') {
        //The below conditional statement adds or removes the CI dropdown and time boxes from back of goal card    
        //if (Goal.CommunityIntegrationAndTimeObject[0].showTime == 'Y' && Goal.CommunityIntegrationAndTimeObject[0].showCommunityIntegration == 'Y') {
        if(t){
            retVar = retVar + "<br /><div id='goalsspacer' class='goalsspacer'></div><div id='goalsci' class='totalgoalsci'> " +
            "<div id='goalsciboxes'";
            if ($.session.communityIntegrityRequired == false) retVar += " style='display: none'";
            retVar += "><span id='goalstarterrorbox" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' ";
            if ($.session.communityIntegrityRequired == true) retVar += "style='display: block;' ";
            retVar += "class='goalstarterrorbox' > </span>" + //MAT new
            "<textinput id='goalscistart" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' class='goalscielement goalscistart' onClick=popGoalsCITimeBox('goalscistart" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "','" + Goal.goalid + "','" + Goal.Objectives[pos].objid + "',event) onChange=validateGoalsCITime('goalscistart" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "','" + Goal.goalid + "','" + Goal.Objectives[pos].objid + "') " +
            ">" + 'START TIME' + "</textinput>" +
            "<span id='goalenderrorbox" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' ";
            if ($.session.communityIntegrityRequired == true) retVar += "style='display: inline;' ";
            retVar += "class='goalenderrorbox' > </span>" +//MAT new
            "<textinput id='goalsciend" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' class='goalscielement goalsciend' onClick=popGoalsCITimeBox('goalsciend" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "','" + Goal.goalid + "','" + Goal.Objectives[pos].objid + "',event) onChange=validateGoalsCITime('goalsciend" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "','" + Goal.goalid + "','" + Goal.Objectives[pos].objid + "') " +
            ">" + 'END TIME' + "</textinput>" +
            "<span id='goallevelerrorbox" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' ";
            if ($.session.communityIntegrityRequired == true) retVar += "style='display: inline;' ";
            retVar += "class='goalenderrorbox' > </span>" +//JDL new
            "<textinput goal='" + Goal.goalid + "' obj='" + Goal.Objectives[pos].objid + "' id='goalscidropdown" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' class='goalscielement goalscidropdown' onClick=popGoalsCIDropDown(" + Goal.goalid + "," + Goal.Objectives[pos].objid + ") " +
            ">     COMMUNITY INTEGRATION     </textinput>" +
            "<div class='goalscidropdownfilterpop' id='goalsintegrationlevelfilterpop" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "'></div>" +
            "</div></div>";
        } else if (Goal.CommunityIntegrationAndTimeObject[0].showTime == 'Y' && Goal.CommunityIntegrationAndTimeObject[0].showCommunityIntegration == 'N') {
            retVar = retVar + "<br /><div id='goalsspacer' class='goalsspacer'></div><div id='goalsci' class='totalgoalsci'> " +
            "<div id='goalsciboxes'";
            if ($.session.communityIntegrityRequired == false) retVar += " style='display: none'";
            retVar += "><span id='goalstarterrorbox" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' ";
            if ($.session.communityIntegrityRequired == true) retVar += "style='display: block;' ";
            retVar += "class='goalstarterrorbox' > </span>" +//MAT new
            "<textinput id='goalscistart" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' class='goalscielement goalscistart' onClick=popGoalsCITimeBox('goalscistart" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "','" + Goal.goalid + "','" + Goal.Objectives[pos].objid + "',event) onChange=validateGoalsCITime('goalscistart" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "','" + Goal.goalid + "','" + Goal.Objectives[pos].objid + "') " +
            ">" + 'START TIME' + "</textinput>" +
            "<span id='goalenderrorbox" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' ";
            if ($.session.communityIntegrityRequired == true) retVar += "style='display: inline;' ";
            retVar += "class='goalenderrorbox' > </span>" +//MAT new
            "<textinput id='goalsciend" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' class='goalscielement goalsciend' onClick=popGoalsCITimeBox('goalsciend" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "','" + Goal.goalid + "','" + Goal.Objectives[pos].objid + "',event) onChange=validateGoalsCITime('goalsciend" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "','" + Goal.goalid + "','" + Goal.Objectives[pos].objid + "') " +
            ">" + 'END TIME' + "</textinput>" +
            "</div></div>";
        } else if (Goal.CommunityIntegrationAndTimeObject[0].showTime == 'N' && Goal.CommunityIntegrationAndTimeObject[0].showCommunityIntegration == 'Y') {
            retVar = retVar + "<br /><div id='goalsspacer' class='goalsspacer'></div><div id='goalsci' class='totalgoalsci'> " +
            "<div id='goalsciboxes'";
            if ($.session.communityIntegrityRequired == false) retVar += " style='display: none'";
            retVar += "><span id='goallevelerrorbox" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' ";
            if ($.session.communityIntegrityRequired == true) retVar += "style='display: inline;' ";
            retVar += "class='goalenderrorbox' > </span>" +//JDL new
            "<textinput goal='" + Goal.goalid + "' obj='" + Goal.Objectives[pos].objid + "' id='goalscidropdown" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "' style='margin-left:30px;margin-top:0px' class='goalscielement goalscidropdown' onClick=popGoalsCIDropDown(" + Goal.goalid + "," + Goal.Objectives[pos].objid + ") " +
            ">     COMMUNITY INTEGRATION     </textinput>" +
            "<div class='goalscidropdownfilterpop' id='goalsintegrationlevelfilterpop" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "'></div>" +
            "</div></div>";//need to ad back style='display:none' to below...MAT
        } else if (Goal.CommunityIntegrationAndTimeObject[0].showTime == 'N' && Goal.CommunityIntegrationAndTimeObject[0].showCommunityIntegration == 'N') {
            retVar = retVar + "<br /><div id='goalsspacer' class='goalsspacer'></div><div id='goalsci' style='display:none' class='totalgoalsci'> " +
            "<div id='goalsciboxes'";
            if ($.session.communityIntegrityRequired == false) retVar += " style='display: none'";
            retVar += "></div></div>";
        }
    } else {
        retVar = retVar + "<br /><div id='goalsspacer' class='goalsspacer'></div><div id='goalsci' class='totalgoalsci'></div> ";
    }
    //new stops here    
    retVar = retVar + "<div><goalsavebutton id='goalsavebutton' class='goalsavebutton' onclick='goalValidateForSave(event," + Goal.goalid + "," + Goal.Objectives[
            pos].objid + "," + activityId + ");'><goalsavebuttontext id='goalsavebuttontext' class='goalsavebuttontext'>Save</goalsavebuttontext></goalsavebutton><savedverify class='goalsavedbox' id='goalsavedbox'></savedverify></div>";
    retVar = retVar + "<div class='goalnotewindow'><div id='notes' class='goalsnotes'><span id='goalsnoteserrorbox" + Goal.goalid +
        "-" + Goal.Objectives[pos].objid +
        "' class='noteserrorbox'></span><span class='goalsnotesimage'></span><textarea id='goaltext" +
        Goal.goalid + "-" + Goal.Objectives[pos].objid +
        "' class='goalsnote' onkeyup=goalValidateForSave(event," + Goal.goalid + "," + Goal.Objectives[
            pos].objid + "," + activityId + ");>" + defaultMessage +
        "</textarea></div><div class='goalnotewindowbuttons'><button class='goalnotessavebutton' onClick=saveGoalsNotesField('" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "')>Save</button>" +
        "<button class='goalnotesdeletebutton' onClick=clearTextBox('" + Goal.goalid + "-" + Goal.Objectives[pos].objid + "')>Delete</button>" +
        "<button class='goalnotescancelbutton' onClick=hideGoalsNotesField('"+ Goal.goalid + "-" + Goal.Objectives[pos].objid + "')>Cancel</button></div></div>";

    retVar = retVar + "<goalslocationpop id='goalslocationpop" + Goal.goalid + "-" + Goal.Objectives[
        pos].objid + "' class='secondarylocationpopbase goalslocationpop' >";
    for (var a = 0; a < $.locs.length; a++) {
        retVar = retVar + "<a class='goalsLink' onClick='setGoalsLocationId(\"" + $.locs[a].locationId +
            "\", \"" + $.locs[a].locationName + "\", \"" + Goal.goalid + "\", \"" + Goal.Objectives[
                pos].objid + "\");' locationId=" + $.locs[a].locationId + ">" + $.locs[a].locationName +
            "</a> ";
    }
    retVar = retVar + "</goalslocationpop>";
    if (primaryDefaultCheck == 1) {
        //Added this for loop to get the initial sublocations to match location
        for (var aa = $.locs.length - 1; aa >= 0; aa--) {
            retVar = retVar + "<goalssecondarylocationpop id='secondarylocationpop" + Goal.goalid + "-" +
                Goal.Objectives[pos].objid +
                "' class='secondarylocationpopbase secondarylocationpop'  >";
            retVar = retVar +
                "<a class='goalsLink' onClick='setGoalsSubLocationId(\"0\", \"No Secondary Location\",\"" +
                Goal.goalid + "\", \"" + Goal.Objectives[pos].objid +
                "\");' locationId=0 >No Secondary Location</a> ";
            for (var b = 0; b < $.locs[locationPositon].secondaryLocations.length; b++) {
                retVar = retVar + "<a class='goalsLink' onClick='setGoalsSubLocationId(\"" + $.locs[locationPositon]
                    .secondaryLocations[b].secondaryLocationId + "\", \"" + $.locs[locationPositon].secondaryLocations[
                        b].secondaryLocation + "\",\"" + Goal.goalid + "\", \"" + Goal.Objectives[pos].objid +
                    "\");' locationId=" + $.locs[locationPositon].secondaryLocations[b].secondaryLocationId + ">" +
                    $.locs[locationPositon].secondaryLocations[b].secondaryLocation + "</a> ";
            }
            retVar = retVar + "</goalssecondarylocationpop>";
        }
    } else {
        var aa = 0;
        retVar = retVar + "<goalssecondarylocationpop id='secondarylocationpop" + Goal.goalid + "-" +
                Goal.Objectives[pos].objid +
                "' class='secondarylocationpopbase secondarylocationpop'  >";
        retVar = retVar +
            "<a class='goalsLink' onClick='setGoalsSubLocationId(\"0\", \"No Secondary Location\",\"" +
            Goal.goalid + "\", \"" + Goal.Objectives[pos].objid +
            "\");' locationId=0 >No Secondary Location</a> ";
        for (var b = 0; b < $.locs[aa].secondaryLocations.length; b++) {
            retVar = retVar + "<a class='goalsLink' onClick='setGoalsSubLocationId(\"" + $.locs[aa]
                .secondaryLocations[b].secondaryLocationId + "\", \"" + $.locs[aa].secondaryLocations[
                    b].secondaryLocation + "\",\"" + Goal.goalid + "\", \"" + Goal.Objectives[pos].objid +
                "\");' locationId=" + $.locs[aa].secondaryLocations[b].secondaryLocationId + ">" +
                $.locs[aa].secondaryLocations[b].secondaryLocation + "</a> ";
        }
        retVar = retVar + "</goalssecondarylocationpop>";
    }
    return retVar;
}

// Back of card code.  May be used for edit and new?  Charts and graph stuff?
function buildResultBoxHtml(Goal, objId, activ) {
    historicalPromptRequired = "N";
    historicalAttemptsRequired = "N";
    historicalNoteRequired = "N";
    var RetVal = "<div id='resultsbox' class='resultsbox' ><span id='resultserrorbox" + Goal.goalid +
        "-" + objId +
        "' class='resultserrorbox' style='display: block;'></span><span class='goalsheadertext resprosatt'>Results:</span>";
    RetVal = RetVal + "<picker-accordion id='result-picker" + Goal.goalid + "-" + objId +
        "' class='result-picker' maxwidth='160' minwidth='22' lastSelected='" + Goal.goalid +
        "-" + objId + "result0' >";
    var selected = "";
    for (var r = 0; r < Goal.Results.length; r++) {
        RetVal = RetVal + "<item id='" + Goal.goalid + "-" + objId + "result" + r +
            "'  style=\"";
        if (r == 0 && activ.objectiveSuccess === 0) RetVal = RetVal + "width: 160px; ";
        //this means a history icon was clicked. Set the values from it, rather than default.
        if (Goal.Results[r].resultCode == activ.objectiveSuccess) {
            RetVal = RetVal + "width: 160px; ";
            selected = " class='selected' ";
            //alert("buildResultBoxHtml " + RetVal.indexOf("lastSelected='" + Goal.goalid + "result1'"));
            var oldPart = "lastSelected='" + Goal.goalid + "-" + objId + "result0'";
            var newPart = "lastSelected='" + Goal.goalid + "-" + objId + "result" + r + "'";
            var startPart = RetVal.substring(0, RetVal.indexOf(oldPart));
            var endPart = RetVal.substring(RetVal.indexOf(oldPart) + 23, RetVal.length);
            RetVal = startPart + newPart + endPart;
            historicalPromptRequired = Goal.Results[r].promptrequired;
            historicalAttemptsRequired = Goal.Results[r].attemptsrequired;
            historicalNoteRequired = Goal.Results[r].notesrequired;
            var test2;
        } else {
            selected = "";
        }
        RetVal = RetVal + "\" onClick=goalValidateForSave(event," + Goal.goalid + "," + objId +
            "," + activ.activityId + "); code=" + Goal.Results[r].resultCode + " " + selected +
            " ><section>" + Goal.Results[r].resultCode + " " + Goal.Results[r].desc +
            "</section></item>";
    }
    RetVal = RetVal +
        "</picker-accordion><br/><div id='goalsspacer' class='goalsspacer'></div>";
    RetVal = RetVal + "<span id='promptserrorbox" + Goal.goalid + "-" + objId +
        "' class='resultserrorbox'></span><span class='goalsheadertext resprosatt'>Prompts:</span>";
    RetVal = RetVal + "<picker-accordion id='prompt-picker" + Goal.goalid + "-" + objId +
        "' class='prompt-picker' maxwidth='160' minwidth='22' lastSelected='" + Goal.goalid +
        "-" + objId + "prompt1'>";
    for (var p = 0; p < $.prompts.length; p++) {
        RetVal = RetVal + "<item id='" + Goal.goalid + "-" + objId + "prompt" + (p + 1) +
            "'  style=\"";
        //1st pass only
        if (p == 0 && activ.promptType.length === 0) {
            //RetVal = RetVal + "width: 160px; ";
        }
        //this means a history icon was clicked. Set the values from it, rather than default.
        if ($.prompts[p].promptCode == activ.promptType) {
            RetVal = RetVal + "width: 160px; ";
            selected = " class='selected' ";
            var oldPart = "lastSelected='" + Goal.goalid + "-" + objId + "prompt1'";
            var newPart = "lastSelected='" + Goal.goalid + "-" + objId + "prompt" + (p + 1) +
                "'";
            var startPart = RetVal.substring(0, RetVal.indexOf(oldPart));
            var endPart = RetVal.substring(RetVal.indexOf(oldPart) + 23, RetVal.length);
            RetVal = startPart + newPart + endPart;

        } else {
            selected = "";
        }
        //add null icon for No Prompt
        var promptCode = $.prompts[p].promptCode;
        if (promptCode == "0") {
            promptCode =
                "<img src='./Images/new-icons/result_Null.png' width='10px' style='top: 4px; left: -1px;' />";
        }
        RetVal = RetVal + "\"  onClick=goalValidateForSave(event," + Goal.goalid + "," + objId +
            "," + activ.activityId + ");  code='" + $.prompts[p].promptCode + "' " + selected +
            " ><section>" + promptCode + " " + $.prompts[p].promptCaption + "</section></item>";
    }
    attemptNumber = activ.promptNumber;
    RetVal = RetVal +
        "</picker-accordion><br/><div id='goalsspacer' class='goalsspacer'></div>";
    RetVal = RetVal + "<span id='attemptserrorbox" + Goal.goalid + "-" + objId +
        "' class='resultserrorbox'></span><span class='goalsheadertext resprosatt'>Attempts:</span>" +
        "<picker-single id='attempt-picker" + Goal.goalid + "-" + objId +
        "'class='attempt-picker' lastSelected='" + Goal.goalid + "-" + objId +
        //Leaving for now Mike (5/28/2015)
        //"attempt00' onClick=goalValidateForSave(event," + Goal.goalid + "," + objId + "," +
        "attempt" + attemptNumber + "'onClick=goalValidateForSave(event," + Goal.goalid + "," + objId + "," +
        activ.activityId + ");>";
    for (var a = 0; a < 10; a++) {
        if (a == activ.promptNumber && activ.objectiveSuccess.length > 0) {
            selected = " class='selected' ";
            var oldPart = "lastSelected='" + Goal.goalid + "-" + objId + "attempt00'";
            var newPart = "lastSelected='" + Goal.goalid + "-" + objId + "attempt" + (a + 1) +
                "'";
            var startPart = RetVal.substring(0, RetVal.indexOf(oldPart));
            var endPart = RetVal.substring(RetVal.indexOf(oldPart) + 24, RetVal.length);
            //RetVal = startPart + newPart + endPart;
        } else {
            selected = "";
        }
        if (a == 0) {
            RetVal = RetVal + "<item id='" + Goal.goalid + "-" + objId + "attempt" + a +
                "' code='" + a +
                "' style='background-image: url(\"./Images/new-icons/result_Null10.png\"); background-repeat: no-repeat;  top: 4px; left: -1px;' ></item>";
        } else {
            RetVal = RetVal + "<item id='" + Goal.goalid + "-" + objId + "attempt" + a +
                "' code='" + a + "' " + selected + ">" + a + "</item>";
        }
    }
    RetVal = RetVal + "</picker-single>";
    RetVal = RetVal + "</div>";
    return RetVal;
}

function preloadCardForHistActivity(goalId, objId, activityId) {
    $.goals.HistoryCard = true;
    if ($('#goalshist' + activityId).hasClass('goalhistselected')) {
        //Duplicate call, do nothing.
    } else {
        $.goals.ciDropdownClicked = false;
        $(".goalhistselected").removeClass("goalhistselected");
        $('#goalshist' + activityId).addClass('goalhistselected');
        $.tempGoalIdHist = goalId;
        $.tempObjIdHist = objId;
        $.tempActivityIdHist = activityId;
        //$(".goalhistselected").removeClass("goalhistselected");
        getGoals($.userId, undefined, true);
    }    
}

function getGoalsMultipleClickFix(userId, selectedId) {
    if ($('#goalNew' + selectedId).hasClass('newgoalselected')) {

    } else {
        $('#goalNew' + selectedId).addClass('newgoalselected');
        //getGoals(userId, selectedId);
    }
    
}

function setUpRequiredFields(goalId, objId, activityId) {
    if (historicalPromptRequired === "Y") {
        $("#" + goalId + "-" + objId + "prompt1").css("display", "none");
        $("#" + goalId + "-" + objId + "prompt1").removeClass("selected");
    }
    if (historicalAttemptsRequired === "Y") {
        $("#" + goalId + "-" + objId + "attempt0").css("display", "none");
        $("#" + goalId + "-" + objId + "attempt0").removeClass("selected");
    }
    if (historicalNoteRequired === "Y") {
        var stripWhiteSpace = $('#goaltext' + goalId + "-" + objId).val();
        stripWhiteSpace = stripWhiteSpace.replace(/\s/g, '');
        var textBoxCount = stripWhiteSpace.length;
        if (textBoxCount > 0 && stripWhiteSpace !== "Howdiditgo?") {
            // do nothing because there is an existing note already filled in
            //Set below variable 
            $.goals.NoteRequired = true;
        } else {
            $("#goalsnoteserrorbox" + goalId + "-" + objId).css("display", "block");
            $("#goalnotesbutton" + goalId + "-" + objId).css("background-color", "red");
            $.goals.NoteRequired = true;
        }
    } else {
        $.goals.NoteRequired = false;
    }
}

function displayGoalsNotesField(goal) {
    $.goals.notePreChange = '';
    $(".goalnotewindow").show();
    $.goals.notePreChange = $("#goaltext" + goal).val();
}

function hideGoalsNotesField(goalId) {
    //$('#goaltext' + goalId).val($.goals.previousGoalsNote);
    $(".goalnotewindow").hide();
    $("#goaltext" + goalId).val($.goals.notePreChange.trim());
    note = $('#goaltext' + goalId).text();
    if (note == " " || note == "") {
        note = $('#goaltext' + goalId).val();
    }
    if (!(note.match(/[a-z]/i))) {
        $('#goaltext' + goalId).text("");
        note = "";
    }
    if (note != "How did it go?" && note != " " && note != "") {
        $("#goalnotesbutton" + goalId).css('background-color', 'green');
    } else {
        if ($.goals.NoteRequired == true) {
            $("#goalnotesbutton" + goalId).css('background-color', 'red');
            $("#goalsnoteserrorbox" + goalId).css("display", "block");
            $("#goalsavebutton").hide();
        } else {
            $("#goalnotesbutton" + goalId).css('background-color', '#70b1d8');
        }
    }
    var arr = [];
    arr = goalId.split('-');
    goalValidateForSave($.goals.tmpEvent, arr[0], arr[1], $.goals.tmpActivityId);
    $(".goalnotewindow").hide();    
}

function saveGoalsNotesField(goalId) {
    $.goals.previousGoalsNote = "";
    $(".goalnotewindow").hide();
    note = $('#goaltext' + goalId).text();
    if (note == " " || note == "") {
        note = $('#goaltext' + goalId).val();
    }
    //if (!(note.match(/^[a-zA-Z0-9_.-]*$/i))) {
    if (!(note.match(/[a-z]/i))) {
        $('#goaltext' + goalId).text("");
        note = "";
    }
    if (note != "How did it go?" && note != " " && note != "") {
        $("#goalnotesbutton" + goalId).css('background-color', 'green');
    } else {
        if ($.goals.NoteRequired == true) {
            $("#goalnotesbutton" + goalId).css('background-color', 'red');
            $("#goalsnoteserrorbox" + goalId).css("display", "block");
            $("#goalsavebutton").hide();
        } else {
            $("#goalnotesbutton" + goalId).css('background-color', '#70b1d8');
        }        
    }
    var arr = [];
    arr = goalId.split('-');
    goalValidateForSave($.goals.tmpEvent, arr[0], arr[1], $.goals.tmpActivityId);
}
//POST BUILT CARD EDITING, SAVING, DELETING
// Button that opens card Edit
function loadCardForHistActivity(goalId, objId, activityId) {
    //load Goal object from goalId, should probably add this function to the obj
    var p = 0;
    var goalCILevel = "";
    var originallyEnteredOnDate = '';
    var gl = new Goal(goalId, 0);
    var absentId = "";//
    for (var i = 0; i < $.goalcards.length; i++) {
        if (parseInt($.goalcards[i].goalid) == goalId) {
            gl = $.goalcards[i];
        }
    }
    
    var pos = 0;
    for (var i = 0; i < gl.Objectives.length; i++) {
        if (gl.Objectives[i].objid == objId) {
            pos = i;
        }
    }
    var userId = "";
    var y = 0;
    var z = 0;
    for (i = 0; i < gl.Objectives[pos].Activity.length; i++) {
        if (gl.Objectives[pos].Activity[i].activityId == activityId) {
            userId = gl.Objectives[pos].Activity[i].submittedByUserId;
            activityDate = gl.Objectives[pos].Activity[i].activityDate;
            selectedActivity = gl.Objectives[pos].Activity[i];
            absentId = gl.Objectives[pos].Activity[i].absentRecordId;//
            startTime = gl.Objectives[pos].Activity[i].objectiveStartTime;
            if (startTime == '') {
                startTime = 'START TIME'
            } else {
                startTime = formatTimeFromDB(startTime);
            }            
            endTime = gl.Objectives[pos].Activity[i].objectiveEndTime;
            if (endTime == '') {
                endTime = 'END TIME'
            } else {
                endTime = formatTimeFromDB(endTime);
            }
            
            goalCILevel = gl.Objectives[pos].Activity[i].objectiveCILevel;
        }
    }

    //alert(makeBackOfCard(gl, objId, activityId, pos));
    activityDate = new Date(activityDate + 'T10:20:30Z');
    var activityDatePreFormat = activityDate;
    activityDate = $.format.date(activityDate, 'MM/dd/yy');
    $.goals.SetNoteToGreen = false;
    $("#flip" + goalId + "-" + objId).find("#cardback").html(makeBackOfCard(gl, objId,
        activityId, pos));

    if (($.goals.objectivesWithAbsent.indexOf(objId + "") != -1) || absentId != "") {//
        absentUnclickable('flip' + goalId + '-' + objId);
    }
    $("#resultserrorbox" + goalId + "-" + objId).css("display", "none"); //not needed for loading hist items
    if ($.goals.SetNoteToGreen == true) {
        $("#goalnotesbutton" + goalId + "-" + objId).css('background-color', 'green');
    }
    //JD 12/20/2016
    $("#actioncenter .goalscidropdown").each(function () {
        var obj = $(this);
        obj.attr("onclick", null);
        var tmpName = null, //$('captionname', this).text(),
            tmpCode = null; //$('code', this).text();
        var goal = obj.attr("goal"),
            objID = obj.attr("obj");
        var arr = [];
        if ($.session.communityIntegrityRequired == "n/a") arr = [{ code: null, name: null, goal: goal, objID: objID, text: "&nbsp;" }];
        var tempArr = [];
        $("result", $.session.ciDropDownResponse).each(function () {
            tempArr.push({
                name: $('captionname', this).text(),
                code: $('code', this).text(),
                goal: goal,
                objID: objID,
                text: $('captionname', this).text()
            });
        });
        tempArr.sort(function (a, b) {
            var nameA = a.name.toUpperCase(),
                nameB = b.name.toUpperCase();

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        arr = arr.concat(tempArr);
        obj.PSlist(arr, {
            callback: function (item) {
                //hack that is needed for rendering save button on click no ton page load
                preChangeCILevelClick(item.code, item.name, item.goal, item.objID);
                //changeCILevel(item.code, item.name, item.goal, item.objID);
            }
        });
    });
    setUpRequiredFields(goalId, objId, activityId);
    $("#goalTrash" + goalId + "-" + objId).css("display", "block");
    //$("#goalNew" + goalId + "-" + objId).css("display", "block");
    //$("#newGoalCardText" + goalId + "-" + objId).css("display", "block");
    //$("#goalTrash" + goalId + "-" + objId).css("display", "block");
    $("#goalCardDeleteText" + goalId + "-" + objId).css("display", "block");
    $('#goalscistart' + goalId + "-" + objId).html(startTime);
    if (startTime !== "START TIME") {
        $("#goalstarterrorbox" + goalId + "-" + objId).hide();
    }
    if (endTime == '11:59 PM') {
        endTime = '12:00 AM';
    }
    $('#goalsciend' + goalId + "-" + objId).html(endTime);
    if (endTime !== "END TIME") {
        $("#goalenderrorbox" + goalId + "-" + objId).hide();
    }
    var firstLoad = true;
    assignCommunityIntegrationDropdownData($.session.ciDropDownResponse, goalId, objId, goalCILevel, firstLoad);
    (function () {
        if ($.session.communityIntegrityRequired == true) {
            var ids = ["goalstarterrorbox", "goalenderrorbox", "goallevelerrorbox"].map(function (el) { return "#" + el + goalId + "-" + objId; });
            $(ids.join(",")).hide();
        }
    })();
    var checkDate = $('#goalsdatebox').val();
    var daysBetween = daysBetweenDates(checkDate);
    var capsUserId = userId.toUpperCase();
    var capsSessionUserId = $.session.UserId.toUpperCase();
    var firstLetterCapsName = userId.charAt(0).toUpperCase() + userId.slice(1);
    var activityCreatedBy = "<div class='activitybyname'>" + " Activity Date: " + activityDate + "&nbsp;&nbsp;&nbsp;&nbsp; Entered By: " + firstLetterCapsName + "</div>";
    $("#flip" + goalId + "-" + objId).find(".activitybyname").remove();
    //$("#flip" + goalId + "-" + objId).find("#cardback").append(activityCreatedBy); 
    $("#flip" + goalId + "-" + objId).find("#goalsci").css("display", "block").append(activityCreatedBy);
    var activityDateBack = daysBetweenDates(activityDatePreFormat);
    if ((daysBetween > $.session.daysBackGoalsEdit || $.session.GoalsUpdate == false || activityDateBack > $.session.daysBackGoalsEdit)) {
        goalsEditFieldsUnclickable();
        $("#goalTrash" + goalId + "-" + objId).hide();
        $("#goalCardDeleteText" + goalId + "-" + objId).hide();
    } else if ((capsUserId != capsSessionUserId)) {
        goalsEditFieldUnclickableDiffUser("flip" + goalId + "-" + objId);
        $("#goalTrash" + goalId + "-" + objId).hide();
        $("#goalCardDeleteText" + goalId + "-" + objId).hide();
    } else if ($.goals.objectivesWithAbsent.indexOf(objId) != -1) {
        goalsEditFieldsUnclickable();
        $(".goalnewsmb").hide();
    } else{
        goalsEditFieldsClickable("flip" + goalId + "-" + objId);
    }
    var locationInfo = getGoalSpecificLocationInfo(activityId, goalId, objId);

    //ie hacks for scrolling to selected activity
    if (($.session.browser == "Explorer" || $.session.browser == "Mozilla") && $.goals.HistoryCard === false) {
        if ($(".goalhistselected")[0] !== undefined) {
            var height = $(".goalhistselected").parent(".goalstoolbar").height();
            var scrollHeight = $(".goalhistselected").parent(".goalstoolbar").get(0).scrollHeight - 8;   //ie randomly adds 8 pixels to scrollheight when there is no scroll bar?
            //if (scrollHeight > height) {
                var parent = $(".goalhistselected").parent(".goalstoolbar");
                parent = parent[0];
                var element = $(".goalhistselected")[0];
                $(parent).animate({ scrollTop: $(parent).scrollTop() + $(element).offset().top - $(parent).offset().top }, { duration: 'slow', easing: 'swing' });
                $('html,body').animate({ scrollTop: $(parent).offset().top - 130 }, { duration: 1000, easing: 'swing' });
               // $(".goalhistselected")[0].scrollIntoView(true);
           // }
        }
    }

    
    //populateActionCenterWithGoals(makeAllCards(goalId, activityId));
    //var loadcard = makeCard(goalId, goalId, activityId);
}

function preChangeCILevelClick(code, name, goal, objID) {
    $.goals.ciDropdownClicked = true;
    changeCILevel(code, name, goal, objID);
}

// Checks to see if all mandatory fields are filled in
function goalValidateForSave(event, goalId, objId, activityId) {
    //$('#resultserrorbox').css('display', 'block');
    $.goals.tmpEvent = event;
    $.goals.tmpActivityId = activityId;
    $.goals.saveButton = false;
    $.goals.deleteButton = false;
    (function () {
        if ($.session.communityIntegrityRequired == true) {
            var start = $("#goalscistart" + goalId + "-" + objId),
                end = $("#goalsciend" + goalId + "-" + objId),
                level = $("#goalscidropdown" + goalId + "-" + objId);
            if (start.html() && start.html().toUpperCase() == "START TIME" && start.is(":visible")) {
                $("#goalstarterrorbox" + goalId + "-" + objId).show();
            }
            if (end.html() && end.html().toUpperCase() == "END TIME" && end.is(":visible")) {
                $("#goalenderrorbox" + goalId + "-" + objId).show();
            }
            if (level.html() && level.html().toUpperCase() == "COMMUNITY INTEGRATION" && level.is(":visible")) {
                $("#goallevelerrorbox" + goalId + "-" + objId).show();
            }
        }
    })();
    var pos = 0;
    var tarId = $(event.target).attr('id');
    var parent = $(event.target).parent().attr('id');
    if (parent == null) {
        parent = "";
    }
    var nodeName = event.target.nodeName;
    var tarCode = $("#" + tarId).attr('code');
    //$("#goalsavedbox" + goalId + "-" + objId).text("");
    $(".goalsavedbox").text("");
    // band-aid to allow clicking on image of no prompt
    if (nodeName == "IMG") {
        parent = $(event.target).parent().parent().attr('id');
    }
    //highlight whatever was selected.
    if (typeof (tarId) === "undefined") {
        accordionClick(parent);
    } else if (parent.indexOf("attempt") > -1 || nodeName == "GOALSAVEBUTTON" || nodeName == "GOALSAVEBUTTONTEXT") {
        pickerClick(tarId);
    } else {
        accordionClick(tarId);
    }
    if (nodeName == "SECTION") {
        tarCode = $("#" + parent).attr('code');
    }
    for (var i = 0; i < $.goalcards.length; i++) {
        //just this card not all cards.
        if (parseInt($.goalcards[i].goalid) == goalId) {
            pos = i;
            var stripWhiteSpace = $('#goaltext' + goalId + "-" + objId).val();
            stripWhiteSpace = stripWhiteSpace.replace(/\s/g, '');
            var textBoxCount = stripWhiteSpace.length;
            if (textBoxCount > 0 && stripWhiteSpace !== "Howdiditgo?") {
                if ($('#goaltext' + goalId + "-" + objId).val() == "How did it go?") {

                } else {
                    $("#goalsnoteserrorbox" + goalId + "-" + objId).css("display", "none");
                    //$("#goalnotesbutton" + goalId + "-" + objId).css("background-color", "#70b1d8");
                }
            }

            //result clicked
            if (parent.indexOf('result') > -1) {
                //alert("result! " + parent);
                // set the other alerts based on what that result type requires.
                //if result was unselected.
                if ($("#" + parent).hasClass("selected") == true) {
                    //alert($.goalcards[i].Results[r].resultCode +""+ tarCode);
                    //Result was unselected, clear styles and return
                    $("#resultserrorbox" + goalId + "-" + objId).css("display", "block");
                    $("#promptserrorbox" + goalId + "-" + objId).css("display", "none");
                    $("#attemptserrorbox" + goalId + "-" + objId).css("display", "none");
                    $("#goalsnoteserrorbox" + goalId + "-" + objId).css("display", "none");
                    //return;
                }
                for (var r = 0; r < $.goalcards[i].Results.length; r++) {
                    if ($.goalcards[i].Results[r].resultCode == tarCode) {
                        //reset all selections
                        var promptSelected = false;
                        var attemptSelected = false;
                        $("#resultserrorbox" + goalId + "-" + objId).css("display", "none");
                        $("#promptserrorbox" + goalId + "-" + objId).css("display", "none");
                        $("#attemptserrorbox" + goalId + "-" + objId).css("display", "none");
                        $("#goalsnoteserrorbox" + goalId + "-" + objId).css("display", "none");
                        note = $('#goaltext' + goalId + "-" + objId).text();
                        if (note == " " || note == "") {
                            note = $('#goaltext' + goalId + "-" + objId).val();
                        }
                        if (note != "How did it go?" && note != " " && note != "") {
                            $("#goalnotesbutton" + goalId + "-" + objId).css('background-color', 'green');
                        } else {
                            $("#goalnotesbutton" + goalId + "-" + objId).css("background-color", "#70b1d8");
                        }
                        

                        if ($.goalcards[i].Results[r].promptrequired == "Y") {
                            $("#" + goalId + "-" + objId + "prompt1").css("display", "none");
                            $("#" + goalId + "-" + objId + "prompt1").removeClass("selected");
                        }
                        if ($.goalcards[i].Results[r].attemptsrequired == "Y") {
                            $("#" + goalId + "-" + objId + "attempt0").css("display", "none");
                        }

                        $('#prompt-picker' + goalId + "-" + objId).children('item').each(
                            function () {
                                if ($(this).hasClass("selected")) {
                                    //$(this).removeClass("selected");
                                    promptSelected = true;
                                }
                            });
                        $('#attempt-picker' + goalId + "-" + objId).children('item').each(
                            function () {
                                if ($(this).hasClass("selected")) {
                                    //$(this).removeClass("selected");
                                    attemptSelected = true;
                                }
                            });

                        if ($.goalcards[i].Results[r].promptrequired == "Y" && promptSelected == false) {
                            $("#promptserrorbox" + goalId + "-" + objId).css("display", "block");
                            $("#goalsavebutton").css("display", "none");
                            //$("#" + goalId + "-" + objId + "prompt1").hide();
                            $("#" + goalId + "-" + objId + "prompt1").css("display", "none");
                            $("#" + goalId + "-" + objId + "prompt1").removeClass("selected");
                        } else {
                            $("#" + goalId + "-" + objId + "prompt1").show();
                        }

                        //Time stuff
                        if ($.goalcards[i].Results[r].citimerequired == "Y") {
                            var start = $("#goalscistart" + goalId + "-" + objId);
                            var end = $("#goalsciend" + goalId + "-" + objId);
                            if (start.html() && start.html().toUpperCase() == "START TIME" && start.is(":visible")) {
                                $("#goalstarterrorbox" + goalId + "-" + objId).show();
                            }
                            if (end.html() && end.html().toUpperCase() == "END TIME" && end.is(":visible")) {
                                $("#goalenderrorbox" + goalId + "-" + objId).show();
                            }                            
                        } else {
                            $("#goalstarterrorbox" + goalId + "-" + objId).hide();
                            $("#goalenderrorbox" + goalId + "-" + objId).hide();
                        }

                        //CI stuff
                        if ($.goalcards[i].Results[r].communityintegrationrequired == "Y") {
                            var level = $("#goalscidropdown" + goalId + "-" + objId);
                            //if (level.html() && level.html().toUpperCase() == "COMMUNITY INTEGRATION" && level.is(":visible")) {
                            if (level.html().toUpperCase().trim() == "COMMUNITY INTEGRATION" && level.is(":visible")) {
                                $("#goallevelerrorbox" + goalId + "-" + objId).show();
                            }                            
                        } else {
                            $("#goallevelerrorbox" + goalId + "-" + objId).hide();
                        }

                        if ($.goalcards[i].Results[r].promptrequired == "Y") {
                            $("#" + goalId + "-" + objId + "prompt1").css("display", "none");
                            $("#" + goalId + "-" + objId + "prompt1").removeClass("selected");
                        }

                        if ($.goalcards[i].Results[r].attemptsrequired == "Y" && attemptSelected == false) {
                            $("#attemptserrorbox" + goalId + "-" + objId).css("display", "block");
                            $("#" + goalId + "-" + objId + "attempt0").css("display", "none");
                            $("#" + goalId + "-" + objId + "attempt0").removeClass("selected");
                        } else {
                            $("#" + goalId + "-" + objId + "attempt0").css("display", "block");
                            $("#" + goalId + "-" + objId + "attempt0").removeClass("selected");
                        }

                        if ($.goalcards[i].Results[r].attemptsrequired == "Y") {
                            $("#" + goalId + "-" + objId + "attempt0").css("display", "none");
                        }

                        if ($.goalcards[i].Results[r].notesrequired == "Y") {
                            var stripWhiteSpace = $('#goaltext' + goalId + "-" + objId).val();
                            stripWhiteSpace = stripWhiteSpace.replace(/\s/g, '');
                            var textBoxCount = stripWhiteSpace.length;
                            if (textBoxCount > 0 && stripWhiteSpace !== "Howdiditgo?") {
                                // do nothing because there is an existing note already filled in
                                $.goals.NoteRequired = true;
                            } else{
                                $("#goalsnoteserrorbox" + goalId + "-" + objId).css("display", "block");
                                $("#goalnotesbutton" + goalId + "-" + objId).css("background-color", "red");
                                $.goals.NoteRequired = true;
                                $("#goalsavebutton").hide();
                                $(".goalsavebutton").hide();
                                $("#goalsavebutton").css("display", "none !important");
                                $(".goalsavebutton").css("display", "none !important");
                            }                            
                        } else {
                            $.goals.NoteRequired = false;
                        }
                    } //end if result == tarCode
                } // end for r
            } //end of result clicked
            if (parent.indexOf('prompt') > -1) {
                $("#promptserrorbox" + goalId + "-" + objId).css("display", "none");
            }
            if (parent.indexOf('attempt') > -1) {
                $("#attemptserrorbox" + goalId + "-" + objId).css("display", "none");
                if ($("#" + parent).hasClass("selected") == true) {
                    //if ($("#resultserrorbox" + goalId + "-" + objId).css("display") == "none") {
                    if(!$("#resultserrorbox" + goalId + "-" + objId).is(":visible")) {
                        $("#attemptserrorbox" + goalId + "-" + objId).css("display", "block");
                    }
                }
            }

            //check if it's time to save.
            if ($.session.applicationName == 'Gatekeeper') {
                var noteBackground = $('#goalnotesbutton' + goalId + "-" + objId).css('background-color');
                if (!$("#resultserrorbox" + goalId + "-" + objId).is(":visible") &&
                    !$("#promptserrorbox" + goalId + "-" + objId).is(":visible") &&
                    !$("#attemptserrorbox" + goalId + "-" + objId).is(":visible") &&
                    !$("#goalsnoteserrorbox" + goalId + "-" + objId).is(":visible") &&
                    (noteBackground != 'rgb(255, 0, 0)')
                    ) {
                    var goalText = $('#goaltext' + goalId + "-" + objId).val();
                    if (goalText == 'How did it go?') {
                        goalText = '';
                    }
                    var objDate = $('#goalsdatebox').val();
                    if (objDate == undefined) {
                        var newDate = new Date();
                        objDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
                    }
                    //can not save undefined as a promptNumber
                    var promptNumber = $('#attempt-picker' + goalId + "-" + objId).find('.selected')
                        .first().text();
                    if (typeof (promptNumber) == "undefined") promptNumber = 0;
                    //check type
                    var promptType = $('#' + $('#prompt-picker' + goalId + "-" + objId).attr(
                        'lastselected')).attr('code');
                    if (typeof (promptType) == "undefined") promptType = "0";
                    if (nodeName == "GOALSAVEBUTTON" || nodeName == "GOALSAVEBUTTONTEXT") {
                        $("#goalsavebutton").css("cursor", "wait");  // set cursor to waiting wheel while waiting on service call
                        $("#goalsavebuttontext").css("cursor", "wait");
                        saveGoalsAfterTimer(goalId, objId, activityId, objDate, $('#' + $(
                        '#result-picker' + goalId + "-" + objId).attr('lastselected')).attr(
                        'code'), goalText, promptType, promptNumber, $.userId, $(
                        '#goalslocation' + goalId + "-" + objId).attr('goalslocid'), $(
                        '#sublocation' + goalId + "-" + objId).attr('goalsseclocid'));
                        // goals card flip back to front
                        $.goals.saveButton = true;

                    } else {
                        $('.goalsavebutton').css('cursor', 'pointer');  // reset mouse cursor from waiting wheel
                        $('.goalsavebuttontext').css('cursor', 'pointer');
                    }

                    $("[objid=" + objId + "]").find('.goalsavebutton').css('display', 'block');
                    //$('.goalsavebutton').css('display', 'block');
                } else {
                    $('.goalsavebutton').css('display', 'none');
                }
            } else {
                var isInvisible = true;
                var ids = [
                    "#resultserrorbox",
                    "#promptserrorbox",
                    "#attemptserrorbox",
                    "#goalsnoteserrorbox",
                    "#goalstarterrorbox",
                    "#goalenderrorbox",
                    "#goallevelerrorbox",
                ].map(function (el) { return el + goalId + "-" + objId; });

                $(ids.join(",")).each(function(index, el) {
                    if($(el).is(":visible")) isInvisible = false;
                    return;
                });

                if (isInvisible == true) {
                    var goalText = $('#goaltext' + goalId + "-" + objId).val();
                    if (goalText == 'How did it go?') {
                        goalText = '';
                    }
                    var objDate = $('#goalsdatebox').val();
                    if (objDate == undefined) {
                        var newDate = new Date();
                        objDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
                    }
                    //can not save undefined as a promptNumber
                    var promptNumber = $('#attempt-picker' + goalId + "-" + objId).find('.selected')
                        .first().text();
                    if (typeof (promptNumber) == "undefined") promptNumber = 0;
                    //check type
                    var promptType = $('#' + $('#prompt-picker' + goalId + "-" + objId).attr(
                        'lastselected')).attr('code');
                    if (typeof (promptType) == "undefined") promptType = "0";
                    if (nodeName == "GOALSAVEBUTTON" || nodeName == "GOALSAVEBUTTONTEXT") {
                        $("#goalsavebutton").css("cursor", "wait");  // set cursor to waiting wheel while waiting on service call
                        $("#goalsavebuttontext").css("cursor", "wait");
                        saveGoalsAfterTimer(goalId, objId, activityId, objDate, $('#' + $(
                        '#result-picker' + goalId + "-" + objId).attr('lastselected')).attr(
                        'code'), goalText, promptType, promptNumber, $.userId, $(
                        '#goalslocation' + goalId + "-" + objId).attr('goalslocid'), $(
                        '#sublocation' + goalId + "-" + objId).attr('goalsseclocid'), $(
                        '#goalscistart' + goalId + "-" + objId).text(), $(
                        '#goalsciend' + goalId + "-" + objId).text(), $(
                        '#goalscidropdown' + goalId + "-" + objId).attr('cicode'));
                        // goals card flip back to front
                        $.goals.saveButton = true;

                    } else {
                        $('.goalsavebutton').css('cursor', 'pointer');  // reset mouse cursor from waiting wheel
                        $('.goalsavebuttontext').css('cursor', 'pointer');
                    }
                    var t = $('#goalnotesbutton' + goalId + "-" + objId).css('background-color');
                    if ($('#goalnotesbutton' + goalId + "-" + objId).css('background-color') == 'rgb(255, 0, 0)') {

                    } else {
                        $("[objid=" + objId + "]").find('.goalsavebutton').show();
                    }
                    
                    
                    if ($.goals.HistoryCard == true && !$('#goalnotesbutton' + goalId + "-" + objId).css('background-color') == 'rgb(255, 0, 0)') {
                        $("[objid=" + objId + "]").find('.goalsavebutton').css('display', 'block').css('margin-top', '-30px');
                    } else if ($.goals.HistoryCard == false && !$('#goalnotesbutton' + goalId + "-" + objId).css('background-color') == 'rgb(255, 0, 0)') {
                        $("[objid=" + objId + "]").find('.goalsavebutton').css('display', 'block').css('margin-top', '-10px');
                    }
                    
                    //$('.goalsavebutton').css('display', 'block');
                } else {
                    $('.goalsavebutton').css('display', 'none');
                }
            }            
        } //end == goal cards
    }
}

// Calls Ajax saveGoals 
function saveGoalsAfterTimer(goalId, objectiveId, activityId, objdate, success, goalnote,
    promptType, promptNumber, personId, locationId, locationSecondaryId, goalStartTime, goalEndTime, goalCILevel) {
    if (goalStartTime != undefined && goalEndTime != undefined) {
        if (goalStartTime == 'START TIME') {
            goalStartTime = '';
        } else {
            goalStartTime = convertTimeToMilitary(goalStartTime);
        }
        if (goalEndTime == 'END TIME') {
            goalEndTime = '';
        } else {
            goalEndTime = convertTimeToMilitary(goalEndTime);
        }
    }
    if (goalStartTime === undefined) goalStartTime = "";
    if (goalEndTime === undefined) goalEndTime = "";
    if (goalCILevel === undefined) goalCILevel = "";
    if (typeof activityId === "undefined") activityId = 0;
    if (typeof goalCILevel === "undefined") goalCILevel = "";
    goalnote = removeUnsavableGoalNoteText(goalnote);
    saveGoals(goalId, objectiveId, activityId, objdate, success, goalnote,
            promptType, promptNumber, personId, locationId, locationSecondaryId,
            goalStartTime, goalEndTime, goalCILevel);
}

function removeUnsavableGoalNoteText(goalnote) {
    if (goalnote.indexOf("\"") != -1) {
        goalnote = goalnote.replace(/\"/g, "");
    }
    if (goalnote.indexOf("'") != -1) {
        goalnote = goalnote.replace(/'/g, "");
    }
    if (goalnote.indexOf("\\") != -1) {
        goalnote = goalnote.replace(/\\/g, "");
    }
    if (goalnote.indexOf("\n") != -1) {
        goalnote = goalnote.replace(/\n/g, " ");
    }
    if (!(goalnote.match(/[a-z]/i))) {
        goalnote = "";
    }
    goalnote = goalnote;
    return goalnote;
}
// Ajax call of deleteGoal
function trashGoal(activityId, goalId, objId) {
    $.fn.PSmodal({
        body: "Are you sure you want to delete this entry?",
        immediate: true,
        buttons: [
            {
                text: "Yes",
                callback: function (event) {
                    $.goals.deleteButton = true;
                    $("#goalshist" + activityId).addClass("goalshistfadouteffect");
                    deleteGoal(activityId, goalId, objId);
                }
            },
            {
                text: "No",
                callback: function () {
                    
                }
            }
        ]
    });
    
}

// LOCATION POP UP BOXES
function popGoalsLocation(event) {
    var tarId = "#goalslocationpop" + $(event.srcElement).attr('id').substring(13);
    var otherId = "#secondarylocationpop" + $(event.srcElement).attr('id').substring(13);
    if ($(tarId).css("display") == "none") {
        $(tarId).css("display", "block");
        $(otherId).css("display", "none");
    } else {
        clearGoalsPops(event);
    }
    $(".goalsavedbox").text("");
}

function popGoalsSecondaryLocation(event) {
    //sublocation
    var tarId = "#secondarylocationpop" + $(event.srcElement).attr('id').substring(11);
    var otherId = "#goalslocationpop" + $(event.srcElement).attr('id').substring(11);
    if ($(tarId).css("display") == "none") {
        $(tarId).css("display", "block");
        $(otherId).css("display", "none");
    } else {
        clearGoalsPops(event);
    }
    $(".goalsavedbox").text("");
}

function setGoalsLocationId(locId, locName, goalId, objId) {
    $("#goalslocation" + goalId + "-" + objId).attr("goalslocid", locId);
    $("#goalslocation" + goalId + "-" + objId).text(locName);
    $("#goalslocationpop" + goalId + "-" + objId).css("display", "none");
    for (var i = 0; i < $.locs.length; i++) {
        var testLocation = $.locs[i].locationId;
        var locationName = $.locs[i].locationName;
        if (testLocation == locId) {
            if ($.locs[i].secondaryLocations.length > 0) {
                //$("#secondarylocationpop" + goalId + "-" + objId).html("");
                //var newHtml = "<goalssecondarylocationpop id='secondarylocationpop" + goalId + "-" + objId + "' class='secondarylocationpopbase secondarylocationpop'  >";
                var nlocId = $.locs[i].secondaryLocations[0].secondaryLocationId;
                var nlocName = $.locs[i].secondaryLocations[0].secondaryLocation;
                setGoalsSubLocationId("0", "No Secondary Location", goalId, objId);
                var newHtml = "<a class='goalsLink' onClick='setGoalsSubLocationId(\"0\", \"No Secondary Location\",\"" + goalId + "\", \"" + objId + "\");' locationId=0 >No Secondary Location</a> ";
                for (var j = 0; j < $.locs[i].secondaryLocations.length; j++) {
                    var nlocId = $.locs[i].secondaryLocations[j].secondaryLocationId;
                    var nlocName = $.locs[i].secondaryLocations[j].secondaryLocation;
                    newHtml = newHtml + "<a class='goalsLink' onClick='setGoalsSubLocationId(\"" + nlocId + "\", \"" + nlocName + "\",\"" + goalId + "\", \"" + objId +
                            "\");' locationId=" + nlocId + ">" + nlocName + "</a> ";

                }
                newHtml = newHtml + "</goalssecondarylocationpop>";
                $("#secondarylocationpop" + goalId + "-" + objId).html(newHtml);
            } else {
                setGoalsSubLocationId("0", "No Secondary Location", goalId, objId);
                var newHtml = "<a class='goalsLink' onClick='setGoalsSubLocationId(\"0\", \"No Secondary Location\",\"" + goalId + "\", \"" + objId + "\");' locationId=0 >No Secondary Location</a> ";
                $("#secondarylocationpop" + goalId + "-" + objId).html(newHtml);
            }            
        }
    }
}

function setGoalsSubLocationId(locId, locName, goalId, objId) {
    $("#sublocation" + goalId + "-" + objId).attr("goalsseclocid", locId);
    $("#sublocation" + goalId + "-" + objId).text(locName);
    $("#secondarylocationpop" + goalId + "-" + objId).css("display", "none");
}

//Flipping of card from new front to existing service
function flipCardToExistingService(tagid, event, goalId, objId, activityId) {
    var tarId = "";
    var nodeName = "";
    var className = "";
    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
        tarId = event.srcElement.id;
        nodeName = event.srcElement.nodeName;
        className = event.srcElement.className;
    } else {
        tarId = $(event.target).attr('id');
        nodeName = event.target.nodeName;
        className = event.target.className;
    }


    if (className == "goalsdetailtext" || className.indexOf("method") > -1 || className == "goalsdetailsbox") {
        return;
    }

    if ((($("#" + tagid).find('.card').hasClass('flipped') && className == 'resultsbox'))
        || className == "goalsdetailtext" || className.indexOf("method") > -1 || className == "goalsdetailsbox") {
        flipCardToFront(tagid);
    } else {
        flipCardToBackExisting(tagid, goalId, objId, activityId);
    }    
}

//VISUAL BEHAVIOR STUFF FOR CARDS
function flipCard(tagid, event) {
    var tarId = "";
    var nodeName = "";
    var className = "";
    $.goals.HistoryCard = false;
    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
        tarId = event.srcElement.id;
        nodeName = event.srcElement.nodeName;
        className = event.srcElement.className;
    } else {
        tarId = $(event.target).attr('id');
        nodeName = event.target.nodeName;
        className = event.target.className;
    }


    if (className == "goalsdetailtext" || className.indexOf("method") > -1 || className == "goalsdetailsbox") {
        return;
    }

    if ((($("#" + tagid).find('.card').hasClass('flipped') && className == 'resultsbox')) 
        || className == "goalsdetailtext" || className.indexOf("method") > -1 || className == "goalsdetailsbox"){
        flipCardToFront(tagid);
    } else {
        //This line below works to see if the save button is on the screen. I added the alert to test.
        //This is called when clicking the new button on the front of a card
        test = $('*').find('.card').hasClass('flipped');
        if (test && $('*').find('.card.flipped').find('#goalsavebutton').css('display') !== 'none') {
            $.fn.PSmodal({
                body: "Would you like to save your changes?",
                immediate: true,
                buttons: [
                    {
                        text: "Yes",
                        callback: function (event) {
                            $(".modalcontainer").hide();
                            $('.card.flipped').find('#goalsavebutton').click();
                            //var cardBack = t.querySelector(".cardback");
                            //var goalId = cardBack.getAttribute("goalid");
                            //var objId = cardBack.getAttribute("objid");

                            //goalValidateForSave(event, 1272, 7856, undefined);
                        }
                    },
                    {
                        text: "No",
                        callback: function () {
                            //flipCardToFront(z);
                            $(".modalcontainer").hide();
                            $('.card.flipped').find('.result-picker .selected').children().css('background-color', '#70b1d8');
                            $('.card.flipped').children().removeClass("selected");
                            $('.card.flipped').find('.result-picker').children().css('width', '22px');
                            $('.card.flipped').find('#goalsavebutton').css('display', 'none');
                            $('.card').removeClass('flipped');
                            goalId = tagid.substring(4);
                            flipCardToBack(tagid, $.userid, goalId);                            
                        }
                    }
                ]
            });
        } else {
            $('.card.flipped').find('.result-picker .selected').children().css('background-color', '#70b1d8');
            $(tagid).children().removeClass("selected");
            $(tagid).find('.result-picker').children().css('width', '22px');
            $(tagid).find('#goalsavebutton').css('display', 'none');            
            $('.card').removeClass('flipped');
            if ($.browser.mozilla || $.browser.msie) {
                //$("#" + tagid + " .cardfront").addClass("forceflip");
                //$("#" + tagid + " .cardback").removeClass("forceflip");
                $('.cardfront').removeClass('forceflip');
                $('.cardback').addClass('forceflip');
            }
            goalId = tagid.substring(4);
            flipCardToBack(tagid, $.userid, goalId);
        }
        
    }
}

function flipCardToBack(tagid) {
    $("#" + tagid).find('.card').addClass('flipped');
    //$("#" + tagid).css("height", "400");

    if ($.browser.mozilla || $.browser.msie) {
        $("#" + tagid + " .cardfront").addClass("forceflip");
        $("#" + tagid + " .cardback").removeClass("forceflip");
    }
    getGoalsMultipleClickFix($.userId, goalId);
}

function flipCardToBackExisting(tagid, goalId, objId, activityId) {
    $("#" + tagid).find('.card').addClass('flipped');
    //$("#" + tagid).css("height", "400");

    if ($.browser.mozilla || $.browser.msie) {
        $("#" + tagid + " .cardfront").addClass("forceflip");
        $("#" + tagid + " .cardback").removeClass("forceflip");
    }
    preloadCardForHistActivity(goalId, objId, activityId);
}

function flipCardToFront(tagid) {
    $(tagid).children().removeClass("selected");
    $(tagid).find('.result-picker').children().css('width', '22px');
    $(tagid).find('#goalsavebutton').css('display', 'none');
    $("#" + tagid).find('.card').removeClass('flipped');
    $("#" + tagid).css("height", "");

    if ($.browser.mozilla || $.browser.msie) {
        $("#" + tagid + " .cardfront").removeClass("forceflip");
        $("#" + tagid + " .cardback").addClass("forceflip");
    }
    getGoals($.userId);
}

function setKnobbTextandColor(code, totalActivites, total) {
    //$.goals.tempColor
    //red = #f13c6e
    //orange = #fdb943
    //green = #cfe371
    var knobbtext = "";
    $.goals.tempPercent = Math.abs(totalActivites / total * 100);
    if (total == "") {
        total = 0;
    }
    //Exactly
    if (code == "OBJFMEX") {
        knobbtext = "<span id='knobbbig' class='knobbbig'> " + totalActivites +
            "<span class='knobbsmall'> of </span>" + total + "</span>";
        if (total > totalActivites) $.goals.tempColor = "#f13c6e";
        if (total < totalActivites) $.goals.tempColor = "#fdb943";
        if (total == totalActivites) $.goals.tempColor = "#cfe371";
    }else if (code == "OBJFMAL") {//At least
        knobbtext = "<span id='knobbbig' class='knobbbig'> " + totalActivites +
            "<span class='knobbsmall2'> ></span>" + total + "</span>";
        if (total > totalActivites) $.goals.tempColor = "#f13c6e";
        if (total < totalActivites) $.goals.tempColor = "#cfe371";
        if (total == totalActivites) $.goals.tempColor = "#cfe371";
    }else if (code == "OBJFMNM") {//At No More than
        knobbtext = "<span id='knobbbig' class='knobbbig'> " + totalActivites +
            "<span class='knobbsmall2'> <</span>" + total + "</span>";
        if (total > totalActivites) $.goals.tempColor = "#cfe371";
        if (total < totalActivites) $.goals.tempColor = "#fdb943";
        if (total == totalActivites) $.goals.tempColor = "#cfe371";
    }else if (code == "" && total !== 0) {//No Code, total not zero
        knobbtext = "<span id='knobbbig' class='knobbbig'> " + totalActivites +
            "<span class='knobbsmall2'> <</span>" + total + "</span>";
        if (total > totalActivites) $.goals.tempColor = "#f13c6e";
        if (total < totalActivites) $.goals.tempColor = "#fdb943";
        if (total == totalActivites) $.goals.tempColor = "#cfe371";
    }else if (code == "OBJFMAN" && total !== 0) {//As Needed with frequency
        knobbtext = "<span id='knobbbig' class='knobbbig'> " + totalActivites +
            "<span class='knobbsmall2'> ></span>" + total + "</span>";
        if (total > totalActivites) $.goals.tempColor = "#fdb943";
        if (total < totalActivites) $.goals.tempColor = "#fdb943";
        if (total == totalActivites) $.goals.tempColor = "#cfe371";
    }else if (code == "OBJFMAN" && total === 0) {//As Needed without frequency
        knobbtext = "<span id='knobbbig' class='knobbbig'><center>" + totalActivites +
            "</center></span>";
        if (totalActivites == 0) $.goals.tempColor = "#70b1d8";
        if (totalActivites > 0) $.goals.tempColor = "#cfe371";
    }else if (code == "OBJFMAR" && total !== 0) {//As Requested with frequency
        knobbtext = "<span id='knobbbig' class='knobbbig'> " + totalActivites +
            "<span class='knobbsmall2'> ></span>" + total + "</span>";
        if (total > totalActivites) $.goals.tempColor = "#fdb943";
        if (total < totalActivites) $.goals.tempColor = "#fdb943";
        if (total == totalActivites) $.goals.tempColor = "#cfe371";
    }else if (code == "OBJFMAR" && total === 0) {//As Requested without frequency
        knobbtext = "<span id='knobbbig' class='knobbbig'><center>" + totalActivites +
            "</center></span>";
        if (totalActivites == 0) $.goals.tempColor = "#70b1d8";
        if (totalActivites > 0) $.goals.tempColor = "#cfe371";
    }else{//Should never be hit, but here just to make sure something shows up.
        knobbtext = "<span id='knobbbig' class='knobbbig'><center>" + totalActivites +
            "</center></span>";       
        $.goals.tempColor = "#cfe371";
    }
    if (total > 9 && totalActivites > 9) {
        knobbtext = knobbtext.replace("class='knobbbig'", "class='knobbbig3'");
        knobbtext = knobbtext.replace("class='knobbsmall2'", "class='knobbsmall4'");
    }
    if (total > 9 || totalActivites > 9) {
        knobbtext = knobbtext.replace("class='knobbbig'", "class='knobbbig2'");
        knobbtext = knobbtext.replace("class='knobbsmall2'", "class='knobbsmall3'");
    }
    return knobbtext;
}

function accordionClick(tagId) {
    if (tagId.indexOf('goaltext') > -1) return; //do not need to add 'selected' class to notes field.
    accordion = $("#" + tagId).parent(); //$(this).closest("picker-accordion");
    maxWidth = accordion.attr('maxwidth');
    minWidth = accordion.attr('minwidth');
    lastBlock = '#' + accordion.attr('lastSelected');
    if ($(this).width() == maxWidth) {
        if ($(this).attr('class') != 'selected') {
            $(this).width(maxWidth);
            $(this).attr('class', 'selected');
        } else {
            $(this).width(maxWidth);
            $(this).attr('class', '');
        }
    } else {
        $(lastBlock).animate({
            width: minWidth + "px"
        }, {
            queue: false,
            duration: 400
        });
        $(lastBlock).attr('class', '');
        $("#" + tagId).animate({
            width: maxWidth + "px"
        }, {
            queue: false,
            duration: 400
        });
        $("#" + tagId).attr('class', 'selected');
    }
    accordion.attr('lastSelected', tagId);
}

function pickerClick(tagId) {
    //don't want picker css added to save button
    if (tagId == "goalsavebutton" || tagId == "goalsavebuttontext") {
        return;
    }
    check = "#" + tagId;
    picker = $("#" + tagId).parent();
    lastBlock = '#' + picker.attr('lastSelected');
    checkTwo = $(lastBlock).children('selected');
    if (check == lastBlock) {

    } else {
        if ($("#" + tagId).attr('class') == 'selected') {
            $("#" + tagId).attr('class', '');
        } else {
            $(lastBlock).attr('class', '');
            $("#" + tagId).attr('class', 'selected');
            picker.attr('lastSelected', tagId);
        }
    }    
}

function popfilterGoals() {
    $("#goalfilterpop").css("display", "block");
}

function popfilterGoalsOccurance() {
    $("#goaloccurancefilterpop").css("display", "block");
}

function popfilterGoalsOutcomeType() {
    //getOutcomeTypeForFilterAjax(function (data) { populateOutcomeTypeFilter(data); });
    $("#goaloutcometypefilterpop").show();
}

function populateOutcomeTypeFilter(res) {
    var optionsHtml = [];
    var optionsHtml2 = [];
    var outcomeTypeId = '';
    var outcomeTypeName = '';
    var outcomeTypes = $("#goaloutcometypefilterpop");

}

function filterGoals(filter) {
    var numofHour = 0;
    var numofDay = 0;
    var numofWeek = 0;
    var numofMonth = 0;
    var numofYear = 0;
    if (filter == 'All') filter = 'All Services';
    $("#actioncenter").children().each(function () {
        var txt = $("#" + this.id).find('#knobcenter').attr("style");
        $(this).show();
        if (typeof txt !== "undefined") {
            //alert(this.id + " " + txt);
            if (filter == 'Complete') {
                //added rgb for IE.  Do not check actual color in future for logical decisions.  This is extremely brittle.
                if (txt.indexOf("#f13c6e") > -1 || txt.indexOf("rgb(241, 60, 110)") > -1) {
                    $(this).hide();
                } else { }
            }
            if (filter == 'Incomplete') {
                if (txt.indexOf("#f13c6e") > -1 || txt.indexOf("rgb(241, 60, 110)") > -1) {
                } else {
                    $(this).hide();
                }
            }
            //fix headers
            if ($("#" + this.id).is(":visible")) {
                if ($("#" + this.id).attr('reocc') == 'H') numofHour++;
                if ($("#" + this.id).attr('reocc') == 'D') numofDay++;
                if ($("#" + this.id).attr('reocc') == 'W') numofWeek++;
                if ($("#" + this.id).attr('reocc') == 'M') numofMonth++;
                if ($("#" + this.id).attr('reocc') == 'Y') numofYear++;
            }
        }
    });
    $("#goalhour").hide();
    $("#goalday").hide();
    $("#goalweek").hide();
    $("#goalmonth").hide();
    $("#goalyear").hide();
    if (numofHour > 0) $("#goalhour").show();
    if (numofDay > 0) $("#goalday").show();
    if (numofWeek > 0) $("#goalweek").show();
    if (numofMonth > 0) $("#goalmonth").show();
    if (numofYear > 0) $("#goalyear").show();
    $("#goalfilterpop").hide();
    $("#goalsfiltertext").text(filter);

    // Reset Filter Text
    if (filter != 'All') {
        //$('#goalsoutcometypefiltertext').val('All Outcome Types');
        $('#goalsoutcometypefiltertext').text('All Outcome Types');
        //$('#goalsoccurancefiltertext').val('All Occurrences');
        $('#goalsoccurancefiltertext').text('All Occurrences');
    }
}

function filterGoalsOccurance(filter) {
    var numofHour = 0;
    var numofDay = 0;
    var numofWeek = 0;
    var numofMonth = 0;
    var numofYear = 0;
    if (filter == 'All') filter = 'All Occurrences';
    $("#actioncenter").children().each(function () {
        $(this).show();
            if (filter == 'ALL') {
                $("#goalhour").show();
                $("#goalday").show();
                $("#goalweek").show();
                $("#goalmonth").show();
                $("#goalyear").show();
                if (($("#" + this.id).attr('reocc') == '') || ($("#" + this.id).attr('reocc') == 'H') || ($("#" + this.id).attr('reocc') == 'D') || ($("#" + this.id).attr('reocc') == 'W') || ($("#" + this.id).attr('reocc') == 'M') || ($("#" + this.id).attr('reocc') == 'Y')) {
                    $(this).show();
                } else { }
            }
            if (filter == 'None') {
                //added rgb for IE.  Do not check actual color in future for logical decisions.  This is extremely brittle.
                if (($("#" + this.id).attr('reocc') == 'H') || ($("#" + this.id).attr('reocc') == 'D') || ($("#" + this.id).attr('reocc') == 'W') || ($("#" + this.id).attr('reocc') == 'M') || ($("#" + this.id).attr('reocc') == 'Y')){
                    $(this).hide();
                } else { }
            }
            if (filter == 'Hourly') {
                if (($("#" + this.id).attr('reocc') == '') || ($("#" + this.id).attr('reocc') == 'D') || ($("#" + this.id).attr('reocc') == 'W') || ($("#" + this.id).attr('reocc') == 'M') || ($("#" + this.id).attr('reocc') == 'Y')) {
                    $(this).hide();
                } else { }
            }
            if (filter == 'Daily') {
                if (($("#" + this.id).attr('reocc') == '') || ($("#" + this.id).attr('reocc') == 'H') || ($("#" + this.id).attr('reocc') == 'W') || ($("#" + this.id).attr('reocc') == 'M') || ($("#" + this.id).attr('reocc') == 'Y')) {
                    $(this).hide();
                } else { }
            }
            if (filter == 'Weekly') {
                if (($("#" + this.id).attr('reocc') == '') || ($("#" + this.id).attr('reocc') == 'H') || ($("#" + this.id).attr('reocc') == 'D') || ($("#" + this.id).attr('reocc') == 'M') || ($("#" + this.id).attr('reocc') == 'Y')) {
                    $(this).hide();
                } else { }
            }
            if (filter == 'Monthly') {
                if (($("#" + this.id).attr('reocc') == '') || ($("#" + this.id).attr('reocc') == 'H') || ($("#" + this.id).attr('reocc') == 'D') || ($("#" + this.id).attr('reocc') == 'W') || ($("#" + this.id).attr('reocc') == 'Y')) {
                    $(this).hide();
                } else { }
            }
            if (filter == 'Yearly') {
                if (($("#" + this.id).attr('reocc') == '') || ($("#" + this.id).attr('reocc') == 'H') || ($("#" + this.id).attr('reocc') == 'D') || ($("#" + this.id).attr('reocc') == 'W') || ($("#" + this.id).attr('reocc') == 'M')) {
                    $(this).hide();
                } else { }
            }
            //fix headers
            if ($("#" + this.id).is(":visible")) {
                if ($("#" + this.id).attr('reocc') == 'H') numofHour++;
                if ($("#" + this.id).attr('reocc') == 'D') numofDay++;
                if ($("#" + this.id).attr('reocc') == 'W') numofWeek++;
                if ($("#" + this.id).attr('reocc') == 'M') numofMonth++;
                if ($("#" + this.id).attr('reocc') == 'Y') numofYear++;
            }
    });
    $("#goalhour").hide();
    $("#goalday").hide();
    $("#goalweek").hide();
    $("#goalmonth").hide();
    $("#goalyear").hide();
    if (numofHour > 0) $("#goalhour").show();
    if (numofDay > 0) $("#goalday").show();
    if (numofWeek > 0) $("#goalweek").show();
    if (numofMonth > 0) $("#goalmonth").show();
    if (numofYear > 0) $("#goalyear").show();
    $("#goaloccurancefilterpop").hide();

    if (filter === "None") {
        filter = "No Frequency";
    }
    $("#goalsoccurancefiltertext").text(filter);

    // Reset Filter Text
    if (filter != 'All') {
        //$('#goalsoutcometypefiltertext').val('All Outcome Types');
        $('#goalsoutcometypefiltertext').text('All Outcome Types');
        //$('#goalsfiltertext').val('All Services');
        $('#goalsfiltertext').text('All Services');
    }
}

function clearTextBox(goalId) {
    //$.goals.previousGoalsNote = $('#goaltext' + goalId).val();
    $('#goaltext' + goalId).text("");
    $('#goaltext' + goalId).val("");
}

function strobe() {
    $('#rostersettingsbutton').toggleClass("rosterstrobe");
}

function clearGoalsPops(event) {
    var tarId = "";
    var nodeName = "";
    var className = "";
    var parentX2 = "";
    //$.locs = [];    
    clearPops(event); // for non day service "global" clear pops  e.g. settings popup
    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
        tarId = event.srcElement.id;
        nodeName = event.srcElement.nodeName;
        className = event.srcElement.className;
        parentX2 = $(event.srcElement).parent().parent().attr('id');
    } else {
        tarId = $(event.target).attr('id');
        nodeName = event.target.nodeName;
        className = event.target.className;
        parentX2 = $(event.target).parent().parent().attr('id');
    }

    if (className == "goalsnotes" || className == "goalsnotesbutton" || className == "goalsnote" || className == "goalsnotesimage" || className == "goalnotewindow" ||
        className == "goalnotessavebutton" || className == "goalnotesdeletebutton" || className == "goalnotescancelbutton" || className == 'actionpane' ||
        className == 'topmenu' || className == 'consumerlist' || className == 'goalline' || className == 'actioncenter' || className == 'face back cardback' ||
        className == 'goalsrightheaderbox2' || className == 'goalsheadertext2' || tarId == 'blowuptextarea') {
        //Do nothing
    } else {
        $(".goalnotewindow").hide();
    }

    if (tarId == "" || tarId == "dslocationbox" || tarId == "goalfilterpop" || tarId == "goalsfiltertext" || tarId == "goalsoccurancefiltertext" || className == "servicesLink" || className == "goalsLink" || className == "goalscielement goalscidropdown") {
        //do nothing
    } else {
        $("#goalfilterpop").css("display", "none");
        $("#goaloccurancefilterpop").css("display", "none");
        $(".goalscidropdownfilterpop").css("display", "none");        
    }
    if (tarId == "actioncenter" || tarId == "actionpane" || tarId == "consumerlist" || tarId == "topbar" || tarId == "leftmenu")
    {
        //I'm pretty sure this if condition makes this never be called.  Leaving it for now because we are close to release  -Joe
        if ($.loadedApp != 'goals') {
            $('.consumerselected').removeClass('highlightselected');
        }        
    } else {
        //do nothing
    }

    if (className == "goalsubloction" || className == "goalsLink" || nodeName == "GOALSLOCATIONPOP" || nodeName == "GOALSSECONDARYLOCATIONPOP") {
        //do nothing
    } else {
        $(".goalslocationpop").css("display", "none");
        $(".secondarylocationpopbase").css("display", "none");
    }

    if (tarId == "blowupwindow" || tarId == "detailsbox" || className.indexOf("methodbox") > -1 || className == "goalsdetailsbox" || className == "goalsdetailtext" || tarId == "servicedetailtext" || className == "methodseccess" || className.indexOf("methodbuttontext") > -1 || className.indexOf("successbuttontext") > -1 || tarId == 'blowuptextarea') {                                                                                                        //Had to undo changes because it was breaking locations and sub-locations displaying                                                                                            
        //do nothing
    } else {
        $("#blowupwindow").remove();
    }

}

//Goals Calendar
function popGoalsCalendarDateBox(inputField) {
    $("#datebox2").blur();
    var now = new Date($('#' + inputField).val());
    var inputDate;
    $('#' + inputField).mobiscroll().date({
        minDate: new Date(1900, 1, 1), //new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        //dateFormat: 'yyyy-mm-dd',
        maxDate: new Date(),
        dateFormat: 'M dd, yyyy',
        theme: 'wp',
        accent: 'steel',
        display: 'bubble',
        mode: 'scroller',
        preset: 'date',
        onShow: function () {
            $(this).scroller('setDate', new Date(now.getFullYear(), now.getMonth(),
                now.getDate()), false);
        },
        onSelect: function (valueText, inst) {
            $('#' + inputField).val(valueText);
            //var list = $.pages.rosterconsumerlist.split("</consumer>");
            var consumerId = "";
            $('.consumerselected', list).each(function () {
                if($(this).hasClass("highlightselected")){
                    consumerId = this.id;
                }
            });
            //Added if statement to not allow future dates to be selected
            var todaysDate = $.format.date(new Date(), 'MMM dd, yyyy');
            var selectedGoalDate = $('#goalsdatebox').val();
            //if (selectedGoalDate <= todaysDate) {
                if(consumerId != ""){
                    getGoals(consumerId);
                    var list = $.pages.rosterconsumerlist.split("</consumer>");
                    getUserIdsWithGoalsByDate(list);
                    getRemainingDailyGoals(list);
                    $("#" + consumerId).addClass("highlightselected");
                }else{
                    if ($.pages.rosterconsumerlist != "") {
                        var list = $.pages.rosterconsumerlist.split("</consumer>");
                        if (list.length <= 2) {
                            $('.consumerselected', list).each(function () {
                                var tmpId = this.id;
                                $.session.singleLoadedConsumerId = tmpId;
                                boxAction(event);
                            });
                        } else if (list.length > 2) {
                            //pass the list to the ajax layer to do compare of returned ids
                            getUserIdsWithGoalsByDate(list);
                            getRemainingDailyGoals(list);
                        }
                    }
                }
        }
    });
    $('#' + inputField).mobiscroll('show');
    return false;
}

function goalsEditFieldsUnclickable() {
    $(".result-picker").addClass("unclickableElement");
    $(".prompt-picker").addClass("unclickableElement");
    $(".attempt-picker").addClass("unclickableElement");
    $(".goalsubloction").addClass("unclickableElement");
    $(".resultsbox").addClass("unclickableElement");
    $(".goalsnote").addClass("unclickableElement");
    $(".goalTrash").addClass("unclickableElement");
    $(".goalNew").addClass("unclickableElement");
    $("#goalsciboxes").addClass("unclickableElement");
    $(".totalgoalsci").addClass("unclickableElement");
}

function absentUnclickable(card) {
    var subLoc = $("#" + card).find($(".goalsubloction"));
    var resultsbox = $("#" + card).find($(".resultsbox"));
    var goalsnote = $("#" + card).find($(".goalsnote"));
    var goalTrash = $("#" + card).find($(".goalTrash"));
    var goalNew = $("#" + card).find($(".goalNew"));
    var resultsAccordian = $("#" + card).find($(".result-picker"));
    var promptsAccordian = $("#" + card).find($(".prompt-picker"));
    var attemptsAccordian = $("#" + card).find($(".attempt-picker"));
    var test = $("#" + card).find(".totalgoalsci");
    var ciBoxes = $("#" + card).find("#goalsciboxes");
    var noteSave = $("#" + card).find(".goalnotessavebutton");
    var noteDelete = $("#" + card).find(".goalnotesdeletebutton");
    var noteCancel = $("#" + card).find(".goalnotescancelbutton");
    var resultsPicker = $("#" + card).find(".result-picker");
    var promptPicker = $("#" + card).find(".prompt-picker");
    var attemptPicker = $("#" + card).find(".attempt-picker");
    var totalGoalsCI = $("#" + card).find(".totalgoalsci"),
        goalslocation = $("#" + card).find("#goalslocation"),
        goalssublocation = $("#" + card).find("#goalssublocation");
    resultsAccordian.addClass("unclickableElement");
    promptsAccordian.addClass("unclickableElement");
    attemptsAccordian.addClass("unclickableElement");
    subLoc.addClass("unclickableElement");
    resultsbox.addClass("unclickableElement");
    //goalsnote.addClass("unclickableElement");
    goalsnote.attr('readonly', true);
    goalTrash.addClass("unclickableElement goalHasAbsent");
    ciBoxes.addClass("unclickableElement goalHasAbsent");
    test.addClass("unclickableElement goalHasAbsent");
    goalNew.removeClass("unclickableElement goalHasAbsent");
    noteSave.addClass("unclickableElement goalHasAbsent");
    noteDelete.addClass("unclickableElement goalHasAbsent");
    noteCancel.addClass("unclickableElement goalHasAbsent");
    resultsPicker.addClass("unclickableElement goalHasAbsent");
    promptPicker.addClass("unclickableElement goalHasAbsent");
    attemptPicker.addClass("unclickableElement goalHasAbsent");
    totalGoalsCI.addClass("unclickableElement goalHasAbsent");
    goalslocation.addClass("unclickableElement goalHasAbsent");
    goalssublocation.addClass("unclickableElement goalHasAbsent");
}

function absentReverseUnclickable(card) {
    var subLoc = $("#" + card).find($(".goalsubloction"));
    var resultsbox = $("#" + card).find($(".resultsbox"));
    var goalsnote = $("#" + card).find($(".goalsnote"));
    var goalTrash = $("#" + card).find($(".goalTrash"));
    var goalNew = $("#" + card).find($(".goalNew"));
    var resultsAccordian = $("#" + card).find($(".result-picker"));
    var promptsAccordian = $("#" + card).find($(".prompt-picker"));
    var attemptsAccordian = $("#" + card).find($(".attempt-picker"));
    var test = $("#" + card).find(".totalgoalsci");
    var ciBoxes = $("#" + card).find("#goalsciboxes");
    var noteSave = $("#" + card).find(".goalnotessavebutton");
    var noteDelete = $("#" + card).find(".goalnotesdeletebutton");
    var noteCancel = $("#" + card).find(".goalnotescancelbutton");
    var resultsPicker = $("#" + card).find(".result-picker");
    var promptPicker = $("#" + card).find(".prompt-picker");
    var attemptPicker = $("#" + card).find(".attempt-picker");
    var totalGoalsCI = $("#" + card).find(".totalgoalsci"),
        goalslocation = $("#" + card).find("#goalslocation"),
        goalssublocation = $("#" + card).find("#goalssublocation");
    resultsAccordian.removeClass("unclickableElement");
    promptsAccordian.removeClass("unclickableElement");
    attemptsAccordian.removeClass("unclickableElement");
    subLoc.removeClass("unclickableElement");
    resultsbox.removeClass("unclickableElement");
    //goalsnote.addClass("unclickableElement");
    goalsnote.attr('readonly', false);
    goalTrash.removeClass("unclickableElement goalHasAbsent");
    ciBoxes.removeClass("unclickableElement goalHasAbsent");
    test.removeClass("unclickableElement goalHasAbsent");
    goalNew.removeClass("unclickableElement goalHasAbsent");
    noteSave.removeClass("unclickableElement goalHasAbsent");
    noteDelete.removeClass("unclickableElement goalHasAbsent");
    noteCancel.removeClass("unclickableElement goalHasAbsent");
    resultsPicker.removeClass("unclickableElement goalHasAbsent");
    promptPicker.removeClass("unclickableElement goalHasAbsent");
    attemptPicker.removeClass("unclickableElement goalHasAbsent");
    totalGoalsCI.removeClass("unclickableElement goalHasAbsent");
    goalslocation.removeClass("unclickableElement goalHasAbsent");
    goalssublocation.removeClass("unclickableElement goalHasAbsent");
}

function goalsEditFieldUnclickableDiffUser(card) {
    var subLoc = $("#" + card).find($(".goalsubloction"));
    var resultsbox = $("#" + card).find($(".resultsbox"));
    var goalsnote = $("#" + card).find($(".goalsnote"));
    var goalTrash = $("#" + card).find($(".goalTrash"));
    var goalNew = $("#" + card).find($(".goalNew"));
    var resultsAccordian = $("#" + card).find($(".result-picker"));
    var promptsAccordian = $("#" + card).find($(".prompt-picker"));
    var attemptsAccordian = $("#" + card).find($(".attempt-picker"));
    var test = $("#" + card).find(".totalgoalsci");
    var ciBoxes = $("#" + card).find("#goalsciboxes");
    var noteSave = $("#" + card).find(".goalnotessavebutton");
    var noteDelete = $("#" + card).find(".goalnotesdeletebutton");
    var noteCancel = $("#" + card).find(".goalnotescancelbutton");
    resultsAccordian.addClass("unclickableElement");
    promptsAccordian.addClass("unclickableElement");
    attemptsAccordian.addClass("unclickableElement");
    subLoc.addClass("unclickableElement");
    resultsbox.addClass("unclickableElement");
    //goalsnote.addClass("unclickableElement");
    goalsnote.attr('readonly', true);
    goalTrash.addClass("unclickableElement");
    ciBoxes.addClass("unclickableElement");
    test.addClass("unclickableElement");
    goalNew.removeClass("unclickableElement");
    noteSave.addClass("unclickableElement");
    noteDelete.addClass("unclickableElement");
    noteCancel.addClass("unclickableElement");
    $.goals.diffUser = true;
}

function goalsEditFieldsClickable(card) {
    var subLoc = $("#" + card).find($(".goalsubloction"));
    var resultsbox = $("#" + card).find($(".resultsbox"));
    var goalsnote = $("#" + card).find($(".goalsnote"));
    var goalTrash = $("#" + card).find($(".goalTrash"));
    var goalNew = $("#" + card).find($(".goalNew"));
    var resultsAccordian = $("#" + card).find($(".result-picker"));
    var promptsAccordian = $("#" + card).find($(".prompt-picker"));
    var attemptsAccordian = $("#" + card).find($(".attempt-picker"));
    var test = $("#" + card).find(".totalgoalsci");
    var ciBoxes = $("#" + card).find("#goalsciboxes");
    var noteSave = $("#" + card).find(".goalnotessavebutton");
    var noteDelete = $("#" + card).find(".goalnotesdeletebutton");
    var noteCancel = $("#" + card).find(".goalnotescancelbutton"),
        goalslocation = $("#" + card).find("#goalslocation"),
        goalssublocation = $("#" + card).find("#goalssublocation");
    resultsAccordian.not(".goalHasAbsent").removeClass("unclickableElement");
    promptsAccordian.not(".goalHasAbsent").removeClass("unclickableElement");
    attemptsAccordian.not(".goalHasAbsent").removeClass("unclickableElement");
    subLoc.not(".goalHasAbsent").removeClass("unclickableElement");
    resultsbox.not(".goalHasAbsent").removeClass("unclickableElement");
    goalsnote.not(".goalHasAbsent").removeClass("unclickableElement");
    goalTrash.not(".goalHasAbsent").removeClass("unclickableElement");
    goalNew.not(".goalHasAbsent").removeClass("unclickableElement");
    ciBoxes.not(".goalHasAbsent").removeClass("unclickableElement");
    test.not(".goalHasAbsent").removeClass("unclickableElement");
    noteSave.not(".goalHasAbsent").removeClass("unclickableElement");
    noteDelete.not(".goalHasAbsent").removeClass("unclickableElement");
    noteCancel.not(".goalHasAbsent").removeClass("unclickableElement");
    goalslocation.not(".goalHasAbsent").removeClass("unclickableElement");
    goalssublocation.not(".goalHasAbsent").removeClass("unclickableElement");
    $.goals.diffUser = false;
}

function goalsEditFieldsClickableAll() {
    $(".result-picker").not(".goalHasAbsent").removeClass("unclickableElement");
    $(".prompt-picker").not(".goalHasAbsent").removeClass("unclickableElement");
    $(".attempt-picker").not(".goalHasAbsent").removeClass("unclickableElement");
    $(".goalsubloction").not(".goalHasAbsent").removeClass("unclickableElement");
    $(".resultsbox").not(".goalHasAbsent").removeClass("unclickableElement");
    $(".goalsnote").not(".goalHasAbsent").removeClass("unclickableElement");
    $(".goalTrash").not(".goalHasAbsent").removeClass("unclickableElement");
    $(".goalNew").not(".goalHasAbsent").removeClass("unclickableElement");
    $("#goalsciboxes").not(".goalHasAbsent").removeClass("unclickableElement");
    $("#goalslocation").not(".goalHasAbsent").removeClass("unclickableElement");
    $("#goalssublocation").not(".goalHasAbsent").removeClass("unclickableElement");
    
    $.goals.diffUser = false;
}

function blowUpTextBox(goalId, identifier) {
    var blowUpWindow = "<div id='blowupwindow' class='blowupwindow'>" +
                        "<textarea readonly id='blowuptextarea'></textarea>" +
                    "</div>";

    $("body").append(blowUpWindow);

    if (identifier == "serviceDetailBox") {
        var textArea = $("#" + goalId).find($(".detailsbox")).text();
        $("#blowuptextarea").append(textArea);
    }

    if (identifier == "methodBox") {
        var textArea = $("#" + goalId).find($(".method")).text();
        $("#blowuptextarea").append(textArea);
    }

    if (identifier == "successBox") {
        var textArea = $("#" + goalId).find($(".success")).text();
        $("#blowuptextarea").append(textArea);
    }
}

function validateGoalsCITime(tagname, goalId, objId) {
    var goalsCIStart = $('#goalscistart' + goalId + "-" + objId).text();
    var goalsCIEnd = $('#goalsciend' + goalId + "-" + objId).text();
    if (goalsCIStart.length > 8 && tagname == '#goalscistart' + goalId + "-" + objId) {
        $('#' + tagname).html($.session.initialGoalCIStart);
        return;
    }
    if (goalsCIEnd.length > 8 && tagname == '#goalsciend' + goalId + "-" + objId) {
        $('#' + tagname).html($.session.initialGoalCIEnd);
        return;
    }
    goalsCIStart = convertTimeToMilitary(goalsCIStart);    
    goalsCIEnd = convertTimeToMilitary(goalsCIEnd);
    if (tagname.indexOf('start') > -1) {
        if ($.session.initialGoalCIEndCompare == '00:00:00') {
            //do nothing
        } else if(goalsCIStart > goalsCIEnd){
            $('#' + tagname).html($.session.initialGoalCIStart);
        }
    } else {
        if ($.session.initialGoalCIStartCompare == '00:00:00') {
            //do nothing
        } else if (goalsCIStart > goalsCIEnd && goalsCIEnd != '00:00:00') {
            $('#' + tagname).html($.session.initialGoalCIEnd);
        }
    }
    ciRequiredTimeControl(tagname, goalId, objId);//need this to make sure required are completed for save display
}

function popGoalsCITimeBox(tagname, goalId, objId, event) {
    //var now = new Date();
    $(".goalsavedbox").text("");
    if (tagname.match("end") && $('#goalscistart' + goalId + "-" + objId).text() == "START TIME") return;
    var obj = $("#" + tagname);
    originalText = $('#' + tagname).text();
    fmt = new DateFmt();
    var goalsCIStartTimeValue = $('#goalscistart' + goalId + "-" + objId).text();
    $.session.initialGoalCIStart = goalsCIStartTimeValue;
    goalsCIStartTimeValue = convertTimeToMilitary(goalsCIStartTimeValue);
    $.session.initialGoalCIStartCompare = goalsCIStartTimeValue;
    var minStartTime = new Date();
    minStartTime.setHours(goalsCIStartTimeValue.substring(0, 2), goalsCIStartTimeValue.substring(3, 5), goalsCIStartTimeValue.substring(6, 8), 0);
    var goalsCIEndTimeValue = $('#goalsciend' + goalId + "-" + objId).text();
    $.session.initialGoalCIEnd = goalsCIEndTimeValue;
    goalsCIEndTimeValue = convertTimeToMilitary(goalsCIEndTimeValue);
    $.session.initialGoalCIEndCompare = goalsCIEndTimeValue;
    var minEndTime = new Date();
    minEndTime.setHours(goalsCIEndTimeValue.substring(0, 2), goalsCIEndTimeValue.substring(3, 5), goalsCIEndTimeValue.substring(6, 8), 0);
    if (minStartTime >= minEndTime) {
        minEndTime = new Date(minStartTime);
        minEndTime.setMinutes(minEndTime.getMinutes() + 1);    }   
    setupTimeInputBox(obj, event);// call to new timepicker    
   
    return false;
}

function ciRequiredTimeControl(tagname, goalId, objid) {
    if (($('#goalscistart' + goalId + "-" + objid).text() != 'START TIME') && ($('#goalsciend' + goalId + "-" + objid).text() == 'END TIME')) {
        $('#goalenderrorbox' + goalId + "-" + objid).show();
        $('#goalstarterrorbox' + goalId + "-" + objid).hide();
        checkIfSaveButtonDisplay(goalId, objid);
    }
    if (($('#goalscistart' + goalId + "-" + objid).text() == 'START TIME') && ($('#goalsciend' + goalId + "-" + objid).text() != 'END TIME')) {
        $('#goalstarterrorbox' + goalId + "-" + objid).show();
        $('#goalenderrorbox' + goalId + "-" + objid).hide();
        checkIfSaveButtonDisplay(goalId, objid);
    }
    if (($('#goalscistart' + goalId + "-" + objid).text() != 'START TIME') && ($('#goalsciend' + goalId + "-" + objid).text() != 'END TIME')) {
        $('#goalstarterrorbox' + goalId + "-" + objid).hide();
        $('#goalenderrorbox' + goalId + "-" + objid).hide();
        checkIfSaveButtonDisplay(goalId, objid);
    }
    if (($('#goalscistart' + goalId + "-" + objid).text() == 'START TIME') && ($('#goalsciend' + goalId + "-" + objid).text() == 'END TIME')) {
        $('#goalstarterrorbox' + goalId + "-" + objid).hide();
        $('#goalenderrorbox' + goalId + "-" + objid).hide();
        checkIfSaveButtonDisplay(goalId, objid);
    }
}

function assignCommunityIntegrationDropdownData(res, goalId, objId, goalCILevel, firstRun) {
    var goalIntegrationLevelHtml = [];
    var goalsIntegrationLevelFp = $('#goalsintegrationlevelfilterpop' + goalId + "-" + objId);
    var classadd = "block";
    var tmpCode = '';
    var tmpName = '';
    var emptyTmpCode = '';
    var emptyTmpName = '';
    var nameToSet = ''
    var count = 0;
    //asdf
    goalIntegrationLevelHtml.push("<a href='#' class='goalscilevellink " + classadd +
                    "' onClick='changeCILevel(\"" + emptyTmpCode + "\",\"" + emptyTmpName + "\",\"" + goalId + "\",\"" + objId + "\")' >" + tmpName +
            "</a>");
    $("result", res).each(function () {
        tmpName = $('captionname', this).text();
        tmpCode = $('code', this).text();        
        var nameWithRemovedQuote = tmpName.replace(/\\['\\]|'/g, function (s) {
            if (s == "'") return "";
            else return s;
        });
        tmpName = nameWithRemovedQuote;
        if (goalCILevel == tmpCode && tmpCode != "") {
            nameToSet = tmpName;
        } else {
            goalIntegrationLevelHtml.push("<a href='#' class='goalscilevellink' " +
            "' cicode='" + tmpCode + "' ciname='" + tmpName +
            "' onClick='changeCILevel(\"" + tmpCode + "\",\"" + tmpName + "\",\"" + goalId + "\",\"" + objId + "\")' >" + tmpName +
            "</a>");
        }
        if (goalCILevel != '' && goalCILevel != undefined) {
            changeCILevel(goalCILevel, nameToSet, goalId, objId, firstRun || false);
        }        
        count++;
    });

    sortBy('#goalsintegrationlevelfilterpop');
}

function popGoalsCIDropDown(goalId, objId) {
    
    assignCommunityIntegrationDropdownData($.session.ciDropDownResponse, goalId, objId, "");
    $("#goalsintegrationlevelfilterpop" + goalId + "-" + objId).css("display", "block");

}

function changeCILevel(code, name, goalId, objId, firstRun) {
    $('#goalscidropdown' + goalId + "-" + objId).html(name || "").attr('cicode', code || "");
    if (name != "COMMUNITY INTEGRATION" && name != null) {
        $("#goallevelerrorbox" + goalId + "-" + objId).hide();
    }
    else $("#goallevelerrorbox" + goalId + "-" + objId).show();
    $("#goalsintegrationlevelfilterpop" + goalId + "-" + objId).css("display", "none");
    //if ($.goals.ciDropdownClicked == true) {
    checkIfSaveButtonDisplay(goalId, objId, firstRun || false);
        //$.goals.ciDropdownClicked = false;
    //}
}

function checkIfSaveButtonDisplay(goalId, objId, firstRun) {
    if (firstRun == true) return;
    var isInvisible = true;
    var ids = [
        "#resultserrorbox",
        "#promptserrorbox",
        "#attemptserrorbox",
        "#goalsnoteserrorbox",
        "#goalstarterrorbox",
        "#goalenderrorbox",
        "#goallevelerrorbox",
    ].map(function (el) { return el + goalId + "-" + objId; });
    
    $(ids.join(",")).each(function (index, el) {
        if ($(el).is(":visible")) isInvisible = false;
        return;
    });
    var noteBackground = $('#goalnotesbutton' + goalId + "-" + objId).css('background-color');
    if (isInvisible == true && (noteBackground != 'rgb(255, 0, 0)')) {
        var goalText = $('#goaltext' + goalId + "-" + objId).val();
        if (goalText == 'How did it go?') {
            goalText = '';
        }
        var objDate = $('#goalsdatebox').val();
        if (objDate == undefined) {
            var newDate = new Date();
            objDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
        }
        //can not save undefined as a promptNumber
        var promptNumber = $('#attempt-picker' + goalId + "-" + objId).find('.selected')
            .first().text();
        if (typeof (promptNumber) == "undefined") promptNumber = 0;
        //check type
        var promptType = $('#' + $('#prompt-picker' + goalId + "-" + objId).attr(
            'lastselected')).attr('code');
        if (typeof (promptType) == "undefined") promptType = "0";


        $("[objid=" + objId + "]").find('.goalsavebutton').css('display', 'block');
        //$('.goalsavebutton').css('display', 'block');
    } else {
        $('.goalsavebutton').css('display', 'none');
    }
    if ($.goals.ciDropdownClicked == true) {
        $('.goalsavebutton').css('margin-right', '1px');
        $.goals.ciDropdownClicked = false;
    }
}

function outcomeTypeFilterForPostSave() {
    var text = $("#goalsoutcometypefiltertext").html();
    $("#actioncenter").children().show();
    if (text != "All Outcome Types") {
        $("#actioncenter").children().each(function (ind, el) {
            var t = $(this);
            if (t.find(".goalsrightheaderbox").length) {
                //console.log(t, t.find(".goalsheadertext").text())
                var myText = t.find(".goalsrightheaderbox").find(".goalsheadertext").text();
                //console.log(myText);
                if (myText != text) {
                    t.hide();
                }
            }
        });
    }     
}

function refilterAfterSave() {
    if ($("#goalsfiltertext").html() != "All Services") {
        filterGoals($("#goalsfiltertext").html());
    } else if ($("#goalsoccurancefiltertext").html() != "All Occurrences") {
        filterGoalsOccurance($("#goalsoccurancefiltertext").html());
    }else if($("#goalsoutcometypefiltertext").html() != "All Outcome Types"){
        outcomeTypeFilterForPostSave();
    }
}

