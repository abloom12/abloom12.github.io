function buildAdminSingleEntryFilters() {
    return new Promise(function (fulfill, reject) {
        var filterHolder = $("<div>").css("width", "100%"),
            promises = [];

        promises.push(buildAdminLocationFilter());
        promises.push(buildAdminEmployeeFilter());
        promises.push(buildAdminStatusFilter());
        promises.push(buildAdminFilterButton());

        Promise.all(promises).then(function success(data) {
            var obj = {filterHolder: filterHolder};
            data.forEach(function (datum) {
                for (var key in datum) {
                    obj[key] = datum[key];
                }
            });
            filterHolder
                .append(obj.locationSpan)
                .append(obj.employeeSpan)
                .append(obj.statusSpan)
                .append(obj.filterSpan);
            fulfill(obj);
        }, function error(err) {
            console.log(err);
            reject(err);
        });
    });
}

function buildAdminLocationFilter() {
    return new Promise(function (fulfill, reject) {
        var span = $("<span>").addClass("adminsingleentryFilterContainer"),
            label = $("<div>Location</div>").css("width", "100%").css("textAlign", "center").appendTo(span),
            textBox = $("<div>").appendTo(span).addClass("adminsingleentrydropdown"),
            myLocations = [{
                name: "ALL",
                text: "ALL",
                ID: ""
            }];

        textBox
            .PSlist(function () {
                return textBox.data("locations");
            }, {
                callback: function (item) {
                    textBox.html(item.name).data("id", item.ID);
                }
            })
            .on("adminReset", function () {
                return new Promise(function (fulfillInner, rejectInner) {
                    
                    getAdminSingleEntryLocations(function (err, res) {
                        if (err) {
                            return reject(err);
                        }
                        myLocations = [];

                        var tempArr = [];

                        $('result', res).each(function () {
                            var ID = $('locationID', this).text(),
                                name = $('shortDescription', this).text();

                            tempArr.push({
                                name: name,
                                text: name,
                                ID: ID
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
                        
                        myLocations = myLocations.concat(tempArr);
                        myLocations.push({
                            name: "ALL",
                            text: "ALL",
                            ID: ""
                        });
                        for (var i = 0; i < myLocations.length; i++) {
                            myLocations[i].text = "<img class='houseicon' src='./images/new-icons/icon_house.png'>" + myLocations[i].text;
                        }
                        textBox.data("locations", myLocations).html(textBox.data("locations")[textBox.data("locations").length - 1].name).data("id", textBox.data("locations")[textBox.data("locations").length - 1].ID);
                        fulfillInner();
                    });
                    
                });
            });
        fulfill({ locationSpan: span, locationBox: textBox });
    });
}

function buildAdminEmployeeFilter() {
    return new Promise(function (fulfill, reject) {
        var span = $("<span>").addClass("adminsingleentryFilterContainer"),
            label = $("<div>Employee</div>").css("width", "100%").css("textAlign", "center").appendTo(span),
            textBox = $("<div>").appendTo(span).addClass("adminsingleentrydropdown");

        textBox
            .PSlist(function () {
                return textBox.data("employees");
            }, {
                callback: function (item) {
                    textBox.text(item.text).data("id", item.id).data("userName", item.userName);
                }
            })
            .on("adminReset", function () {
                return new Promise(function (fulfillInner, rejectInner) {
                    textBox.text(textBox.data("employees")[textBox.data("employees").length - 1].text).data("id", textBox.data("employees")[textBox.data("employees").length - 1].id).data("userName", textBox.data("employees")[textBox.data("employees").length - 1].userName);
                    fulfillInner();
                })
            });
        fulfill({ employeeSpan: span, employeeBox: textBox });
    });
}

function buildAdminStatusFilter() {
    return new Promise(function (fulfill, reject) {
        var span = $("<span>").addClass("adminsingleentryFilterContainer"),
            label = $("<div>Status</div>").css("width", "100%").css("textAlign", "center").appendTo(span),
            textBox = $("<div>").appendTo(span).addClass("adminsingleentrydropdown");

        var statuses = [
            {
                text: "Needs Approval",
                code: "A"
            },
            {
                text: "Pending",
                code: "P"
            },
            {
                text: "Rejected",
                code: "R"
            },
            {
                text: "Approved",
                code: "S"
            }
        ];

        statuses.sort(function (a, b) {
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

        statuses.push({
            text: "ALL",
            code: ""
        });
        

        textBox.on("adminReset", function () {
            return new Promise(function (fulfillInner, rejectInner) {
                textBox.text(statuses[statuses.length - 1].text).data("code", statuses[statuses.length - 1].code);
                fulfillInner();
            });
        });

        textBox.PSlist(statuses, {
            callback: function (item) {
                textBox.text(item.text).data("code", item.code);
            }
        });

        fulfill({ statusSpan: span, statusBox: textBox });
        
    });
}

function buildAdminFilterButton() {
    return new Promise(function (fulfill, reject) {
        var button = $("<button>").addClass("bannericon filtericon").css("marginTop", "20px"),
            span = $("<span>").css("display", "inline-block").css("height", "100%").css("marginLeft", "10px");

        span.append(button);
        fulfill({ filterSpan: span, filterButton: button });
    });
}