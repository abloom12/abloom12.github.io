function getEnabledConsumersForWorkshopAjax() {
    var selectedDate = $("#workshopdateboxinside").html();
    selectedDate = formatDateForDatabaseSave(selectedDate);
    var selectedLocation = $("#workshoplocationname").attr("locationid");
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getEnabledConsumersForWorkshop/",
        data: '{"token":"' + $.session.Token + '", "selectedDate":"' + selectedDate + '", "selectedLocation":"' + selectedLocation + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.parse(response.getEnabledConsumersForWorkshopResult);
            disableNonWorkshopConsumers(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function WorkshopPreBatchLoad(callback) {
    var newDate = new Date();
    absenceDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    $.session.workshopBatchId = "";
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/WorkshopPreBatchLoad/",
        //data: JSON.stringify(data),
        data: '{"token":"' + $.session.Token + '", "absenceDate":"' + absenceDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //try {
                //callback(null, response.WorkshopPreBatchLoadResult);
                data = response.WorkshopPreBatchLoadResult;
                if (data.length > 1) {
                    displaySelectBatch(data, callback);
                } else if (data.length == 1) {
                    $.session.workshopBatchId = data[0].id;
                    callback(data);
                } else {
                    displayNoBatch();
                    $("#roostertoolbar").hide();
                    $("*").removeClass("waitingCursor");
                    data = null;
                    callback(data);
                }                
            //}
            //catch (e) {
            //    callback(e, null);
            //}
            
        },
        error: function (xhr, status, error) {
            callback(error, null);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

//Call to popuate list based on drop down values
function getWorkshopBatchById(data, callback) {
    callback();
}

function WorkshopLocations(data, callback) {
    var selectedDate = $("#workshopdateboxinside").html();
    //selectedDate = formatDateForDatabaseSave(selectedDate);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/WorkshopLocations/",
        //data: JSON.stringify(data),
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + selectedDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                //callback(null, response.WorkshopLocationsResult);
                data = response.WorkshopLocationsResult;
                populateLocations(null, data);
            }
            catch (e) {
                //callback(e, null);
            }

        },
        error: function (xhr, status, error) {
            //callback(error, null);
            alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function WorkshopGetSupervisorsAjax() {
    var selectedDate = $("#workshopdateboxinside").html();
    //selectedDate = formatDateForDatabaseSave(selectedDate);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getWorkshopSupervisors/",
        //data: JSON.stringify(data),
        data: '{"token":"' + $.session.Token + '", "selectedDate":"' + selectedDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                data = response.getWorkshopSupervisorsResult;
                populateSupervisors(null, data);
            }
            catch (e) {
                //callback(e, null);
            }

        },
        error: function (xhr, status, error) {
            //callback(error, null);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}  

function WorkshopGetJobCodeAjax() {
    var selectedDate = $("#workshopdateboxinside").html();
    var location = $("#workshoplocationname").attr("locationid");
    queryData = {
        token: $.session.Token,
        selectedDate: selectedDate,
        location: location
    };
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getWorkshopJobCode/",
        data: JSON.stringify(queryData),
        //data: '{"token":"' + $.session.Token + '", "selectedDate":"' + selectedDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                //callback(null, response.WorkshopLocationsResult);
                data = response.getWorkshopJobCodeResult;
                populateWorkCodes(null, data);
            }
            catch (e) {
                //callback(e, null);
            }

        },
        error: function (xhr, status, error) {
            //callback(error, null);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

//Filter call. Send to DB when values change out of one of the drop downs
function WorkshopFilterListAjax(data, overlapData) {    
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getWorkshopFilterListData/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                data = response.getWorkshopFilterListDataResult;
                preFilterListDataSetup(null, data, overlapData);
            }
            catch (e) {
                // callback(e, null); // callback is undefined
                console.log(e);
            }

        },
        error: function (xhr, status, error) {            
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function WorkshopClockInAjax(data) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/GetWorkshopOverlaps/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {                
                data = response.GetWorkshopOverlapsResult;                
                filterSetup(data);
            }
            catch (e) {
                callback(e, null);
            }

        },
        error: function (xhr, status, error) {
            alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function WorkshopClockOutAjax(data) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/GetWorkshopOverlaps/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                data = response.GetWorkshopOverlapsResult;
                filterSetup(data);
            }
            catch (e) {
                callback(e, null);
            }

        },
        error: function (xhr, status, error) {
            alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function updateWorkshopClockInAjax(updateClockInData) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/UpdateWorkshopClockIn/",
        data: JSON.stringify(updateClockInData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = JSON.stringify(response);
                if (res.indexOf('Start Overlap') != -1) {// == '"[{"OverlapError":"Bad Time"}]"') {
                    //Show pop up with error message saying start time can not be after end time. 
                    timeOverlapPopup("Start time can not be set after end time.");
                } else {
                    startTime = formatTimeFromDB(updateClockInData.timeEntered);
                    $("#" + updateClockInData.jobActivityId + " td:nth-child(2)").text(startTime);
                    $("*").removeClass("waitingCursor");
                }                
                //callback();
            }
            catch (e) {
                //callback(e, null);
            }

        },
        error: function (xhr, status, error) {
            alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function clockoutWorkshopSingleAjax(singleClockOutData) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/ClockoutWorkshopSingle/",
        data: JSON.stringify(singleClockOutData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = JSON.stringify(response);
                //data = response.getClockoutWorkshopSingleResult;
                if (res.indexOf("End Overlap") !== -1) {
                    timeOverlapPopup("End time overlaps with existing record.");                    
                } else {
                    endTime = formatTimeFromDB(singleClockOutData.timeEntered);
                    $("#" + singleClockOutData.jobActivityId + " td:nth-child(3)").text(endTime);

                    // this works now just need to send over the endtime and not starttime input - Ash
                    var clockoutEndtime = Array.from($("#" + singleClockOutData.jobActivityId + " td:nth-child(3)"));
                    validateEndTime(clockoutEndtime[0]);
                    filterSetup();
                    //callback();
                }
            }
            catch (e) {
                //callback(e, null);
            }

        },
        error: function (xhr, status, error) {
            alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function deleteWorkshopEntryAjax(deleteData) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/DeleteWorkshopEntry/",
        data: JSON.stringify(deleteData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                data = response.getDeleteWorkshopEntryResult;
                //callback();
            }
            catch (e) {
                //callback(e, null);
            }

        },
        error: function (xhr, status, error) {
            alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}

function updateWorkshopQuantityAjax(quantity, jobActId) {
    insertData = {
        token: $.session.Token,
        quantity: quantity,
        jobActivityId: jobActId
    };
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/UpdateWorkshopQuantity/",
        data: JSON.stringify(insertData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                data = response.getUpdateWorkshopQuantityResult;
            }
            catch (e) {
                
            }

        },
        error: function (xhr, status, error) {
            alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        }
    });
}