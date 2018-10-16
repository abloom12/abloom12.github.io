$.dropdownData = [];
$.caseNotes = {};
$.caseNotes.mileageConsumerIds = [];
$.caseNotes.billerName = "";
$.caseNotes.reporterName = "";
$.caseNotes.reportedDate = "";
$.session.gkGroupEdit = false;
$.session.advGroupEdit = false;
$.caseNotes.noTimerEdit = false;
$.caseNotes.inactTime;
$.caseNotes.documentTimeSeconds = 0;
$.session.cnEdit = false;
$.session.maxGroupMiles = 0;
$.caseNotes.dontResetInactTimerFlag = false;
$.caseNotes.differentUserNoEdit = false;
 
function BillingCode(serviceCode, serviceId, serviceFunding, serviceRequired, locationRequired, needRequired, contactRequired, allowGroupNotes, mileageRequired, docTimeRequired, travelTimeRequired) {
    this.serviceCode = serviceCode;
    this.serviceId = serviceId;
    this.serviceFunding = serviceFunding;
    this.serviceRequired = serviceRequired;
    this.locationRequired = locationRequired;
    this.needRequired = needRequired;
    this.contactRequired = contactRequired;
    this.allowGroupNotes = allowGroupNotes;
    this.mileageRequired = mileageRequired;
    this.docTimeRequired = docTimeRequired;
    this.travelTimeRequired = travelTimeRequired;
    this.billingCodeLocations = [];
    this.billingCodeContacts = [];
    this.billingCodeServices = [];
    this.billingCodeNeeds = [];
}

function BillingCodeLocations(locName, locCode) {
    this.locName = locName;
    this.locCode = locCode;
}

function BillingCodeContacts(contactName, contactCode) {
    this.contactName = contactName;
    this.contactCode = contactCode;
}

function BillingCodeServices(serviceName, serviceCode) {
    this.serviceName = serviceName;
    this.serviceCode = serviceCode;
    //this.serviceFunding = serviceFunding;
}

function BillingCodeNeeds(needName, needCode) {
    this.needName = needName;
    this.needCode = needCode;
}

