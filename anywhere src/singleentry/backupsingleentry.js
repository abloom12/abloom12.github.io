var singleEntryErrors = {
    positionDenied: "You have disabled the use of GeoLocation on this website. Please correct your settings on this browser and try again. Your data will not save, as the location is required.",
    positionUnavailable: "Your current location is currently unavailable.",
    positionTimeout: "The request to get user location timed out.",
    positionUnknown: "An unknown error occurred. Please try again. Your data will not save, as the location is required.",
    deviceUnsupported: "This device does not support GeoLocation. Please try a different browser or contact your support. Your data will not save, as GeoLocation is required.",
}

//Function called on initial page load
function singleEntryLoad(obj, isSaved) {
    var moveAllIn = $("<button>")
        .addClass("rosterbutton doubleleft").click(function () {
            var consumerListCount = $("#consumerlist").children().not(".SEconsumerunavailable");

            if (consumerListCount.length > 500) {
                consumerListCount.each(function () {
                    moveConsumerToSingleEntryCard($(this));
                });
            }
            else {
                consumerListCount.each(function () {
                    $(this).fadeOut('fast', function () {
                        moveConsumerToSingleEntryCard($(this));
                    });
                });
            }
        }),
        moveAllOut = $("<button>")
        .addClass("rosterbutton doubleright").click(function () {
            var actioncenterCount = $("#actioncenter").find("Consumer");
            if (actioncenterCount.length > 500) {
                actioncenterCount.each(function () {
                    moveConsumerToActiveList($(this));
                });
            } else {
                actioncenterCount.each(function () {
                    $(this).fadeOut('fast', function () {
                        moveConsumerToActiveList($(this));
                    });
                });
            }
        }),
        myPromises = [];

    $("#singleentrybutton").addClass("buttonhighlight");

    $("#roostertoolbar").html("").append(moveAllIn).append(moveAllOut);
    if (obj === false) {
        myPromises.push(buildSingleEntryCard({}, isSaved));
    }
    else {
        if ($.session.isCurrentlySingleEntry == false) {
            myPromises.push(buildSingleEntryBanner(true));
        }
        myPromises.push(buildSingleEntryCard(obj, isSaved));
    }

    Promise.all(myPromises).then(function success(data) {
        data.forEach(function (obj) {
            var startDateBox,
                startDate,
                endDate,
                now,
                d;
            if (obj && obj.type) {
                if (obj.type == "card") {
                    obj.buttonLogic();
                    startDateBox = $("#datebox2");
                    startDate = startDateBox.data("startDate");
                    endDate = startDateBox.data("endDate");
                    now = new Date();
                    now.setHours(0);
                    now.setMinutes(0);
                    now.setSeconds(0);
                    now.setMilliseconds(0);
                    $("#singleentrydatebox").click(function () {
                        var startDateBox = $("#datebox2"),
                            startDate = startDateBox.data("startDate"),
                            endDate = startDateBox.data("endDate"),
                            now = new Date();
                        now.setHours(0);
                        now.setMinutes(0);
                        now.setSeconds(0);
                        now.setMilliseconds(0);
                        
                        popSingleEntryCalendarDateBox($(this), startDate, endDate, (startDate <= now && now <= endDate));
                    });

                    if (startDate <= now && now <= endDate) {
                        d = now;
                    }
                    else {
                        d = startDate;
                    }
                    if (obj.dateEntry) $("#singleentrydatebox").text(obj.dateEntry);
                    else $("#singleentrydatebox").text($.format.date(d, 'MM/dd/yyyy'));
                    
                }
            }
        });
        enableCorrectCustomers([]);
        if (navigator.geolocation) {
            if (location.protocol === "https:" || location.hostname === "localhost") {
                navigator.geolocation.getCurrentPosition(function success() {}, function error(error) {
                    if ($.session.singleEntryLocationRequired == "Y") {
                        var str = "";
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                str = singleEntryErrors.positionDenied;
                                break;
                            case error.POSITION_UNAVAILABLE:
                                str = singleEntryErrors.positionUnavailable;
                                break;
                            case error.TIMEOUT:
                                str = singleEntryErrors.positionTimeout;
                                break;
                            case error.UNKNOWN_ERROR:
                                str = singleEntryErrors.positionUnknown;
                                break;
                        }
                        $.fn.PSmodal({
                            body: str,
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
                        console.log(error);
                    }
                });
            }
            else {
            }
        }
        else {
            if ($.session.singleEntryLocationRequired == "Y") {
                $.fn.PSmodal({
                    body: singleEntryErrors.deviceUnsupported,
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
            }
        }
        $(document).trigger("moduleLoad");
    }, function error(err) {
        console.log(err);
    });
}

//build Single Entry Action Banner; used by Single Entry and Admin Single Entry
function buildSingleEntryBanner(addFilterButton) {
    return new Promise(function (fulfill, reject) {
        /* Begin Action Banner building */
        
        var startCalendarIcon = $("<button>").addClass("bannericon calendaricon").attr("id", "calendaricon"),
            startDateBox = $("<dateinput>").attr("id", "datebox2").addClass("locationbox").css("width", "290px"),
            startDateInput = $("<input>").attr("id", "datebox").addClass("datebox headertext").appendTo(startDateBox).css("width", "260px");

        $('#actionbanner').html("");

        getSingleEntryPayPeriods(function (err, res) {
            if (err) {
                return reject(err);
            }
            var dates = [],
                date,
                target = startDateBox,
                now = null;
            
            $("payperiod", res).each(function () {
                var startDate = $("startdate", this).text(),
                    endDate = $("enddate", this).text(),
                    startD = new Date(startDate),
                    endD = new Date(endDate),
                    startText = leftpadTime(startD.getMonth() + 1) + "/" + leftpadTime(startD.getDate()) + "/" + startD.getFullYear(),
                    endText = leftpadTime(endD.getMonth() + 1) + "/" + leftpadTime(endD.getDate()) + "/" + endD.getFullYear(),
                    str,
                    current = new Date();
                str = [startText, endText].join(" - ");

                dates.push({ startText: startText, endText: endText, text: str, startDate: startD, endDate: endD });
                //Need below to set the time for new Date() to 12am so that it evaluates with starD and endD with the same hour.
                current = current.setHours(0, 0, 0, 0);
                if (current >= startD && endD >= current) {
                    now = dates[dates.length - 1];
                }
            });
            if (now !== null) {
                date = now;
            }
            else date = dates[0];
            target.find("input").val(date.text).attr("disabled", false);
            target.data("startDate", date.startDate)
                .data("endDate", date.endDate)
                .PSlist(dates, {
                    callback: function (item) {
                        target.find("input").val(item.text).attr("disabled", false);
                        target.data("startDate", item.startDate)
                            .data("endDate", item.endDate);

                        if (addFilterButton) singleEntryLoad(false);
                        else getEmployeeListAndCountInfoAjax(buildAdminSingleEntryEmployees);
                        $.session.isCurrentlySingleEntry = true;
                    }
                });
            fulfill();
        })
        startCalendarIcon.click(function (e) {
            startDateBox.trigger("click");
        });
        startDateInput.click(function (e) {
            startDateBox.trigger("click");
        });
        $('#actionbanner').append(startCalendarIcon).append(startDateBox);
        if (addFilterButton) {
            $("#actionbanner").append($("<button>")
                .addClass("bannericon filtericon")
                .click(function () {
                    var userId = $.session.UserId,
                        startD = startDateBox.data("startDate"),
                        endD = startDateBox.data("endDate"),
                        startDate, endDate;

                    if (startDateBox.data("startDate") == undefined
                    || startDateBox.data("endDate") == undefined) {
                        return;
                    }
                    $(".doubleright").click();
                    startDate = (startD.getFullYear() + '-' + (startD.getMonth() + 1) + '-' + startD.getDate()),
                        endDate = (endD.getFullYear() + '-' + (endD.getMonth() + 1) + '-' + endD.getDate());
                    getSingleEntryByDate(userId, startDate, endDate, "", buildSingleEntryTable);
                })
            );
        }

        //Time entry report button
        var timeEntryButton = $("<button>")
            .addClass("timeentryreportbutton")
            .text("Time Entry Report")
            .click(function () {
                var userId = $.session.UserId;
                if (startDateBox.data("startDate") == undefined
                || startDateBox.data("endDate") == undefined) {
                    return;
                }
                var startD = startDateBox.data("startDate"),
                endD = startDateBox.data("endDate");

                var startDate = (startD.getFullYear() + '-' + (startD.getMonth() + 1) + '-' + startD.getDate()),
                    endDate = (endD.getFullYear() + '-' + (endD.getMonth() + 1) + '-' + endD.getDate());
                $.session.singleEntryReportCurrentlyProcessing = true;
                $("#actionbanner").trigger("SEReportButtons");
                getEmpSingleEntryDetailReportAjax(userId, startDate, endDate);
            });

        //Overlap Report Button
        var overlapReportButton = $("<button>")
            .addClass("overlapreportbutton")
            .text("Overlap Report")
            .click(function () {
                var userId = $.session.UserId;
                if (startDateBox.data("startDate") == undefined
                || startDateBox.data("endDate") == undefined) {
                    return;
                }
                var startD = startDateBox.data("startDate"),
                endD = startDateBox.data("endDate");

                var startDate = (startD.getFullYear() + '-' + (startD.getMonth() + 1) + '-' + startD.getDate()),
                    endDate = (endD.getFullYear() + '-' + (endD.getMonth() + 1) + '-' + endD.getDate());
                $.session.singleEntryReportCurrentlyProcessing = true;
                $("#actionbanner").trigger("SEReportButtons");
                getOverlapSingleEntryDetailReportAjax(userId, startDate, endDate);
            });

        
        $("#actionbanner")
            .append(timeEntryButton)
            .append(overlapReportButton)
            .off("SEReportButtons")
            .on("SEReportButtons", function () {
                if ($.session.singleEntryReportCurrentlyProcessing == true) {
                    timeEntryButton.attr("disabled", true);
                    overlapReportButton.attr("disabled", true);
                }
                else {
                    timeEntryButton.attr("disabled", false);
                    overlapReportButton.attr("disabled", false);
                }
            })
            .trigger("SEReportButtons");
    });
    
    /* End Action Banner building */
}

function buildSingleEntryCard(vals, isSaved) {
    return new Promise(function (fulfill, reject) {
        vals = vals || {};
        var readonly = false;
        var isAdmin = false;
        var status = "";
        if (vals.readOnly) readonly = vals.readOnly;
        if (vals.isAdmin) isAdmin = vals.isAdmin;
        if (vals.status) status = vals.status;
        
        if (!vals.consumers) vals.consumers = [];
        getRequiredSingleEntryFieldsAjax(function (err, res) {
            if (err) {
                return reject(err);
            }
            var destinationRequired = $("destinationrequired", res).text();
            var noteRequired = $("noterequired", res).text();
            var odometerRequired = $("odometerrequired", res).text();
            var reasonRequired = $("reasonrequired", res).text();

            var amPm = '';
            var currHour = new Date().getHours();
            if (currHour == 00) {
                currHour = 12;
                amPm = 'AM';
            } else if (currHour == 12) {
                currHour = 12;
                amPm = 'PM';
            } else if (currHour > 12) {
                amPm = 'PM';
                currHour = currHour - 12;
            } else {
                amPm = 'AM'
            }
            currHour = addZero(currHour);
            var currMinutes = new Date().getMinutes();
            currMinutes = addZero(currMinutes);
            var currTime = "";

            var startTime = vals.startTime || currTime;
            if (startTime.toUpperCase().indexOf("N") !== -1) startTime = "";
            var endTime = vals.endTime || "";

            var correctTime = function (str) {
                var s = str;
                if (s.split(":")[0] == "0") s = "12:" + s.split(":")[1];
                if (s.indexOf("NaN") != -1) s = "";
                return s;
            }

            var errormessage = $("<p>").addClass("singleentryerror");
            var singleentryrecord = $("<div>").addClass("singleentryrecord");
            var singleentryrecordheader = $("<div>").addClass("singleentryrecordheader");
            singleentryrecord.append(singleentryrecordheader);
            $("#actioncenter").html("").append(errormessage).append(singleentryrecord);

            var dateEntry = vals.date ? new Date(vals.date) : null;
            if (dateEntry) dateEntry = $.format.date(dateEntry, 'MM/dd/yyyy');

            var dateTextBox = $("<textinput>")
                .attr("id", "singleentrydatebox")
                .mask("99/99/9999", { placeholder: dateEntry })
                .addClass("singleentrydate").text(dateEntry);

            startTime = correctTime(startTime);
            endTime = correctTime(endTime);
            
            var startTextBox = $("<textinput>").attr("id", "singleEntryStart").addClass("singleentrytime").data("startTime", startTime).text(startTime);

            var endTextBox = $("<textinput>").attr("id", "singleEntryEnd").addClass("singleentrytime").data("endTime", endTime).text(endTime);

            var target = $("<textinput>").attr("id", "singleEntryCalculated").addClass("singleentrytime");
            if (vals.hours && parseInt(vals.hours, 10) != 0) target.text(vals.hours);

            var workCodes = $("<textinput>").attr("id", "singleEntryWorkCode").addClass("singleentryworkcode");
            if (vals.workCode) workCodes.text(vals.workCode);
            else workCodes.html("&nbsp;");
            if (vals.workCodeID) workCodes.attr("workCodeID", vals.workCodeID);
            if (vals.billable) workCodes.attr("billable", vals.billable);

            var locations = $("<textinput>").attr("id", "SElocationbox").addClass("singleentrylocation");

            startTextBox.data("target", target);
            endTextBox.data("target", target);
            
            if (!readonly) {
                var incrementSettings = {};
                if ($.session.singleEntry15minDoc == "Y") {
                    incrementSettings = {
                        increment: 15,
                        incrementMessage: "This is not a valid time, you must document to the nearest quarter hour.",
                    }
                }
                startTextBox.change(function () {
                    target.trigger("calculate");
                }).click(function (e) {
                    setupTimeInputBox(startTextBox, {
                        x: startTextBox.offset().left + 30,
                        y: startTextBox.offset().top - 100,
                    }, incrementSettings);
                    return false;
                });
                endTextBox.change(function () {
                    target.trigger("calculate");
                }).click(function (e) {
                    setupTimeInputBox(endTextBox, {
                        x: endTextBox.offset().left + 30,
                        y: endTextBox.offset().top - 100,
                        
                    }, incrementSettings);
                    return false;
                });
            }

            target.on("calculate", function () {
                singleEntryTimeCalculate(startTextBox, endTextBox, target);
                buttonLogic();
            });

            var notesBox = $("<textarea>").hide().bind("change", function () {
                buttonLogic();
            }).val(vals.notes || "");

            var notesButton = $("<span>").addClass("singleentrynotes").click(function () {
                notesButtonClick({
                    notesBox: notesBox,
                    readonly: readonly
                });
            });

            var transportationIndicator = $("<input>").hide(),
                transportationType = $("<input>").hide().val(vals.transportationType || ""),
                transportationOdometerStart = $("<input>").hide().val(vals.transportationOdometerStart || ""),
                transportationOdometerEnd = $("<input>").hide().val(vals.transportationOdometerEnd || ""),
                transportationTotalMiles = $("<input>").hide().val(vals.transportationTotalMiles || ""),
                transportationDestination = $("<input>").hide().val(vals.transportationDestination || ""),
                transportationReason = $("<input>").hide().val(vals.transportationReason || "");

            var transportationButton = buildTransportationButton({
                transportationIndicator: transportationIndicator,
                transportationType: transportationType,
                transportationOdometerStart: transportationOdometerStart,
                transportationOdometerEnd: transportationOdometerEnd,
                transportationTotalMiles: transportationTotalMiles,
                transportationDestination: transportationDestination,
                transportationReason: transportationReason,
                destinationRequired: destinationRequired,
                noteRequired: noteRequired,
                odometerRequired: odometerRequired,
                reasonRequired: reasonRequired,
                status: status,
                readonly: readonly
            });

            transportationIndicator.bind("change", function () {
                transportationButton.removeClass("singleentrytransportationYes");
                if (this.value !== "") {
                    transportationButton.addClass("singleentrytransportationYes");
                }
                buttonLogic();
            });
            

            var singleEntryID = vals.singleEntryID || "";
            var saver = $("<button>").addClass("singleentrybutton");
            var saveMessage = $("<div>").text("Record Saved").css("color", "white").hide();
            var saveCount = 0;
            if (isSaved == true) saveCount = 4;
            //if (isSaved == true) saveMessage.show();

            var saveClick = function (results) {
                var startDateBox = $("#datebox2"),
                    startDate = startDateBox.data("startDate"),
                    endDate = startDateBox.data("endDate"),
                    startMoment = moment(startDate),
                    endMoment = moment(endDate).add(1, "days"),//Add a day because MomentJS's isBetween function requires it 
                    nowMoment = moment();

                var thisFunc = function () {
                    if (results.data.startTime == "" && results.data.endTime == "") {
                        if (results.data.singleEntryID == "") {
                            if (location.protocol === "https:" || location.hostname === "localhost") {
                                getDeviceLocation(function (position) {
                                    if (position && position.coords) {
                                        var latitude = position.coords.latitude;
                                        var longitude = position.coords.longitude;
                                        results.data.latitude = latitude;
                                        results.data.longitude = longitude;
                                    }
                                    saveSingleEntryDataSetUp(results.data);
                                });
                            } else {
                                saveSingleEntryDataSetUp(results.data);
                            }
                        }
                        else {
                            updateSingleEntryDataSetUp(results.data);
                        }
                    } else {
                        singleEntryOverlapDataSetUp(results.data, function (err, res) {
                            if (err) throw err;
                            var myFunc = function () {
                                if (results.data.singleEntryID == "") {
                                    if (navigator.geolocation) {
                                        if (location.protocol === "https:" || location.hostname === "localhost") {
                                            navigator.geolocation.getCurrentPosition(function success(position) {
                                                if (position) {
                                                    var latitude = position.coords.latitude;
                                                    var longitude = position.coords.longitude;
                                                    results.data.latitude = latitude;
                                                    results.data.longitude = longitude;
                                                }
                                                saveSingleEntryDataSetUp(results.data);
                                            }, function error(error) {
                                                if ($.session.singleEntryLocationRequired == "Y") {
                                                    var str = "";
                                                    switch (error.code) {
                                                        case error.PERMISSION_DENIED:
                                                            str = singleEntryErrors.positionDenied;
                                                            break;
                                                        case error.POSITION_UNAVAILABLE:
                                                            str = singleEntryErrors.positionUnavailable;
                                                            break;
                                                        case error.TIMEOUT:
                                                            str = singleEntryErrors.positionTimeout;
                                                            break;
                                                        case error.UNKNOWN_ERROR:
                                                            str = singleEntryErrors.positionUnknown;
                                                            break;
                                                    }
                                                    $.fn.PSmodal({
                                                        body: str,
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
                                                    saveSingleEntryDataSetUp(results.data);
                                                }
                                            });
                                        }
                                        else {
                                            saveSingleEntryDataSetUp(results.data);
                                        }
                                    }
                                    else {
                                        if ($.session.singleEntryLocationRequired == "Y") {
                                            $.fn.PSmodal({
                                                body: singleEntryErrors.deviceUnsupported,
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
                                            saveSingleEntryDataSetUp(results.data);
                                        }
                                    }
                                }
                                else {
                                    updateSingleEntryDataSetUp(results.data);
                                }
                            };
                            if ($("single_entry_id", res).length && $("single_entry_id", res).map(function () { return $(this).text() }).get().join() != singleEntryID) {
                                $.fn.PSmodal({
                                    body: "There is an overlap with an existing Single Entry record. Do you wish to proceed?",
                                    immediate: true,
                                    buttons: [
                                        {
                                            text: "Yes",
                                            callback: function () {
                                                myFunc();
                                            }
                                        },
                                        {
                                            text: "No",
                                            callback: function () {
                                            }
                                        }
                                    ]
                                });
                            }
                            else {
                                myFunc();
                            }
                        })
                    }
                }
                if (!nowMoment.isBetween(startMoment, endMoment)) {
                    $.fn.PSmodal({
                        body: "You are saving a time record outside of the current pay period. Do you want to save and continue?",
                        immediate: true,
                        buttons: [
                            {
                                text: "Yes",
                                callback: function () {
                                    thisFunc();
                                }
                            },
                            {
                                text: "No",
                                callback: function () {

                                }
                            }
                        ]
                    });
                }
                else {
                    thisFunc();
                }
            };
            
            var deleter = $("<button>").addClass("singleentrybutton").text("Delete");

            var deleteClick = function (id) {
                $.fn.PSmodal({
                    body: "Are you sure you wish to delete this record?",
                    immediate: true,
                    buttons: [
                        {
                            text: "Yes",
                            callback: function () {
                                deleteSingleEntryRecord(id, function (err) {
                                    if (err) return console.log(err);
                                    loadApp('singleentry');
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
            };

            var canceler = $("<button>").addClass("singleentrybutton").text("Cancel").click(function () {
                if (isAdmin) loadApp('adminsingleentry', isAdmin);
                else loadApp('singleentry');
            });
            
            var buttonLogic = function () {
                deleter.hide().off("click");
                canceler.hide();
                if (saveCount > 0) {
                    saveCount--;
                    setTimeout(function () { saveMessage.fadeIn(); }, 1000);
                }
                else saveMessage.hide();
                saver.hide().off("click");

                if (singleEntryID != "") {
                    deleter.show().on("click", function () {
                        deleteClick(singleEntryID);
                    });
                    canceler.show();
                }
                var startTime = startTextBox.text(),
                        endTime = endTextBox.text();

                if (startTime == "") startTime = startTextBox.val();
                if (endTime == "") endTime = endTextBox.val();

                var results = singleEntryAuditor({
                    location: locations.attr("locid"),
                    locationBox: locations,
                    date: dateTextBox.text(),
                    startTime: startTime,
                    endTime: endTime,
                    timeDiff: target.text(),
                    workCode: workCodes.attr("workCodeID"),
                    billable: workCodes.attr("billable"),
                    keyTimes: workCodes.attr("keyTimes"),
                    notes: removeUnsavableNoteText(notesBox.val()),
                    transportationType: transportationType.val(),
                    transportationOdometerStart: transportationOdometerStart.val(),
                    transportationOdometerEnd: transportationOdometerEnd.val(),
                    transportationTotalMiles: transportationTotalMiles.val(),
                    transportationDestination: removeUnsavableNoteText(transportationDestination.val()),
                    transportationReason: removeUnsavableNoteText(transportationReason.val()),
                    consumers: singleentryrecord.find("consumer"),
                    consumerGroups: singleentryrecord.find("consumer-group"),
                    singleEntryID: singleEntryID,
                    requiredData: res,
                    errormessage: errormessage
                });

                notesButton.removeClass("singleentrynotesNotNeeded singleentrynotesYes singleentrynotesNo");
                if (results.data.notes == "") {
                    if (results.required.noteRequired == "N") {
                        notesButton.addClass("singleentrynotesNotNeeded");
                    }
                    else {
                        notesButton.addClass("singleentrynotesNo");
                    }
                }
                else {
                    notesButton.addClass("singleentrynotesYes");
                }

                if (readonly) {
                    canceler.show();
                }
                else {
                    

                    if (!results.errors.length) {
                        saver.show().on("click", function () {
                            saveClick(results);                            
                        })
                        if (singleEntryID == "") {
                            saver.text("Save");
                        }
                        else {
                            saver.text("Update");
                        }
                    }
                    else {
                        console.log(results.errors);
                    }
                }
            }

            window.buttonLogic = buttonLogic;

            window.singleentryErrors = {};
            var addLabel = function (obj) {
                var item = obj.item;
                var label = obj.label;
                var mainSpan = $("<span>");
                var errorSpan = $("<span>").html("<img src='./Images/new-icons/icon_error.png'>").css({
                    "float": "left",
                    "backgroundImage": "url(../Images/new-icons/icon_error.png)",
                    "backgroundRepeat": "no-repeat",
                    "backgroundSize": "1.1%"
                }).hide();
                var span = $("<span>");
                var div = $("<div>").text(label).css("textAlign", "center");
                span.append(div);
                span.append(item);
                window.singleentryErrors[obj.errorCode] = errorSpan;
                mainSpan.append(errorSpan);
                mainSpan.append(span);
                return mainSpan;
            }
            var div1 = $("<div>");
            var div2 = $("<div>");

            div1.append(addLabel({ item: dateTextBox, label: "Date", errorCode: "date" }))
                .append(addLabel({ item: workCodes, label: "Work Code", errorCode: "workCode" }).addClass("singleentryworkcodeholder"))
                .append(addLabel({ item: startTextBox, label: "Start Time", errorCode: "startTime" }))
                .append(addLabel({ item: endTextBox, label: "End Time", errorCode: "endTime" }))
                .append(addLabel({ item: target, label: "Hours", errorCode: "hours" }));

            div2.append(notesBox)
                .append(notesButton)
                .append(transportationButton)
                .append(transportationIndicator)
                .append(addLabel({ item: locations, label: "Location", errorCode: "locations" }).addClass("singleentrylocationholder").css("paddingRight", "5px").hide());

            var transportationInputs = [transportationType, transportationOdometerStart, transportationOdometerEnd, transportationTotalMiles, transportationDestination, transportationReason];

            transportationInputs.forEach(function (input) {
                div2.append(input);
            });

            singleentryrecordheader.append(div1).append(div2);
            var consumersLabelHolder = $("<span style='float: left;'>");
            var errorSpan = $("<span>").html("<img src='./Images/new-icons/icon_error.png'>").hide();
            var consumersLabel = $("<div id='seConsumersLabel'>").html("Consumers:");
            singleentryrecord.append(consumersLabelHolder).append($("<br>"));
            consumersLabelHolder.append(errorSpan);
            consumersLabelHolder.append(consumersLabel);
            window.singleentryErrors["consumers"] = errorSpan;

            var consumers = [];
            vals.consumers.forEach(function (consumer) {
                
                var names = consumer.name.split(" ");
                var firstName = names.shift();
                var lastName = names.join(" ");
                consumers.push({
                    firstName: firstName,
                    lastName: lastName,
                    id: consumer.id
                });
            });
            consumers.sort(function (a, b) {
                if (a.lastName < b.lastName) return -1;
                if (a.lastName > b.lastName) return 1;
                return 0
            });
            consumers.forEach(function (consumer) {
                var tag = $("<consumer-group>").attr("id", consumer.id).click(function () {
                    $(this).remove();
                    $("#consumerlist").find("#" + consumer.id).removeClass("SEconsumerunavailable");
                    buttonLogic();
                }).addClass("consumer singleentryselected");

                var consumerInfo = $("<consumerinfo>").appendTo(tag);
                var picbox = $("<picbox>").appendTo(consumerInfo).addClass("picbox");
                var pic = $("<img onerror=\"this.src='./images/new-icons/default.jpg'\">")
                    .addClass("portrait")
                    .attr("src", "./images/portraits/" + consumer.id + ".png?rng=" + +(new Date())).appendTo(picbox);

                var consumerbodybox = $("<consumerbodybox>").appendTo(consumerInfo).addClass("consumerbodybox");
                var namebox = $("<namebox>").appendTo(consumerbodybox).addClass("namebox nametext").text(consumer.firstName);
                namebox.append("<div class='lastnametext'>" + consumer.lastName + "</div>");
                $("#consumerlist").find("#" + consumer.id).addClass("SEconsumerunavailable").data("preHide", true);
                singleentryrecord.append(tag);
            });

            notesBox.trigger("change");
            target.trigger("calculate");

            var buttonHolder = $("<div>").css({
                "position": "absolute",
                "bottom": "0px",
                "right": "0px",
                "zIndex": "9999"
            }).append(saveMessage)
            if (vals.readOnly == true) {
                buttonHolder.append(saver).append(canceler);
            } else {
                buttonHolder.append(saver).append(deleter).append(canceler);
            }
            
            singleentryrecord.append(buttonHolder);
            updateTransportationIndicator(transportationTotalMiles, transportationIndicator);

            finishSingleEntryCard({
                vals: vals,
                startTime: startTextBox,
                hours: target,
                workCodes: workCodes,
                readonly: readonly,
                locations: locations,
                buttonLogic: buttonLogic,
                fulfill: fulfill,
                endTime: endTextBox,
                dateEntry: dateEntry,
                reject: reject
            });
        });
    });    
}

function notesButtonClick(obj) {
    var notesBox = obj.notesBox,
        readonly = obj.readonly;

    var overlay = $("<div>");
    overlay.addClass("singleentryoverlay")

    var wrapper = $("<div>").click(function (e) {
        e.stopImmediatePropagation();
    }).addClass("singleentrynotewindow");

    var row1 = $("<div>");

    var decoration = $("<span>");

    var textarea = $("<textarea>").bind("keyup", function () {
        decoration.removeClass("singleentrynotestextareaYes singleentrynotestextareaNo");
        if (this.value !== "") {
            decoration.addClass("singleentrynotestextareaYes");
        }
        else {
            decoration.addClass("singleentrynotestextareaNo");
        }
    }).val(notesBox.val()).trigger("keyup");
    
    row1.append(decoration).append(textarea);

    var row2 = $("<div>").css({
        "width": "100%",
        "textAlign": "right"
    });
    
    var saveButton = $("<button>").text("Save").click(function () {
        notesBox.val(textarea.val().trim()).trigger("change");
        overlay.remove();
    }).addClass("singleentrynotessave singleentrybutton");

    var resetButton = $("<button>").text("Reset").click(function () {
        textarea.val("").trigger("keyup").focus();
    }).addClass("singleentrynotesreset singleentrybutton");

    var cancelButton = $("<button>").text("Cancel").click(function () {
        overlay.remove();
    }).addClass("singleentrynotescancel singleentrybutton");

    if (readonly) {
        textarea.attr("disabled", true);
        row2.append(cancelButton);
    }
    else {
        row2.append(saveButton).append(resetButton).append(cancelButton);
    }

    
    wrapper.append(row1).append(row2);
    overlay.append(wrapper);
    $("body").append(overlay);
    textarea.focus();
}

function finishSingleEntryCard(obj) {
    var vals = obj.vals,
        workCodes = obj.workCodes,
        startTime = obj.startTime,
        hours = obj.hours,
        readonly = obj.readonly,
        locations = obj.locations,
        buttonLogic = obj.buttonLogic,
        fulfill = obj.fulfill,
        reject = obj.reject,
        dateEntry = obj.dateEntry,
        endTime = obj.endTime;

    window.buildCustomerList = function (myWorkCode) {
        //start MR code for ticket 26585
        var ID = locations.attr("locid");
        var date = $("#singleentrydatebox").html();
        date = formatDateForDatabaseSave(date);
        if (ID) {
            getSingleEntryUsersByLocationAjax(ID, date, function (err, res) {
                if (err) {
                    return console.log(err);
                }
                var ids = [];
                $("result", res).each(function () {
                    ids.push({consumer_id: $(this).find("consumer_id").text()})
                });
                enableCorrectCustomers(ids, myWorkCode || "N");
                buttonLogic();
            })
        }
        else {
            enableCorrectCustomers("", myWorkCode || "N");
            buttonLogic();
        }
        return;
        //end MR code for ticket 26585

        /*
         * This is where the new logic needs to go in for ticket 24673
         */
        var date = $("#singleentrydatebox").html();
        date = formatDateForDatabaseSave(date);
        getSingleEntryUsersWCAjax({ token: $.session.Token, seDate: date }, function (err, data) {
            if (err) throw err;
            enableCorrectCustomers(data, myWorkCode || "N");
            buttonLogic();
        });
        /*
        var ID = locations.attr("locid");
        var date = $("#singleentrydatebox").html();
        date = formatDateForDatabaseSave(date);
        if (ID) {
            /*getSingleEntryUsersByLocationAjax(ID, date, function (err, res) {
                if (err) {
                    return console.log(err);
                }
                enableCorrectCustomers(res, myWorkCode || "N");
                buttonLogic();
            })
            
            getSingleEntryUsersWCAjax({ token: $.session.Token, seDate: date }, function (err, data) {
                if (err) throw err;
                console.log(data);
            });
        }
        else {
            enableCorrectCustomers("", myWorkCode || "N");
            buttonLogic();
        }
        */
    }

    var myPromises = [];
    myPromises.push((function () {
        return new Promise(function (fulfill, reject) {
            getWorkCodes(function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }
                var target = workCodes;
                var workCodesArr = [];
                $('workcode', res).each(function () {
                    var workcodeid = $('workcodeid', this).text(),
                        workcodename = $('workcodename', this).text(),
                        workcodebillable = $('billable', this).text(),
                        keyTimes = $("keyTimes", this).text();

                    workCodesArr.push({
                        id: workcodeid,
                        billable: workcodebillable,
                        keyTimes: keyTimes,
                        text: workcodename
                    });
                });
                /*
                workCodesArr.sort(function (a, b) {
                    var aName = a.text, bName = b.text;
                    if (aName < bName) return -1;
                    if (aName > bName) return 1;
                    return 0;
                });
                */
                if (!readonly) {
                    target.PSlist(workCodesArr, {
                        callback: function (item) {
                            $(this).text(item.text)
                                .attr("workCodeID", item.id)
                                .attr("billable", item.billable)
                                .attr("keyTimes", item.keyTimes);
                            if (item.keyTimes == "N") {
                                startTime.val("").text("");
                                endTime.val("").text("");
                                startTime.addClass('unclickableElement');
                                endTime.addClass('unclickableElement');
                                hours.attr("contenteditable", true).off("blur").on("blur", function () {
                                    buttonLogic();
                                });
                            }
                            else if (item.keyTimes == "Y") {
                                startTime.val(startTime.data("startTime")).text(startTime.data("startTime"))
                                startTime.removeClass('unclickableElement');
                                endTime.removeClass('unclickableElement');
                                hours.attr("contenteditable", false).trigger("calculate").off("blur")
                            }

                            if (item.billable == "Y") {
                                locations.parent().parent().css("display", "none");
                            }
                            else locations.parent().parent().css("display", "inline-block");
                            //MR code for ticket 26585 
                            if ($.session.singleEntryAddConsumersOnBillable == "Y") {
                                locations.parent().parent().css("display", "inline-block");
                            }
                            //end MR code for ticket 26585
                            buildCustomerList(item.billable);
                        }
                    });
                }
                fulfill();
            });
        });
    })());

    myPromises.push((function () {
        return new Promise(function (fulfill, reject) {
            getSingleEntryLocations(function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }
                var myLocations = [];
                $('location', res).each(function () {
                    var ID = $('ID', this).text(),
                        name = $('Name', this).text(),
                        residence = $('Residence', this).text(),
                        singleEntryTransportationReimburse = $("SE_Trans_Reimbursable", this).text();
                    if (residence == "Y") {
                        text = "<img class='houseicon' src='./images/new-icons/icon_house.png'>" + name;
                    }
                    else {
                        text = "<img class='buildingicon' src='./images/new-icons/icon_building.png'>" + name;
                    }
                    myLocations.push({
                        name: name,
                        text: text,
                        ID: ID,
                        residence: residence,
                        singleEntryTransportationReimburse: singleEntryTransportationReimburse
                    });
                });
                var defaultLocation = null;
                function getDefaultLocation(callback) {
                    callback(vals.locationID || null);
                }
                getDefaultLocation(function (id) {
                    defaultLocation = myLocations.filter(function (location) {
                        return location.ID == id;
                    });
                    if (!defaultLocation.length) defaultLocation = null;
                    else defaultLocation = defaultLocation[0];

                    function setLocation(location, firstTime) {
                        if (vals.locationName && firstTime) {
                            locations.html(vals.locationName).attr('locid', vals.locationID).attr('residence', "Y").attr("singleEntryTransportationReimburse", vals.transportationType);
                            locations.parent().parent().show();
                            buildCustomerList(workCodes.attr("billable"));
                        }
                        else {
                            if (location) {
                                locations.html(location.name).attr('locid', location.ID).attr('residence', location.residence).attr("singleEntryTransportationReimburse", location.singleEntryTransportationReimburse);
                                locations.parent().parent().show();

                                buildCustomerList(workCodes.attr("billable"));
                            }
                            else {
                                locations.html("Select Location").attr('locid', null).attr('residence', null).attr("singleEntryTransportationReimburse", null);
                            }
                        }
                    }
                    if (!readonly) {
                        locations.PSlist(myLocations, {
                            callback: function (item) {
                                setLocation(item, false);
                            }
                        })
                    }
                    setLocation(defaultLocation, true);
                });
                fulfill();
            });
        });
    })());

    Promise.all(myPromises).then(function success(data) {
        fulfill({
            type: "card",
            readonly: readonly,
            buttonLogic: buttonLogic,
            dateEntry: dateEntry
        });
    }, function error(err) {
        console.log(err);
        reject(err);
    });
}

function updateTransportationIndicator(transportationTotalMiles, transportationIndicator) {
    var str = "";
    if (transportationTotalMiles.val() != "") str = "Y";
    transportationIndicator.val(str).trigger("change");
}

function buildTransportationButton(inputs) {
    var transportationIndicator = inputs.transportationIndicator,
        transportationType = inputs.transportationType,
        transportationOdometerStart = inputs.transportationOdometerStart,
        transportationOdometerEnd = inputs.transportationOdometerEnd,
        transportationTotalMiles = inputs.transportationTotalMiles,
        transportationDestination = inputs.transportationDestination,
        transportationReason = inputs.transportationReason,
        destinationRequired = inputs.destinationRequired,
        noteRequired = inputs.noteRequired,
        odometerRequired = inputs.odometerRequired,
        reasonRequired = inputs.reasonRequired,
        status = inputs.status,
        readonly = inputs.readonly,
        transportationInputs = [transportationType, transportationOdometerStart, transportationOdometerEnd, transportationTotalMiles, transportationDestination, transportationReason],
        transportationButton = $("<span>").addClass("singleentrytransportation").click(function (e) {
            var URL = "./singleentry/transportation.html";
            $.ajax({
                type: "GET",
                url: URL + "?RNG=" + +(new Date()),
                success: function (response) {
                    buildTransportationModal({
                        html: response,
                        readonly: readonly,
                        transportationIndicator: transportationIndicator,
                        transportationType: transportationType,
                        transportationOdometerStart: transportationOdometerStart,
                        transportationOdometerEnd: transportationOdometerEnd,
                        transportationTotalMiles: transportationTotalMiles,
                        transportationDestination: transportationDestination,
                        transportationReason: transportationReason,
                        transportationInputs: transportationInputs,
                        destinationRequired: destinationRequired,
                        noteRequired: noteRequired,
                        odometerRequired: odometerRequired,
                        reasonRequired: reasonRequired,
                        status: status
                    })
                
                },
                error: function (xhr, status, error) {
                    console.log(xhr, status, error);
                }
            });
        });

    return transportationButton;
}

function singleEntryTimeCalculate(startTextBox, endTextBox, target) {
    if (endTextBox.text() != "") {
        if (startTextBox.text() === "00:00 PM" || endTextBox.text() === "00:00 PM") {
            target.html("");
            return;
        }
        var start = startTextBox.text(),
            startTime = "",
            end = endTextBox.text(),
            endTime = "",
            now = new Date(),
            startDate, endDate,
            diff, diffHrs, diffMins,
            totalDiff;
        if (start) {
            startTime = convertTime(start.split(":")[0], start.split(":")[1].split(" ")[0], start.split(":")[1].split(" ")[1]);
        }
        
        if (end) {
            endTime = convertTime(end.split(":")[0], end.split(":")[1].split(" ")[0], end.split(":")[1].split(" ")[1]);
        }

        now = new Date();

        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startTime.hours, startTime.minutes);
        if (end == "12:00 AM") {
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, endTime.hours, endTime.minutes);
        } else {
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endTime.hours, endTime.minutes);
        }
        

        diff = endDate - startDate;
        
        diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
        diffMins = Math.floor(((diff % 86400000) % 3600000) / 60000); // minutes

        totalDiff = (parseInt(diffHrs, 10) + (parseFloat((diffMins / 60).toFixed(2)))).toFixed(2);
        if (Math.floor(totalDiff) == totalDiff) totalDiff = totalDiff + ".00";
        totalDiff += "";
        if (totalDiff.split(".").length > 2) totalDiff = totalDiff.split(".")[0] + "." + totalDiff.split(".")[1];
        if (totalDiff.indexOf("-") > -1) totalDiff = "Invalid";
        if (isNaN(totalDiff) && totalDiff != "Invalid") totalDiff = "";
        if (start == end && start == "12:00 AM") totalDiff = "24.00";
        target.html(totalDiff);
    }    
}

function leftpadTime(str) {
    str = parseInt(str, 10);
    if (str < 0 || str > 60) throw "Invalid time entered for leftpadTime";
    else if (str < 10) str = "0" + str;
    return str + "";
}

function stripSeconds(str) {
    //Assumes format like "1/3/2017 1:51:32 PM"    
    var d = new Date(str);
    if (isNaN(d.getTime())) return "";
    var AMorPM = "AM";
    var hours = d.getHours();
    if (hours >= 12) {
        AMorPM = "PM";
        if (hours != 12) hours -= 12;
    }
    return leftpadTime(d.getMonth() + 1) + "/" + leftpadTime(d.getDate()) + "/" + d.getFullYear() + " " + leftpadTime(hours + "") + ":" + leftpadTime(d.getMinutes() + "") + " " + AMorPM;
}

function convertTime(hours, minutes, AMorPM) {
    var time = {
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10)
    }
    if (AMorPM === "PM") {
        if (hours != 12) time.hours += 12;
    }
    else {
        if (hours == 12) time.hours = 0;
    }
    return time;
}

function bindSingleEntryWorkCodes(res, target, readonly) {
    var workCodes = [];
    $('workcode', res).each(function () {
        var workcodeid = $('workcodeid', this).text(),
            workcodename = $('workcodename', this).text(),
            workcodebillable = $('billable', this).text();

        workCodes.push({
            id: workcodeid,
            name: workcodename,
            text: workcodename,
            billable: workcodebillable
        });
    });
    if (!readonly) {
        target.PSlist(workCodes, {
            callback: function (item) {
                target
                    .text(item.text)
                    .attr("workCodeID", item.id)
                    .attr("billable", item.billable);
            }
        });
    }
}

function timeStringToFloat(time) {
    /*
    var hoursMinutes = time.split(/[.:]/),
        hours = parseInt(hoursMinutes[0], 10),
        minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;

    if (isNaN(hours)) {
        return ((60 * (minutes / 100))).toFixed(2);
    } else {
        return (hours + (60 * (minutes / 100))).toFixed(2);
    }
    */
    return time;
}

function parseSingleEntry(res, readonly, isAdmin) {
    var vals = {
            startTime: undefined,
            endTime: undefined,
            hours: undefined,
            date: undefined,
            workCode: undefined,
            workCodeID: undefined,
            billable: undefined,
            locationID: undefined,
            locationName: undefined,
            notes: undefined,
            transportationType: undefined,
            transportationOdometerStart: undefined,
            transportationOdometerEnd: undefined,
            transportationTotalMiles: undefined,
            transportationDestination: undefined,
            transportationReason: undefined,
            singleEntryID: undefined,
            status: undefined,
            readOnly: false,
            isAdmin: false,
        },
        startTime = $("Start_Time", res).text().split(":"),
        endTime = $("End_Time", res).text().split(":"),
        hours = $("Check_Hours", res).text();

    if (typeof readonly != undefined) vals.readOnly = readonly;
    if (typeof isAdmin != undefined) vals.isAdmin = isAdmin;
    if ($("singleentry", res).length > 0) {

        vals.date = $("Date_of_Service", res).text();

        vals.singleEntryID = $("Single_Entry_ID", res).text();
        vals.notes = $("Comments", res).text();

        if (startTime.length > 1) {
            if (parseInt(startTime[0], 10) == 12) {
                startTime = (parseInt(startTime[0], 10)) + ":" + startTime[1] + " PM";
            }
            else if (parseInt(startTime[0], 10) > 12) {
                startTime = (parseInt(startTime[0], 10) - 12) + ":" + startTime[1] + " PM";
            }
            else {
                startTime = (parseInt(startTime[0], 10)) + ":" + startTime[1] + " AM";
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
                endTime = (parseInt(endTime[0], 10)) + ":" + endTime[1] + " AM";
            }
        }
        else {
            endTime = "";
        }

        vals.startTime = startTime;
        vals.endTime = endTime;
        vals.hours = hours;
        vals.workCode = $("Work_Code_Name", res).text();
        vals.workCodeID = $("Work_Code_ID", res).text();
        vals.billable = $("billable", res).text();
        vals.locationID = $("Location_ID", res).text();
        vals.locationName = $("Location_Name", res).text();
        vals.transportationTotalMiles = $("Transportation_Units", res).text();
        vals.transportationType = $("Transportation_reimbursable", res).text();
        vals.transportationOdometerStart = $("odometerstart", res).text();
        vals.transportationOdometerEnd = $("odometerend", res).text();
        vals.status = $("Anywhere_Status", res).text();

        vals.transportationDestination = $("destination", res).text();
        vals.transportationReason = $("reason", res).text();
        vals.consumers = [];
        $("consumername", res).each(function (index) {
            var name = $(this).text();
            var id = $($("consumerid", res)[index]).text();
            vals.consumers.push({
                name: name,
                id: id
            });
        });
    }
    $(".leftsidemenu").removeClass("buttonhighlight");
    singleEntryLoad(vals);
}

function insertSingleEntrySuccess(res) {
    moveAllConsumersToActiveListSE();
}

function singleEntryAuditor(opts) {
    var result = {
            errors: [],
            data: opts,
            required: {}
        },
        res = opts.requiredData,
        errormessage = opts.errormessage,
        destinationRequired = $("destinationrequired", res).text(),
        noteRequired = $("noterequired", res).text(),
        odometerRequired = $("odometerrequired", res).text(),
        reasonRequired = $("reasonrequired", res).text(),
        consumerIdString = [],
        //The three variables below are not being used as of 05/19/2016 - J.D. Lowe
        supervisorApproval = $("supervisorapproval", res).text(),
        reconfigImportFile = $("reconfigimportfile", res).text(),
        use5CharacterWorkcode = $("use5characterworkcode", res).text();
    Object.keys(window.singleentryErrors).forEach(function (key) {
        window.singleentryErrors[key].hide();
    });
    
    result.required.destinationRequired = destinationRequired;
    result.required.noteRequired = noteRequired;
    result.required.odometerRequired = odometerRequired;
    result.required.reasonRequired = reasonRequired;

    errormessage.html("");

    result.data.consumers.each(function () {
        consumerId = $(this).attr("id");
        consumerIdString.push(consumerId);
    });

    result.data.consumerGroups.each(function () {
        consumerIdString.push($(this).attr("id"));
    });

    var isTimeInvalid = function (time) {
        if (time.trim() == "") return false;
        else {
            var hours = time.split(":")[0],
                minutes = time.split(":")[1];

            if (parseInt(hours, 10) > 12 || parseInt(minutes, 10) > 59) return true;
            else return false;
        }
    }

    if (result.data.timeDiff == "Invalid") {
        result.errors.push("Please enter a valid start and end time.");
        window.singleentryErrors["hours"].show();
    }

    result.data.numberOfConsumersPresent = consumerIdString.length;
    result.data.consumerId = consumerIdString.join(",");

    if (opts.location == undefined && opts.locationBox.is(":visible")) {
        result.errors.push("Please select a location.");
        window.singleentryErrors["locations"].show();
    }
    if (opts.workCode == undefined) {
        window.singleentryErrors["workCode"].show();
        result.errors.push("Please select a valid work code.");
    }
    
    if (opts.billable != undefined) {
        if (opts.billable == "Y") {
            if (!consumerIdString.length) {
                result.errors.push("Please select at least one consumer.");
                window.singleentryErrors["consumers"].show();
            }
        }
    }
    if (opts.keyTimes != undefined) {
        if (opts.keyTimes == "N" && (opts.timeDiff == "" || isNaN(parseFloat(opts.timeDiff)) || opts.timeDiff.indexOf("-") != -1)) {
            result.errors.push("Please enter a valid Total Hours.");
            window.singleentryErrors["hours"].show();
        }
        else if (opts.keyTimes == "Y") {
            result.data.timeDiff = "0.00";
            if (result.data.startTime == "" || isTimeInvalid(result.data.startTime)) {
                result.errors.push("Please enter a valid Start Time.");
                window.singleentryErrors["startTime"].show();
            }
        }
    }

    if (result.required.noteRequired == "Y" && result.data.notes.trim() == "") {
        result.errors.push("Notes are required.");
    }

    if (isTimeInvalid(result.data.endTime)) {
        result.errors.push("Please enter a valid End Time.");
        window.singleentryErrors["endTime"].show();
    }
    return result;
}

function moveAllConsumersToActiveListSE() {
    //fade out is huge performance hit in large numbers
    var actioncenterCount = $("#actioncenter").children('.singleentryrecord').children();
    if (actioncenterCount.length > 500) {
        $("#actioncenter").find('Consumer').each(function () {
            moveConsumerToActiveList($(this));
        });
    } else {
        $("#actioncenter").find('Consumer').each(function () {
            $(this).fadeOut('fast', function () {
                moveConsumerToActiveList($(this));
            });
        });
    }

}

function enableCorrectCustomers(arr, workCode) {
    var ids = [];
    if(arr != "") ids = arr.map(function (el) { return el.consumer_id; });
    var consumers = [];
    $("consumer", ".singleentryrecord").each(function () {
        if (ids.indexOf($(this).attr("id")) === -1) {
            consumers.push($(this));
        }
        else if (workCode == "N") {
            consumers.push($(this));
        }
    });

    if (workCode == "N") ids = [];

    consumers.forEach(function (Consumer) {
        moveConsumerToActiveList(Consumer);
    });
    $("#consumerlist").children().addClass("SEconsumerunavailable");
    ids.forEach(function (id) {
        if ($("#" + id, "#consumerlist").data("preHide")) {
            $("#" + id, "#consumerlist").data("preHide", false);
        }
        else $("#" + id, "#consumerlist").removeClass("SEconsumerunavailable");
    });
}

function singleEntryOverlapDataSetUp(data, callback) {
    var newDate = new Date(data.date),
	    dateOfService = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()),
		startTime = convertTimeToMilitaryNew(data.startTime),
		endTime = convertTimeToMilitaryNew(data.endTime),
        overlapData;
    if (endTime == "::00") {
        endTime = null;
    }
    var singleEntryId = data.singleEntryID;

    overlapData = {
        token: $.session.Token,
        dateOfService: dateOfService,
        startTime: startTime,
        endTime: endTime,
        singleEntryId: singleEntryId
    };

    singleEntryOverlapCheckAjax(overlapData, callback);
}