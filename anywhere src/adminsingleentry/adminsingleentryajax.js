//function getEmployeeList() {
//    $.ajax({
//        type: "POST",
//        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
//            "/" + $.webServer.serviceName + "/getEmployeeList/",
//        data: '{"token":"' + $.session.Token + '"}',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response, status, xhr) {
//            var res = JSON.stringify(response);
//            loadApp('adminsingleentry');
//            //do work on response string
//        },
//        error: function (xhr, status, error) {
//            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
//        },
//    });
//}
function getSingleEntrySupervisorsAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntrySupervisors/",
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

//Going to have to do another get pay period call. So that we can get the closed pay
//periods as well as opne ones for admin.
function getSingleEntryPayPeriodsAdminAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntryPayPeriodsAdmin/",
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

function getAdminSingleEntryLocations(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getAdminSingleEntryLocations/",
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

function getEmployeeListAndCountInfoAjax(supervisorId, callback) {   
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getEmployeeListAndCountInfo/",
        data: '{"token":"' + $.session.Token + '", "supervisorId":"' + supervisorId + '"}',
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

//Need to create a filter procedure. Pay period, supervisor, location, employee and status.
//Must be able to filter all or only a few
//filterData must be in the below order and set to empty strings if undefined
//(string token, string startDate, string endDate, string supervisorId, string locationId, string employeeId, string status)
function singleEntryFilterAdminListAjax(filterData, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/singleEntryFilterAdminList/",
        data: JSON.stringify(filterData),
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

function getAddressByLatLong(lat, lng, callback) {
    $.ajax({
        type: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + $.googleMapAPI,
        dataType: "json",
        success: function (response, status, xhr) {
            if (response && response.results && response.results[0] && response.results[0].formatted_address) {
                callback(response.results[0].formatted_address);
            }
            else callback("");
        },
        error: function (xhr, status, error) {
            callback("");
        }
    });
}

//function getUserSingleEntryLocationsForPayPeriod(userId, startDate, endDate, callback) {
//'{"token":"' + $.session.Token + '", "userId":"' + userId + '", "startDate":"' + startDate + '", "endDate":"' + endDate + '"}',
function getUserSingleEntryLocationsForPayPeriod(data, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getUserSingleEntryLocationsForPayPeriod/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(res);
        },
        error: function (xhr, status, error) {
        },
    });
}

function adminUpdateSingleEntryStatusAjax(adminStatusData, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/adminUpdateSingleEntryStatus/",
        data: JSON.stringify(adminStatusData),
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

function getSingleEntryUsersWCAjax(getUserData, callback) {//getUserdata must contain token and date from single entry page
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getSingleEntryUsersWC/",
        data: JSON.stringify(getUserData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //console.log(response);
            var res = JSON.parse(response.getSingleEntryUsersWCResult);
            callback(null, res);
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });
}