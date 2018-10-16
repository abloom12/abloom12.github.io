//(function (scope) {
//    if (!scope.Absent) {
//        scope.Absent = {};
//    }
//})(window.Anywhere);

function updateConsumersListAbsentIcon(absentData) {
    $(".consumerlist").children().removeClass("showAbsentInList");
    absentData.forEach(function (id) {
        //console.log(id);
        $(".consumerlist").find("#" + id).addClass("showAbsentInList");
    });
}

function preAbsentCardAll() {
    var available = $(".consumerlist > :not(.showAbsentInList)");
    if (!available.length) {
        $.fn.PSmodal({
            body: "There are currently no selected consumers who can have an absent record for today added.",
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
    else {
        var ids = [];
        available.each(function (ind, el) { ids.push($(el).attr("id")); });
        var defaultDate = new Date(),
                obj = {};

        var datebox = $("#datebox").val();
        var dateboxDateObject = Date.parse(datebox);
        dateboxDateObject = new Date(dateboxDateObject);
        var statusDate = moment(dateboxDateObject).format('YYYY-MM-DD');

        var values = $.extend({
            consumerName: "ALL SELECTED",
            consumerId: ids.join(","),
            locationName: "All",
            locationId: "*",
            dateAbsence: statusDate,
            reportedBy: [$.session.Name, $.session.LName].join(" "),
            dateReported: statusDate,
            timeReported: defaultDate,
            notificationType: "",
            notificationId: "",
            reason: "",
            reasonId: "",
            alreadyExist: false,
            new: true
        }, obj);

        if ($("#locationbox").attr("locid") != "0") {
            values.locationName = $("#locationbox").text().trim();
            values.locationId = $("#locationbox").attr("locid");
        }

        var overlay = $("<div>")
        .addClass("modaloverlay")
        .css({
            "backgroundColor": "rgba(0, 0, 0, 0.15)"
        }).appendTo($("body"));


        $.ajax({
            type: "GET",
            url: "./absent/modules/absentform.html?RNG=" + +(new Date()),
            success: function (HTMLresponse, status, xhr) {
                buildAbsentCard({ card: $("<div>").replaceWith(HTMLresponse), overlay: overlay, values: values, multi: true });
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        })
    }
}

function buildAbsentCard(obj) {
    var card = obj.card,
        overlay = obj.overlay,
        values = obj.values,
        multi = obj.multi;

    overlay.click(function () {
        $(this).remove();
    }).append(card);

    card.click(function (e) {
        e.stopPropagation();
    }).bind("remove", function () {
        overlay.remove();
    });
    if (values.timeReported == '11:59:59') {
        values.timeReported = '00:00:00';
    }
    var consumerName = values.consumerName,
    consumerId = values.consumerId,
    locationName = values.locationName,
    locationId = values.locationId,
    dateAbsence = moment(values.dateAbsence),
    reportedBy = values.reportedBy,
    dateReported = moment(values.dateReported),
    timeReported = moment(values.timeReported, ['h:m a', 'H:m', 'HH:mm:ss']),
    notificationType = values.notificationType,
    notificationId = values.notificationId,
    reason = values.reason,
    reasonId = values.reasonId,
    absentId = values.absentId;

    card.find("#consumer").text(consumerName).attr("consumerId", consumerId);
    card.find("#location").text(locationName).attr("locationId", locationId);
    card.find("#dateAbsence").text(dateAbsence.format('MM/DD/YYYY'));
    card.find("#reportedBy").text(reportedBy);
    card.find("#dateReported").text(dateReported.format("MM/DD/YYYY"));
    card.find("#timeReported").text(timeReported.format("h:mm a"));
    card.find("#notificationType").text(notificationType).attr("notificationId", notificationId);
    if (notificationType.trim() == "") card.find("#notificationType").html("&nbsp;");
    card.find("#reason").text(reason).attr("reasonId", reasonId);

    assignAbsentCardButtons({
        absentId: absentId,
        overlay: overlay,
        card: card,
        multi: multi,
        showSave: values.new == true,
        showDelete: ((reportedBy.toUpperCase().trim() === [$.session.Name, $.session.LName].join(" ").toUpperCase().trim()) || $.session.RosterDeleteAbsent == true) && values.new == false,
    })
    assignAbsentCardFieldFunctionality({
        card: card,
        readOnly: values.new == false
    })
}

function assignAbsentCardFieldFunctionality(obj) {
    var card = obj.card,
        readOnly = obj.readOnly;
    

    if (readOnly == false) {

        var timeBox = card.find("#timeReported");
        timeBox.click(function () {
            setupTimeInputBox(timeBox, { x: timeBox.offset().left + 30, y: timeBox.offset().top - 100 })
        });

        var dateAbsence = card.find("#dateAbsence");
        dateAbsence.click(function () {
            popupCalendar({ target: $(this) })
        });

        var dateReported = card.find("#dateReported");
        dateReported.click(function () {
            popupCalendar({ target: $(this), maxDate: new Date() })
        });

        var notificationType = card.find("#notificationType");
        notificationType.PSlist(new Promise(function (fulfill, reject) {
            selectAbsentNotificationTypesAjax(function (data) {
                var arr = [];
                data.forEach(function (el) {
                    arr.push({
                        text: el.notifdesc,
                        id: el.notifid,
                    })
                });
                arr.sort(function (a, b) {
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
                fulfill(arr);
            });
        }), {
            callback: function (el) {
                notificationType.text(el.text).attr("notificationId", el.id);
            }
        });

        var reason = card.find("#reason");

        reason.PSlist(new Promise(function (fulfill, reject) {
            selectAbsentReasonsAjax(function (data) {
                var arr = [];

                data.forEach(function (el) {
                    arr.push({
                        text: el.reasondesc,
                        id: el.reasonid,
                    })
                });

                arr.sort(function (a, b) {
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
                fulfill(arr);
            });
        }), {
            callback: function (el) {
                reason.text(el.text).attr("reasonId", el.id);
            }
        });
    }
    
}

function assignAbsentCardButtons(obj) {
    var card = obj.card,
        absentId = obj.absentId,
        multi = obj.multi,
        showSave = obj.showSave,
        showDelete = obj.showDelete,
        overlay = obj.overlay,
        cancel = card.find("#cancel"),
        save = card.find("#save"),
        myDelete = card.find("#delete");

    if (showDelete == true) {
        myDelete.show().click(function () {
            Anywhere.promptYesNo("Are you sure you want to delete this Absent record?", function () {
                var deleteOverlay = null,
                message = null;

                deleteOverlay = $("<div>").css({
                    "backgroundColor": "rgba(0, 0, 0, 0.55)",
                    "position": "absolute",
                    "top": "0",
                    "bottom": "0",
                    "left": "0",
                    "right": "0",
                    "zIndex": "9999"
                });

                var box = $("<div>").css({
                    "position": "fixed",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translate(-50%, -50%)",
                }).appendTo(deleteOverlay);

                var gif = $("<img>").appendTo(box).prop("src", "Images/gears.svg");
                message = $("<div>").css({
                    "fontSize": "18px",
                    "color": "#fff"
                }).appendTo(box);
                $("body").append(deleteOverlay);

                message.html("Deleting...");
                deleteAbsentAjax(absentId, function (err) {
                    deleteOverlay.remove();
                    if (err) console.log(err);
                    if ($.loadedApp == "dayservices") {
                        loadApp("dayservices");
                    }
                    else {
                        if ($("#rostersettingsbutton").hasClass("buttonhighlight")) {
                            getConsumersByGroup($("#filtertext").attr("groupcode"), $("#filtertext").attr("retrieveid"), $("#filtertext").text().trim());
                            //getConsumersByGroup($("#filtertext").attr("groupcode"), $("#locationbox").attr("locid"), $("#locationbox").text().trim());
                        }
                    }

                    overlay.remove();
                    card.trigger("remove");
                });
            })
        })
    }

    cancel.click(function () {
        card.remove();
    });

    if (showSave == false) save.hide();

    save.click(function () {
        var overlay = null,
        message = null;

        overlay = $("<div>").css({
            "backgroundColor": "rgba(0, 0, 0, 0.55)",
            "position": "absolute",
            "top": "0",
            "bottom": "0",
            "left": "0",
            "right": "0",
            "zIndex": "9999"
        });

        var box = $("<div>").css({
            "position": "fixed",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%, -50%)",
        }).appendTo(overlay);

        var gif = $("<img>").appendTo(box).prop("src", "Images/gears.svg");
        message = $("<div>").css({
            "fontSize": "18px",
            "color": "#fff"
        }).appendTo(box);
        $("body").append(overlay);

        message.html("Saving...");

        var anonymousFunction = function () {
            if (parseInt(card.find("#location").attr("locationId"), 10) === 0) {
                allLocationSaveAbsentAjax({
                    token: $.session.Token,
                    absentReasonId: card.find("#reason").attr("reasonId"),
                    absentNotificationId: card.find("#notificationType").attr("notificationId"),
                    consumerIdString: card.find("#consumer").attr("consumerId"),
                    absenceDate: moment(card.find("#dateAbsence").text()).format('YYYY-MM-DD'),
                    reportedBy: removeUnsavableNoteText(card.find("#reportedBy").text()),
                    timeReported: moment(card.find("#timeReported").text(), ['h:m a', 'H:m']).format("HH:mm:ss"),
                    dateReported: moment(card.find("#dateReported").text()).format('YYYY-MM-DD'),
                }, function (data) {
                    if ($.loadedApp == "dayservices") {
                        loadApp("dayservices");
                    }
                    else {
                        if (moment(card.find("#dateAbsence").text()).isSame(moment($("#datebox").val()), "day")) {
                            $(".consumerlist > :not(.showAbsentInList)").addClass("showAbsentInList").find(".absenticon").addClass("isAbsent");
                        }
                        if ($("#rostersettingsbutton").hasClass("buttonhighlight")) {
                            //getConsumersByGroup($("#filtertext").attr("groupcode"), $("#locationbox").attr("locid"), $("#locationbox").text().trim());
                            getConsumersByGroup($("#filtertext").attr("groupcode"), $("#filtertext").attr("retrieveid"), $("#filtertext").text().trim());
                        }
                    }
                    
                    overlay.remove();
                    card.trigger("remove");
                });
            }
            else {
                //var conId = card.find("#consumer").attr("consumerId");
                oneLocationAbsentSaveAjax({
                    token: $.session.Token,
                    absentReasonId: card.find("#reason").attr("reasonId"),
                    absentNotificationId: card.find("#notificationType").attr("notificationId"),
                    consumerIdString: card.find("#consumer").attr("consumerId"),
                    absenceDate: moment(card.find("#dateAbsence").text()).format('YYYY-MM-DD'),
                    locationId: card.find("#location").attr("locationId"),
                    reportedBy: removeUnsavableNoteText(card.find("#reportedBy").text()),
                    timeReported: moment(card.find("#timeReported").text(), ['h:m a', 'H:m']).format("HH:mm:ss"),
                    dateReported: moment(card.find("#dateReported").text()).format('YYYY-MM-DD'),
                }, function (data) {
                    //console.log(data);
                    if ($.loadedApp == "dayservices") {
                        loadApp("dayservices");
                    }
                    else {
                        if ($("#rostersettingsbutton").hasClass("buttonhighlight")) {
                            //var conId = "#" + card.find("#consumer").attr("consumerId");
                            getConsumersByGroup($("#filtertext").attr("groupcode"), $("#filtertext").attr("retrieveid"), $("#filtertext").text().trim());
                            //setTimeout($(conId).find(".absenticon").addClass("isAbsent"), 5000);
                            //$(conId).find(".absenticon").addClass("isAbsent");
                            //getConsumersByGroup($("#filtertext").attr("groupcode"), $("#locationbox").attr("locid"), $("#locationbox").text().trim());
                        }
                    }
                    overlay.remove();
                    card.trigger("remove");
                });
            }
        };
        absentPreSaveCheckAjax({
            token: $.session.Token,
            consumerIdString: card.find("#consumer").attr("consumerId"),
            absentDate: moment(card.find("#dateAbsence").text()).format('YYYY-MM-DD'),
            locationId: card.find("#location").attr("locationId"),
        }, function (data) {
            if (data.length) {
                var names = data.map(function (id) {
                    var firstName = $("#" + id).find("namebox").clone().children().remove().end().text();
                    var lastName = $("#" + id).find(".lastnametext").text();
                    if (lastName.trim() == "") lastName = $("#" + id).find(".lastnametextselected").text();
                    return [firstName, lastName].join(" ");
                }).sort().join("<br />");
                overlay.hide();

                $.fn.PSmodal({
                    body: "The following consumers have an already existing record in either Outcomes or Day Services. Do you wish to proceed?<br /><br />" + names,
                    immediate: true,
                    buttons: [
                        {
                            text: "Yes",
                            callback: function () {
                                overlay.show();
                                anonymousFunction();
                            }
                        },
                        {
                            text: "No",
                            callback: function () {
                                overlay.remove();
                            }
                        }
                    ]
                });
            }
            else {
                anonymousFunction();
            }
        });
    })
}