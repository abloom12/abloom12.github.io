function getLoginCredentials(consumerId) {
    data = {
        token: $.session.Token,
        consumerId: consumerId,
        userId: $.session.UserId,
        applicationName: $.session.applicationName
    };
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getIntellivueAppId/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            //var res = JSON.stringify(response);
            data = response.getIntellivueAppIdResult;
            window.open(data);
            //callback(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}