function clearSettingsBarPop() {
    var tarId = "";
    var nodeName = "";
    var className = "";
    //null check to handle no argument call of clear pops
    if (event != null) {
        if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
            tarId = event.srcElement.id;
            nodeName = event.srcElement.nodeName;
            className = event.srcElement.className;
        } else {
            tarId = $(event.target).attr('id');
            nodeName = event.target.nodeName;
            className = event.target.className;
        }

        var ignoredTargetIds = [
                "locationicon",
                "settings",
                "rostersettingstext",
                "help",
                "settingsheader",
                "settingsbox",
                "locationbox",
                "headertext"],
            ignoredClassNames = [
                "settingstext",
                "locationsettingstext",
                "defaultselection boxvert",
                "settingsicon rostermenubutton buttonhighlight",
                "loclink noblock",
                "loclink block" 
            ],
            ignoredNodeNames = [
                "STAFFLOCATION",
                "LOCATIONPOPUPBOX"
            ];

        if (ignoredTargetIds.indexOf(tarId) != -1 ||
                ignoredClassNames.indexOf(event.srcElement.className) != -1 ||
                ignoredNodeNames.indexOf(nodeName) != -1) {
                    //Do nothing
        } else {
            $("#helpbox").css("display", "none");
            $("#settingsbox").css("display", "none");
            $("#locationsettingspop").css("display", "none");
            $("locationpopupbox").css("display", "none");
        }

        if (event.srcElement.parentNode != null) {
            if (event.srcElement.parentNode.tagName == "LOCATIONPOPUPBOX" || event.srcElement.parentNode
                .tagName == "TOPBAR") {
                //$("#settingsbox").css("display", "block");
                $("locationpopupbox").css("display", "none");
            }
        }
    }
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function resizeActionCenter() {
    height = $(window).height();
    width = $(window).width();

    if ($('#settingsbox').is(':visible')) {
        if ($.loadedApp == "roster") {
            var px = width - 330;
            $("#actioncenter").css("width", px + "px");
        }
    } else {
        if ($.loadedApp == "roster") {
            var px = width - 270;
            $("#actioncenter").css("width", px + "px");
        }
    }


    //handles negative widths created from formula above
    if ($("actioncenter").width() == 0) {
        $("#actioncenter").css("width", "350px");
    }

}

