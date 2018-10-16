function adminSingleEntryLoad(extraData) {
    $("#adminsingleentrybutton").addClass("buttonhighlight");
    if (false) {
        Employee = function (options) {
            var employee = this;
            employee.firstName = options.firstName || "";
            employee.lastName = options.lastName || ""
            employee.fullName = [employee.firstName, employee.lastName].join(" ");
            employee.employees = [];
            employee.userName = options.userName;
            return employee;
        }
        $("#adminsingleentrybutton").addClass("buttonhighlight");
        buildSingleEntryBanner(false);
        getEmployeeListAndCountInfoAjax($.session.PeopleId, buildAdminSingleEntryEmployees);
        //Hide the right side bar on this
        $(document).trigger("moduleLoad");
    }
    else {
        function resetFilters(obj) {
            return new Promise(function (fulfill, reject) {
                var promises = [];
                promises.push(obj.locationBox.triggerHandler("adminReset"));
                promises.push(obj.employeeBox.triggerHandler("adminReset"));
                promises.push(obj.statusBox.triggerHandler("adminReset"));

                Promise.all(promises).then(function success() {
                    fulfill();
                }, function error(err) {
                    console.log(err);
                    reject();
                });
            });
        }
        
        $("#outerconsumerpane").hide(); // Can't get this to fire
        var promises = [];

        promises.push(buildAdminSingleEntryBanner());
        promises.push(buildSingleEntryBody());

        Promise.all(promises).then(function success(data) {
            var obj = {};
            data.forEach(function (datum) {
                for (var key in datum) {
                    obj[key] = datum[key];
                }
            });
            function getCheckedBoxes() {
                return obj.tbody.find("input").filter(function () {
                    return $(this).prop("checked") == true;
                });
            }

            obj.filterButton.click(function (e) {
                e.stopPropagation();
                var startD = obj.date.box.data("startDate"),
                endD = obj.date.box.data("endDate");

                var startDate = (startD.getFullYear() + '-' + (startD.getMonth() + 1) + '-' + startD.getDate()),
                endDate = (endD.getFullYear() + '-' + (endD.getMonth() + 1) + '-' + endD.getDate());
                

                var data = {
                    token: $.session.Token,
                    startDate: startDate,
                    endDate: endDate,
                    startD: startD,
                    endD: endD,
                    dateText: obj.date.box.find("input").val(),
                    supervisorId: obj.supervisor.box.data("person_id"),
                    supervisorText: obj.supervisor.box.find("input").val(),
                    locationId: obj.locationBox.data("id"),
                    locationText: obj.locationBox.html(),
                    employeeId: obj.employeeBox.data("id"),
                    employeeText: obj.employeeBox.text(),
                    employeeUserName: obj.employeeBox.data("userName"),
                    status: obj.statusBox.data("code"),
                    statusText: obj.statusBox.text()
                };
                obj.tbody.html("Loading...");
                obj.caption.text("");
                obj.map.html("");
                var map = null;
                if (data.employeeId == "") {
                }
                else {
                    map = initiateMap({
                        map: obj.map,
                        userName: obj.employeeBox.data("userName"),
                        startDate: startDate,
                        endDate: endDate,
                        id: obj.locationBox.data("id"),
                        code: obj.statusBox.data("code"),
                        table: obj.tbody
                    });
                }

                singleEntryFilterAdminListAjax(data, function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    var dataInner = developSingleEntryGridData(res);
                    obj.tbody.html("");
                    if (dataInner.length) {
                        var totalHours = 0;
                        dataInner.forEach(function (datum) {
                            var row = $("<tr>").attr("SEID", datum.id).appendTo(obj.tbody);
                            row.click(function (e) {
                                if (map != null) {
                                    obj.tbody.find("tr").removeClass("highlightedAdminRow");
                                    var myMarker = null;
                                    markers.forEach(function (marker) {
                                        marker.AnywhereCustomObject.ids.forEach(function (myID) {
                                            if (datum.id == myID) {
                                                myMarker = marker;
                                            }
                                        });
                                    });
                                    if (myMarker && !$(e.target).data("isLocation")) {
                                        row.addClass("highlightedAdminRow");
                                        var bound = new google.maps.LatLngBounds();
                                        bound.extend(myMarker.getPosition());
                                        map.panTo(bound.getCenter());
                                    }

                                }
                                return true;
                            });
                            var statusCell = $("<td>");
                            var summaryCell = $("<td>");
                            var status = datum.status.status;
                            var numConsumersSpan = $("<span>").text(datum.consumers).addClass("singleentryfilterminibutton").attr("title", "Number of Consumers").appendTo(summaryCell),
                                hasNotes = $("<span>").addClass("singleentryfilterminibutton singleentryfiltermininotesbutton").attr("title", "Notes").appendTo(summaryCell),
                                hasTransportation = $("<span>").addClass("singleentryfilterminibutton singleentryfilterminitransportationbutton").attr("title", "Transportation").appendTo(summaryCell);
                            var statusText = datum.status[status] || datum.status.default;
                            statusCell.text(statusText);
                            if (parseInt(datum.consumers, 10) > 0) numConsumersSpan.css("backgroundColor", "green");
                            if (datum.notes) hasNotes.css("backgroundColor", "green");
                            if (datum.transportation) hasTransportation.css("backgroundColor", "green");
                            if (status == "P" || status == "A") {
                                statusCell.prepend($("<input>").attr("type", "checkbox").data("SEID", datum.id).data("hoursMissing", datum.hoursMissing).data("status", status));
                            }
                            var temp = $("<td>").data("isLocation", true).text(datum.location);
                            temp.click((function (id) {
                                return function (e) {
                                    getSingleEntryById(id, true, data);
                                }
                            })(datum.id)).css({
                                "cursor": "pointer",
                                "textDecoration": "underline"
                            })
                            row.append(statusCell)
                                .append($("<td>").text(datum.name))
                                .append($("<td>").text(datum.date))
                                .append($("<td>").text(datum.startTime))
                                .append($("<td>").text(datum.endTime))
                                .append($("<td>").text(datum.hours))
                                .append(temp)
                                .append($("<td>").text(datum.workCode))
                                .append(summaryCell);

                            if (!isNaN(parseFloat(datum.hours))) totalHours += (parseFloat(datum.hours) * 100);
                        });
                        obj.caption.text("Total Hours: " + (totalHours / 100));
                    }
                    else {
                        $("<tr><td colspan='500' style='min-width:825px !important;max-width:825px !important;'>No data found</td></tr>").appendTo(obj.tbody);
                    }
                });
            });
            //Banner
            obj.date.box.PSlist(obj.date.box.data("dates"), {
                callback: function (item, stopButton) {
                    
                    obj.date.box.find("input").val(item.text).attr("disabled", true);
                    obj.date.box.data("startDate", item.startDate)
                        .data("endDate", item.endDate);
                    //console.log(stopButton !== true)
                    if (stopButton !== true) {
                        resetFilters(obj).then(function () {
                            obj.filterButton.click();
                        });
                    }
                }
            });
            obj.supervisor.box.PSlist(function () {
                return obj.supervisor.box.data("supervisors").filter(function (supervisor) {
                    return supervisor.status != "beta";
                });
            }, {
                callback: function (item, stopButton) {
                    obj.supervisor.box.find("input").val(item.fullName).attr("disabled", true);
                    obj.supervisor.box.data("person_id", item.id);

                    var arr = [];

                    obj.supervisor.box.data("supervisors").forEach(function (supervisor) {
                        if (supervisor.id === item.id && supervisor.status != "beta") {
                            arr = supervisor.directEmployees;
                        }
                    });


                    obj.employeeBox.data("employees", arr);

                    if (stopButton !== true) {
                        resetFilters(obj).then(function () {
                            obj.filterButton.click();
                        });
                    }
                }
            });

            var arr = [];

            obj.supervisor.box.data("supervisors").forEach(function (supervisor) {
                if (supervisor.id === $.session.PeopleId && supervisor.status != "beta") {
                    arr = supervisor.directEmployees;
                }
            });
            
            obj.employeeBox.data("employees", arr);

            //Buttons in main area
            obj.approveButton.PSmodal({
                body: function () {
                    var checkedBoxes = getCheckedBoxes();
                    if (checkedBoxes.length == 1) return "1 record will be approved.  Do you want to continue?";
                    else return checkedBoxes.length + " records will be approved.  Do you want to continue?";
                },
                onbefore: function () {
                    var checkedBoxes,
                        hasHoursArr,
                        hasOnlyAArr;

                    checkedBoxes = getCheckedBoxes();
                    if (!checkedBoxes.length) {
                        $.fn.PSmodal({
                            body: "No entries were selected. Please select at least one entry.",
                            immediate: true,
                            buttons: [
                                {
                                    text: "OK",
                                    callback: function () {
                                    }
                                }
                            ]
                        });
                        return false;
                    }

                    hasHoursArr = $.map(checkedBoxes, function (obj) { return $(obj).data("hoursMissing"); });
                    if (hasHoursArr.indexOf(true) !== -1) {
                        $.fn.PSmodal({
                            body: "One of the selected entries is missing an End Time. Please enter the end time and resubmit.",
                            immediate: true,
                            buttons: [
                                {
                                    text: "OK",
                                    callback: function () {
                                    }
                                }
                            ]
                        });
                        return false;
                    }

                    hasOnlyAArr = $.map(checkedBoxes, function (obj) { return $(obj).data("status") == "A"; });
                    if (hasOnlyAArr.indexOf(false) !== -1) {
                        $.fn.PSmodal({
                            body: "Unable to Approve selected time entries.  Please make sure all selected entries have a status of Needs Approval.",
                            immediate: true,
                            buttons: [
                                {
                                    text: "OK",
                                    callback: function () {
                                    }
                                }
                            ]
                        });
                        return false;
                    }
                    return true;
                },
                buttons: [
                    {
                        text: "Yes",
                        callback: function () {

                            var ids = $.map(getCheckedBoxes(), function (obj) { return $(obj).data("SEID"); });
                            var data = {
                                token: $.session.Token,
                                singleEntryIdString: ids.join(","),
                                newStatus: "S",
                                userID: $.session.UserId
                            }
                            //console.log(data);
                            adminUpdateSingleEntryStatusAjax(data, function () {
                                obj.filterButton.click();
                            });

                        }
                    },
                    {
                        text: "No",
                        callback: function () {
                        }
                    }
                ]
            });

            obj.rejectButton.PSmodal({
                body: function () {
                    var checkedBoxes = getCheckedBoxes();
                    if (checkedBoxes.length == 1) return "1 record will be rejected.  Do you want to continue?";
                    else return checkedBoxes.length + " records will be rejected.  Do you want to continue?";
                },
                onbefore: function () {
                    var checkedBoxes,
                        hasHoursArr,
                        hasOnlyAArr;

                    checkedBoxes = getCheckedBoxes();
                    if (!checkedBoxes.length) {
                        $.fn.PSmodal({
                            body: "No entries were selected. Please select at least one entry.",
                            immediate: true,
                            buttons: [
                                {
                                    text: "OK",
                                    callback: function () {
                                    }
                                }
                            ]
                        });
                        return false;
                    }

                    hasOnlyAArr = $.map(checkedBoxes, function (obj) { return $(obj).data("status") == "A"; });
                    if (hasOnlyAArr.indexOf(false) !== -1) {
                        $.fn.PSmodal({
                            body: "Unable to Reject selected time entries.  Please make sure all selected entries have a status of Needs Approval.",
                            immediate: true,
                            buttons: [
                                {
                                    text: "OK",
                                    callback: function () {
                                    }
                                }
                            ]
                        });
                        return false;
                    }

                    return true;
                },
                buttons: [
                    {
                        text: "Yes",
                        callback: function () {

                            var ids = $.map(getCheckedBoxes(), function (obj) { return $(obj).data("SEID"); });
                            var data = {
                                token: $.session.Token,
                                singleEntryIdString: ids.join(","),
                                newStatus: "R",
                                userID: $.session.UserId
                            }
                            adminUpdateSingleEntryStatusAjax(data, function () {
                                obj.filterButton.click();
                            });
                        }
                    },
                    {
                        text: "No",
                        callback: function () {
                        }
                    }
                ]
            });

            obj.submitButton.PSmodal({
                body: function () {
                    var checkedBoxes = getCheckedBoxes();
                    if (checkedBoxes.length == 1) return "1 record will be submitted.  Do you want to continue?";
                    else return checkedBoxes.length + " records will be submitted.  Do you want to continue?";
                },
                onbefore: function () {
                    var checkedBoxes,
                        hasHoursArr,
                        hasOnlyPArr;

                    checkedBoxes = getCheckedBoxes();
                    if (!checkedBoxes.length) {
                        $.fn.PSmodal({
                            body: "No entries were selected. Please select at least one entry.",
                            immediate: true,
                            buttons: [
                                {
                                    text: "OK",
                                    callback: function () {
                                    }
                                }
                            ]
                        });
                        return false;
                    }

                    hasHoursArr = $.map(checkedBoxes, function (obj) { return $(obj).data("hoursMissing"); });
                    if (hasHoursArr.indexOf(true) !== -1) {
                        $.fn.PSmodal({
                            body: "One of the selected entries is missing an End Time. Please enter the end time and resubmit.",
                            immediate: true,
                            buttons: [
                                {
                                    text: "OK",
                                    callback: function () {
                                    }
                                }
                            ]
                        });
                        return false;
                    }

                    hasOnlyPArr = $.map(checkedBoxes, function (obj) { return $(obj).data("status") == "P"; });
                    if (hasOnlyPArr.indexOf(false) !== -1) {
                        $.fn.PSmodal({
                            body: "Unable to Submit selected time entries.  Please make sure all selected entries have a status of Pending.",
                            immediate: true,
                            buttons: [
                                {
                                    text: "OK",
                                    callback: function () {
                                    }
                                }
                            ]
                        });
                        return false;
                    }
                    return true;
                },
                buttons: [
                    {
                        text: "Yes",
                        callback: function () {

                            var ids = $.map(getCheckedBoxes(), function (obj) { return $(obj).data("SEID"); });
                            var data = {
                                token: $.session.Token,
                                singleEntryIdString: ids.join(","),
                                newStatus: "A",
                                userID: $.session.UserId
                            }
                            adminUpdateSingleEntryStatusAjax(data, function () {
                                obj.filterButton.click();
                            });
                        }
                    },
                    {
                        text: "No",
                        callback: function () {
                        }
                    }
                ]
            });

            if (extraData) {
                obj.date.box.trigger("PSlist-call", [{ text: extraData.dateText, startDate: extraData.startD, endDate: extraData.endD }, true]);

                if (extraData.supervisorText !== undefined && extraData.supervisorId !== undefined) {
                    obj.supervisor.box.trigger("PSlist-call", [{ fullName: extraData.supervisorText, id: extraData.supervisorId }, true]);
                }
                obj.locationBox.triggerHandler("adminReset").then(function () {
                    if (extraData.locationText !== undefined && extraData.locationId !== undefined) {
                        obj.locationBox.trigger("PSlist-call", [{ name: extraData.locationText, ID: extraData.locationId }]);
                    }
                    if (extraData.employeeText !== undefined && extraData.employeeId !== undefined && extraData.employeeUserName !== undefined) {
                        obj.employeeBox.trigger("PSlist-call", [{ text: extraData.employeeText, id: extraData.employeeId, userName: extraData.employeeUserName }]);
                    }
                    if (extraData.statusText !== undefined && extraData.status !== undefined) {
                        obj.statusBox.trigger("PSlist-call", [{ text: extraData.statusText, code: extraData.status }]);
                    }
                    obj.filterButton.click();
                })
            }
            else {
                resetFilters(obj).then(function () {
                    obj.filterButton.click();
                });
            }
            $(document).trigger("moduleLoad");
        }, function error(err) {
            console.log(err);
            $(document).trigger("moduleLoad");
        });
    }
}

