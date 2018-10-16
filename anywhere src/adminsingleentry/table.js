function initializeAdminSingleEntryGrid() {
    return new Promise(function (fulfill, reject) {
        var tableHolder = $("<div>").css("width", "100%"),
            promises = [];

        promises.push(createAdminSingleEntryTable());

        Promise.all(promises).then(function success(data) {
            var obj = { tableHolder: tableHolder };
            data.forEach(function (datum) {
                for (var key in datum) {
                    obj[key] = datum[key];
                }
            });
            tableHolder.append(obj.table);
            fulfill(obj);
        }, function error(err) {
            console.log(err);
            reject(err);
        });
    });
}

function createAdminSingleEntryTable() {
    return new Promise(function (fulfill, reject) {
        var table = $("<table class='adminsingleentryTable'><thead></thead><tbody></tbody><caption style='margin-left: 94px;' align='bottom'></caption></table>"),
            thead = table.find("thead"),
            tbody = table.find("tbody"),
            caption = table.find("caption");

        var row = $("<tr>").appendTo(thead);
        var checkboxCell = $("<th>").appendTo(row);
        checkboxCell.append($("<input>").attr("type", "checkbox").click(function () {
            var status = $(this).is(":checked");
            tbody.find("input").each(function (el) {
                $(this).prop("checked", status);
            });
        }));
        [
            "Employee",
            "Date",
            "Start Time",
            "End Time",
            "Hours",
            "Location",
            "Work Code",
            ""
        ].forEach(function (column) {
            row.append($("<th>").text(column));
        });

        fulfill({ table: table, thead: thead, tbody: tbody, caption: caption });
    });
}

function developSingleEntryGridData(res) {
    var arr = [];
    $('result', res).each(function () {
        var id = $("Single_Entry_ID", this).text();
        var status = $("Anywhere_Status", this).text();
        var firstname = $("firstname", this).text();
        var lastname = $("lastname", this).text();
        var dateText = $("Date_of_Service", this).text();
        var startText = $("Start_Time", this).text();
        var endText = $("End_Time", this).text();
        var startTime = startText.split(":");
        var endTime = endText.split(":");
        var hours = $("Check_Hours", this).text();
        var locationText = $("Location_Name", this).text();
        var workCodeText = $("WCCode", this).text();
        var consumers = $("Number_Consumers_Present", this).text();
        var notes = $("Comments", this).text();
        var transportationUnits = $("Transportation_Units", this).text();
        var latitude = $("Latitude", this).text();
        var longitude = $("Longitude", this).text();
        var hoursMissing = false;
        //if (parseInt(hours, 10) == 0) {
        if(hours === "0.00") {
            hours = "";
        }

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

        if (hours == "") {
            if (endTime == "") {
                hoursMissing = true;
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

                totalDiff = (parseInt(diffHrs, 10) + (parseFloat((diffMins / 60).toFixed(2)))).toFixed(2);
                if (Math.floor(totalDiff) == totalDiff) totalDiff = totalDiff + ".00";
                totalDiff += "";
                if (totalDiff.split(".").length > 2) totalDiff = totalDiff.split(".")[0] + "." + totalDiff.split(".")[1];
                hours = totalDiff;
            }
        }
        else {
            //checkBox.attr("hourMissing", false);
        }

        var statusObj = {
            status: status,
            
            P: "Not Submitted " + stripSeconds($("Last_Update", this).text()),
            A: "Needs Approval " + stripSeconds($("Submit_Date", this).text()),
            R: "Rejected " + stripSeconds($("Rejected_Time", this).text()),
            default: "Approved " + stripSeconds($("Approved_Time", this).text())
        };

        arr.push({
            id: id,
            status: statusObj,
            name: [lastname, firstname].join(", "),
            date: dateText,
            startTime: startTime,
            endTime: endTime,
            hours: hours,
            hoursMissing: hoursMissing,
            location: locationText,
            workCode: workCodeText,
            consumers: parseInt(consumers, 10),
            notes: notes.trim() !== "",
            transportation: transportationUnits.trim() !== "",
            latitude: latitude,
            longitude: longitude
        });
    });
    return arr;
}
