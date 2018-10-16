function buildSingleEntryTable(res) {
    var tableHolder = $("<div>").attr("id", "singleEntryTableHolder"),
        table = $("<table><thead></thead><tbody></tbody></table>").appendTo(tableHolder),
        thead = table.find("thead"),
        tbody = table.find("tbody"),
        headRow = $("<tr>").appendTo(thead),
        allCheckBox = $("<input>").attr("type", "checkbox").click(function () {
            var status = $(this).is(":checked");
            tbody.find("input").each(function (el) {
                $(this).prop("checked", status);
            });
        }),
        holder = $("<div>"),
        button1,
        button2;

    table.addClass("singleEntrySearchTable");
    headRow.append($("<th>").append(allCheckBox));

    ["Date", "Start Time", "End Time", "Hours", "Location", "Work Code"].forEach(function (text) {
        headRow.append($("<th>").text(text));
    });
    headRow.append($("<th>").text(""));
    $('singleentry', res).each(function () {
        var stats = $("<td>"),
            id = $("Single_Entry_ID", this).text(),
            status = $("Anywhere_Status", this).text(),
            bodyRow = $("<tr>").appendTo(tbody),
            buttonCell = $("<td>"),
            checkBox = $("<input>").attr("type", "checkbox").data("SEID", id),
            dateText = $("Date_of_Service", this).text(),
            startText = $("Start_Time", this).text(),
            endText = $("End_Time", this).text(),
            startTime = startText.split(":"),
            endTime = endText.split(":"),
            hours = $("Check_Hours", this).text(),
            locationText = $("Location_Name", this).text(),
            notes = $("Comments", this).text(),
            transportationUnits = $("Transportation_Units", this).text(),
            workCodeText = $("WCCode", this).text(),
            numConsumers = $("Number_Consumers_Present", this).text(),
            numConsumersSpan = $("<span>").text(numConsumers).addClass("singleentryfilterminibutton").attr("title", "Number of Consumers"),
            hasNotes = $("<span>").addClass("singleentryfilterminibutton singleentryfiltermininotesbutton").attr("title", "Notes"),
            hasTransportation = $("<span>").addClass("singleentryfilterminibutton singleentryfilterminitransportationbutton").attr("title", "Transportation"),
            temp;


        var statusObj = {
            status: status,

            P: "Not Submitted " + stripSeconds($("Last_Update", this).text()),
            A: "Needs Approval " + stripSeconds($("Submit_Date", this).text()),
            R: "Rejected " + stripSeconds($("Rejected_Time", this).text()),
            default: "Approved " + stripSeconds($("Approved_Time", this).text())
        };

        if (status == "P" || status == "R") {
            var quickSpan = $("<span>").append(checkBox);
            buttonCell.append(quickSpan);
            if (status == "R") {
                quickSpan.append(statusObj.R);

                bodyRow.css({
                    "color": "red",
                    "fontWeight": "bold"
                });
            }
        }
        else if(status == "A") {
            buttonCell.html("Pending Approval");
        }
        else if (status == "S") {
            if ($.session.SEViewAdminWidget == true) {
                buttonCell.html("Approved on " + stripSeconds($("Approved_Time", this).text()));
            }
            else {
                buttonCell.html("Submitted on " + stripSeconds($("Submit_Date", this).text()));
            }
            
        }
        // Append td(buttonCell) to tr(bodyRow)
        bodyRow.append(buttonCell);
        
        if (parseFloat(hours) == 0) {
            hours = "";
        }
        else hours = parseFloat(hours).toFixed(2);

        dateText = new Date(dateText);
        dateText = pad(dateText.getMonth() + 1) + "/" + pad(dateText.getDate()) + "/" + pad((dateText.getFullYear() + "").substring(2));

        if (startTime.length > 1) {
            if (parseInt(startTime[0], 10) == 12) {
                startTime = (parseInt(startTime[0], 10)) + ":" + startTime[1] + " PM";
            }
            else if (parseInt(startTime[0], 10) > 12) {
                startTime = (parseInt(startTime[0], 10) - 12) + ":" + startTime[1] + " PM";
            }
            else {
                if (parseInt(startTime[0], 10) == 0) {
                    startTime = "12:" + startTime[1] + " AM";
                }
                else {
                    startTime = (parseInt(startTime[0], 10)) + ":" + startTime[1] + " AM";
                }
            }
        }
        else {
            startTime = "";
        }

        if (endTime.length > 1) {
            if (parseInt(endTime[0], 10) == 12) {
                endTime = (parseInt(endTime[0], 10)) + ":" + endTime[1] + " PM";
            }
            else if (parseInt(endTime[0], 10) > 12) {
                endTime = (parseInt(endTime[0], 10) - 12) + ":" + endTime[1] + " PM";
            }
            else {
                if (parseInt(endTime[0], 10) == 0) {
                    endTime = "12:" + endTime[1] + " AM";
                }
                else {
                    endTime = (parseInt(endTime[0], 10)) + ":" + endTime[1] + " AM";
                }
                
            }
        }
        else {
            endTime = "";
        }

        bodyRow.append($("<td>").text(dateText));
        bodyRow.append($("<td>").text(startTime));
        if (endText == "23:59:59") {
            //endTextReplace = "12:00:00";
            bodyRow.append($("<td>").text("12:00 AM"));

        } else {
            bodyRow.append($("<td>").text(endTime));
        }
        if (hours == "") {
            if (endTime == "") {
                bodyRow.css("border", "3px solid red");
                checkBox.attr("hourMissing", true);
            }
            else {
                var start = startTime,
                    startHours = "",
                    end = endTime,
                    endHours = "",
                    now = new Date(),
                    startDate, endDate,
                    diff, diffHrs, diffMins,
                    totalDiff;

                if (start) {
                    startHours = convertTime(start.split(":")[0], start.split(":")[1].split(" ")[0], start.split(":")[1].split(" ")[1]);
                }

                if (end) {
                    endHours = convertTime(end.split(":")[0], end.split(":")[1].split(" ")[0], end.split(":")[1].split(" ")[1]);
                }

                now = new Date();

                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours.hours, startHours.minutes);
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours.hours, endHours.minutes);
                
                diff = endDate - startDate;

                diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
                diffMins = Math.floor(((diff % 86400000) % 3600000) / 60000); // minutes

                totalDiff = parseInt(diffHrs) + parseFloat((diffMins / 60).toFixed(2));
                if (Math.floor(totalDiff) == totalDiff) totalDiff = totalDiff + ".00";
                totalDiff += "";

                totalDiff = parseFloat(totalDiff);
                totalDiff = totalDiff.toFixed(2);

                hours = totalDiff;
                
                if (endText === "23:59:59") {
                    var hoursArray = hours.split('.');
                    if (hoursArray[1] == "98") {
                        hoursArray[0]++;
                        hoursArray[1] = "00";
                        hours = hoursArray.join('.');
                    } else if (hours.length == 2) {
                        hours += "0";
                    }
                }
            }
        }
        else {
            checkBox.attr("hourMissing", false);
        }

        bodyRow.append($("<td>").text(hours));

        temp = $("<td>").text(locationText);
        if (status == "P" || status == "R") {
            temp.click((function (id) {
                return function (e) {
                    getSingleEntryById(id);
                }
            })(id)).css({
                "cursor": "pointer",
                "textDecoration": "underline"
            })
        }
        else {
            temp.click((function (id) {
                return function (e) {
                    getSingleEntryById(id, true);
                }
            })(id)).css({
                "cursor": "pointer",
                "textDecoration": "underline"
            })
        }
        bodyRow.append(temp);
        bodyRow.append($("<td>").text(workCodeText));

        if (parseInt(numConsumers, 10) > 0) numConsumersSpan.css("backgroundColor", "green");
        if (notes.trim() != "") hasNotes.css("backgroundColor", "green");
        if (transportationUnits.trim() != "") hasTransportation.css("backgroundColor", "green");
        stats.append(numConsumersSpan).append(hasNotes).append(hasTransportation);
        bodyRow.append(stats);
    });
    $('#actioncenter').html("<br />").append(holder).append(tableHolder);

    function getCheckedBoxes() {
        return tbody.find("input").filter(function () {
            return $(this).prop("checked") == true;
        });
    }
    button1 = $("<button>").addClass("singleentrybutton").text("Submit").PSmodal({
        body: "By clicking Yes, you are confirming that you have reviewed these entries and that they are correct to the best of your knowledge.",
        onbefore: function () {
            var checkedBoxes,
                hasHoursArr;

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

            hasHoursArr = $.map(checkedBoxes, function (obj) { return $(obj).attr("hourmissing"); });
            if (hasHoursArr.indexOf("true") !== -1) {
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
            return true;
        },
        buttons: [
            {
                text: "Yes",
                callback: function () {
                    var ids = $.map(getCheckedBoxes(), function (obj) { return $(obj).data("SEID"); });
                    var obj = {
                        token: $.session.Token,
                        singleEntryIdString: ids.join(","),
                        newStatus: "S"
                    }
                    updateSingleEntryStatus(obj, function () {
                        setTimeout(function () {
                            //console.log($(".filtericon").is(":visible"));
                            if ($(".filtericon").is(":visible")) {
                                $(".filtericon").click();
                            }
                            else {
                                window.dashboardUnapprovedEntryFunction();
                            }
                        }, 0);
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
    button2 = $("<button>").addClass("singleentrybutton").text("Delete").PSmodal({
        body: "Are you sure you wish to delete this record?",
        onbefore: function () {
            return getCheckedBoxes().length;
        },
        buttons: [
            {
                text: "Yes",
                callback: function () {
                    var ids = $.map(getCheckedBoxes(), function (obj) { return $(obj).data("SEID"); });
                    var obj = {
                        token: $.session.Token,
                        singleEntryIdString: ids.join(","),
                        newStatus: "R"
                    }
                    
                    var myPromises = [];
                    var deleter = function (id) {
                        return new Promise(function (fulfill, reject) {
                            deleteSingleEntryRecord(id, function (err) {
                                if (err) return reject(err);
                                fulfill();
                            })
                        });
                    }
                    ids.forEach(function (myID) {
                        myPromises.push(deleter(myID));
                    });
                    Promise.all(myPromises).then(function success() {
                        setTimeout(function () {
                            //console.log($(".filtericon").is(":visible"));
                            if ($(".filtericon").is(":visible")) {
                                $(".filtericon").click();
                            }
                            else {
                                window.dashboardUnapprovedEntryFunction();
                            }
                        }, 0);
                    }, function error(err) {
                        console.log(err);
                    });
                }
            },
            {
                text: "No",
                callback: function thisFunctionDoesNothing() {}
            }
        ]
    });
    if ($.session.isPSI == false) {
        holder.append(button1).append(button2);
    }
}