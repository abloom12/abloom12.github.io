
//insert single entry
function insertSingleEntry(insertData, saveMessage) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/insertSingleEntry/",
        data: JSON.stringify(insertData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            if (response.insertSingleEntryResult.match("Error ")) {
                $.fn.PSmodal({
                    body: "Your time record cannot be saved. Please contact Primary Solutions.",
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
            else {
                //do work on response string
                var res = JSON.stringify(response);

                insertSingleEntrySuccess(res);
                loadApp('singleentry', true);
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            $.fn.PSmodal({
                body: "Your time record cannot be saved. Please contact Primary Solutions.",
                immediate: true,
                buttons: [
                    {
                        text: "OK",
                        callback: function () {
                        }
                    }
                ]
            });
        },
    });
}

function insertSingleEntryNew(data, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/insertSingleEntry/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            if (response.insertSingleEntryResult.match("Error ")) {
                $.fn.PSmodal({
                    body: "Your time record cannot be saved. Please contact Primary Solutions.",
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
            else {
                if (callback) return callback();
                else return;
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            $.fn.PSmodal({
                body: "Your time record cannot be saved. Please contact Primary Solutions.",
                immediate: true,
                buttons: [
                    {
                        text: "OK",
                        callback: function () {
                        }
                    }
                ]
            });
        },
    });
}

function preInsertSingleEntry(insertData, saveMessage) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/preInsertSingleEntry/",
        data: JSON.stringify(insertData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var results = response.preInsertSingleEntryResult;
                if (typeof results == "string") throw "Fail";
                else {
                    var consumerObj = {}, locationObj = {}, pendingArr = [];
                    if (results == null) {  //JDL if it's null, that means all the saving already happened on the server
                        insertSingleEntrySuccess();
                        loadApp('singleentry', true);
                    }
                    else {
                        results.forEach(function (item) {
                            var consumerId = item.consumerId;
                            var locationId = item.locationId;
                            var consumerName = item.consumerName;
                            var locationName = item.locationName;
                            if (!consumerObj[consumerId]) consumerObj[consumerId] = [];
                            consumerObj[consumerId].push({
                                consumerId: consumerId,
                                locationId: locationId,
                                consumerName: consumerName,
                                locationName: locationName,
                                text: locationName
                            });

                            if (!locationObj[locationId]) locationObj[locationId] = [];
                        });
                        Object.keys(consumerObj).forEach(function (consumerId) {
                            if (consumerObj[consumerId].length == 1) {
                                locationObj[consumerObj[consumerId][0].locationId].push(consumerId);
                            }
                            else {
                                pendingArr.push(consumerObj[consumerId])
                            }
                        });
                        

                        var myFunc = function (index) {
                            if (index == -1) {
                                $.fn.PSmodal({
                                    body: "Your time record was not saved.",
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
                            else {
                                if (pendingArr[index]) {
                                    var overlay = $("<div>")
                                    .addClass("modaloverlay")
                                    .css({
                                        "backgroundColor": "rgba(0, 0, 0, 0.15)"
                                    }).appendTo($("body"));

                                    $.ajax({
                                        type: "GET",
                                        url: "./singleentry/singleentrymultiple.html?RNG=" + +(new Date()),
                                        success: function (HTMLresponse, status, xhr) {
                                            var pendingArrCurr = pendingArr[index];
                                            var consumerId = pendingArrCurr[0].consumerId,
                                                consumerName = pendingArrCurr[0].consumerName;

                                            var card = $("<div>").replaceWith(HTMLresponse);
                                            overlay.click(function () {
                                                $(this).remove();
                                            }).bind("remove", function () {
                                                myFunc(++index);
                                            }).append(card);

                                            card.click(function (e) {
                                                e.stopPropagation();
                                            }).bind("remove", function () {
                                                overlay.remove();
                                            });

                                            pendingArrCurr.sort(function (a, b) {
                                                var nameA = a.text.toUpperCase(),
                                                    nameB = b.text.toUpperCase();

                                                if (nameA < nameB) {
                                                    return -1;
                                                }
                                                if (nameA > nameB) {
                                                    return 1;
                                                }
                                                return 0;
                                            });

                                            card.find("#text").html("Attention: The consumer " + consumerName + " has mutliple locations. Which location would you like to save to?");

                                            card.find("#save").click(function () {
                                                alert("You have not yet selected a location. Please select a location and then save.");
                                            });
                                            card.find("#cancel").click(function () {
                                                index = -2;
                                                overlay.remove();
                                            });

                                            card.find("#dropdown").PSlist(pendingArrCurr, {
                                                overlaysuppress: true,
                                                callback: function (item) {
                                                    //console.log(item);
                                                    card.find("#dropdown").html(item.text);
                                                    card.find("#save").off("click").click(function () {
                                                        locationObj[item.locationId].push(consumerId);
                                                        overlay.remove();
                                                    })
                                                }
                                            })
                                        },
                                        error: function (xhr, status, error) {
                                            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
                                        },
                                    })
                                }
                                else {
                                    Promise.all(Object.keys(locationObj).filter(function (locationId) {
                                        return locationObj[locationId].length;
                                    }).map(function (locationId) {
                                        var consumerIds = locationObj[locationId];
                                        var myData = insertData;
                                        return new Promise(function (fulfill, reject) {
                                            myData.numberOfConsumersPresent = consumerIds.length;
                                            myData.consumerId = consumerIds.join(",");
                                            myData.locationId = locationId;
                                            insertSingleEntryNew(myData, function () {
                                                fulfill();
                                            });
                                        });
                                        
                                    })).then(function success(data) {
                                        insertSingleEntrySuccess();
                                        loadApp('singleentry', true);
                                    }, function error(err) {
                                        console.log(err);
                                    })
                                }
                            }
                        }
                        myFunc(0);
                    }
                }
            }
            catch (e) {
                console.log(e);
                $.fn.PSmodal({
                    body: "Your time record cannot be saved. Please contact Primary Solutions.",
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
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            $.fn.PSmodal({
                body: "Your time record cannot be saved. Please contact Primary Solutions.",
                immediate: true,
                buttons: [
                    {
                        text: "OK",
                        callback: function () {
                        }
                    }
                ]
            });
        },
    });
}


//update single entry
function updateSingleEntry(updateData, saveMessage) {
    var test = JSON.stringify(updateData);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateSingleEntry/",
        data: JSON.stringify(updateData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //console.log(response);
            if (response.updateSingleEntryResult.match("Error ")) {
                $.fn.PSmodal({
                    body: "Your time record cannot be saved. Please contact Primary Solutions.",
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
            else {
                //do work on response string
                var res = JSON.stringify(response);
                moveAllConsumersToActiveListSE();
                loadApp('singleentry', true);
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            $.fn.PSmodal({
                body: "Your time record cannot be saved. Please contact Primary Solutions.",
                immediate: true,
                buttons: [
                    {
                        text: "OK",
                        callback: function () {
                        }
                    }
                ]
            });
        },
    });
}

//get single entry info by id
function getSingleEntryById(singleEntryId, readonly, isAdmin) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntryById/",
        data: '{"token":"' + $.session.Token + '", "singleEntryId":"' + singleEntryId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            parseSingleEntry(res, readonly, isAdmin || false);
        },
        error: function (xhr, status, error) {
        },
    });
}

//get list of single entry within date range
function getSingleEntryByDate(userId, startDate, endDate, statusIn, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntryByDate/",
        data: '{"token":"' + $.session.Token + '", "userId":"' + userId + '", "startDate":"' + startDate + '", "endDate":"' + endDate + '", "statusIn":"' + statusIn + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if(callback) callback(res);
            else buildSingleEntryTable(res);
        },
        error: function (xhr, status, error) {
        },
    });
}

