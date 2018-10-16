var showNotesAndToDoList = true;

/*Consumer Notes*/

function selectNotesByConsumerAndLocationAjax(consumerId, locationId, consumerName, locationName) {
    var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
    var overlay = $("<div>")
        .addClass("modaloverlay")
        .css({
            "backgroundColor": "rgba(0, 0, 0, 0.15)"
        }).appendTo($("body"));
    var datum = {
        token: $.session.Token,
        consumerId: consumerId,
        locationId: locationId,
        daysBackDate: daysBackDate
    };
    $.ajax({
        type: "POST",
        url: "/" + $.webServer.serviceName + "/selectNotesByConsumerAndLocation/",
        data: JSON.stringify(datum),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var results = JSON.parse(response.selectNotesByConsumerAndLocationResult);
            buildProgressNotesCard(results, overlay, consumerId, locationId, consumerName, locationName);

        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
    return false;
}

function insertConsumerNoteAjax(insertData, callback) {//insertData = token, consumerId, noteTitle, note, locationId 
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/insertConsumerNote/",
        data: JSON.stringify(insertData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (callback) callback(res);
        },
        error: function (xhr, status, error) {
        },
    });
}

function deleteConsumerNoteAjax(noteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/deleteConsumerNote/",
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

function updateConsumerNoteAjax(updateData, callback) {//@token varchar(100), @noteId bigint, @consumerId double, @note long VARCHAR
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateConsumerNote/",
        data: JSON.stringify(updateData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (callback) callback(res);
        },
        error: function (xhr, status, error) {
        },
    });
}

function updateConsumerNoteDateReadAjax(noteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateConsumerNoteDateRead/",
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

function selectConsumerNoteAjax(noteId, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/selectConsumerNote/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.parse(response.selectConsumerNoteResult);
            if (callback) callback(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function updateConsumerNotesDaysBackAjax() {
    updatedReviewDays = $("#progressnotesdaysback").val();
    $.session.defaultProgressNoteReviewDays = updatedReviewDays;
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateConsumerNotesDaysBack/",
        data: '{"token":"' + $.session.Token + '", "updatedReviewDays":"' + updatedReviewDays + '"}',
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

function getConsumersWithUnreadNotesByEmployeeAndLocationAjax(locationId, callback) {
    var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
    var datum = {
        token: $.session.Token,
        locationId: locationId,
        daysBackDate: daysBackDate
    };
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getConsumersWithUnreadNotesByEmployeeAndLocation/",
        data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "daysBackDate":"' + daysBackDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var results = JSON.parse(response.getConsumersWithUnreadNotesByEmployeeAndLocationResult);
                callback(results);
            }
            catch (e) {
                callback([]);
            }
            
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

/*Location Notes*/

function updateConsumerNotesChecklistDaysBackAjax() {
    updatedChecklistDays = $("#progressnoteschecklistdaysback").val();
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateConsumerNotesChecklistDaysBack/",
        data: '{"token":"' + $.session.Token + '", "updatedChecklistDays":"' + updatedChecklistDays + '"}',
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

function updateLocationNoteDateReadAjax(noteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateLocationNoteDateRead/",
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

function insertLocationNoteAjax(insertData, callback) {//insertData = token, noteTitle, note, locationId 
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/insertLocationNote/",
        data: JSON.stringify(insertData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (callback) callback(res);
        },
        error: function (xhr, status, error) {
        },
    });
}

function deleteLocationNoteAjax(noteId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/deleteLocationNote/",
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

function selectAllUsersLocationNotesAjax(callback) {
    var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/selectAllUsersLocationNotes/",
        data: '{"token":"' + $.session.Token + '", "daysBackDate":"' + daysBackDate + '"}',
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

function selectLocationNoteAjax(noteId, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/selectLocationNote/",
        data: '{"token":"' + $.session.Token + '", "noteId":"' + noteId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.parse(response.selectLocationNoteResult);
            if (callback) callback(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getLocationsWithUnreadNotesAjax(callback) {
    var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getLocationsWithUnreadNotes/",
        data: '{"token":"' + $.session.Token + '", "daysBackDate":"' + daysBackDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var results = JSON.parse(response.getLocationsWithUnreadNotesResult);
                callback(results);
            }
            catch (e) {
                callback([]);
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function doesLocationHaveUnreadNotesAjax(locationId, callback) {
    var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
    var datum = {
        token: $.session.Token,
        locationId: locationId,
        daysBackDate: daysBackDate
    };
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/checkIfLocationHasUnreadNotes/",
        data: '{"token":"' + $.session.Token + '", "locationId":"' + locationId + '", "daysBackDate":"' + daysBackDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var results = JSON.parse(response.checkIfLocationHasUnreadNotesResult);
                callback(results);
            }
            catch (e) {
                callback([]);
            }
            
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getLocationProgressNotes(locationId, consumerName, locationName) {
    var overlay = $("<div>")
        .addClass("modaloverlay")
        .css({
            "backgroundColor": "rgba(0, 0, 0, 0.15)"
        }).appendTo($("body"));
    var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
    var datum = {
        token: $.session.Token,
        locationId: locationId,
        daysBackDate: daysBackDate
    };
    $.ajax({
        type: "POST",
        url: "/" + $.webServer.serviceName + "/selectNotesByLocation/",
        data: JSON.stringify(datum),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var results = JSON.parse(response.selectNotesByLocationResult);
            buildProgressNotesCard(results, overlay, null, locationId, consumerName, locationName);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    })
}

function updateLocationNoteAjax(updateData, callback) {//@token varchar(100), @noteId bigint, @consumerId double, @note long VARCHAR
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateLocationNote/",
        data: JSON.stringify(updateData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            if (callback) callback(res);
        },
        error: function (xhr, status, error) {
        },
    });
}