function caseNotesLoad() {
    if ($.session.applicationName == 'Advisor') {
        getConsumersThatCanHaveMileageAjax(parseIdsThatCanHaveMilage);
    }    
    if ($.session.CaseNotesCaseloadRestriction == true) {
        getCaseLoadRestriction();
    }
    $.session.editNoteMileageOnLoadFlag = false;
    $.caseNotes.noTimerEdit = false;
    $.caseNotes.documentTimeSeconds = 0;
    $.session.cnEdit = false;
    pauseTimer();
    $.session.caseNoteEditSecond = false;
    $("*").removeClass("highlightselected").removeClass("notselectedbuthasgoals");
    $.session.existingGroupNoteIdForUpdate = "";
    $("#casenotesbutton").addClass("buttonhighlight"); 
    $("#actionbanner").html("");
    $("#roostertoolbar").html("");
    $("#roostertoolbar").html(
    "<div id='buttondiv' class='flex justify-sa'>" +
        "<div class='buttonWrap'>" +
            "<button id='newnote' class='rightpanelbutton newnote'  onClick=loadNewCaseNote()></button > " +
            "<p id='newnotedescription'>New</p>" +
        "</div>" +
        "<div class='buttonWrap'>" +
            "<button id='editnote' class='rightpanelbutton editnote' onClick=filterByButtonSearch()></button>" +
            "<p id='editnotedescription'>Filter By</p>" +
        "</div>" +
    "</div>" +
    "<input id='caseconsumersearchbox' onkeyup='caseConsumerFilter()'>");
    $("#roostertoolbar").addClass("caserosterbar");
    $("#consumerlist").addClass("caseconsumerlist");
    
    //enable "new" button
    if ($.session.CaseNotesUpdate == true){
        $("#newnote").addClass("casenoteeditenabled");
        $("#newnotedescription").addClass("casenoteeditenabled");
    }
    
    $("#actionbanner").html("<button class='billericon' onClick='popFilterBiller()'></button>" +
                        "<div id='casenotesbillerfilterbox' class='casenotesbillerfilterbox' onClick='popFilterBiller()'><div id='casenotesbillerfiltertext' class='headertext'>Biller</div></div>" +
						"<div id='billerfilterpop' class='billerfilterpop' ></div>"); //onClick='getFilteredCaseNotesListDataSetter()></div>");
    $("*").addClass("waitingCursor");
    getBillersListForDropDown();

    var serviceDates = "<div class='casedatecontainer'>" +
        "<label class='casedateheadertext'>Service Dates</label>" +
        "<div class='startendwrapper'>" +
            "<label class='casedatecontainerlabel'>Start:</label>" +
            "<input id='casenotesservicestartdatebox' class='casedateentry' onkeyup='checkIfCompleteDate(event)'>" +
            "<button id='calendaricon' class='casenotesbannericon calendaricon cncalandaricon' onClick=popCaseNotesCalendarDateBox('casenotesdateboxservicestart')></button>" +
            "<dateinput id='casenotesdateboxservicestart' class='casenotesdatebox'></input></dateinput>" +
            "<label class='casedatecontainerlabel'>End:</label>" +
            "<input id='casenotesserviceenddatebox'class='casedateentry' onkeyup='checkIfCompleteDate(event)'>" +
            "<button id='calendaricon' class='casenotesbannericon calendaricon' onClick=popCaseNotesCalendarDateBox('casenotesdateboxserviceend')></button>" +
            "<div class='clearcasecalanders' onclick='clearCaseDateFilter()'></div>" +
            "<dateinput id='casenotesdateboxserviceend' class='casenotesdatebox'></input></dateinput>" +
        "</div>" +
    "</div>";

    var datesEntered = "<div class='casedatecontainer'>" +

        "<label class='casedateheadertext'>Dates Entered</label>" +
        "<div class='startendwrapper'>" +
            "<label class='casedatecontainerlabel'>Start:</label>" +
            "<input id='casenotesdateenteredstartdatebox' class='casedateentry' onkeyup='checkIfCompleteDate(event)'>" +
            "<button id='calendaricon' class='casenotesbannericon calendaricon' onClick=popCaseNotesCalendarDateBox('casenotesdateboxenteredstart')></button>" +
            "<dateinput id='casenotesdateboxenteredstart' class='casenotesdatebox'></input></dateinput>" +
            "<label class='casedatecontainerlabel'>End:</label>" +
            "<input id='casenotesdateenteredenddatebox' class='casedateentry' onkeyup='checkIfCompleteDate(event)'>" +
            "<button id='calendaricon' class='casenotesbannericon calendaricon' onClick=popCaseNotesCalendarDateBox('casenotesdateboxenteredend')></button>" +
            "<div class='clearcasecalanders' onclick='clearCaseDateEnteredFiltered()'></div>" +
            "<dateinput id='casenotesdateboxenteredend' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
        "</div>" +
    "</div>";

    var daysBackLabel = "<p id='daysbacklabel' class='blankopacity'></p>"; 
    $("#actioncenter").append("<p id='casenoteoverlaperrormessage'></p>").append(serviceDates).append(datesEntered).append(daysBackLabel);
    $(".casedateentry").mask("99/99/9999", { placeholder: " " });


    var caseTable = '<div class="cntableouterwrapper"><div class="casenotestable" id="casenotetableid"  >' + '<table >' + '</table>' + '</div></div>';
    $([
        "#casenotesdateboxservicestart",
        "#casenotesdateboxserviceend",
        "#casenotesdateboxenteredstart",
        "#casenotesdateboxenteredend"
    ].join(", "))
        .text($.format.date(new Date($.pages.rosterdate), 'MM/dd/yy'))
        .val($.format.date(new Date(), 'MMM dd, yyyy'));
    
    $("#actioncenter").append(caseTable);
    if ($.session.useSessionFilterVariables == true) {
        assignSavedFilterParameters();
    } else {
        convertDaysBackToPopulateServiceDate();
    }
    if ($.session.timeOverlapConsumers.length != 0) {
        var uniqueNames = [];
        $.each($.session.timeOverlapConsumers, function (i, el) {
            if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        $("#casenoteoverlaperrormessage").text('Time overlap(s):' + uniqueNames.join(", "));
        $.session.timeOverlapConsumers = [];
    }
    $(document).trigger("moduleLoad");
    //convertDaysBackForCaseNoteLoadFilter($.session.defaultCaseNoteReviewDays);    
}

//Creates the case notes table from the res of getFilteredCaseNotesList
function createCaseNotesListTable(res) {
    $.session.maxGroupMiles = 0;
    var overlap = false;
    var caseTable2 = '<table >';
    caseTable2 = caseTable2 + '<div class="firsttr"><tr id="firsttr"><td id="frdatetd">Service Date</td><td id="frservicestarttd">Service Start</td><td id="frnametd">Name</td><td id="frnotetd">Note</td><td id="frdatetd">Date Created</td><td id="frupdatedbytd">Updated By</td><td id="frgroupidtd">Group Note Id</td><td id="frbatchedtd">Batched</td></tr></div>';
    if (res.indexOf("<casenote>") > -1) {
        $('casenote', res).each(function () {
            casenoteid = $('casenoteid', this).text();
            tmpServiceDate = $('servicedate', this).text();
            tmpServiceDate = new Date(tmpServiceDate);
            tmpServiceDate = formatDateGFromDB(tmpServiceDate);
            tmpStartTime = $('starttime', this).text();
            tmpStartTime = formatTimeFromDB(tmpStartTime);
            tmpConfidential = $('confidential', this).text();

            tmpFirstName = $('firstname', this).text();
            tmpLastName = $('lastName', this).text();
            tmpNoteSummary = $('notesummary', this).text();
            tmpConsumerId = $('consumerid', this).text();
            if (tmpNoteSummary.indexOf("\\n") != -1) {
                tmpNoteSummary = tmpNoteSummary.replace(/\\n/g, "\n");
            }
            if (tmpNoteSummary.indexOf("\\r") != -1) {
                tmpNoteSummary = tmpNoteSummary.replace(/\\r/g, "\n");
            }
            tmpOriginalUpdate = $('originalupdate', this).text();
            tmpOriginalUpdate = new Date(tmpOriginalUpdate);
            tmpOriginalUpdate = (("0" + (tmpOriginalUpdate.getMonth() + 1)).slice(-2) + '/' + ("0" + tmpOriginalUpdate.getDate()).slice(-2) + '/' + tmpOriginalUpdate.getFullYear());
            tmpLastUpdate = $('mostrecentupdate', this).text();
            tmpLastUpdate = new Date(tmpLastUpdate);
            tmpLastUpdate = (("0" + (tmpLastUpdate.getMonth() + 1)).slice(-2) + '/' + ("0" + tmpLastUpdate.getDate()).slice(-2) + '/' + tmpLastUpdate.getFullYear());
            tmpLastUpdateByUserId = $('lastupdatedby', this).text();
            tmpGroupNoteId = $('groupnoteid', this).text();
            tmpGroupIdToPass = tmpGroupNoteId;
            if (tmpGroupIdToPass == '') {
                tmpGroupIdToPass = 0;
            }
            if (tmpGroupNoteId == '') {
                tmpGroupNoteId = '---';
            }
            tmpBillingID = $('billingid', this).text();
            if (tmpBillingID != '') {
                tmpBillingID = 'Y'
            } else {
                tmpBillingID = 'N'
            }
            var userName = $('#casenotesbillerfiltertext').html();
            userName = userName.replace(/\s+/g, '');
            var sessionName = ($.session.Name + $.session.LName);
            if (tmpConfidential == 'Y') {
                if (userName != sessionName) {
                    tmpNoteSummary = "This is a confidential note.";
                }
            }
            var classRed = "";
            if ($.session.overlapNoteIds.indexOf(casenoteid) > -1) {
                overlap = true;
                classRed = "class='redbackground' ";
            } else {

            }

            caseTable2 = caseTable2 + '<tr ' + classRed + 'id=' + casenoteid + '><td id="datetd">' + tmpServiceDate + '</td><td id="servicestarttd">' + tmpStartTime + '</td><td class="cnconsumername" id="nametd" onClick=getCaseNoteEdit(' + casenoteid + ',' + tmpConsumerId + ',' + tmpGroupIdToPass + ')>' + tmpFirstName + ' ' + tmpLastName + '</td><td class="cnnotesummary" id="notetd" onClick=blowUpTempNote(' + casenoteid + ')>' + tmpNoteSummary + '</td><td id="datetd">' + tmpOriginalUpdate + '</td><td id="updatedbytd">' + tmpLastUpdateByUserId + '</td><td id="groupidtd">' + tmpGroupNoteId + '</td><td id="batchedtd">' + tmpBillingID + '</td></tr>';
        });                                                                                                                       
        caseTable2 = caseTable2 + '</table>' + '</div>';
    } else {
        caseTable2 = caseTable2 + '<tr><td class="casenotestablenodata">No case notes available within search parameters.</td></tr>';
        caseTable2 = caseTable2 + '<tr><td class="casenotestablenodata"></td></tr>';
        caseTable2 = caseTable2 + '</table>';
    }
    $(".cntableouterwrapper").css("display", "block");
    $(".casenotestable").html(caseTable2);

    var errorMessageHeight = parseInt($("#casenoteoverlaperrormessage").css("height"), 10);
    var baseHeight = 120;

    $("#firsttr").css("top", (baseHeight + errorMessageHeight) + "px");
    
    $("*").removeClass("waitingCursor");
    $.session.overlapNoteIds = [];
}

//CAse notes calendar. 
function popCaseNotesCalendarDateBox(inputField, number) {
    $("#datebox3").blur();
    var now = new Date($('#' + inputField).val());
    var inputDate;
    $('#' + inputField).mobiscroll().date({
        minDate: new Date(1900, 1, 1), //new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        //dateFormat: 'yyyy-mm-dd',
        maxDate: new Date(),
        dateFormat: 'mm/dd/yyyy',
        theme: 'wp',
        accent: 'steel',
        display: 'bubble',
        mode: 'scroller',
        preset: 'date',        
        onShow: function () {
            $(this).scroller('setDate', new Date(now.getFullYear(), now.getMonth(),
                now.getDate()), false);
            $('.dw-arr').css('display', 'none');
        },
        onSelect: function (valueText, inst) {
            if (inputField == 'casenotesdateboxservicestart') {
                $('#casenotesservicestartdatebox').val(valueText);
            } else if (inputField == 'casenotesdateboxserviceend') {
                $('#casenotesserviceenddatebox').val(valueText);
            } else if (inputField == 'casenotesdateboxenteredstart') {
                $('#casenotesdateenteredstartdatebox').val(valueText);
            } else if (inputField == 'casenotesdateboxenteredend') {
                $('#casenotesdateenteredenddatebox').val(valueText);
            } else if (inputField == 'casenotesdateboxnewnote') {
                //If passTime = 1 procede if passTime = 0 display error
                //If sameDate = 1 dif days if sameDate = 0 same days
                var passTime = checkTimesWhenDateChange();
                var sameDate = checkIfSameDates(valueText);
                if (sameDate == 0 && passTime == 0) {
                    //$("#casenoteerrormessage").text("Start or End time cannot be in the future for current date");
                    $.session.caseNoteTimeCheck = 'fail';
                    $('#newcasenoteservicedatebox').val(valueText);
                } else {
                    $.session.caseNoteTimeCheck = 'pass';
                    //$("#casenoteerrormessage").html("");
                    //$("#casenoteerrormessage").css("display", "none");
                    $('#newcasenoteservicedatebox').val(valueText);
                }
                
            }
            toggleSaveButton();
            var consumerId = $('.highlightselected').attr('id');
            getConsumerSpecificVendors(consumerId);
            //getFilteredCaseNotesListDataSetter();
        }
    });
    $('#' + inputField).mobiscroll('show');
    return false;
}

function checkIfSameDates(valueText) {
    var newValueText = new Date(valueText);
    valueText = (newValueText.getFullYear() + '-' + (newValueText.getMonth() + 1) + '-' + newValueText.getDate());
    var todaysDate = new Date();
    todaysDate = (todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate());
    if (valueText == todaysDate) {
        return 0;
    } else {
        return 1;
    }
}

function checkTimesWhenDateChange() {
    var startTime = convertTimeToMilitary($('#newcasenoteservicestarttimebox').val());
    var endTime = convertTimeToMilitary($('#newcasenoteserviceendtimebox').val());
    //var currHour = new Date(new Date().getTime());
    var currHour = new Date().getHours();
    if (currHour == 00) {
        currHour = 12;
        amPm = 'AM';
    } else if (currHour == 12) {
        currHour = 12;
        amPm = 'PM';
    } else if (currHour > 12) {
        amPm = 'PM';
        currHour = currHour - 12;
    } else {
        amPm = 'AM'
    }
    currHour = addZero(currHour);
    var currMinutes = new Date().getMinutes();
    currMinutes = addZero(currMinutes);
    var currTime = currHour + ':' + currMinutes + ' ' + amPm;
    currTime = convertTimeToMilitary(currTime);
    if (currTime < startTime || currTime < endTime) {
        return 0;
    } else {
        return 1;
    }
    alert("Start time = " + startTime + "End time = " + endTime + "Current = " + currTime)
}


function highlightPersonCasenotes(event) {
    var par = $(event.target);
    if ($(par).hasClass("consumerselected")) {
        //not sure if this is still being hit ever -Joe
    } else {
        par = $(par).closest('consumer');
    }
    // Set the background color for persons
    $("#consumerlist").children().css('background-color', '');

    var consumerId = par.attr('id');
    //This if/else added to remove selection from user individually
    if ($(par).hasClass("highlightselected")) {
        //This part is added
        par.removeClass("highlightselected");
    } else {
        par.removeClass("notselected");
        par.addClass("highlightselected");
    }    
    //Were here before
    //par.removeClass("notselected");
    //par.addClass("highlightselected");
}

function currentlySelectedConsumers() {
    var selectedUserName = "";
    var userName = "";
    var nameString = "";
    var existingConsumers = '';
    var existingName = '';
    var additionalNameString = '';
    var commaAdded = false;
    if ($.session.gkGroupEdit == true || $.session.advGroupEdit == true || $.session.isSingleEdit == true) {
        existingConsumers = $('.groupcasenotenamedetails').html();
        existingName = $('.casenotenamedetails').html();
        var consumerGroupCount = $('.highlightselected').length;
        if (consumerGroupCount > 0) {
            $("#casenotesavebutton").css("display", "block");
        } else {
            $("#casenotesavebutton").css("display", "none");
        }
    }
    $('.casenoteselectednamedetails').css("display", "block");
    var ids = [];
    $('.highlightselected').each(function (index) {
        var temp = $(this);
        ids.push(temp.attr("id"));
        var firstName = temp.find("#namebox").clone().children().remove().end().text();
        var lastName = temp.find(".lastnametextselected").text();
        selectedUserName = [firstName, lastName].join(" ");

        //selectedUserName = this.innerText; //$(this).attr('innerText'); //+ "," + selectedRosterUserId;
        userName = selectedUserName;
        //selectedUserNameToTest = userName.replace(/[\n\r]/g, '');
        selectedUserNameToTest = userName.replace(/ /g, '');
        if (existingConsumers != "" && existingConsumers != undefined) {
            existingConsumers = existingConsumers.replace(/ /g, '');
        }
        if (existingName != "" && existingName != undefined) {
            existingName = existingName.replace(/ /g, '');
        }
        if ((existingConsumers != "") && (existingConsumers != undefined)) {
            if ((existingConsumers.indexOf(selectedUserNameToTest) == -1)) {
                $.session.groupAddOnNames.push(selectedUserName);
                selectedUserName = selectedUserName + ', ';
                additionalNameString = additionalNameString + selectedUserName;
                commaAdded = true;
            } else if ((existingConsumers.indexOf(selectedUserNameToTest) != -1)) {
                $(this).removeClass('highlightselected');
                if (nameString == "") {
                    $('#casenotesavebutton').css('display', 'none');
                }
                
            }
        }
        if (commaAdded == false) {
            selectedUserName = selectedUserName + ', ';
        }
        if ((existingName.indexOf(selectedUserNameToTest) != -1) && $.session.isSingleEdit == true) {
            $(this).removeClass('highlightselected');
        } else {
            nameString = nameString + selectedUserName;
            nameString = nameString.replace(/[\n\r]/g, '');
            //Below may need changed, but working for now(2/2/16)
            nameString = nameString.replace("Groups", "");
        }
        
    });
    nameString = nameString.substr(0, nameString.length - 2);
    $('.casenoteselectednamedetails').html("Currently Selected:" + " " + nameString);
    if ($.session.isSingleEdit == true) {
        $('.groupcasenoteadditionalnamedetails').html("Additional Consumers:" + " " + nameString);
        if (nameString != "") {
            $.session.changeFromSingleToGroupNote = true;
        } else {
            $.session.changeFromSingleToGroupNote = false;
            $('.groupcasenoteadditionalnamedetails').html("");
        }
    } else {
        //Additions to group    
        additionalNameString = additionalNameString.substr(0, additionalNameString.length - 2);
        $('.groupcasenoteadditionalnamedetails').html("Group Additions:" + " " + additionalNameString);
        if (additionalNameString == '') {
            $('.groupcasenoteadditionalnamedetails').html("");
            //$.session.groupAddOnNames = [];
        }
    }       
    $('.groupcasenoteadditionalnamedetails').css("display", "block");

    var matchedIDs = $.grep(ids, function (id) {
        return $.caseNotes.mileageConsumerIds.indexOf(id + "") !== -1;
    });
    if ($.session.applicationName != 'Gatekeeper') {
        if (matchedIDs.length) {
            $('#cnmileage').show();
            if (parseFloat($('#cnmileagetextarea').val(), 10) == 0) $('#cnmileagetextarea').val($.session.maxGroupMiles);
        }
        else $('#cnmileage').hide();
    }
}

function loadNewCaseNote() {
    $.session.consumerEditId = "";
    $.session.editCaseNoteId = '';
    $.session.consumerIdToEdit = '';
    $.caseNotes.noTimerEdit = false;
    $.session.batchedNoteEdit = false;
    $.session.cnEdit = false;
    $.session.useSessionFilterVariables = false;
    $.session.existingGroupNoteIdForUpdate = "";
    $.session.gkGroupEdit = false;
    $.session.advGroupEdit = false;
    $.session.caseNoteEditSecond = false;
    $.session.isSingleEdit = false;
    $.session.overlapScreenLock = false;
    $.session.changeFromSingleToGroupNote = false;
    $.session.consumersForGroupCounter = 0;
    $.session.groupConsumerCount = 0;
    $.caseNotes.documentTimeSeconds = 0; 
    $('.consumerselected').removeClass('unclickableElement');
    //$.session.dontLoadAppAfterDelete == false;
    
    $("#actioncenter").html("");
    var consumerSelectedCount = $(".consumerselected").length;
    var selectedConsumerCount = $(".highlightselected").length;
    if (consumerSelectedCount < 1) {
        var caseNoteHelp = " helpfadeinslow";
        var splash = "<div ><div class='content'><div class='left-side'>" +
            "<div class='hrtriangleleft" + caseNoteHelp +
            "'></div><div id='rosterhelp' class='rosterhelp rosterhelpleft" + caseNoteHelp +
            "'><span class='helpheader'>Get started:</span><hr class='hrhelp'><span class='helptext'>Select the Roster Icon here. Add people to the right side by clicking or tapping them.</span></div></div></div></div>";
        // $("#actioncenter").append("<p id='casenoteerrormessage'>Please select a consumer on the right to create a new case note.</p>");
        // $('#casenotehelpbanner').css('display', 'block');
        $("#actioncenter").append("<div id='casenotehelpbanner' class='casenotebannererror'><span class='helptext'>Select one or more consumers to enter a note.</span>" +
                            "<div class='cntriangleright'></div>" + "</div>");
        $("#actioncenter").html(splash);
    }else if (selectedConsumerCount < 1) {
       // $("#actioncenter").append("<p id='casenoteerrormessage'>Please select a consumer on the right to create a new case note.</p>");
        // $('#casenotehelpbanner').css('display', 'block');
        $("#actioncenter").append("<div id='casenotehelpbanner' class='casenotebannererror'><span class='helptext'>Select one or more consumers to enter a note.</span>" +
                            "<div class='cntriangleright'></div>" + "</div>");
        
    } else {
        //populateDropdownData();
        getSelectedConsumerIdForVendowDropDown();
        getReviewRequiredAndDefaultBillingCode();
        if ($.session.applicationName == 'Gatekeeper') {
            $("#actioncenter").append(
            "<p id='casenoteerrormessage'></p>" +
            "<div class='casenoteselectednamedetails'></div>" +
            "<div id='newCaseNote'>" +
                "<div id='casenotelabelbox'>" +
                    "<p>Bill Code:</p>" +
                    "<span id='locationreqerror'></span>" +
                    "<p>Location:</p>" +
                    "<span id='servicereqerror'></span>" +
                    "<p>Service:</p>" +
                    "<span id='needreqerror'></span>" +
                    "<p>Need:</p>" +
                    "<span id='contactreqerror'></span>" +
                    "<p>Contact:</p>" +
            "</div>");

            if ($.session.browser == "Safari") {
                $("#newCaseNote").append(
                "<div class='casedropdowncontainer'>" +
                "<div class='casedropdownsafari' id='cnbillingcodedropdownfilterbox' onClick='popFilterCNBillingCode()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnbillingcodefilterpop'></div>" +
                "<div class='casedropdownsafari' id='cnlocationdropdownfilterbox' onClick='popFilterCNLocation()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnlocationfilterpop'></div>" +
                "<div class='casedropdownsafari' id='cnservicedropdownfilterbox' onClick='popFilterCNService()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnservicefilterpop'></div>" +
                //servicelocation work MAT
                "<div class='casedropdownsafari dynamic' id='cnservicelocationdropdownfilterbox' onClick='popFilterCNServiceLocation()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnservicelocationfilterpop'></div>" +

                "<div class='casedropdownsafari' id='cnneeddropdownfilterbox' onClick='popFilterCNNeed()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnneedfilterpop'></div>" +
                "<div class='casedropdownsafari' id='cncontactdropdownfilterbox' onClick='popFilterCNContact()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cncontactfilterpop'></div>" +
                "</div>");
            } else {
                $("#newCaseNote").append(
                "<div class='casedropdowncontainer'>" +
                "<div class='casedropdown' id='cnbillingcodedropdownfilterbox' onClick='popFilterCNBillingCode()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnbillingcodefilterpop'></div>" +
                "<div class='casedropdown' id='cnlocationdropdownfilterbox' onClick='popFilterCNLocation()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnlocationfilterpop'></div>" +
                "<div class='casedropdown' id='cnservicedropdownfilterbox' onClick='popFilterCNService()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnservicefilterpop'></div>" +
                //servicelocation work MAT
                "<div class='casedropdown dynamic' id='cnservicelocationdropdownfilterbox' onClick='popFilterCNServiceLocation()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnservicelocationfilterpop'></div>" +

                "<div class='casedropdown' id='cnneeddropdownfilterbox' onClick='popFilterCNNeed()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnneedfilterpop'></div>" +
                "<div class='casedropdown' id='cncontactdropdownfilterbox' onClick='popFilterCNContact()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cncontactfilterpop'></div>" +
                "</div>");
            }
            

        } else {
            $("#actioncenter").append(
            "<p id='casenoteerrormessage'></p>" +
            "<div class='casenoteselectednamedetails'></div>" +
            "<div id='newCaseNote'>" +
                "<div id='casenotelabelbox'>" +
                    "<p>Serv. Code:</p>" +
                    "<span id='locationreqerror'></span>" +
                    "<p>Location:</p>" +
                    "<span id='servicereqerror'></span>" +
                    "<p>Service:</p>" +
                    "<p class='dynamic'>Serv. Loc:</p>" +
                    "<span id='needreqerror'></span>" +
                    "<p>Need:</p>" +
            "</div>");

            if ($.session.browser == "Safari") {
                $("#newCaseNote").append(
                "<div class='casedropdowncontainer'>" +
                "<div class='casedropdownsafari' id='cnbillingcodedropdownfilterbox' onClick='popFilterCNBillingCode()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnbillingcodefilterpop'></div>" +
                "<div class='casedropdownsafari' id='cnlocationdropdownfilterbox' onClick='popFilterCNLocation()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnlocationfilterpop'></div>" +
                "<div class='casedropdownsafari' id='cnservicedropdownfilterbox' onClick='popFilterCNService()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnservicefilterpop'></div>" +
                //servicelocation work MAT
                "<div class='casedropdownsafari dynamic' id='cnservicelocationdropdownfilterbox' onClick='popFilterCNServiceLocation()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnservicelocationfilterpop'></div>" +

                "<div class='casedropdownsafari' id='cnneeddropdownfilterbox' onClick='popFilterCNNeed()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnneedfilterpop'></div>" +
                "</div>");
            } else {
                $("#newCaseNote").append(
                "<div class='casedropdowncontainer'>" +
                "<div class='casedropdown' id='cnbillingcodedropdownfilterbox' onClick='popFilterCNBillingCode()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnbillingcodefilterpop'></div>" +
                "<div class='casedropdown' id='cnlocationdropdownfilterbox' onClick='popFilterCNLocation()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnlocationfilterpop'></div>" +
                "<div class='casedropdown' id='cnservicedropdownfilterbox' onClick='popFilterCNService()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnservicefilterpop'></div>" +
                //servicelocation work MAT
                "<div class='casedropdown dynamic' id='cnservicelocationdropdownfilterbox' onClick='popFilterCNServiceLocation()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnservicelocationfilterpop'></div>" +

                "<div class='casedropdown' id='cnneeddropdownfilterbox' onClick='popFilterCNNeed()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnneedfilterpop'></div>" +
                "</div>");
            }
            
        }        

        if ($.session.applicationName == 'Gatekeeper') {
            $("#newCaseNote").append(
             "<div id='casenotelabelbox2'>" +
             "<p>Service Date:</p>" +
             "<p>Start Time:</p>" +
             "<span id='endreqerror'></span>" +
             "<p>End Time:</p>" +
             "<span id='vendorreqerror'></span>" +
             "<p>Vendor:</p>" +
             "</div>");
            
            if ($.session.browser == "Safari") {
                $("#newCaseNote").append(
                "<div class='casedropdowncontainer'>" +
                "<div class='casedropdownsafari' id='casenotedate' onClick=popCaseNotesCalendarDateBox('casenotesdateboxnewnote')>" +
                    "<input id='newcasenoteservicedatebox' class='caseservicedateentrynew'>" +
                    "<dateinput id='casenotesdateboxnewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +

                "<div class='casedropdownsafari' id='notestarttime' onClick=popCaseNotesTime('starttimeclock')>" +
                    "<input id='newcasenoteservicestarttimebox' class='caseservicestarttimeentry' >" +
                     "<dateinput id='casenotesstarttimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +
                "<div class='casedropdownsafari' id='noteendtime' onClick=popCaseNotesTime('endtimeclock')>" +
                    "<input id='newcasenoteserviceendtimebox' class='caseservicestarttimeentry' >" +
                     "<dateinput id='casenotesendtimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +
                "<div class='casedropdownsafari' id='cnvendordropdownfilterbox'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnvendorfilterpop'></div>" +

                "</div>" + "<div class='casenotedoctime'><label class='doctimelabel'>Doc Time</label><div class='cntimerbuttons'><button id='cnTimerStart' onClick='startCaseNoteTimer()'>Start</button><button id='cnTimerStop' onClick='pauseTimer()'>Stop</button></div><div id='newcasenotestimer'><label id=minutes>0</label></div></div>" +
                "<div id='cntraveltime' class='casenotetraveltime'><div id='cntraveltimelabel'  name='groupnote' value='GroupNote'>Travel (Min)</div><br />" +
                    "<input type='text' onkeypress='return event.charCode >= 48 && event.charCode <= 57' id='cntraveltimetextarea' maxlength='4' onkeyup='toggleSaveButton(); handleChange(this);'/></div>" +
                "<div id='starttimeclock' class='clockinhiddeninput'>" +
                "<div id='endtimeclock' class='clockinhiddeninput'>");
            } else {
                $("#newCaseNote").append(
                "<div class='casedropdowncontainer'>" +
                "<div class='casedropdown' id='casenotedate' onClick=popCaseNotesCalendarDateBox('casenotesdateboxnewnote')>" +
                    "<input id='newcasenoteservicedatebox' class='caseservicedateentrynew'>" +
                    "<dateinput id='casenotesdateboxnewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +

                "<div class='casedropdown' id='notestarttime' onClick=popCaseNotesTime('starttimeclock')>" +
                    "<input id='newcasenoteservicestarttimebox' class='caseservicestarttimeentry' >" +
                     "<dateinput id='casenotesstarttimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +
                "<div class='casedropdown' id='noteendtime' onClick=popCaseNotesTime('endtimeclock')>" +
                    "<input id='newcasenoteserviceendtimebox' class='caseservicestarttimeentry' >" +
                     "<dateinput id='casenotesendtimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +
                "<div class='casedropdown' id='cnvendordropdownfilterbox'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnvendorfilterpop'></div>" +
                //Test changes here for new. MAT
                "</div>" + "<div class='casenotedoctime'><label class='doctimelabel'>Doc Time</label><div class='cntimerbuttons'><button id='cnTimerStart' onClick='startCaseNoteTimer()'>Start</button><button id='cnTimerStop' onClick='pauseTimer()'>Stop</button></div><div id='newcasenotestimer'><label id=minutes>0</label></div></div>" +
                "<div id='cntraveltime' class='casenotetraveltime'><div id='cntraveltimelabel'  name='groupnote' value='GroupNote'>Travel (Min)</div><br />" +
                    "<input type='text' onkeypress='return event.charCode >= 48 && event.charCode <= 57' id='cntraveltimetextarea' maxlength='4' onkeyup='toggleSaveButton(); handleChange(this);'/></div>" +
                "<div id='starttimeclock' class='clockinhiddeninput'>" +
                "<div id='endtimeclock' class='clockinhiddeninput'>");
            }
            
        } else {
            $("#newCaseNote").append(
             "<div id='casenotelabelbox2'>" +
             "<p>Service Date:</p>" +
             "<p>Start Time:</p>" +
             "<span id='endreqerror'></span>" +
             "<p>End Time:</p>" +
             "<span id='vendorreqerror'></span>" +
             "<p>Vendor:</p>" +
             "<span id='contactreqerror'></span>" +
             "<p>Contact:</p>" +
            "</div>");

            if ($.session.browser == "Safari") {
                $("#newCaseNote").append(
                "<div class='casedropdowncontainer'>" +
                "<div class='casedropdownsafari' id='casenotedate' onClick=popCaseNotesCalendarDateBox('casenotesdateboxnewnote')>" +
                    "<input id='newcasenoteservicedatebox' class='caseservicedateentrynew'>" +
                    "<dateinput id='casenotesdateboxnewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +

                "<div class='casedropdownsafari' id='notestarttime' onClick=popCaseNotesTime('starttimeclock')>" +
                    "<input id='newcasenoteservicestarttimebox' class='caseservicestarttimeentry' >" +
                     "<dateinput id='casenotesstarttimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +
                "<div class='casedropdownsafari' id='noteendtime' onClick=popCaseNotesTime('endtimeclock')>" +
                    "<input id='newcasenoteserviceendtimebox' class='caseservicestarttimeentry' >" +
                     "<dateinput id='casenotesendtimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +
                "<div class='casedropdownsafari' id='cnvendordropdownfilterbox'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnvendorfilterpop'></div>" +

                "<div class='casedropdownsafari' id='cncontactdropdownfilterbox' onClick='popFilterCNContact()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cncontactfilterpop'></div>" +

                "</div>" + "<div class='casenotedoctime'><label class='doctimelabel'>Doc Time</label><div class='cntimerbuttons'><button id='cnTimerStart' onClick='startCaseNoteTimer()'>Start</button><button id='cnTimerStop' onClick='pauseTimer()'>Stop</button></div><div id='newcasenotestimer'><label id=minutes>0</label></div></div>" +
                "<div id='starttimeclock' class='clockinhiddeninput'>" +
                "<div id='endtimeclock' class='clockinhiddeninput'>");
            } else {
                $("#newCaseNote").append(
                "<div class='casedropdowncontainer'>" +
                "<div class='casedropdown' id='casenotedate' onClick=popCaseNotesCalendarDateBox('casenotesdateboxnewnote')>" +
                    "<input id='newcasenoteservicedatebox' class='caseservicedateentrynew'>" +
                    "<dateinput id='casenotesdateboxnewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +

                "<div class='casedropdown' id='notestarttime' onClick=popCaseNotesTime('starttimeclock')>" +
                    "<input id='newcasenoteservicestarttimebox' class='caseservicestarttimeentry' >" +
                     "<dateinput id='casenotesstarttimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +
                "<div class='casedropdown' id='noteendtime' onClick=popCaseNotesTime('endtimeclock')>" +
                    "<input id='newcasenoteserviceendtimebox' class='caseservicestarttimeentry' >" +
                     "<dateinput id='casenotesendtimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
                "</div>" +
                "<div class='casedropdown' id='cnvendordropdownfilterbox'></div>" +
                "<div class='casenotedropdownfilterpop' id='cnvendorfilterpop'></div>" +

                "<div class='casedropdown' id='cncontactdropdownfilterbox' onClick='popFilterCNContact()'></div>" +
                "<div class='casenotedropdownfilterpop' id='cncontactfilterpop'></div>" +

                "</div>" + "<div class='casenotedoctime'><label class='doctimelabel'>Doc Time</label><div class='cntimerbuttons'><button  id='cnTimerStart' onClick='startCaseNoteTimer()'>Start</button><button  id='cnTimerStop' onClick='pauseTimer()'>Stop</button></div><div id='newcasenotestimer'><label id=minutes>0</label></div></div>" +
                "<div id='starttimeclock' class='clockinhiddeninput'>" +
                "<div id='endtimeclock' class='clockinhiddeninput'>");
            }

        }

        $("#minutes").keydown(function (e) {
            if (e.which == 8 || e.which == 46) return true;
            if ($(this).text().length >= 5) return false;
        });


        var casenotesection = $("<div>");
        casenotesection.append("<span class='casenotetextimage'></span>");

        var casenotetext = $("<textarea>")
        .attr("id", "casenotetext")
        //.keyup(checkForText)
        .focus(textCheck)
        //.change(checkForText)
        .click(function (e) {
            if ($("#mobiledetector").css("display") == "none") {
                var left = $("#newCaseNote").offset().left;
                $("#newCaseNote").addClass("mobile-top").css("left", left);
            }
        })
        .blur(function (e) {
            $("#newCaseNote").removeClass("mobile-top");
        });

        casenotesection.append(casenotetext);
        $("#newCaseNote").append(casenotesection);

        $("#newCaseNote").append("<div id='cnothersettingscontainer'></div>");

        $("#cnothersettingscontainer").append(
            "<div id='cnmileage' class='casenotemileage'><div id='cnmileagelabel' class='cnmileagelabel'>Mileage</div>" +
            "<input type='text' id='cnmileagetextarea' maxlength='9' ></textarea></div>" +
        "<div id='confidentialcheckbox' class='casecheckcontainer'><input type='checkbox' id='confidentialcb' class='casecheckbox' name='confidential' value='Confidential' onChange=toggleSaveButton()><label>Confidential</label><br></div>" +
        "<div id='groupcncheckbox' class='casecheckcontainer'><input type='checkbox' id='groupcasenotecb' class='casecheckbox' name='groupnote' value='GroupNote' onChange=toggleSaveButton()>Group Note<br></div>" 
        );
        $("#newCaseNote").append("<casenotesavebutton id='casenotesavebutton' onClick=beginOverlapCheck()>Save</casenotesavebutton>");
    }
    var amPm = '';
    var currHour = new Date().getHours();
    if (currHour == 00) {
        currHour = 12;
        amPm = 'AM';
    } else if (currHour == 12) {
        currHour = 12;
        amPm = 'PM';
    }else if (currHour > 12) {
        amPm = 'PM';
        currHour = currHour - 12;
    } else {
        amPm = 'AM'
    }
    currHour = addZero(currHour);
    var currMinutes = new Date().getMinutes();
    currMinutes = addZero(currMinutes);
    var currTime = currHour + ':' + currMinutes + ' ' + amPm;
    //if ($.session.anAdmin == 'Y' ) {
    if ($.session.UpdateCaseNotesDocTime == true) {
        $("#minutes").attr("contenteditable", 'true');
        $("#seconds").attr("contenteditable", 'true');
        $("#editcasenotestimer").removeClass("unclickableElement");
    } else {
        $("#minutes").attr("contenteditable", 'false');
        $("#seconds").attr("contenteditable", 'false'); 
        $("#editcasenotestimer").addClass("unclickableElement");
    }
    if ($.session.applicationName == 'Gatekeeper') {
        $("#cnmileagetextarea").keydown(function (e) {
            var key = e.which;
            if (key == 110 || key == 190) return false;
        }).keyup(function (e) {
            var key = e.which;
            if (key == 37 || key == 39) return true;
            var obj = $(this);
            if (obj.val() == "") return obj.val(".00");
            var s = this.selectionStart;
            if (key == 190 || key == 110) {
                setCaretToPos(this, obj.val().indexOf(".") + 1);
                return;
            }
            var tempPos = obj.getCursorPosition();
            obj.val(obj.val().replace(/[^0-9.]/, ""));
            if (obj.val().indexOf(".") == -1) {
                obj.val(obj.val() + ".");
            }
            var vals = obj.val().split(".");
            var isLeftSide = tempPos <= vals[0].length;
            if (isLeftSide) {
                if (vals[0].length <= 5) {
                    this.selectionEnd = s;
                    return;
                }
                vals[0] = vals[0].substr(0, s) + vals[0].substr(s + 1);
                if (vals[0].length > 5) {
                    var extraVals = vals[0].substr(5, 2);
                    if (extraVals.length == 2) {
                        vals[1] = extraVals;
                        s += 2;
                    }
                    else {
                        s++;
                        vals[1] = extraVals + vals[1].substr(1);
                    }
                }
                vals[0] = vals[0].substr(0, 5);
            }
            else {
                if (vals[1] == "") {
                    vals[1] = "00";
                    obj.val(vals.join("."));
                }
                if (vals[1].length <= 2) return;
                var tempS = s;
                s = s - vals[0].length - 1;
                vals[1] = vals[1].substr(0, s) + vals[1].substr(s + 1);
                vals[1] = vals[1].substr(0, 2);
                s = tempS;
            }
            obj.val(vals.join("."));
            this.selectionEnd = s;
        });
    } else if ($.session.applicationName == 'Advisor') {
        $("#cnmileagetextarea").keyup(function () {
            $(this).val($(this).val().replace(/\D/g, '').substr(0, 10));
        })        
    }
    if ($.session.applicationName == 'Advisor') {
        $(".casenotedoctime").hide();
        $('#cnmileagetextarea').css('text-align', 'center');
    }
    $("#newcasenoteservicedatebox").text($.format.date(new Date($.pages.rosterdate), 'MM/dd/yy')).val($.format.date(new Date(), 'MM/dd/yyyy'));
    $("#casenotesdateboxnewnote").text($.format.date(new Date($.pages.rosterdate), 'MM/dd/yy')).val($.format.date(new Date(), 'MMM dd, yyyy'));
    $("#newcasenoteservicestarttimebox").text(currTime).val(currTime);
    $("#casenotesavebutton").css("display", "none");
    $("#casenotesbillerfilterbox").removeClass('unclickableElement');
    $('label').click(function () {
        minutes = $(this).attr('for');
        $('#' + minutes).trigger('click');
        //$('#minutes').html("");
        $.caseNotes.documentTimeSeconds = 0;
    });
    //$('#confidentialcb').attr('onclick', '');
    currentlySelectedConsumers();
    //startCaseNoteTimer("newNote");
}

//Edit existing case note
function loadEditCaseNote(editResponse) {
    $.session.changeFromSingleToGroupNote = false;
    $.session.batchedNoteEdit = false;
    $.session.cnEdit = true;
    $.session.consumersForGroupCounter = 0;
    $.session.groupConsumerCount = 0;
    $("#actioncenter").html("");
    populateDropdownData(editResponse);
    getSelectedConsumerIdForVendowDropDown();
    if ($.session.applicationName == 'Gatekeeper') {
        $("#actioncenter").append(
        "<p id='casenoteerrormessage'></p>" +
        "<div class='casenotenamedetails'></div>" +
        "<div class='groupcasenotenamedetails'></div>" +
        "<div class='groupcasenoteadditionalnamedetails'></div>" +
        "<div id='newCaseNote'>" +
            "<div id='casenotelabelbox'>" +
                "<p>Bill Code:</p>" +
                "<span id='locationreqerror'></span>" +
                "<p>Location:</p>" +
                "<span id='servicereqerror'></span>" +
                "<p>Service:</p>" +
                "<span id='needreqerror'></span>" +
                "<p>Need:</p>" +
                "<span id='contactreqerror'></span>" +
                "<p>Contact:</p>" +
        "</div>");

        if ($.session.browser == "Safari") {
            $("#newCaseNote").append(
            "<div class='casedropdowncontainer'>" +
            "<div class='casedropdownsafari' id='cnbillingcodedropdownfilterbox' onClick='popFilterCNBillingCode()' ></div>" +
            "<div class='casenotedropdownfilterpop' id='cnbillingcodefilterpop'></div>" +
            "<div class='casedropdownsafari' id='cnlocationdropdownfilterbox' onClick='popFilterCNLocation()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnlocationfilterpop'></div>" +
            "<div class='casedropdownsafari' id='cnservicedropdownfilterbox' onClick='popFilterCNService()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnservicefilterpop'></div>" +
            //servicelocation work MAT
            "<div class='casedropdownsafari dynamic' id='cnservicelocationdropdownfilterbox' onClick='popFilterCNServiceLocation()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnservicelocationfilterpop'></div>" +

            "<div class='casedropdownsafari' id='cnneeddropdownfilterbox' onClick='popFilterCNNeed()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnneedfilterpop'></div>" +
            "<div class='casedropdownsafari' id='cncontactdropdownfilterbox' onClick='popFilterCNContact()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cncontactfilterpop'></div>" +
            "</div>");
        } else {
            $("#newCaseNote").append(
            "<div class='casedropdowncontainer'>" +
            "<div class='casedropdown' id='cnbillingcodedropdownfilterbox' onClick='popFilterCNBillingCode()' ></div>" +
            "<div class='casenotedropdownfilterpop' id='cnbillingcodefilterpop'></div>" +
            "<div class='casedropdown' id='cnlocationdropdownfilterbox' onClick='popFilterCNLocation()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnlocationfilterpop'></div>" +
            "<div class='casedropdown' id='cnservicedropdownfilterbox' onClick='popFilterCNService()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnservicefilterpop'></div>" +
            //servicelocation work MAT
            "<div class='casedropdown dynamic' id='cnservicelocationdropdownfilterbox' onClick='popFilterCNServiceLocation()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnservicelocationfilterpop'></div>" +

            "<div class='casedropdown' id='cnneeddropdownfilterbox' onClick='popFilterCNNeed()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnneedfilterpop'></div>" +
            "<div class='casedropdown' id='cncontactdropdownfilterbox' onClick='popFilterCNContact()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cncontactfilterpop'></div>" +
            "</div>");
        }        
    } else {
        $("#actioncenter").append(
        "<p id='casenoteerrormessage'></p>" +
        "<div class='casenotenamedetails'></div>" +
        "<div class='groupcasenotenamedetails'></div>" +
        "<div class='groupcasenoteadditionalnamedetails'></div>" +
        "<div id='newCaseNote'>" +
            "<div id='casenotelabelbox'>" +
                "<p>Serv. Code:</p>" +
                "<span id='locationreqerror'></span>" +
                "<p>Location:</p>" +
                "<span id='servicereqerror'></span>" +
                "<p>Service:</p>" +
                "<p class='dynamic'>Serv. Loc:</p>" +
                "<span id='needreqerror'></span>" +
                "<p>Need:</p>" +
        "</div>");

        if ($.session.browser == "Safari") {
            $("#newCaseNote").append(
            "<div class='casedropdowncontainer'>" +
            "<div class='casedropdownsafari' id='cnbillingcodedropdownfilterbox' onClick='popFilterCNBillingCode()' ></div>" +
            "<div class='casenotedropdownfilterpop' id='cnbillingcodefilterpop'></div>" +
            "<div class='casedropdownsafari' id='cnlocationdropdownfilterbox' onClick='popFilterCNLocation()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnlocationfilterpop'></div>" +
            "<div class='casedropdownsafari' id='cnservicedropdownfilterbox' onClick='popFilterCNService()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnservicefilterpop'></div>" +
            //servicelocation work MAT
            "<div class='casedropdownsafari dynamic' id='cnservicelocationdropdownfilterbox' onClick='popFilterCNServiceLocation()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnservicelocationfilterpop'></div>" +
            "<div class='casedropdownsafari' id='cnneeddropdownfilterbox' onClick='popFilterCNNeed()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnneedfilterpop'></div>" +
            "</div>");
        } else {
            $("#newCaseNote").append(
            "<div class='casedropdowncontainer'>" +
            "<div class='casedropdown' id='cnbillingcodedropdownfilterbox' onClick='popFilterCNBillingCode()' ></div>" +
            "<div class='casenotedropdownfilterpop' id='cnbillingcodefilterpop'></div>" +
            "<div class='casedropdown' id='cnlocationdropdownfilterbox' onClick='popFilterCNLocation()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnlocationfilterpop'></div>" +
            "<div class='casedropdown' id='cnservicedropdownfilterbox' onClick='popFilterCNService()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnservicefilterpop'></div>" +
            //servicelocation work MAT
            "<div class='casedropdown dynamic' id='cnservicelocationdropdownfilterbox' onClick='popFilterCNServiceLocation()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnservicelocationfilterpop'></div>" +
            "<div class='casedropdown' id='cnneeddropdownfilterbox' onClick='popFilterCNNeed()'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnneedfilterpop'></div>" +
            "</div>");
        }
        
    }   

    if ($.session.applicationName == 'Gatekeeper') {
        $("#newCaseNote").append(
            "<div id='casenotelabelbox2'>" +
            "<p>Service Date:</p>" +
            "<p>Start Time:</p>" +
            "<span id='endreqerror'></span>" +
            "<p>End Time:</p>" +
            "<span id='vendorreqerror'></span>" +
            "<p>Vendor:</p>" +
            "</div>");

        if ($.session.browser == "Safari") {
            $("#newCaseNote").append(
            "<div class='casedropdowncontainer'>" +
            "<div class='casedropdownsafari' id='casenotedate' onClick=popCaseNotesCalendarDateBox('casenotesdateboxnewnote')>" +
                "<input id='newcasenoteservicedatebox' class='caseservicedateentrynew'>" +
                "<dateinput id='casenotesdateboxnewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +

            "<div class='casedropdownsafari' id='notestarttime' onClick=popCaseNotesTime('starttimeclock')>" +
                "<input id='newcasenoteservicestarttimebox' class='caseservicestarttimeentry' >" +
                    "<dateinput id='casenotesstarttimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +
            "<div class='casedropdownsafari' id='noteendtime' onClick=popCaseNotesTime('endtimeclock')>" +
                "<input id='newcasenoteserviceendtimebox' class='caseservicestarttimeentry' >" +
                    "<dateinput id='casenotesendtimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +
            "<div class='casedropdownsafari' id='cnvendordropdownfilterbox'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnvendorfilterpop'></div>" +
            "</div>" + "<div class='casenotedoctime'><label class='doctimelabel'>Doc Time</label><div class='cntimerbuttons'><button id='cnTimerStart' onClick='startCaseNoteTimer(); toggleSaveButton();'>Start</button><button id='cnTimerStop' onClick='pauseTimer()'>Stop</button></div><div id='editcasenotestimer' onClick='toggleSaveButton()'><label id=minutes onChange='toggleSaveButton()'>0</label></div></div>" +
            "<div id='cntraveltime' class='casenotetraveltime'><div id='cntraveltimelabel'  name='groupnote' value='GroupNote'>Travel (Min)</div><br />" +
                "<input type='text' onkeypress='return event.charCode >= 48 && event.charCode <= 57' id='cntraveltimetextarea' maxlength='4' onkeyup='toggleSaveButton(); handleChange(this);'/></div>" +
            "<div id='starttimeclock' class='clockinhiddeninput'>" +
            "<div id='endtimeclock' class='clockinhiddeninput'>");
        } else {
            $("#newCaseNote").append(
            "<div class='casedropdowncontainer'>" +
            "<div class='casedropdown' id='casenotedate' onClick=popCaseNotesCalendarDateBox('casenotesdateboxnewnote')>" +
                "<input id='newcasenoteservicedatebox' class='caseservicedateentrynew'>" +
                "<dateinput id='casenotesdateboxnewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +

            "<div class='casedropdown' id='notestarttime' onClick=popCaseNotesTime('starttimeclock')>" +
                "<input id='newcasenoteservicestarttimebox' class='caseservicestarttimeentry' >" +
                    "<dateinput id='casenotesstarttimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +
            "<div class='casedropdown' id='noteendtime' onClick=popCaseNotesTime('endtimeclock')>" +
                "<input id='newcasenoteserviceendtimebox' class='caseservicestarttimeentry' >" +
                    "<dateinput id='casenotesendtimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +
            "<div class='casedropdown' id='cnvendordropdownfilterbox'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnvendorfilterpop'></div>" +
            "</div>" + "<div class='casenotedoctime'><label class='doctimelabel'>Doc Time</label><div class='cntimerbuttons'><button id='cnTimerStart' onClick='startCaseNoteTimer(); toggleSaveButton();'>Start</button><button id='cnTimerStop' onClick='pauseTimer()'>Stop</button></div><div id='editcasenotestimer' onClick='toggleSaveButton()'><label id=minutes onChange='toggleSaveButton()'>0</label></div></div>" +
            "<div id='cntraveltime' class='casenotetraveltime'><div id='cntraveltimelabel'  name='groupnote' value='GroupNote'>Travel (Min)</div><br />" +
                "<input type='text' onkeypress='return event.charCode >= 48 && event.charCode <= 57' id='cntraveltimetextarea' maxlength='4' onkeyup='toggleSaveButton(); handleChange(this);'/></div>" +
            "<div id='starttimeclock' class='clockinhiddeninput'>" +
            "<div id='endtimeclock' class='clockinhiddeninput'>");
        }
        
    } else {
        $("#newCaseNote").append(
            "<div id='casenotelabelbox2'>" +
            "<p>Service Date:</p>" +
            "<p>Start Time:</p>" +
            "<span id='endreqerror'></span>" +
            "<p>End Time:</p>" +
            "<span id='vendorreqerror'></span>" +
            "<p>Vendor:</p>" +
            "<span id='contactreqerror'></span>" +
            "<p>Contact:</p>" +
            "</div>");

        if ($.session.browser == "Safari") {
            $("#newCaseNote").append(
            "<div class='casedropdowncontainer'>" +
            "<div class='casedropdownsafari' id='casenotedate' onClick=popCaseNotesCalendarDateBox('casenotesdateboxnewnote')>" +
                "<input id='newcasenoteservicedatebox' class='caseservicedateentrynew'>" +
                "<dateinput id='casenotesdateboxnewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +

            "<div class='casedropdownsafari' id='notestarttime' onClick=popCaseNotesTime('starttimeclock')>" +
                "<input id='newcasenoteservicestarttimebox' class='caseservicestarttimeentry' >" +
                    "<dateinput id='casenotesstarttimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +
            "<div class='casedropdownsafari' id='noteendtime' onClick=popCaseNotesTime('endtimeclock')>" +
                "<input id='newcasenoteserviceendtimebox' class='caseservicestarttimeentry' >" +
                    "<dateinput id='casenotesendtimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +
            "<div class='casedropdownsafari' id='cnvendordropdownfilterbox'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnvendorfilterpop'></div>" +

             "<div class='casedropdownsafari' id='cncontactdropdownfilterbox' onClick='popFilterCNContact()'></div>" +
              "<div class='casenotedropdownfilterpop' id='cncontactfilterpop'></div>" +
            "</div>" + "<div class='casenotedoctime'><label class='doctimelabel'>Doc Time</label><div class='cntimerbuttons'><button  id='cnTimerStart' onClick='startCaseNoteTimer(); toggleSaveButton();'>Start</button><button id='cnTimerStop' onClick='pauseTimer()'>Stop</button></div><div id='editcasenotestimer' onClick='toggleSaveButton()'><label id=minutes onChange='toggleSaveButton()'>0</label></div></div>" +
            "<div id='starttimeclock' class='clockinhiddeninput'>" +
            "<div id='endtimeclock' class='clockinhiddeninput'>");
        } else {
            $("#newCaseNote").append(
            "<div class='casedropdowncontainer'>" +
            "<div class='casedropdown' id='casenotedate' onClick=popCaseNotesCalendarDateBox('casenotesdateboxnewnote')>" +
                "<input id='newcasenoteservicedatebox' class='caseservicedateentrynew'>" +
                "<dateinput id='casenotesdateboxnewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +

            "<div class='casedropdown' id='notestarttime' onClick=popCaseNotesTime('starttimeclock')>" +
                "<input id='newcasenoteservicestarttimebox' class='caseservicestarttimeentry' >" +
                    "<dateinput id='casenotesstarttimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +
            "<div class='casedropdown' id='noteendtime' onClick=popCaseNotesTime('endtimeclock')>" +
                "<input id='newcasenoteserviceendtimebox' class='caseservicestarttimeentry' >" +
                    "<dateinput id='casenotesendtimenewnote' class='casenotesdatebox'><input id='goalsdatebox' class='headertext'></input></dateinput>" +
            "</div>" +
            "<div class='casedropdown' id='cnvendordropdownfilterbox'></div>" +
            "<div class='casenotedropdownfilterpop' id='cnvendorfilterpop'></div>" +

             "<div class='casedropdown' id='cncontactdropdownfilterbox' onClick='popFilterCNContact()'></div>" +
              "<div class='casenotedropdownfilterpop' id='cncontactfilterpop'></div>" +
            "</div>" + "<div class='casenotedoctime'><label class='doctimelabel'>Doc Time</label><div class='cntimerbuttons'><button id='cnTimerStart' onClick='startCaseNoteTimer(); toggleSaveButton();'>Start</button><button id='cnTimerStop' onClick='pauseTimer()'>Stop</button></div><div id='editcasenotestimer' onClick='toggleSaveButton()'><label id=minutes onChange='toggleSaveButton()'>0</label></div></div>" +
            "<div id='starttimeclock' class='clockinhiddeninput'>" +
            "<div id='endtimeclock' class='clockinhiddeninput'>");
        }

    }

    $("#minutes").keydown(function (e) {
        if (e.which == 8 || e.which == 46) return true;
        if ($(this).text().length >= 5) return false;
    });

    var casenotesection = $("<div>");
    casenotesection.append("<span class='casenotetextimage'></span>");
    
    var casenotetext = $("<textarea>")
        .attr("id", "casenotetext")
        //.keyup(checkForText)
        .focus(textCheck)
        //.change(checkForText)
        .click(function (e) {
            if ($("#mobiledetector").css("display") == "none") {
                //                $("#newCaseNote").addClass("mobile-top");
                var left = $("#newCaseNote").offset().left;
                $("#newCaseNote").addClass("mobile-top").css("left", left);
            }
        })
        .blur(function (e) {
            $("#newCaseNote").removeClass("mobile-top");
        });

    casenotesection.append(casenotetext);
    $("#newCaseNote").append(casenotesection).append("<div id='cnothersettingscontainer'></div>");

    $("#cnothersettingscontainer").append(
        "<div id='cnmileage' class='casenotemileage'><div id='cnmileagelabel' class='cnmileagelabel'>Mileage</div>" +
            "<input type='text' onkeyup=toggleSaveButton() maxlength='9' id='cnmileagetextarea'></textarea></div>" +
    "<div id='confidentialcheckbox' class='casecheckcontainer'><input type='checkbox' id='confidentialcb' class='casecheckbox' name='confidential' value='Confidential' onChange=toggleSaveButton()><label>Confidential</label><br></div>" +
    "<div id='batchedcheckbox' class='casecheckcontainer'><input type='checkbox' disabled readonly id='batchedcb' class='casecheckbox' name='batched' value='Batched'>Batched<br></div>" +
    "<div id='groupcncheckbox' class='casecheckcontainer'><input type='checkbox' id='groupcasenotecb' class='casecheckbox' name='groupnote' value='GroupNote' onChange=toggleSaveButton()>Group Note<br></div>"
    );
    //if ($.session.applicationName == 'Gatekeeper') {
    //    $("#cnothersettingscontainer").append(
    //    "<div id='cntraveltime' class='casenotetraveltime'><div id='cntraveltimelabel'  name='groupnote' value='GroupNote'>Travel (Min)</div><br />" +
    //            "<textarea input type='number' id='cntraveltimetextarea' maxlength='6'></textarea></div>");
    //}
    //$("#newCaseNote").append("<casenotesavebutton id='casenotesavebutton' onClick=saveCaseNote()>Save</casenotesavebutton>");
    $("#newCaseNote").append("<casenotesavebutton id='casenotesavebutton' onClick=beginOverlapCheck()>Save</casenotesavebutton>");
    $("#newCaseNote").append("<casenotedeletebutton id='casenotedeletebutton' onClick=deleteCaseNote()>Delete</casenotedeletebutton>");

    if ($.session.CaseNotesUpdate == true) {
        $("#casenotesavebutton").addClass("casenoteeditenabledtwo");
        $("#casenotedeletebutton").addClass("casenoteeditenabledtwo");
    }


    var amPm = '';
    var currHour = new Date().getHours();
    if (currHour > 12) {
        amPm = 'PM';
        currHour = currHour - 12;
    } else {
        amPm = 'AM'
    }
    var currMinutes = new Date().getMinutes();
    var currTime = currHour + ':' + currMinutes + ' ' + amPm;
    if ($.session.UpdateCaseNotesDocTime == true) {
        $("#minutes").attr("contenteditable", 'true');
        $("#seconds").attr("contenteditable", 'true');
        $("#editcasenotestimer").removeClass("unclickableElement");
    } else {
        $("#minutes").attr("contenteditable", 'false');
        $("#seconds").attr("contenteditable", 'false');
        $("#editcasenotestimer").addClass("unclickableElement");
    }
    if ($.session.applicationName == 'Gatekeeper') {
        
        $("#cnmileagetextarea").keydown(function (e) {
            var key = e.which;
            if (key == 110 || key == 190) return false;
        }).keyup(function (e) {
            var key = e.which;
            if (key == 37 || key == 39) return true;
            var obj = $(this);
            if (obj.val() == "") return obj.val(".00");
            var s = this.selectionStart;
            if (key == 190 || key == 110) {
                setCaretToPos(this, obj.val().indexOf(".") + 1);
                return;
            }
            var tempPos = obj.getCursorPosition();
            obj.val(obj.val().replace(/[^0-9.]/, ""));
            if (obj.val().indexOf(".") == -1) {
                obj.val(obj.val() + ".");
            }
            var vals = obj.val().split(".");
            var isLeftSide = tempPos <= vals[0].length;
            if (isLeftSide) {
                if (vals[0].length <= 5) {
                    this.selectionEnd = s;
                    return;
                }
                vals[0] = vals[0].substr(0, s) + vals[0].substr(s + 1);
                if (vals[0].length > 5) {
                    var extraVals = vals[0].substr(5, 2);
                    if (extraVals.length == 2) {
                        vals[1] = extraVals;
                        s += 2;
                    }
                    else {
                        s++;
                        vals[1] = extraVals + vals[1].substr(1);
                    }
                }
                vals[0] = vals[0].substr(0, 5);
            }
            else {
                if (vals[1] == "") {
                    vals[1] = "00";
                    obj.val(vals.join("."));
                }
                if (vals[1].length <= 2) return;
                var tempS = s;
                s = s - vals[0].length - 1;
                vals[1] = vals[1].substr(0, s) + vals[1].substr(s + 1);
                vals[1] = vals[1].substr(0, 2);
                s = tempS;
            }
            obj.val(vals.join("."));
            this.selectionEnd = s;
        });
    } else if ($.session.applicationName == 'Advisor') {
        $("#cnmileagetextarea").keyup(function () {
            $(this).val($(this).val().replace(/\D/g, '').substr(0, 10));
        })
    }
    if ($.session.applicationName == 'Advisor') {
        $(".casenotedoctime").hide();
        $('#cnmileagetextarea').css('text-align', 'center');
    }
    $("#newcasenoteservicedatebox").text($.format.date(new Date($.pages.rosterdate), 'MM/dd/yy')).val($.format.date(new Date(), 'MM/dd/yyyy'));
    $("#casenotesdateboxnewnote").text($.format.date(new Date($.pages.rosterdate), 'MM/dd/yy')).val($.format.date(new Date(), 'MMM dd, yyyy'));
    $("#newcasenoteservicestarttimebox").text(currTime).val(currTime);
    $("#editnote").css('display', 'none');
    $("#editnotedescription").css('display', 'none');
    $("#casenotesbillerfilterbox").addClass('unclickableElement');
    $('label').click(function () {
        minutes = $(this).attr('for');
        $('#' + minutes).trigger('click');
        //$('#minutes').html("");
        $.caseNotes.documentTimeSeconds = 0;
        toggleSaveButton();
    });
    //$.session.cnEdit = false;
}