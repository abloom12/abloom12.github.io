function assignLocationProgressNotesButton(locationId, name) {
    $("#locationProgressNotes").off("click").click(function () {
        getLocationProgressNotes(locationId, null, name)
    });

    doesLocationHaveUnreadNotesAjax(locationId, function (data) {
        $("#locationProgressNotes").show();
        if (data && data.length) {
            if (data[0].hasNote == "0") {
                $("#locationProgressNotes").removeClass("progressNotesLocationHasUnread");
            }
            else {
                $("#locationProgressNotes").addClass("progressNotesLocationHasUnread");
            }
        }
        if (locationId == 0) {
            $("#locationProgressNotes").hide();
        }
    });
}

function buildProgressNotesCard(results, overlay, consumerId, locationId, consumerName, locationName) {
    overlay.click(function () {
        assignLocationProgressNotesButton(locationId, locationName);
        getConsumerGroups(locationId, locationName);
        getRosterLocations();
        $(this).remove();
    });

    var cardFlipContainer = $("<div>")
            .addClass("flip-container").click(function (e) {
                e.stopPropagation();
            }).bind("remove", function () {
                overlay.remove();
            }).appendTo(overlay),
        flipper = $("<div>").addClass("flipper").appendTo(cardFlipContainer),
        frontCard = $("<div>").addClass("progress-notes-front").show().appendTo(flipper),
        backCard = $("<div>").addClass("progress-notes-back").hide().appendTo(flipper);

    // Remove CSS From JS
    var titleBar = $("<div>").css({
            "width": "95%",
            "backgroundColor": "#70b1d8",
            "borderBottom": "2px solid #cfe371",
            "color": "#fff",
            "height": "60px",
            "padding": "5px 10px"
        }).click(function (e) {
            if ($("#mobiledetector").css("display") == "none") {
                $(this).addClass("mobile-top");
            }
        }),
        bodyBar = $("<div>").css({
        "width": "100%",
        "backgroundColor": "#2d77a3",
        "color": "#fff",
        "height": "90%",
        "max-height": "90%",
        "marginTop": "8px",
        "overflow-y": "auto",
    });

    var frontTitle, backTitle, frontBody, backBody, backTitleTextBox, backBackButton;

    var resetter = function () {
        frontTitle = titleBar.clone(true);
        backTitle = titleBar.clone(true);//.html("<input type='text' style='background-color: rgba(0, 0, 0, 0);border: 0;color: white;'>");//.click(function () { cardFlipContainer.toggleClass("progress-flip"); });
        backTitleTextBox = $("<textarea id='progressNotesNewTitle' rows=1 placeholder='Add Note Title Here'/>").blur(function (e) {
            $(this).parent().removeClass("mobile-top");
        }).appendTo(backTitle);
        backBackButton = $("<img src='./Images/new-icons/arrow-circle-up.png'>")
            .addClass("progressNotesBackButton")
            .click(function () {
                //cardFlipContainer.toggleClass("progress-flip");
                if (consumerId == null) {
                    //getLocationProgressNotes(locationId, consumerName, locationName)selectNotesByLocation()
                    getLocationProgressNotes(locationId, consumerName, locationName);
                }
                else {
                    selectNotesByConsumerAndLocationAjax(consumerId, locationId, consumerName, locationName);
                }
                overlay.click();
                //buildProgressNotesCard(results, overlay, consumerId, locationId, consumerName, locationName);
            })
            .appendTo(backTitle)

        frontBody = bodyBar.clone(true);
        backBody = bodyBar.clone(true);
    }


    var addNewNoteLink = $("<a>").click(function (e) {
        e.stopPropagation();
        backCard.html("");
        resetter();
        var textareaHolder = $("<span>").appendTo(backBody).addClass("progressNoteTextareaHolder"),
            textareaDecoration = $("<span id='progressNoteTextareaDecoration'>").html("&nbsp;").appendTo(textareaHolder),
            textarea = $("<textarea>").css({ "width": "65%", "float": "left", "padding": 0, "height": "100%", "resize": "none" }).click(function (e) {
                $("html").animate({
                    scrollTop: $(this).offset().top
                }, 100);
            }).appendTo(textareaHolder),
            saveButton = $("<button>").addClass("progressNoteSaveButton").appendTo(textareaHolder);

        saveButton.click(function () {
            var title = removeUnsavableNoteText(backTitleTextBox.val().trim()).split("\\r").join("").split("\\n").join(""),
                note = removeUnsavableNoteText(textarea.val().trim()).split("\\r").join("").split("\\n").join(""),
                obj = {};

            if (note == "") {
                return;
            }
            if (consumerId == null) {
                obj = {
                    token: $.session.Token,
                    noteTitle: title,
                    note: note,
                    locationId: locationId,
                };
                insertLocationNoteAjax(obj, function () {
                    overlay.click();
                });
            }
            else {
                obj = {
                    token: $.session.Token,
                    consumerId: consumerId,
                    noteTitle: title,
                    note: note,
                    locationId: locationId,
                };
                insertConsumerNoteAjax(obj, function () {
                    overlay.click();
                })
            }
        });

        backCard.append(backTitle).append(backBody).show();
        //cardFlipContainer.toggleClass("progress-flip");
        frontCard.hide();
        return false;
    }),
        addNewNote = $("<img src='./Images/new-icons/plus-circle.png'>").addClass("progressNotesAddLink").on("click", function (e) {
            e.stopPropagation();
            backCard.html("");
            resetter();
            var textareaHolder = $("<span>").appendTo(backBody).addClass("progressNoteTextareaHolder"),
                textareaDecoration = $("<span id='progressNoteTextareaDecoration'>").html("&nbsp;").appendTo(textareaHolder),
                textarea = $("<textarea>").css({ "width": "65%", "float": "left", "padding": 0, "height": "100%", "resize": "none" }).click(function (e) {
                    $("html").animate({
                        scrollTop: $(this).offset().top
                    }, 100);
                }).appendTo(textareaHolder),
                saveButton = $("<button>").addClass("progressNoteSaveButton").appendTo(textareaHolder);

            saveButton.click(function () {
                var title = removeUnsavableNoteText(backTitleTextBox.val().trim()).split("\\r").join("").split("\\n").join(""),
                    note = removeUnsavableNoteText(textarea.val().trim()).split("\\r").join("").split("\\n").join(""),
                    obj = {};

                if (note == "") {
                    return;
                }
                if (consumerId == null) {
                    obj = {
                        token: $.session.Token,
                        noteTitle: title,
                        note: note,
                        locationId: locationId,
                    };
                    insertLocationNoteAjax(obj, function () {
                        overlay.click();
                    });
                }
                else {
                    obj = {
                        token: $.session.Token,
                        consumerId: consumerId,
                        noteTitle: title,
                        note: note,
                        locationId: locationId,
                    };
                    insertConsumerNoteAjax(obj, function () {
                        overlay.click();
                    })
                }
            });

            backCard.append(backTitle).append(backBody).show();
            frontCard.hide();
            //cardFlipContainer.toggleClass("progress-flip");
            return false;
        });
    resetter();

    //var span = $("<span style='display:inline-block;width:50%;font-size: 16px;padding-top:13px;transform: translate(50%, 0%);'>");
    var span = $("<span>").addClass("progressNoteTitleText")

    if (consumerId == null) {
        span.text(locationName + " Notebook");
    }
    else {
        span.text(consumerName + " Notebook");
    }

    frontTitle.append(span).append(addNewNote)


    var allNoteIds = [];
    results.forEach(function (el) {
        if (allNoteIds.indexOf(el.noteID) === -1) {
            allNoteIds.push(el.noteID);
            var noteHold = $("<div>").addClass("progressNotesPreviewNoteContainer");

            noteHold.click(function () {
                var myUpdaterFunc = null,
                    mySelectorFunc = null;

                if (consumerId == null) {
                    myUpdaterFunc = updateLocationNoteDateReadAjax;
                    mySelectorFunc = selectLocationNoteAjax;
                }
                else {
                    myUpdaterFunc = updateConsumerNoteDateReadAjax;
                    mySelectorFunc = selectConsumerNoteAjax;
                }
                myUpdaterFunc(el.noteID);
                mySelectorFunc(el.noteID, function (res) {
                    //console.log(res);
                    backCard.html("");
                    resetter();
                    var textareaHolder = $("<span>").appendTo(backBody).addClass("progressNoteTextareaHolder"),
                        textareaDecoration = $("<span id='progressNoteTextareaDecoration'>").html("&nbsp;").appendTo(textareaHolder),
                        textarea = $("<textarea>").css({ "width": "65%", "float": "left", "padding": 0, "height": "100%", "resize": "none" }).appendTo(textareaHolder),
                        saveButton = $("<button>").addClass("progressNoteSaveButton").appendTo(textareaHolder);

                    saveButton.click(function () {
                        var title = removeUnsavableNoteText(backTitleTextBox.val().trim()).split("\\r").join("").split("\\n").join(""),
                            note = removeUnsavableNoteText(textarea.val().trim()).split("\\r").join("").split("\\n").join(""),
                            obj;

                        if (note == "") {
                            return;
                        }
                        if (consumerId == null) {
                            obj = {
                                token: $.session.Token,
                                noteId: el.noteID,
                                locationId: locationId,
                                note: note,
                            };
                            updateLocationNoteAjax(obj, function () {
                                overlay.click();
                            });
                        }
                        else {
                            obj = {
                                token: $.session.Token,
                                noteId: el.noteID,
                                consumerId: consumerId,
                                note: note,
                            };
                            updateConsumerNoteAjax(obj, function () {
                                overlay.click();
                            });
                        }
                        
                    });

                    var allNotes = $("<div>").css({
                        "overflowY": "auto",
                        "height": "200px"
                    });

                    res.forEach(function (el2, i) {
                        var noteHold = $("<div>").addClass("progressNotesNoteContainer"),
                            details = $("<span>").css("display", "inline-block").css("width", "40%"),
                            note = $("<span>").css("display", "inline-block").addClass("progressNotesNote").text(el2.note).css("width", "55%");

                        var img = $("<img>")
                            .addClass("progressNotesEmployeeImg progressNotesEmployeeHasRead")
                            .on("error", function () {
                                $(this).attr("src", './images/new-icons/default.jpg');
                            })
                            .attr("src", './images/new-icons/default.jpg')
                            //Will need to later implement the correct photo
                            //.attr("src", './images/portraits/' + el2.emp_id + ".png?rng=" + +(new Date()));

                        var detailsText = $("<span>");

                        var name = $("<div>").text(el2.firstname + " " + el2.lastname[0] + ".").addClass("progressNotesEmployeeName"),
                            timedate = $("<div>").text(moment(el2.Date_Entered).format("M/D/YY - hh:mmA")).addClass("progressNotesPreviewEmployeeTime");

                        detailsText.append(name).append(timedate);

                        details.append(img).append(detailsText);
                        //console.log(el2.notetitle)
                        /*
                        if (el2.notetitle != "") {
                            backTitleTextBox.val(el2.notetitle).attr("disabled", true).attr("placeholder", "")
                        }
                        */
                        //else backTitleTextBox.val(el2.notetitle)
                        if (i == 0) {
                            details.css("position", "absolute");
                            note.css("marginLeft", "40%")
                            backTitleTextBox.val(el2.notetitle).attr("disabled", true).attr("placeholder", "")
                        }
                        else {
                            details.css("float", "right");
                            img.css("float", "right");
                        }

                        noteHold.append(details).append(note);
                        allNotes.append(noteHold);
                    });

                    backBody.append(allNotes);

                    backCard.append(backTitle).append(backBody).show();
                    frontCard.hide();
                    //cardFlipContainer.toggleClass("progress-flip");
                })
            })

            var img = $("<img>").addClass("progressNotesEmployeeImg");
            img.on("error", function () {
                $(this).attr("src", './images/new-icons/default.jpg');
            }).attr("src", './images/new-icons/default.jpg');
                //Will need to later implement the correct photo
                //.attr("src", './images/portraits/' + el.empId + ".png?rng=" + +(new Date()));
            if (el.is_read == "0") {
                img.addClass("progressNotesEmployeeHasNotRead");
            }
            else {
                img.addClass("progressNotesEmployeeHasRead");
            }

            var details = $("<span>").addClass("progressNotesPreviewEmployeeDetails").css("float", "left")
            var name = $("<div>").text(el.MainAuthor).addClass("progressNotesPreviewEmployeeName");
            var timedate = $("<div>").text(moment(el.datecreated).format("M/D/YY - hh:mmA")).addClass("progressNotesPreviewEmployeeTime");

            details.append(name);
            details.append(timedate);

            var note = $("<span>").addClass("progressNotesPreviewNotes");

            var title = $("<div>").text(el.title).addClass("progressNotesPreviewTitle"),
                noteText = $("<div>").text(el.note).addClass("progressNotesPreviewNote");

            note.append(title).append(noteText);

            noteHold.append(img);
            noteHold.append(details);
            noteHold.append(note);
            frontBody.append(noteHold);
        }
    });

    frontCard.append(frontTitle).append(frontBody);
}