//delete entry
function deleteSingleEntryRecord(singleEntryId, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/deleteSingleEntryRecord/",
        data: '{"token":"' + $.session.Token + '", "singleEntryId":"' + singleEntryId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
            //loadApp('singleentry');
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });
}

//manager approve entry
function approveSingleEntryRecord(singleEntryId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/approveSingleEntryRecord/",
        data: '{"token":"' + $.session.Token + '", "singleEntryId":"' + singleEntryId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            loadApp('singleentry');
        },
        error: function (xhr, status, error) {
        },
    });
}

//gets required fields
function getSingleEntryRequiredFields() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntryRequiredFields/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //loadApp('singleentry');
        },
        error: function (xhr, status, error) {
        },
    });
}

//gets required fields
function getCustomLinks() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getCustomLinks/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //loadApp('singleentry');
        },
        error: function (xhr, status, error) {
        },
    });
}

function getWorkCodes(callback, input, readonly) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getWorkCodes/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });
}

//Gets system messages
function getSytemMessages() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSystemMessages/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //loadApp('singleentry');
        },
        error: function (xhr, status, error) {
        },
    });
}

function getSingleEntryLocations(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntryLocations/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () { },
        complete: function () { },
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });
}

function getSingleEntryPayPeriods(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntryPayPeriods/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () { },
        complete: function () { },
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });
}

function updateSingleEntryStatus(statusData, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateSingleEntryStatus/",
        data: JSON.stringify(statusData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if(callback) callback(res);
        },
        error: function (xhr, status, error) {
        },
    });
}

function getRequiredSingleEntryFieldsAjax(callback, readonly, isAdmin, status, vals, isSaved) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getRequiredSingleEntryFields/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
            // setupRequiredFieldsSingleEntry(null, res, readonly, isAdmin, status, vals, isSaved);
        },
        error: function (xhr, status, error) {
            callback(error, null);
            // setupRequiredFieldsSingleEntry(error, null);
        },
    });
}

function getSingleEntryUsersByLocationAjax(locationId, seDate, callback) {
    if ($.session.singleEntryEditLocationHack != "") {
        locationId = $.session.singleEntryEditLocationHack;
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntryUsersByLocation/",
        data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "seDate":"' + seDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $.session.singleEntryEditLocationHack = "";
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });
}

function singleEntryOverlapCheckAjax(overlapData, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/singleEntryOverlapCheck/",
        data: JSON.stringify(overlapData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });
}