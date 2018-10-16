//Returns filtered list of case notes
function getFilteredCaseNotesList(billerId, selectedRosterUserId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd, consumerCount) {

    if (billerId == '000' || billerId == '0') {
        billerId = '%';
    }
    var listComplete = false;
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/caseNotesFilteredSearch/",
        data: '{"token":"' + $.session.Token + '", "billerId":"' + billerId + '", "selectedRosterUserId":"' + selectedRosterUserId +
            '", "serviceStartDate":"' + serviceStartDate + '", "serviceEndDate":"' + serviceEndDate + '", "dateEnteredStart":"' + dateEnteredStart + '", "dateEnteredEnd":"' + dateEnteredEnd + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            createCaseNotesListTable(res);
            listComplete = true;
            $.session.caseNoteListResponse = res;
            $("*").removeClass("waitingCursor");
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Gets the information for the drop downs of case notes
function populateDropdownData(editResponse) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/populateDropdownData/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            assignDropdownData(res, editResponse);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Gets the vendors for the vendor drop down. Did not put with other drop down ajax call because this is consumer specific.
function getConsumerSpecificVendors(consumerId) {
    if (consumerId == '' || consumerId == undefined) {
        consumerId = $.session.caseNoteConsumerId;
    }
    var serviceDate = $('#newcasenoteservicedatebox').val();
    if (serviceDate == '' || serviceDate == undefined) {
        var newDate = new Date();
        serviceDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    } else {
        var newDate = new Date(serviceDate);
        serviceDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getConsumerSpecificVendors/",
        data: '{"token":"' + $.session.Token + '", "consumerId":"' + consumerId + '", "serviceDate":"' + serviceDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            assignVendorDropDownData(res);
            $("*").removeClass("waitingCursor");
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Saves the new value for case notes review days
function updateCaseNotesReviewDays(updatedReviewDays) {
    var defaultReviewDays = "";
    if (updatedReviewDays === undefined) {
        defaultReviewDays = $("#casenotesdaysback").val();
        updatedReviewDays = $("#casenotesdaysback").val();
    } else {
        defaultReviewDays = updatedReviewDays;
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateCaseNotesReviewDays/",
        data: '{"token":"' + $.session.Token + '", "updatedReviewDays":"' + updatedReviewDays + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $.session.defaultCaseNoteReviewDays = defaultReviewDays;
            if ($.loadedApp == 'casenotes') {
                convertDaysBackForCaseNoteLoadFilter(defaultReviewDays);
                loadApp('casenotes');
                //$("#daysbacklabel").text("last " + $.session.defaultCaseNoteReviewDays + " days back for " + $.caseNotes.billerName);
            }            
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Gets list of billers for drop down
function getBillersListForDropDown() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getBillersListForDropDown/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            var allString = '<biller><billerId>000</billerId><billerName>All</billerName></biller>';
            res = res.slice(0, 45) + allString + res.slice(45);
            createBillerDropdown(res);
            if ($.session.CaseNotesCaseloadRestriction == false) {
                convertDaysBackForCaseNoteLoadFilter($.session.defaultCaseNoteReviewDays);
            }            
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getReviewRequiredForCaseManager(caseManagerId) {// Also get default billing/service code. Needs renamed at some point
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getReviewRequiredForCaseManager/",
        data: '{"token":"' + $.session.Token + '", "caseManagerId":"' + caseManagerId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            setReviewRequired(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Save single new case note. May not need the vendor, they are still working out details
function saveSingleCaseNote(noteId, caseManagerId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, reviewRequired, confidential, caseNote, casenotemileage, casenotetraveltime, documentationTime) {
    if (casenotetraveltime == undefined) {
        casenotetraveltime = "";
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/saveCaseNote/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '","caseManagerId":"' + caseManagerId +
            '", "consumerId":"' + consumerId + '", "serviceOrBillingCodeId":"' + serviceOrBillingCodeId +
            '", "locationCode":"' + locationCode + '", "serviceCode":"' + serviceCode + '", "needCode":"' +
            needCode + '", "serviceDate":"' + serviceDate + '", "startTime":"' +
            startTime + '", "endTime":"' + endTime +
            '", "vendorId":"' + vendorId + '", "contactCode":"' + contactCode + '", "serviceLocationCode":"' + serviceLocationCode + '", "caseNote":"' + caseNote + '", "reviewRequired":"' + reviewRequired +
            '", "confidential":"' + confidential + '", "casenotemileage":"' + casenotemileage + '", "casenotetraveltime":"' + casenotetraveltime + '", "documentationTime":"' + documentationTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (res.indexOf('567') > -1) {
                $("#casenoteerrormessage").text('Start time overlap error.')
            } else if (res.indexOf('568') > -1) {
                $("#casenoteerrormessage").text('End time overlap error.')
            } else {
                $(".consumerselected").removeClass("highlightselected");
                //$.session.overlapScreenLock = true;
                //loadApp('casenotes');
                if ($.session.overlapScreenLock != true) {
                    $.session.overlapScreenLock = true;
                    loadApp('casenotes');
                }
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function saveAdditionalGroupCaseNote(noteId, groupNoteId, caseManagerId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, reviewRequired, confidential, caseNote, casenotemileage, casenotetraveltime, documentationTime) {
    if (casenotetraveltime == undefined) {
        casenotetraveltime = "";
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/saveAdditionalGroupCaseNote/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '","groupNoteId":"' + groupNoteId + '","caseManagerId":"' + caseManagerId +
            '", "consumerId":"' + consumerId + '", "serviceOrBillingCodeId":"' + serviceOrBillingCodeId +
            '", "locationCode":"' + locationCode + '", "serviceCode":"' + serviceCode + '", "needCode":"' +
            needCode + '", "serviceDate":"' + serviceDate + '", "startTime":"' +
            startTime + '", "endTime":"' + endTime +
            '", "vendorId":"' + vendorId + '", "contactCode":"' + contactCode + '", "serviceLocationCode":"' + serviceLocationCode + '", "reviewRequired":"' + reviewRequired + '", "confidential":"' + confidential +
            '", "caseNote":"' + caseNote + '", "casenotemileage":"' + casenotemileage + '", "casenotetraveltime":"' + casenotetraveltime + '", "documentationTime":"' + documentationTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //$(".consumerselected").removeClass("highlightselected");
            //loadApp('casenotes');
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function updateGroupNoteValuesAndDropDowns(groupNoteId, noteId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, contactCode, serviceDate, startTime, endTime) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateGroupNoteValuesAndDropdowns/",
        data: '{"token":"' + $.session.Token + '", "groupNoteId":"' + groupNoteId + '", "noteId":"' + noteId + '", "serviceOrBillingCodeId":"' + serviceOrBillingCodeId +
            '", "locationCode":"' + locationCode + '", "serviceCode":"' + serviceCode +
            '", "needCode":"' + needCode + '", "contactCode":"' + contactCode +
            '","serviceDate":"' + serviceDate + '", "startTime":"' + startTime + '", "endTime":"' + endTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $(".consumerselected").removeClass("highlightselected");
            if ($.session.overlapScreenLock != true) {
                $.session.overlapScreenLock = true;
                loadApp('casenotes');
            }
            //loadApp('casenotes');
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function updateGroupNoteValues(groupNoteId, noteId, serviceOrBillingCodeId, serviceDate, startTime, endTime) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateGroupNoteValues/",
        data: '{"token":"' + $.session.Token + '", "groupNoteId":"' + groupNoteId + '", "noteId":"' + noteId + '", "serviceOrBillingCodeId":"' + serviceOrBillingCodeId +
            '","serviceDate":"' + serviceDate + '", "startTime":"' + startTime + '", "endTime":"' + endTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $(".consumerselected").removeClass("highlightselected");
            if ($.session.overlapScreenLock != true) {
                $.session.overlapScreenLock = true;
                loadApp('casenotes');
            }
            
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Save new group case note. Made its own function to make easier to debug and also to have less conditions in stored procedure
function saveGroupCaseNote(noteId, groupNoteId, caseManagerId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, reviewRequired, confidential, caseNote, consumerGroupCount, casenotemileage, casenotetraveltime, documentationTime) {
    if (casenotetraveltime == undefined) {
        casenotetraveltime = "";
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/saveGroupCaseNote/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '","groupNoteId":"' + groupNoteId + '","caseManagerId":"' + caseManagerId +
            '", "consumerId":"' + consumerId + '", "serviceOrBillingCodeId":"' + serviceOrBillingCodeId +
            '", "locationCode":"' + locationCode + '", "serviceCode":"' + serviceCode + '", "needCode":"' +
            needCode + '", "serviceDate":"' + serviceDate + '", "startTime":"' +
            startTime + '", "endTime":"' + endTime +
            '", "vendorId":"' + vendorId + '", "contactCode":"' + contactCode + '", "serviceLocationCode":"' + serviceLocationCode + '", "caseNote":"' + caseNote + '", "reviewRequired":"' + reviewRequired + '", "confidential":"' + confidential +
            '", "consumerGroupCount":"' + consumerGroupCount + '", "casenotemileage":"' + casenotemileage + '", "casenotetraveltime":"' + casenotetraveltime + '", "documentationTime":"' + documentationTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $(".consumerselected").removeClass("highlightselected");
            if ($.session.groupSaveCounter == $.session.consumerGroupCount) {
                loadApp('casenotes');
            }
            $.session.groupSaveCounter++;
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function deleteExistingCaseNote(noteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/deleteExistingCaseNote/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            loadApp('casenotes');
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function deleteExistingCaseNoteTwo(noteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/deleteExistingCaseNote/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Gets case note to edit. 
function getCaseNoteEdit(noteId, consumerId, groupNoteId) {
    $.session.consumerIdToEdit = consumerId;
    $.session.caseNoteEdit = true;
    $.session.overlapScreenLock = false;
    $.session.editCaseNoteId = noteId;
    $("#actioncenter").html("");
    //loadEditCaseNote();
    $("*").addClass("waitingCursor");
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getCaseNoteEdit/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //loadEditCaseNote();
            var res = JSON.stringify(response);
            if (groupNoteId != '') {
                getFuckingPainInTheAssMileage(groupNoteId);
            }
            loadEditCaseNote(res);
            //assignCaseNoteEditData(res);
            $.session.caseNoteEditSecond = true;
            $("*").removeClass("waitingCursor");
        },
        error: function (xhr, status, error) {
           //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Gets information for dynamic dropdown of service location
//which is only rendered if the service has funding checked yes
function getServiceLocationsForCaseNoteDropDown() {
    var serviceDate = $('#newcasenoteservicedatebox').val();
    var newDate = new Date(serviceDate);
    serviceDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    var consumerId = $('.highlightselected').attr('id');
    if (consumerId == '' || consumerId == undefined) {
        consumerId = $.session.consumerIdToEdit;
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getServiceLocationsForCaseNoteDropDown/",
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + serviceDate + '", "consumerId":"' + consumerId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            createServiceLocationDropdown(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getCaseLoadRestriction() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getCaseLoadRestriction/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            getCaseLoadNamesAndIds(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getCaseLoadNamesAndIds(res) {
    var consumerId = '',
        consumerFirstName = '',
        consumerLastName = '';
    $.session.consumerIdArray = [];
    
    $('results', res).each(function () {
        consumerId = $('id', this).text();
        consumerFirstName = $('FN', this).text();
        consumerLastName = $('LN', this).text();
        $.session.consumerIdArray.push(consumerId);
    });
    if ($.session.consumerIdArray.length < 1) {
        createCaseNotesListTable(res);
        noCaseLoadUnclickable();
    } else {
        convertDaysBackForCaseNoteLoadFilter($.session.defaultCaseNoteReviewDays);
    }
    
}

//Gets the group note id for inserting new group notes
function getGroupNoteId() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getGroupNoteId/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            setGroupIdForSaving(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Get group notes names for display
function getGroupNoteNames(groupNoteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getGroupNoteNames/",
        data: '{"token":"' + $.session.Token + '", "groupNoteId":"' + groupNoteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            setConsumerNamesToScreen(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Time overlap check for group notes
function caseNoteOverlapCheck(consumerId, startTime, endTime, serviceDate, caseManagerId, noteId, groupNoteId) {
    if (noteId == undefined || noteId == '') {
        noteId = 0;
    }
    if (groupNoteId == undefined || groupNoteId == '') {
        groupNoteId = 0;
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/caseNoteOverlapCheck/",
        data: '{"token":"' + $.session.Token + '", "consumerId":"' + consumerId + '", "startTime":"' + startTime + '", "endTime":"' + endTime + '", "serviceDate":"' + serviceDate + '", "caseManagerId":"' + caseManagerId + '", "noteId":"' + noteId + '", "groupNoteId":"' + groupNoteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //manageOverlapInfo(res);
            
            if ($.session.groupConsumerCount == 1 || $.session.groupOverlapCheckCounter == $.session.groupConsumerCount) {
                saveCaseNote();
            }
            manageOverlapInfo(res);
            $.session.groupOverlapCheckCounter++;
            //$.session.editCaseNoteId = '';
        }, 
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function manageOverlapInfo(res) {
    var tmpConsumerName = '';
    var tmpServiceDate = '';
    var tmpStartTime = '';
    var tmpBillingServiceName = '';
    $('results', res).each(function () {
        tmpConsumerName = $('consumername', this).text();
        tmpServiceDate = $('servicedate', this).text();
        tmpServiceDate = formatDateGFromDB(tmpServiceDate);
        tmpStartTime = $('starttime', this).text();
        tmpStartTime = formatTimeFromDB(tmpStartTime);
        tmpBillingServiceName = $('billingservicename', this).text();
        tmpNoteId = $('casenoteid', this).text();
        $.session.overlapNoteIds.push(tmpNoteId);
        $.session.timeOverlapConsumers.push(tmpConsumerName + ', ' + tmpBillingServiceName + ', ' + tmpServiceDate + ' - ' + tmpStartTime);
    });    
}

function getConsumersThatCanHaveMileageAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getConsumersThatCanHaveMileage/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getFuckingPainInTheAssMileage(groupNoteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getGroupNoteMaxMileage/",
        data: '{"token":"' + $.session.Token + '", "groupNoteId":"' + groupNoteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            setMaxMileage(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getDocTimeEditPermissionAjax(peopleId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getDocTimeEditPermission/",
        data: '{"token":"' + $.session.Token + '", "peopleId":"' + peopleId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if ((res.indexOf('<window_name>UpdateDocTime</window_name><permission>Update Doc Time</permission>') > -1) || (res.indexOf('<window_name>Anywhere Case Notes</window_name><permission>Update Doc Time</permission>') > -1)) {
                $.session.UpdateCaseNotesDocTime = true;
            } else {
                $.session.UpdateCaseNotesDocTime = false;
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function clearTravelTimeOnChangeAjax(noteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/clearTravelTimeOnChange/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}