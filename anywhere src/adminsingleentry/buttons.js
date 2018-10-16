function buildAdminSingleEntryButtons() {
    return new Promise(function (fulfill, reject) {
        var buttonHolder = $("<div>").css("width", "100%").css("textAlign",  "center"),
            promises = [];

        promises.push(buildAdminApproveButton());
        promises.push(buildAdminRejectButton());
        promises.push(buildAdminSubmitButton());

        Promise.all(promises).then(function success(data) {
            var obj = {buttonHolder: buttonHolder};
            data.forEach(function (datum) {
                for (var key in datum) {
                    obj[key] = datum[key];
                }
            });
            buttonHolder
                .append(obj.approveButton)
                .append(obj.rejectButton)
                .append(obj.submitButton);
            fulfill(obj);
        }, function error(err) {
            console.log(err);
            reject(err);
        });
    });
}

function buildAdminApproveButton() {
    return new Promise(function (fulfill, reject) {
        var button = $("<button>").text("Approve").addClass("adminsingleentryButton");
        fulfill({ approveButton: button });
    });
}

function buildAdminRejectButton() {
    return new Promise(function (fulfill, reject) {
        var button = $("<button>").text("Reject").addClass("adminsingleentryButton");
        fulfill({ rejectButton: button });
    });
}

function buildAdminSubmitButton() {
    return new Promise(function (fulfill, reject) {
        var button = $("<button>").text("Submit").addClass("adminsingleentryButton");
        fulfill({ submitButton: button });
    });
}