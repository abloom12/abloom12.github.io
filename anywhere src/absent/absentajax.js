(function (scope) {
    if (!scope.AbsentAjax) {
        scope.AbsentAjax = {};
    }
})(window.Anywhere);

function selectAbsentAjax(consumerId, locationId, statusDate, consumerName, locationName) {
    if ($.loadedApp == "roster") {
        statusDate = $("#datebox").val();
        locationName = $("#locationbox").text().trim();
        locationId = $("#locationbox").attr("locid");
    }
    else if ($.loadedApp == "goals") {
        statusDate = $("#goalsdatebox").val();
    }
    var selectData = {
        token: $.session.Token,
        consumerId: consumerId,
        locationId: locationId,
        statusDate: moment(statusDate).format('YYYY-MM-DD'),
    }
    var overlay = $("<div>")
        .addClass("modaloverlay")
        .css({
            "backgroundColor": "rgba(0, 0, 0, 0.15)"
        }).appendTo($("body"));
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/selectAbsent/",
        data: JSON.stringify(selectData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //console.log(response);
            var res = JSON.parse(response.selectAbsentResult),
                resObj = res[0],
                defaultDate = new Date(),
                obj = {};

            if (resObj) {
                if (resObj.recordid) obj.absentId = resObj.recordid;
                if (resObj.timereported) obj.timeReported = resObj.timereported;
                if (resObj.consumerId) obj.consumerId = resObj.consumerId;
                if (resObj.dateOfAbsence) obj.dateAbsence = resObj.dateOfAbsence;
                if (resObj.dateReported) obj.dateReported = resObj.dateReported;

                if (resObj.notificationId) obj.notificationId = resObj.notificationId;
                if (resObj.notificationdescription) obj.notificationType = resObj.notificationdescription;
                if (resObj.reportedby) { obj.reportedBy = resObj.reportedby };
                if (resObj.reasonId) obj.reasonId = resObj.reasonId;
                if (resObj.reasondescription) obj.reason = resObj.reasondescription;
                obj.new = false;
            } else {
                obj.reportedBy = [$.session.Name, $.session.LName].join(" ");
                obj.new = true;
            }
            var values = $.extend({
                consumerName: consumerName,
                consumerId: consumerId,
                locationName: locationName,
                locationId: locationId,
                dateAbsence: statusDate,
                reportedBy: obj.reportedBy,
                dateReported: statusDate,
                timeReported: defaultDate,
                notificationType: "",
                notificationId: "",
                reason: "",
                reasonId: "",
                absentId: 0,
            }, obj);

            $.ajax({
                type: "GET",
                url: "./absent/modules/absentform.html?RNG=" + +(new Date()),
                success: function (HTMLresponse, status, xhr) {
                    buildAbsentCard({ card: $("<div>").replaceWith(HTMLresponse), overlay: overlay, values: values, multi: false });
                },
                error: function (xhr, status, error) {
                    //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
                },
            })
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });

    return false;
}

function deleteAbsentAjax(absentId, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/deleteAbsent/",
        data: '{"token":"' + $.session.Token + '", "absentId":"' + absentId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(null);
        },
        error: function (xhr, status, error) {
            callback(error);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function selectAbsentNotificationTypesAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/selectAbsentNotificationTypes/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //var res = JSON.stringify(response);
            //callback(response);
            if (response.selectAbsentNotificationTypesResult) callback(JSON.parse(response.selectAbsentNotificationTypesResult));
            else callback([]);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function selectAbsentReasonsAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/selectAbsentReasons/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //var res = JSON.stringify(response);
            if (response.selectAbsentReasonsResult) callback(JSON.parse(response.selectAbsentReasonsResult));
            else callback([]);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function oneLocationAbsentSaveAjax(saveData, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/oneLocationAbsentSave/",
        data: JSON.stringify(saveData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = response.oneLocationAbsentTableSaveResult;
                if (callback) callback(res);
            }
            catch (e) {
                console.log("There was a problem with oneLocationAbsentSaveAjax");
                //callback([]);
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    })
}

function allLocationSaveAbsentAjax(data, callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/allLocationSaveAbsent/",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = response.allLocationSaveAbsentResult;
                if (callback) callback(res);
            }
            catch (e) {
                console.log("There was a problem with allLocationSaveAbsent");
                //callback([]);
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function absentPreSaveCheckAjax(data, callback) {
    var selectData = data;
    if (parseInt(selectData.locationId, 10) == 0) {
        selectData.locationId = "%";
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/absentPreSave/",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(selectData),
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = response.absentPreSaveResult;
                if (callback) callback(res);
            }
            catch (e) {
                console.log("There was a problem with absentPreSave");
                //callback([]);
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getConsumersByLocationAbsentAjax(locationId, absenceDate, callback) {
    var selectData = {
        token: $.session.Token,        
        absenceDate: moment(absenceDate).format('YYYY-MM-DD'),
        locationId: locationId,
    }
    if (parseInt(locationId, 10) == 0) {
        selectData.locationId = "%";
    }
    //JDL 01/26/2016 - Instead of pulling individual location, now pull all locations each time, since we don't want to cache data
   // selectData.locationId = "%";
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getConsumersByLocationAbsent/",
        data: JSON.stringify(selectData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = JSON.parse(response.getConsumersByLocationAbsentResult);
                if (callback) callback(res);
                unKillAllClickEvents();
            }
            catch (e) {
                console.log("There was a problem with getConsumersByLocationAbsent");
                //callback([]);
            }
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}