function formatDateGFromDB(date) {
    date = new Date(date);
    date = (("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear());
    return date;
}

function formatTimeFromDB(time) {
    var test = time.substr(0, 2);
    if ((time.substr(0, 2) > 12) && (time.substr(0, 2) < 22)) {
        test2 = time.substr(0, 2) - 12;
        //tmpStartTime = tmpStartTime.replace(test, '0' + test2)
        time = time.replace(time.substring(0, 2), ('0' + test2));
    } else if (time.substr(0, 2) >= 22) {
        test2 = time.substr(0, 2) - 12;
        time = time.replace(time.substring(0, 2), (test2));
        //tmpStartTime = tmpStartTime.replace(test, test2)
    } else if (time.substr(0, 2) == 00) {
        time = time.replace(time.substring(0, 2), (12));
        //tmpStartTime = tmpStartTime.replace(test, test2)
    }
    //
    time = time.slice(0, 5);
    //
    if (test >= 12) {
        time = time + ' PM';
    } else {
        time = time + ' AM';
    }
    return time;
}

function convertTimeFromMilitary(value) {
    if (value !== null && value !== undefined) { //If value is passed in
        if (value.indexOf('AM') > -1 || value.indexOf('PM') > -1) { //If time is already in standard time then don't format.
            return value;
        }
        else {
            if (value.length == 8) { //If value is the expected length for military time then process to standard time.
                var hour = value.substring(0, 2); //Extract hour
                var minutes = value.substring(3, 5); //Extract minutes
                var identifier = 'AM'; //Initialize AM PM identifier

                if (hour == 12) { //If hour is 12 then should set AM PM identifier to PM
                    identifier = 'PM';
                }
                if (hour == 0) { //If hour is 0 then set to 12 for standard time 12 AM
                    hour = 12;
                }
                if (hour > 12) { //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
                    hour = hour - 12;
                    if (hour < 10) {
                        hour = '0' + hour;
                    }
                    identifier = 'PM';
                }
                return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
            }
            else { //If value is not the expected length than just return the value as is
                return value;
            }
        }
    }
}

function removeUnsavableNoteText(note) {
    if (note.indexOf("\"") != -1) {
        note = note.replace(/\"/g, "");
    }
    if (note.indexOf("'") != -1) {
        note = note.replace(/'/g, "");
    }
    if (note.indexOf("\\") != -1) {
        note = note.replace(/\\/g, "");
    }
    if (note.indexOf("\n") != -1) {
        //note = note.replace(/\n/g, "\\\\x0a");
        note = note.replace(/\n/g, "\\r\\n");
    }
    note = note;
    return note;
}

function removeBadNoteTextToDisplay(note) {
    var test = note.indexOf("\\r");
    note = note.replace(/[\n\r]/g, '');
    if (note.indexOf("\\n") != -1) {
        note = note.replace(/\\n/g, "\n");
    }
    if (note.indexOf("\\r") != -1) {
        note = note.replace(/\\r/g, ' ');
    }
    //if (note.indexOf("\\n") != -1) {
    //    note = note.replace(/\\n/g, " ").trim();
    //}
    //if (note.indexOf("\\r") != -1) {
    //    note = note.replace(/\\r/g, " ").trim();
    //}
    if (note.indexOf("\"") != -1) {
        note = note.replace(/\"/g, "");
    }
    if (note.indexOf("'") != -1) {
        note = note.replace(/'/g, "");
    }
    if (note.indexOf("\\") != -1) {
        note = note.replace(/\\/g, "");
    }

    note = note;
    return note;
}

//Gets days between passed in date and current date
function daysBetweenDates(checkDate) {
    var oneDay = 24 * 60 * 60 * 1000;
    var todaysDate = new Date();
    if (checkDate == undefined) {
        var checkDate = new Date();
    }
    var changeDate = new Date(checkDate);

    //leaving these for a week or two to in case this pops up again
    //var test = todaysDate.getTime();
    //var test2 = changeDate.getTime();
    //var test3 = Math.round(Math.abs((todaysDate.getTime() - changeDate.getTime()) / (oneDay)));
    //var test4 = Math.trunc((todaysDate.getTime() - changeDate.getTime()) / (oneDay));
    return Math.floor((todaysDate.getTime() - changeDate.getTime()) / (oneDay));
}

function formatDateForDatabaseSave(date) {
    var newDate = new Date(date);
    date = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    return date;
}

function convertTimeToMilitaryNew(inputTime) {
    if (inputTime == "") {
        return "::00";
    }
    var time = inputTime;
    var hours = parseInt(time.match(/^(\d+)/)[1], 10);
    var minutes = parseInt(time.match(/:(\d+)/)[1], 10);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    //alert(sHours + ":" + sMinutes);
    return [sHours, sMinutes, "00"].join(":");
}

// Convert the input AM/PM time to a 24-hour military time:
function convertTimeToMilitary(inputTime) {
    var amPM = "";
    var hour = "";
    var minute = "";
    var militaryTime = "";
    if (inputTime.length < 5 && inputTime != "") {
        inputTime = "0" + inputTime;
    }
    // Parse the input time into hours, minutes and AM/PM values:
    for (var i = 0; i < inputTime.length; i++) {
        if (isNaN(inputTime.charAt(i)) == false && inputTime.charAt(i) != ' ') {
            if (i < 2) {
                hour = hour + inputTime.charAt(i);
            };

            if (i == 3 || i == 4) {
                minute = minute + inputTime.charAt(i);
            };
        };

        if (inputTime.charAt(i) == "A" || inputTime.charAt(i) == "P" || inputTime.charAt(i) == "M") {
            amPM = amPM + inputTime.charAt(i);
        };
    };

    // If a AM value, add 12 to the input hour:
    if (amPM == "AM" && hour == "12") {
        hour = "00";
    };

    // If a PM value, add 12 to the input hour:
    if (amPM == "PM") {
        if (hour != "00") {
            if (hour != "12") {
                var x = +hour;
                x = x + 12;
                hour = String(x);
            };
        };
    };

    // Create a military time from the input time format:
    militaryTime = hour + ":" + minute + ":00";

    return militaryTime;
}

//http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function setCaretToPos(input, pos) {
    setSelectionRange(input, pos, pos);
}

function getDeviceLocation(callback) {
    if (location.protocol === "https:" || location.hostname === "localhost") {
        if (navigator.geolocation ) {
            navigator.geolocation.getCurrentPosition(callback, callback, { timeout: 3000 });
        } else {
            callback();
        }
    }
}

//New time enter code below
function setTimeToScreen(amOrPm) {
    var pmAM = amOrPm;
    var timeDigitsEntered = $('#timedisplayfield').val();
    var originId = '#' + $('.timebox').attr('fromid');
    //console.log($('#timedisplayfield').val(), originId);
    if (timeDigitsEntered.length < 3) {
        timeDigitsEntered = timeDigitsEntered + ':00';
    } else {
        timeDigitsEntered = timeDigitsEntered.substring(0, timeDigitsEntered.length - 2) + ':' + timeDigitsEntered.slice(-2);
    }
    if (timeDigitsEntered.length < 5) {
        timeDigitsEntered = '0' + timeDigitsEntered;
    }
    timeDigitsEntered = timeDigitsEntered + ' ' + pmAM;
    //console.log($(".timebox").data('opts'));
    var opts = $(".timebox").data('opts');
    var increment = opts.increment;
    var minutes = timeDigitsEntered.split(":")[1].split(" ")[0];
    var hours = timeDigitsEntered.split(":")[0];
    //console.log($('#timedisplayfield').val());
    if (increment != 0 && increment != undefined) {
        if (parseInt(minutes, 10) % increment != 0) {
            return $.fn.PSmodal({
                body: opts.incrementMessage,
                immediate: true,
                closeOnBlur: false,
                buttons: [
                    {
                        text: "OK",
                        callback: function () {
                        }
                    }
                ]
            });
        }
    }
    if (parseInt(hours, 10) > 12) {
        return $.fn.PSmodal({
            body: "You have entered invalid hours. Please correct this.",
            immediate: true,
            closeOnBlur: false,
            buttons: [
                {
                    text: "OK",
                    callback: function () {
                    }
                }
            ]
        });
    }
    if (parseInt(minutes, 10) > 59) {
        return $.fn.PSmodal({
            body: "You have entered invalid minutes. Please correct this.",
            immediate: true,
            closeOnBlur: false,
            buttons: [
                {
                    text: "OK",
                    callback: function () {
                    }
                }
            ]
        });
    }
    if (opts.callback) {
        opts.callback(timeDigitsEntered);
    }
    else {
        $(originId).val(timeDigitsEntered);
        $(originId).html(timeDigitsEntered);
        $(originId).text(timeDigitsEntered);
        $(originId).change();
    }
    
    $('#timeoverlay').remove();
}

function setupTimeInputBox(obj, event, opts) {
    URL = "./global/timeinputpad.html";
    $.ajax({
        type: "GET",
        url: URL + "?RNG=" + +(new Date()),
        success: function (response) {
            html = response;
            displayTimeBox(html, obj, event, opts || {
                increment: 0,
                incrementMessage: "",
            });
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
        }
    });
}

function displayTimeBox(html, obj, event, opts) {
    var x, y;
    if ($.mobile) {
        x = 20;
        y = 20;
    }
    else {
        x = event.x - 50;
        y = event.y - 16;
        $("#timeinputkeypad").css("zoom", "125%");
    }
    var overlay = $("<div id='timeoverlay'>").css({
        "backgroundColor": "rgba(0, 0, 0, 0.15)",
        "position": "absolute",
        "top": "0",
        "bottom": "0",
        "left": "0",
        "right": "0",
        "zIndex": "99999"
    }).click(function () {
        $(this).remove();
        return false;
    });
    var timeBox = $('<div fromid="' + obj[0].id + '" class=\"timebox\">' + html + '</div>').click(function (e) { return false; }).data("opts", opts);

    timeBox.css({
        "opacity": "1.0 !important",
        "marginLeft": x,
        "marginTop": y
    });
    
    overlay.append(timeBox);    
    $("body").append(overlay);
    
}

function clearTimepadInputField() {
    $('#timedisplayfield').val("");
}

function checkOrientation() {
    if ($("#portraitOrientation").is(":visible")) {
        return "portrait"
    }
    else if ($("#landscapeOrientation").is(":visible")) {
        return "landscape";
    }
    else {
        return "undetected";
    }
}

function convertDaysBack(daysBackIn) {
    var dateOffset = (24 * 60 * 60 * 1000) * daysBackIn;
    var daysBackDate = new Date();
    daysBackDate.setTime(daysBackDate.getTime() - dateOffset);
    var dateToPass = (daysBackDate.getFullYear() + '-' + (daysBackDate.getMonth() + 1) + '-' + daysBackDate.getDate());
    return dateToPass;
}

function popupCalendar(opts) {
    var minDate = opts.minDate || null,
        maxDate = opts.maxDate || null,
        currVal = opts.currVal || null,
        callback = opts.callback || function () { },
        target = opts.target;

    var obj = {
        dateFormat: 'mm/dd/yy',
        theme: 'wp',
        accent: 'steel',
        display: 'bubble',
        mode: 'scroller',
        preset: 'date',
        onSelect: function (valueText, inst) {
            target.text(valueText);
            callback();
        },
        onShow: function () {
            if (currVal != null) {
                $(this)
                    .scroller(
                        'setDate',
                        new Date(
                            currVal.getFullYear(),
                            currVal.getMonth(),
                            currVal.getDate()
                        ),
                        false);
            }

            $('.dw-arr').css('display', 'none');
        },
    };

    if (minDate != null) {
        obj.minDate = minDate;
    }

    if (maxDate != null) {
        obj.maxDate = maxDate;
    }

    target.mobiscroll().date(obj).mobiscroll('show');
}

function getTodaysDate() {//yyyy-mm-dd
    var today = new Date();
    var date = moment(today).format('YYYY-MM-DD')
    return date;
}

function setUpAdminPermissions() {
    $.session.DayServiceView = true;
    $.session.DayServiceInsert = true;
    $.session.DayServiceUpdate = true;
    $.session.DayServiceDelete = true;
    $.session.DayServiceNonBillable = true;
    $.session.DayServiceOverRide = true;
    $.session.DenyStaffClockUpdate = false;
    $.session.DenyClockUpdate = false;
    $.session.DemographicsView = true;
    $.session.DemographicsBasicDataView = true;
    $.session.DemographicsRelationshipsView = true;
    $.session.DemographicsPictureUpdate = true;
    $.session.DemographicsNotesView = true;
    $.session.GoalsView = true;
    $.session.GoalsUpdate = true;
    $.session.CaseNotesView = true;
    $.session.CaseNotesTablePermissionView = true;
    $.session.CaseNotesUpdate = true;
    $.session.CaseNotesCaseloadRestriction = false;
    $.session.SingleEntryView = true;
    $.session.SingleEntryUpdate = true;
    $.session.caseNoteEditSecond = true;
    $.session.caseNoteDisplayGroupNoteDivPreference = true;
    $.session.caseNoteDisplayGroupNoteCheckedPreference = true;
    $.session.updateAllGroupDropDowns = true;
    $.session.changeFromSingleToGroupNote = true;
    $.session.UpdateCaseNotesDocTime = true;
    $.session.anAdmin = true;
    $.session.ViewAdminSingleEntry = true;
    $.session.CaseNotesViewEntered = false;
}

function openCaraSolva() {
    var form = $("<form />", {
        action: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/CaraSolvaSignIn/",
        method: "POST",
        target: "_blank",
        enctype: "application/json"
    });
    form.hide().append("<input name='token' id='token' value='" + $.session.Token + "' />");
    form.appendTo($("body"));
    form.submit();
}

(function (scope) {
    if (!scope.Anywhere) {
        scope.Anywhere = {};
    }
    scope.Anywhere.promptYesNo = function (message, yesCallback, noCallback) {
        $.fn.PSmodal({
            body: message,
            immediate: true,
            buttons: [
                {
                    text: "Yes",
                    callback: function () {
                        if (yesCallback) yesCallback();
                    }
                },
                {
                    text: "No",
                    callback: function () {
                        if (noCallback) noCallback();
                    }
                }
            ]
        });
    }
})(window);

function killAllClicks(e) {
    e.preventDefault();
    e.stopPropagation();
}

function killAllClickEvents() {
    document.addEventListener('click', killAllClicks, true);
}

function unKillAllClickEvents() {
    document.removeEventListener('click', killAllClicks, true);
}

function nameChopper(name, firstOrLast) {
    var hyphenIndex = name.search("-");
    if (hyphenIndex != -1) {
        return name.slice(0, hyphenIndex - 1);
    } else {
        if (firstOrLast === "first") {
            return name.slice(0, 15);
        } else {
            return name.slice(0, 20);
        }
    }
}

function findAndSlice(array, value, property) {
    function itemFind(item) {
        // Check for array of objects
        if (typeof array[0] === "object" && property) {
            return item[property] === value;
        } else {
            return item === value;
        }
    }

    array.splice(array.findIndex(itemFind), 1);
}

function removeDecimals(num) {
    if (typeof num === "number") {
        return Math.floor(num);
    } else {
        return Math.floor(parseInt(num));
    }
}
