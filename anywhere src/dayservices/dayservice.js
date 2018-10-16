$.checkToggle;
$.currentlocationId;
$.displayDSSelect;
$.residence;
$.originalText;
$.locationIds;
$.serviceLocationCount;
$.errorMessage;
$.errorConsumerIds;
$.isBatched;
$.ciDate;
var firstSelected = true;
var selectAll;
var unSelectCards;

function strobe() {
    $('#rostersettingsbutton').toggleClass("rosterstrobe");
}

function dayServicesLoad() {
    // Set global default values:
    checkToggle = "All";
    currentlocationId = "";
    errorMessage = "";
    isBatched = "N";
    addBrowserCSS = "";
    addCalendarCSS = "caledariconleft2";
    addCelendarTextCSS = "dateboxleft2";

    $("#consumerlist").addClass("dayServicesConsumerList");

    var showSplash = false;
    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
        addBrowserCSS = "daybuttonsbaseIE";
        addCalendarCSS = "calendarIconIE";
        addCelendarTextCSS = "dateboxleftIE";
    }
    // Get the selected location prior to selecting any day services:
    currentlocationId = $('#locationbox').attr('locid');
    residence = $('#locationbox').attr('residence');
    // Set the day service action banner:
    $("#actionbanner").html("");
    $("#actionbanner").html( //"<dayserviceicon class='dayserviceicon'></dayserviceicon>" +
        "<button class='bannericon locationicon' onClick='popDSLocation(event)'></button>" +
        "<dslocationbox id='dslocationbox2' class='locationbox' onClick='popDSLocation(event)'><div id='dslocationbox' class='headertext'></div></dslocationbox>" +
        "<button id='calendaricon' class='bannericon calendaricon' onClick=popCalendarDateBox('dsdatebox')></button>" +
        "<dateinput id='datebox2' class='locationbox' onClick=popCalendarDateBox('dsdatebox');><input id='dsdatebox' class='headertext'></input></dateinput>" +
        "<button id='search' class='bannericon filtericon' onClick='extendSearchBox()'></button>" +
        "<div id='searchbox' class='searchbox'><input id='rosterfilter' class='searchinput' onclick='tabletFocus(event)' onkeyup='filterDayServicesCards()'><div id='cancelsearch' class='cancelsearch' onclick='hideSearchBox()'></div></div></input></div>" +
        "<dslocationpopupbox id='dslocationpop' class='dslocationpop'></dslocationpopupbox>" +
        "<div id='locationhelp' class='rosterhelp' style='display: none;'><div id='errorarr' class='arrbase arr'></div><span class='helptext'>Please Select a Location</span></div>"
    );
    $('#dsdatebox').attr('readonly', true);
    // Set the calendar date to the current date:
    if ($.pages.rosterdate != null) {
        $("#dsdatebox").text($.pages.rosterdate);
        $("#dsdatebox").val($.pages.rosterdate);
    } else {
        $("#dsdatebox").text($.format.date(new Date($.pages.rosterdate), 'MM/dd/yy'));
        $("#dsdatebox").val($.format.date(new Date(), 'MMM dd, yyyy'));
    }
    
    if ($('.consumerlist').children().length > 0) {
        // Get the consumer service locations from the roster info:
        getConsumerServiceLocations("getLocations");
        showSplash = false;
        // Get the day service locations based on the users security settings:
        getDayServiceLocations();
        $("#dayservicesettingsbutton").addClass("buttonhighlight");
    } else {
        //splash screen
        var rosterhelp = "";
        var goalshelp = "";
        showSplash = true;
        if ($(".consumerselected").length == 0) { //no consumers selected.
            rosterhelp = " helpfadeinslow";
            tid = setInterval(strobe, 1000);
        } else {
            goalshelp = " helpfadeinslow";
        }
        var splash = "<div class='wrapper'><div class='content'><div class='left-side'>" +
            "<div class='hrtriangleleft" + rosterhelp +
            "'></div><div id='rosterhelp' class='rosterhelp rosterhelpleft" + rosterhelp +
            "'><span class='helpheader'>Get started:</span><hr class='hrhelp'><span class='helptext'>Select the Roster Icon here. Add people to the right side by clicking or tapping them.</span></div><div class='left-side-stuff'><div class='headline'>Day Services</div><br>" +
            "This interface is designed to allow you to enter data quickly and accurately so you can focus on spending your time assisting those in need of your help." +
            "<br><br></div></div><div class='right-side-guitar'>" +
            "</div></div></div>";
        // Set the day service action banner:
        $("#actionbanner").html("");
        $("#actioncenter").html(splash);
        addOrRemoveHelpScreenImage();
    }

    // If the user has update permission, show the clockin and clockout icons:
    if ($.session.DayServiceUpdate == true) {
        $("#roostertoolbar").html(
            "<button id='clockinicon' class='rosterbutton timeinicon'  onClick=popClockInOutTimeBox('clockininput')></button>" +
            "<button id='clockouticon'class='rosterbutton timeouticon' onClick=popClockInOutTimeBox('clockoutinput')></button>" +
            "<div id='clockininput' class='clockinhiddeninput'>" +
            "<div id='clockoutinput' class='clockouthiddeninput'>");
    } else {
        $("#roostertoolbar").html("");
    }
    if (showSplash) {
        $("#clockinicon").css("display", "none");
        $("#clockouticon").css("display", "none");
    }
    if (typeof currentlocationId === "undefined") {
        //nothing
    } else {
        checkConsumersForDate(currentlocationId);
    }
    $(document).trigger("moduleLoad");
    getDateToCheckShowCIAjax(compareCIDate);
}
// Check consumers to see which locations have been selected:

function getConsumerServiceLocations(functionIndicator) {
    var serviceLocations = "";
    var locationId = "";
    var index;
    var addLocation;
    var locationFound;
    locationIds = [];
    serviceLocationCount = 0;
    index = 0;
    $("#consumerlist").children(":not(.cloneAbsent)").each(function () {
        serviceLocations = $(this).attr("servicelocations");
        locationFound = "N";
        for (var i = 0; i < serviceLocations.length; i++) {
            if (serviceLocations.charAt(i) != '|') {
                locationId = locationId + serviceLocations.charAt(i);
            } else {
                if (functionIndicator == "checkConsumer") {
                    if (locationId == currentlocationId) {
                        // Set the background color for persons:
                        locationFound = "Y";
                    }
                }
                if (functionIndicator == "getLocations") {
                    addLocation = "Y";
                    for (var y = 0; y < serviceLocationCount + 1; y++) {
                        if (locationIds[y] == locationId) {
                            addLocation = "N";
                        }
                    }
                    if (addLocation == "Y") {
                        locationIds[index] = locationId;
                        index = index + 1;
                        serviceLocationCount = serviceLocationCount + 1;
                    }
                }
                locationId = "";
            }
        }
        locationId = "";
        // If a location has been selected:
        if (functionIndicator == "checkConsumer" && $('#dslocationbox').attr('locid') !=
            0) {
            // If the consumer is not associated with the selected location:
            if (locationFound == "N") {
                $(this).addClass("notInGroup");
            } else {
                $(this).removeClass("notInGroup");
            }
        }
    });
}
/////////////  Display Functions  ////////////////////////////////////
// Refresh the consumer day service activity records:

function refreshConsumerDayServiceActivity() {
    // Hide the error box:
    errorMessage = "";
    $("#errorboxtext").text("");
    $("#errorbox").css("opacity", "0");
    $("#errorbox").css("display", "none");
    // Call the stored procedure:
    getConsumerDayServiceActivity()
}
// Highlight the selected employee and his/her day service records:

function highlightPerson(event) {
    var par = $(event.target);
    if ($(par).hasClass("consumerselected")) {
        //alert("outer"); //not sure if this is still being hit ever -Joe
    } else {
        par = $(par).closest('consumer');
    }
    if (par.hasClass("highlightselected")) {
        par.removeClass("highlightselected")
    } else {
        par.removeClass("notselected");
        par.addClass("highlightselected");
    }
    // Set the background color for persons:
    //$("#consumerlist").children().css('background-color', '');
    ///$("#consumerlist").children().removeClass("highlightselected");
    // Get the id of the selected person:
    var consumerId = par.attr('id');
    // Set the new background color of the person selected:
    //par.css('background-color', '#99CCFF');
    ///$(".consumerselected").addClass("notselected");
    //par.removeClass("notselected");
    //par.addClass("highlightselected");
}

function highlightConsumers(consumerId, color, errorConsumerIds) {
    // For each day service person:
    $("dayservicerecord").each(function () {
        var lineNumber = $(this).attr('id');
        // If the hidden value matches the selected consumer's id:
        if ($(this).find('#consumerid' + lineNumber).attr('value') == consumerId) {
            // Highlight the day service person row:
            //$(this).css('background-color', color); //'#99CCFF' - blue
            $(".consumerselected").addClass("notselected");
            par.removeClass("notselected");
            $(this).addClass("highlightselected");
            //par.addClass("highlightselected");
        } else {
            // DO NOT Clear if Error Row
            var isErrorRow = false;
            if (errorConsumerIds != null) {
                for (i = 0; i < errorConsumerIds.length; i++) {
                    if ($(this).find('#consumerid' + lineNumber).attr('value') ==
                        errorConsumerIds[i]) {
                        isErrorRow = true;
                        break;
                    }
                }
            }
            // Clear the day service person row:
            if (!isErrorRow) $(this).css('background-color', '#e9e9e9');
        }
    });
}
// Look to see if any checkboxes have been checked:

function canvassCheckBoxes() {
    // If the location has already been batched, return:
    if (isBatched == "Y") {
        return;
    }
    var checkBoxCount = 0;
    // If the user has update permission:
    if ($.session.DayServiceUpdate == true) {
        // For each day service person:
        $("dayservicerecord").each(function () {
            // If the checkbox has been checked:
            if ($(this).find('#dscheckbox').attr('checked'))
                // Add 1 to the checkbox count:
                checkBoxCount = checkBoxCount + 1;
        });
        if (checkBoxCount > 0) {
            // Show the trashcan action button:
            $("#trashcan").css("opacity", "1");
            $("#trashcan").css("display", "block");
        } else {
            // Hide it:
            $("#trashcan").css("opacity", "0");
            $("#trashcan").css("display", "none");
        }
        if (checkBoxCount == 1) {
            // Hide all actionbuttons except for the trashcan:
            $("#timein").css("opacity", "0");
            $("#timein").css("display", "none");
            $("#timeout").css("opacity", "0");
            $("#timeout").css("display", "none");
            $("#dstype").css("opacity", "0");
            $("#dstype").css("display", "none");
        }
        if (checkBoxCount > 1) {
            // Show all the actionbuttons:
            $("#timein").css("opacity", "1");
            $("#timein").css("display", "block");
            $("#timeout").css("opacity", "1");
            $("#timeout").css("display", "block");
            $("#dstype").css("opacity", "1");
            $("#dstype").css("display", "block");
        }
    }
}

function massCheckboxUpdate() {
    if (isBatched == "Y") {
        return;
    }
    var checkBoxCount = 0;
    // If the user has update permission:
    if ($.session.DayServiceUpdate == true) {
        // For each day service person:
        $("dayservicerecord").each(function () {
            checkBoxCount = checkBoxCount + 1;
        });
        if (checkToggle == "All") {
            // Show the actionbuttons:
            $(".dscheckbox").attr('checked', 'checked');
            if (checkBoxCount > 0) {
                $("#trashcan").css("opacity", "1");
                $("#trashcan").css("display", "block");
            }
            if (checkBoxCount > 1) {
                $("#trashcan").css("opacity", "1");
                $("#trashcan").css("display", "block");
                $("#timein").css("opacity", "1");
                $("#timein").css("display", "block");
                $("#timeout").css("opacity", "1");
                $("#timeout").css("display", "block");
                $("#dstype").css("opacity", "1");
                $("#dstype").css("display", "block");
            }
            checkToggle = "None";
            $("#checkbox").removeClass("checkplusicon");
            $("#checkbox").addClass("checkminusicon");
        } else {
            // Hide the actionbuttons:
            $(".dscheckbox").removeAttr('checked');
            $("#trashcan").css("opacity", "0");
            $("#trashcan").css("display", "none");
            $("#timein").css("opacity", "0");
            $("#timein").css("display", "none");
            $("#timeout").css("opacity", "0");
            $("#timeout").css("display", "none");
            $("#dstype").css("opacity", "0");
            $("#dstype").css("display", "none");
            checkToggle = "All";
            $("#checkbox").removeClass("checkminusicon");
            $("#checkbox").addClass("checkplusicon");
        }
    }
}

function changeTheDSLocation(locationId) {
    var optionsHtml = [];
    var locations = $('#dslocationpop');
    isBatched = "N"; //If the location is changed, isBatched should be changed back to "N".
    $("#dslocationpop").css("opacity", "0");
    $("#dslocationpop").css("display", "none");
    $('#dslocationpop').children().each(function () {
        var tmpName = $(this).text().trim();
        var tmpId = $(this).attr('locid');
        var tmpRes = $(this).attr('Residence');
        var checkForLocationId = $('#dslocationbox').attr('locid');
        if (tmpRes == 'Y') {
            icon = "<img class='houseicon' src='./images/new-icons/icon_house.png' />";
        } else {
            icon =
                "<img class='buildingicon' src='./images/new-icons/icon_building.png' />";
        }
        //-------------------------------------------------------------------------------------------------------------------------------
        if ($(this).attr('locid') == locationId) {
            //added this check to not allow "select location" into the dropdown.  This may not be the best answer.  Perhaps remove "select location" from DB? -Joe
            if (checkForLocationId != 0) {
                optionsHtml.push("<a href='#' class='loclink' locid='" + $(
                        '#dslocationbox').attr('locid') + "' residence='" + tmpRes +
                    "' onClick='changeTheDSLocation(" + $('#dslocationbox').attr(
                        'locid') + ")'>" + icon + " " + $('#dslocationbox').text() +
                    "</a>");
            }
            $('#dslocationbox').text(tmpName);
            $('#dslocationbox').attr('locid', tmpId);
            resizeDsHeaderText('#dslocationbox', tmpName.length);
            currentlocationId = locationId;
            if ($.session.defaultDayServiceLocation > 0) {
                tmpId = $.session.defaultDayServiceLocation;
            }
            //createCookie('defaultDayServiceLocation', tmpId, 7);
            //saveDefaultLocationValueAjax('3', tmpId)
            setDefaultLoc(3, locationId);
        } else {
            if (tmpId != "0") optionsHtml.push("<a href='#' class='loclink' locid='" +
                tmpId + "' residence='" + tmpRes +
                "' onClick='changeTheDSLocation(" + tmpId + ")'>" + icon + " " +
                tmpName + "</a>");
        }
    });
    optionsHtml = optionsHtml.join('');
    locations.html(optionsHtml);
    sortBy('#dslocationpop');
    // If the user has update permission, show the clockin and clockout icons:
    if ($.session.DayServiceUpdate == true) {
        $("#appbuttonbox").html(
            "<clockinicon id='clockinicon' class='clockinicon' onClick=popClockInOutTimeBox('clockininput')></clockinicon>" +
            "<clockouticon id='clockouticon' class='clockouticon' onClick=popClockInOutTimeBox('clockoutinput')></clockouticon>" +
            "<clockin id='clockintext' class='clockinbox'>Clock In All</clockin>" +
            "<clockout id='clockouttext' class='clockoutbox'>Clock Out All</clockout>" +
            "<input id='clockininput' type='hidden'></input>" +
            "<input id='clockoutinput' type='hidden'></input>");
    }
    // Call the stored procedure to retrieve the consumer day service activity rows:
    getConsumerDayServiceActivity();
}

function resizeDsHeaderText(tag, length) {
    if (length <= 9) {
        $(tag).css("font-size", "25px");
    }
    if (length > 9) {
        $(tag).css("font-size", "21px");
    }
    if (length > 13) {
        $(tag).css("font-size", "18px");
    }
    if (length > 17) {
        $(tag).css("font-size", "15px");
    }
    if (length > 20) {
        $(tag).css("font-size", "12px");
    }
    if (length > 30) {
        $(tag).css("font-size", "11px");
    }
}

function getDayServiceInput(inputId) {
    //reset variable for card selection functionality
    $('.cidropdownfilterpop').hide();
    firstSelected = true;
    $('#' + inputId).css('display', 'block');    
}

function updateDayService(dpsttype, dsvalue, text, value) {
    var lineNumber = "";
    var dpsId = $(dpsttype).attr('id');
    var consumerId = $(dpsttype).parent().parent().attr('consumerId');
    $(dpsttype).text(text);
    $(dsvalue).attr('value', value);
    // Get the line number of the selected time:
    for (var i = 0; i < dpsId.length; i++) {
        if (isNaN(dpsId.charAt(i)) != true) lineNumber = lineNumber + dpsId.charAt(i);
    }
    updateDSType(lineNumber, consumerId);
}
///////////////////  Pop the display boxes ///////////////////////////////////
// Get time in and time out values for day service consumer rows:

function popDayServiceTimeBox(tagname) {
    if ($.session.DenyClockUpdate == true) { //|| $.session.DenyStaffClockUpdate == true) {
        return false;
    }
    if (isBatched == "Y") {
        return;
    }
    var now = new Date();
    originalText = $('#' + tagname).text();
    fmt = new DateFmt();
    //set default time. if it's 00:00, then use now, if not use value.
    if ($('#' + tagname).text() == '00:00 PM') {
        $('#' + tagname).text(fmt.format(now, "%h:%M %T"));
    }
    setupTimeInputBox([{ id: tagname }], {
        x: 80, y: 80,
    }, {
        callback: function (timeDigitsEntered) {
            $('#' + tagname).text(timeDigitsEntered);
            validateConsumerDSLineTimeAndUpdate(tagname);
        },
    })
    $('#' + tagname).text(originalText);
    return false;
}

function checkSingleClockIn() {
    var retval = true;
    //check highlighted row
    $("#consumerlist").children().each(function () {
        var numberOfSelected = 0;
        var color = $(this).css('background-color');
        //pick the one(s) that is highlighted
        if (color == 'rgb(153, 204, 255)') {
            // Add the consumer day service record for update:
            consumerId = $(this).attr("id");
            if ($(this).children("consumerinfo").css('opacity') < 1) {
                retval = false;
            }
        }
    });
    return retval;
}
// Get clockin and clockout values for day service clockin/clockout icons:

function popClockInOutTimeBox(inputField) {
    var now = new Date();
    if ($.session.DayServiceUpdate == false) return false;
    //if deny just use now as clock in/out time.
    if ($.session.DenyClockUpdate == true) {
        var now = new Date();
        var min = now.getMinutes();
        if (min.toString().length == 1) {
            min = '0' + min;
        }
        var hour = now.getHours();
        var timeText = convertMilitaryTimeToAMPM(hour + ":" + min);
        $('#' + inputField).val(timeText);
        if (inputField == "clockininput" || inputField == "clockinsingle" || inputField == "selectedclockininput") {
            $('#' + inputField).val(timeText);
            setClockInTime(inputField);
        }
        if (inputField == "clockoutinput" || inputField == "clockoutsingle" || inputField == "selectedclockoutinput") {
            $('#' + inputField).val(timeText);
            setClockOutTime(inputField, timeText);
        }
        return false;
    }
    if (!checkSingleClockIn()) return;
    setupTimeInputBox([{ id: inputField }], {
        x: 80, y: 80,
    }, {
        callback: function (timeDigitsEntered) {
            $('#' + inputField).val(timeDigitsEntered);
            if (inputField == "clockininput" || inputField == "clockinsingle" || inputField == "selectedclockininput") {
                setClockInTime(inputField);
            }
            if (inputField == "clockoutinput" || inputField == "clockoutsingle" || inputField == "selectedclockoutinput") {
                setClockOutTime(inputField, timeDigitsEntered);
            }
            //$('#' + inputField).val(timeDigitsEntered);
            //setClockInTime(inputField);
        },
    })
    return false;
    /*
    $('#' + inputField).mobiscroll().time({
        minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        dateFormat: 'M dd',
        theme: 'wp',
        accent: 'steel',
        display: 'bubble',
        mode: 'scroller',
        onSelect: function (valueText, inst) {
            if (inputField == "clockininput" || inputField == "clockinsingle" ||
                inputField == "selectedclockininput") {
                $('#' + inputField).val(valueText);
                setClockInTime(inputField);
            }
            if (inputField == "clockoutinput" || inputField == "clockoutsingle" ||
                inputField == "selectedclockoutinput") {
                $('#' + inputField).val(valueText);
                setClockOutTime(inputField, valueText);
            }
        }
    });
    $('#' + inputField).mobiscroll('show');
    //refresh to make sure data is updated
    //refreshConsumerDayServiceActivity();
    return false;
    */
}
// Get clockin and clockout values for day service clockin/clockout icons:

function popMassUpdateInOutTimeBox(inputField) {
    var now = new Date();
    if ($.session.DayServiceUpdate == false) return false;
    $('#' + inputField).mobiscroll().time({
        minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        dateFormat: 'M dd',
        theme: 'wp',
        accent: 'steel',
        display: 'bubble',
        mode: 'scroller',
        onSelect: function (valueText, inst) {
            if (inputField == "massclockininput") {
                validateMassTimeInAndUpdate(inputField);
                $('#' + inputField).val(valueText);
            } else {
                $('#' + inputField).val(valueText);
                validateMassTimeOutAndUpdate(inputField);
            }
        }
    });
    $('#' + inputField).mobiscroll('show');
    return false;
}
// Get calendar date change:

function popCalendarDateBox(inputField) {
    $("#datebox2").blur();
    var now = new Date($('#' + inputField).val());
    var inputDate;
    if ($.session.DayServiceUpdate == false) {
        return false;
    }
    $('#' + inputField).mobiscroll().date({
        minDate: new Date(1900, 1, 1), //new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        //dateFormat: 'yyyy-mm-dd',
        maxDate: new Date(),
        dateFormat: 'M dd, yyyy',
        theme: 'wp',
        accent: 'steel',
        display: 'bubble',
        mode: 'scroller',
        preset: 'date',
        onShow: function () {
            $(this).scroller('setDate', new Date(now.getFullYear(), now.getMonth(),
                now.getDate()), false);
        },
        onSelect: function (valueText, inst) {
            changedToDate = new Date(valueText);
            if ($.ciDate <= changedToDate) {
                $.session.ciBShow = true;
            } else {
                $.session.ciBShow = false;
            }
            $('#' + inputField).val(valueText);
            getConsumerServiceLocations("getLocations");
            getDayServiceLocations();
            checkConsumersForDate($('#dslocationbox').attr('locid'));
        }
    });
    $('#' + inputField).mobiscroll('show');
    return false;
}
// Show the day service type selections:

function popTypeUpdateBox(event) {
    //Removed all code. It was commented out. Leaving function name in case it is still being called from somewhere.- MAT(10/6/16)
}
// Show all the day services locations:

function popDSLocation(event) {
    //    if (isBatched == "Y") {
    //        return;
    //    };
    if ($("#dslocationpop").css("display") == "none") {
        $("#dslocationpop").css("opacity", "1");
        $("#dslocationpop").css("display", "block");
        $("#locationhelp").css("display", "none");
    } else {
        clearDayServicePops(event);
    }
}

function clearHighLighting(event) {
    $("#consumerlist").children().each(function () {
        var color = $(this).css('background-color');
        //pick the one(s) that is highlighted
        if (color == 'rgb(153, 204, 255)') {
            // Add the consumer day service record for update:
            $(this).css('background-color', 'rgb(255, 255, 255)');
        }
    });
    // For each day service person:
    $("dayservicerecord").each(function () {
        $(this).css('background-color', '#e9e9e9');
    });
    clearClockSingles();
}

function clearClockSingles() {
    $('#clockinsingle').css("opacity", "0");
    $('#clockoutsingle').css("opacity", "0");
    $('#clockinsingle').css("display", "none");
    $('#clockoutsingle').css("display", "none");
}
///////// Clear Popups  ////////////////////////////////////////////

function clearDayServicePops(event) {
    var tarId = "";
    var nodeName = "";
    var className = "";
    var parentX2 = "";

    // for non day service "global" clear pops  e.g. settings popup
    //clearPops(event); 

    //abstracted out code that should live in global place to clear settings right bar
    clearSettingsBarPop();

    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
        tarId = event.srcElement.id;
        nodeName = event.srcElement.nodeName;
        className = event.srcElement.className;
        parentX2 = $(event.srcElement).parent().parent().attr('id');
    } else {
        tarId = $(event.target).attr('id');
        nodeName = event.target.nodeName;
        className = event.target.className;
        parentX2 = $(event.target).parent().parent().attr('id');
    }
    if (tarId === undefined) {
        return;
    }
    if ($("#errorboxtext").text().length > 0) {
        return;
    }
    if ($("#errorboxtext").text().length > 0) {
        return;
    }
    if (tarId == "" || tarId == "dslocationpop" || tarId == "dslocationbox" || tarId == "dslocationbox2" || tarId ==
        "dslocationdownarrow" || parentX2 == "consumerlist" || tarId == "namebox" || tarId.indexOf(
            "img") > -1 || tarId.indexOf("clockinsingle") > -1 || tarId.indexOf(
            'clockoutsingle') > -1 || tarId.indexOf("clockintextsingle") > -1 || tarId.indexOf(
            "dpsttype") > -1 || tarId.indexOf("dst") > -1) { } else {
        $("#dslocationpop").css("display", "none");
        $("dstypepop").css("display", "none");
        $(".cidropdownfilterpop").hide();
    }
    if (tarId == "namebox" || className == "portraitsselected" || tarId == "clockouticon" ||
        tarId == "clockinicon") { } else {
        $('.consumerselected').removeClass('highlightselected');
        $('.consumerselected').removeClass("notselected");
    }
    //alert(tarId + " " + nodeName + " " + className + " " + parentX2);
    //needed for selection reset
    if ($('.dayservicerecord').hasClass('selected') || unSelectCards) {
        if (nodeName == "ACTIONCENTER" || nodeName == "ACTIONPANE" || tarId == "roostertoolbar" ||
            tarId == "outerleftmenu" || tarId == "outerconsumerpane") {
            $('.dayservicerecord').removeClass("selected");
            $('.dayservicerecord').removeClass("notselected");
            $('.topmenu').fadeIn(600);
            $('#consumerpane').fadeIn(600);
            $('#leftmenu').fadeIn(600);
            $(".inputbar").removeClass("invertedLine");
            $("#selectrows").removeClass("unselectallrows");
            $("#selectrows").addClass("selectallrows");
            firstSelected = true;
            selectAll = true;
            unSelectCards = false;
        }
    }

    //turn back on help message after leaving help and settings panel if no one is clocked in
    if ($("#actioncenter").children().length == 0 && $("#settingsbox").css("display") == "none" && $("#helpbox").css("display") == "none"  && firstLoad == false) {
        //too slow. need a solution that doesnt flash this befor server call is finished
        $("#actioncenter").append("<div class='consumerclockinhelptriangle'></div>");
        $("#actioncenter").append("<div id='consumerclockinhelp'>Click here to clock in</div>");
    }
}
///////////  Sorting  ////////////////////////////////////

function sortObj(key, html) {
    return {
        key: key,
        html: html
    };
}

function sortDaySerivces(container, parentNode, childNodeSortOn, style) {
    var sortArray = [];
    if (style.length == 0) {
        $(parentNode).children(childNodeSortOn).each(function () {
            sortArray.push(sortObj($(this).text(), $(this).parent().html()));
        });
    } else {
        $(parentNode).find('.dpstimein').each(function () {
            sortArray.push(sortObj($(this).val(), $(this).parent().html()));
        });
    }
    sortArray.sort(function (a, b) {
        var aID = a.key;
        var bID = b.key;
        return (aID == bID) ? 0 : (aID > bID) ? 1 : -1;
    });
    if ($('#' + childNodeSortOn).attr('order') == 'forward') {
        sortArray.reverse();
        $('#' + childNodeSortOn).attr('order', 'reverse');
        $('#' + childNodeSortOn + 'arrow').removeClass('down2');
        $('#' + childNodeSortOn + 'arrow').addClass('up');
    } else {
        $('#' + childNodeSortOn).attr('order', 'forward');
        $('#' + childNodeSortOn + 'arrow').removeClass('up');
        $('#' + childNodeSortOn + 'arrow').addClass('down2');
    }
    var newhtml = "";
    $(sortArray).each(function () {
        var id = this.html.substring(this.html.indexOf('<dspersonid id="') + 18);
        id = id.substring(0, id.indexOf('"'));
        newhtml = newhtml + "<" + parentNode + " id='" + id + "' class='" + $(
                "dayservicerecord[id='" + id + "']").attr('class') + "' style=" + $(
                "dayservicerecord[id='" + id + "']").attr('style') + " >" + this.html +
            "</" + parentNode + ">";
    });
    $(parentNode).parent().html(newhtml);
}
////////////// Utility Functions ////////////////////////////////////////////

function convertDSValueToText(value) {
    var newtext;
    switch (value) {
        case "C":
            newText = "Combo";
            break;
        case "A":
            newText = "Adult Day";
            break;
        case "V":
            newText = "Voc. Hab.";
            break;
        case "E":
            newText = "Enclave";
            break;
        case "N":
            newText = "Non-Billable";
            break;
        case "G":
            newText = "Group Employment";
            break;
        default:
            newText = "Day Service";
    }
    return newText;
}

function createSelectOptions(DSType) {
    //Removed all code. It was commented out. Leaving function name in case it is still being called from somewhere.- MAT(10/6/16)
}
////////////// Database Update Functions ///////////////////
// Mass update time in:

function validateMassTimeInAndUpdate(inputId) {
    var inputTime = $("#" + inputId).attr('value');
    // If time entered:
    if (inputTime.length > 0) {
        // Convert the AM/PM time input to military time:
        inputTime = convertTimeToMilitary(inputTime);
        var lineNumber;
        var consumerId;
        var consumerIds = "";
        var startTime;
        var endTime;
        var timeError = "N";
        var errorMsg;
        var inputType = "Start Time";
        // For each day service consumer record:
        $("dayservicerecord").each(function () {
            // If the consumer day service record is checked:
            if ($(this).find('#dscheckbox').attr('checked')) {
                lineNumber = $(this).attr('id');
                consumerId = $(this).find('#consumerid' + lineNumber).attr('value');
                startTime = $("#dpstimein" + lineNumber).val();
                endTime = $("#dpstimeout" + lineNumber).val();
                startTime = convertTimeToMilitary(startTime);
                endTime = convertTimeToMilitary(endTime);
                // For each consumer record:
                $("#consumerlist").children().each(function () {
                    // If the day service record has the same id as the consumer and the consumer is "active":
                    if ($(this).attr("id") == consumerId && $(this).find(
                        "consumerinfo").css("opacity") == "1") {
                        // If the time in is earlier than the time out:
                        if (validateTime(inputTime, endTime) == 0) {
                            timeError = "Y";
                        } else {
                            // Add the consumer record for update:
                            consumerIds = consumerIds + consumerId + "," +
                                startTime + "|";
                        }
                    }
                });
            }
        });
        // Update the consumer day service times:
        if (consumerIds.length > 0 && timeError == "N") {
            // Hide the error box:
            errorMessage = "";
            $("#errorboxtext").text("");
            $("#errorbox").css("opacity", "0");
            $("#errorbox").css("display", "none");
            updateDayServiceActivity(consumerIds, inputType, inputTime, "");
        }
    }
}

function validateTime(startTime, stopTime, id) {
    var validTime = 1;
    if (startTime > stopTime && stopTime != "00:00:00") {
        setErrorBox("Time Conflict");
        setErrorHeader(id);
        validTime = 0;
    }
    return validTime;
}
// Mass update time out:

function validateMassTimeOutAndUpdate(inputId) {
    var inputTime = $("#" + inputId).attr('value');
    // If time entered:
    if (inputTime.length > 0) {
        // Convert the AM/PM time input to military time:
        inputTime = convertTimeToMilitary(inputTime);
        // Set 12 midnight to 11:59 PM:
        if (inputTime == "00:00:00") {
            inputTime = "23:59:00";
        }
        var lineNumber;
        var consumerId;
        var consumerIds = "";
        var startTime;
        var endTime;
        var timeError = "N";
        var errorMsg;
        var inputType = "Stop Time";
        // For each day service consumer:
        $("dayservicerecord").each(function () {
            // If the consumer day service record is checked:
            if ($(this).find('#dscheckbox').attr('checked')) {
                lineNumber = $(this).attr('id');
                consumerId = $(this).find('#consumerid' + lineNumber).attr('value');
                startTime = $("#dpstimein" + lineNumber).val();
                startTime = convertTimeToMilitary(startTime);
                // For each consumer record:
                $("#consumerlist").children().each(function () {
                    // If the day service record has the same id as the consumer and the consumer is "active":
                    if ($(this).attr("id") == consumerId && $(this).find(
                        "consumerinfo").css("opacity") == "1") {
                        // If the time in is earlier than the time out:
                        if (startTime > inputTime) {
                            timeError = "Y";
                            errorMsg =
                                "The Time Out cannot be earlier than the Time In.";
                            $(this).css('background-color', '#FFBABA');
                            setErrorBox(errorMsg);
                        } else {
                            // Add the consumer record for update:
                            startTime = $("#starttime" + lineNumber).attr(
                                'value');
                            startTime = convertTimeToMilitary(startTime);
                            consumerIds = consumerIds + consumerId + "," +
                                startTime + "|";
                        }
                    }
                });
            }
        });
        // Update the consumer day service times:
        if (consumerIds.length > 0 & timeError == "N") {
            // Hide the error box:
            errorMessage = "";
            $("#errorboxtext").text("");
            $("#errorbox").css("opacity", "0");
            $("#errorbox").css("display", "none");
            updateDayServiceActivity(consumerIds, inputType, inputTime, "");
        }
    }
}
// Time in and time out for consumer day service rows:

function validateConsumerDSLineTimeAndUpdate(inputId) {
    var lineNumber = '';
    var fieldName = "";
    var inputTime = "";
    var inputType = "";
    var inTime = "";
    var outTime = "";
    var activityLine = "";
    var amPM = "";
    var hour = "";
    var minute = "";
    var inputMilitaryTime = "";
    var outputMilitaryTime = "";
    var originalTime = "";
    var returnValue = "";
    var consumerKey;

    //incoming time change
    inputTime = $("#" + inputId).text(); 

    // Get the field name and activity line number:
    for (var i = 0; i < inputId.length; i++) {
        if (isNaN(inputId.charAt(i)) == true) fieldName = fieldName + inputId.charAt(i);
        else lineNumber = lineNumber + inputId.charAt(i);
    }
    // Get the selected consumer
    var consumerId = $("#inputbar" + lineNumber).parent().attr('consumerid');

    //currently clocked in time
    var startTime = $("#dpstimein" + lineNumber).attr('value');
    startTime = convertTimeToMilitary(startTime);

    // If time entered:
    if (inputTime.length > 0) {
        // Convert the AM/PM time input to military time:
        inputTime = convertTimeToMilitary(inputTime);
        // If the input field was the out time:
        if (fieldName == "dpstimeout") {
            inputType = "Stop Time";
            activityLine = "#dpstimein" + lineNumber;
            inTime = $(activityLine).text();
            // Convert in time to military time:
            if (inTime.length > 0) {
                inputMilitaryTime = convertTimeToMilitary(inTime);
                if (inputMilitaryTime == "00:00:00") {
                    inputMilitaryTime = "23:59:00";
                }
            }
            // Set the input time to the output military time:
            outputMilitaryTime = inputTime;
        } else {
            // If the input field was the in time:
            inputType = "Start Time";
            activityLine = "#dpstimeout" + lineNumber;
            // Set the input time to the input military time:
            inputMilitaryTime = inputTime;
            outTime = $(activityLine).text();
            // Convert out time to military time:
            if (outTime.length > 0) {
                outputMilitaryTime = convertTimeToMilitary(outTime);
            }
        }
        // If the time in is earlier than the time out:
        if (validateTime(inputMilitaryTime, outputMilitaryTime) == 0) {
            var header = $('#dpstimeout' + lineNumber).parent().siblings('.dsrecordheader');
            header.addClass('errorheader');
            errorMessage = "Time conflict";
            $(".errorheader").append("<p class='errorText'>" + errorMessage + "</p>");
            //header.children('namebox').css('display', 'none');
            header.children('acuitybox').css('display', 'none');
            return false;
        } else {
            // Hide the error box:
            errorMessage = "";
            $("#errorboxtext").text("");
            $("#errorbox").css("opacity", "0");
            $("#errorbox").css("display", "none");
            // Add the consumer day service record for update:
            consumerKey = consumerId + "," + startTime + "|";
            // Update the day service activity time:
            updateDayServiceActivity(consumerKey, inputType, inputTime, "");
        }
    }
}

function setClockInTime(inputId) {
    // If an existing error exists, return:
    if ($("#errorboxtext").text().length > 0) {
        return;
    }
    var clockInTime = "";
    // Get the clockin time:
    clockInTime = $("#" + inputId).attr('value');
    // If a time has been entered:
    if (clockInTime.length > 0) {
        // Convert the AM/PM time to military time:
        clockInTime = convertTimeToMilitary(clockInTime);
        var lineNumber;
        var consumerId;
        var consumerIds = "";
        var highlighted;
        var highlightedConsumerId;
        var cardExists;
        var clockInAll;
        //set highlighted to true and sets id if right bar has a selected consumer
        $(".consumerselected").each(function () {
            if ($(this).hasClass("highlightselected")) {
                highlighted = true;
                highlightedConsumerId = $(this).attr('id');
            }
        });
        if (inputId == "clockininput") {            
            $("#consumerlist").children().each(function () {
                if ($(this).css("opacity") == "1") {
                    if ($(this).hasClass("highlightselected")) {
                        // Add the consumer day service record for update:
                        consumerId = $(this).attr("id");
                        consumerIds = consumerIds + consumerId + "|";
                        clockInAll = false;
                    }
                }
            });
            if (clockInAll != false) {
                $("#consumerlist").children().each(function () {
                    if ($(this).css("opacity") == "1") {
                        consumerId = $(this).attr("id");
                        consumerIds = consumerIds + consumerId + "|";
                    }
                });
            }
            // }
            //}
        }
        if (inputId == "selectedclockininput") {
            // For every consumer that is "active":
            $("#actioncenter").children().each(function () {
                if ($(this).hasClass("selected")) {
                    consumerId = $(this).attr("consumerid");
                    consumerIds = consumerIds + consumerId + "|";
                }
            });
        }
        //may be able to remove this, especially if we refactor out single clock in.
        if (inputId == "clockinsingle") {
            $("#consumerlist").children().each(function () {
                var color = $(this).css('background-color');
                //pick the one(s) that is highlighted
                if (color == 'rgb(153, 204, 255)') {
                    // Add the consumer day service record for update:
                    consumerId = $(this).attr("id");
                    consumerIds = consumerIds + consumerId + "|";
                }
            });
        }
        // If any consumers selected:
        if (consumerIds.length > 0) {
            // Hide the error box:
            errorMessage = "";
            $("#errorboxtext").text("");
            $("#errorbox").css("opacity", "0");
            $("#errorbox").css("display", "none");
            //Call the stored procedure:
            dayServiceClockIn(consumerIds, clockInTime);
        }
    }
}

function setClockOutTime(inputId) {
    var inputTime = $("#" + inputId).attr('value');
    // If an existing error exists, return:
    if ($("#errorboxtext").text().length > 0) {
        return;
    }
    var clockOutTime = "";
    // Get the clockout time:
    clockOutTime = $("#" + inputId).attr('value');
    // If a time has been entered:
    if (clockOutTime.length > 0) {
        // Convert the AM/PM time input to military time:
        clockOutTime = convertTimeToMilitary(clockOutTime);
        // Set 12 midnight to 11:59 PM:
        if (clockOutTime == "00:00:00") {
            clockOutTime = "23:59:00";
        }
        var lineNumber = "";
        var startTime;
        var endTime;
        var consumerId;
        var consumerKeys = "";
        var timeError = "N";
        var inputType = "Stop Time";
        var highlighted;
        var highlightedConsumerId;
        $(".consumerselected").each(function () {
            if ($(this).hasClass("highlightselected")) {
                highlighted = true;
                highlightedConsumerId = $(this).attr('id');
            }
        });
        if (inputId == "clockoutinput") {
            $(".dayservicerecord").each(function () {
                if (highlighted == true) {
                    if (highlightedConsumerId == $(this).attr('consumerid')) {
                        // Get active row from that id
                        var activeRowId = $(this).find("inputbar").eq(0).attr('id');
                        var lineNumber = "";
                        // Get the line number of the selected time:
                        for (var i = 0; i < activeRowId.length; i++) {
                            if (isNaN(activeRowId.charAt(i)) != true) lineNumber =
                                lineNumber + activeRowId.charAt(i);
                        }
                        //consumerId = $(this).find('#consumerid' + lineNumber).attr('value');
                        consumerId = $(this).attr('consumerid');
                        startTime = $("#dpstimein" + lineNumber).text();
                        endTime = $("#dpstimeout" + lineNumber).text();
                        //convert to military time:
                        startTime = convertTimeToMilitary(startTime);
                        // If the end time has not already been entered:
                        if (endTime == "00:00 PM") {
                            // Find the list of consumers:
                            $("#consumerlist").children().each(function () {
                                // If the day service record has the same id as the consumer and the consumer is "active":
                                //if ($(this).attr("id") == consumerId && $(this)
                                //    .find("consumerinfo").css("opacity") == "1"
                                //) {
                                if ($(this).hasClass("highlightselected")) {
                                    // Set the start time:
                                    consumerId = $(this).attr('id');
                                    startTime = convertTimeToMilitary(startTime);
                                    if (validateTime(startTime, clockOutTime,
                                        consumerId) == 0) {
                                        timeError = "Y";
                                        $(this).css('border-color', '#ab2c1f');
                                        return false;
                                    } else {
                                        //  Add the consumer day service record for update:
                                        consumerKeys = consumerKeys +
                                            consumerId + "," + startTime + "|";
                                    }
                                }
                            });
                        }
                        consumerKeys = consumerKeys + consumerId + "," + startTime +
                            "|";
                    }
                } else {
                    // Get active row from that id
                    var activeRowId = $(this).find("inputbar").eq(0).attr('id');
                    var lineNumber = "";
                    // Get the line number of the selected time:
                    for (var i = 0; i < activeRowId.length; i++) {
                        if (isNaN(activeRowId.charAt(i)) != true) lineNumber =
                            lineNumber + activeRowId.charAt(i);
                    }
                    //consumerId = $(this).find('#consumerid' + lineNumber).attr('value');
                    consumerId = $(this).attr('consumerid');
                    startTime = $("#dpstimein" + lineNumber).text();
                    endTime = $("#dpstimeout" + lineNumber).text();
                    //convert to military time:
                    startTime = convertTimeToMilitary(startTime);
                    // If the end time has not already been entered:
                    if (endTime == "00:00 PM") {
                        // Find the list of consumers:
                        //$("#consumerlist").children().each(function () {
                            // If the day service record has the same id as the consumer and the consumer is "active":
                            //if ($(this).attr("id") == consumerId && $(this).find(
                            //    "consumerinfo").css("opacity") == "1") {
                            //if ($(this).hasClass("highlightselected")) {
                                // Set the start time:
                             //   consumerId = $(this).attr('id');
                                startTime = convertTimeToMilitary(startTime);
                                if (validateTime(startTime, clockOutTime) == 0) {
                                    timeError = "Y";
                                    $(this).css('border-color', '#ab2c1f');
                                    return false;
                                } else {
                                    //  Add the consumer day service record for update:
                                    consumerKeys = consumerKeys + consumerId +
                                        "," + startTime + "|";
                                }
                           // }
                        //});
                    }
                    //Can't tell why line below exists.  Solves clockout problem by removing it.
                    //consumerKeys = consumerKeys + consumerId + "," + startTime + "|";
                }
            });
        }
        if (inputId == "selectedclockoutinput") {
            // For each day service consumer record:
            $(".dayservicerecord").each(function () {
                if ($(this).hasClass("selected")) {
                    // Get active row from that id
                    var activeRowId = $(this).find("inputbar").eq(0).attr('id');
                    var lineNumber = "";
                    // Get the line number of the selected time:
                    for (var i = 0; i < activeRowId.length; i++) {
                        if (isNaN(activeRowId.charAt(i)) != true) lineNumber =
                            lineNumber + activeRowId.charAt(i);
                    }
                    //consumerId = $(this).find('#consumerid' + lineNumber).attr('value');
                    consumerId = $(this).attr('consumerid');
                    startTime = $("#dpstimein" + lineNumber).text();
                    endTime = $("#dpstimeout" + lineNumber).text();
                    //convert to military time:
                    startTime = convertTimeToMilitary(startTime);
                    // If the end time has not already been entered:
                    if (endTime == "00:00 PM") {
                        // Find the list of consumers:
                        $("#actioncenter").children().each(function () {
                            // If the day service record has the same id as the consumer and the consumer is "active":
                            if ($(this).attr("consumerid") == consumerId && $(this).hasClass("selected")){

                                // Set the start time:
                                startTime = convertTimeToMilitary(startTime);
                                if (validateTime(startTime, clockOutTime) == 0) {
                                    timeError = "Y";
                                    $(this).css('border-color', '#ab2c1f');
                                    return false;
                                } else {
                                    //  Add the consumer day service record for update:
                                    consumerKeys = consumerKeys + consumerId +
                                        "," + startTime + "|";
                                }
                            }
                        });
                    }
                    //Can't tell why line below exists.  Solves clockout problem by removing it.
                    //consumerKeys = consumerKeys + consumerId + "," + startTime + "|";
                }
            });
        }
        if (inputId == "clockoutsingle") {
            // For every consumer that is "active": background color of the person selected:
            //par.parent().css('background-color', '#99CCFF');
            $("#consumerlist").children().each(function () {
                var color = $(this).css('background-color');
                //pick the one(s) that is highlighted
                if (color == 'rgb(153, 204, 255)') {
                    // Add the consumer day service record for update:
                    consumerId = $(this).attr("id");
                }
            });
            //need to find start time
            $(".dayservicerecord").each(function () {
                tmplineNumber = $(this).attr('id');
                tmpconsumerId = $(this).find('#consumerid' + tmplineNumber).attr(
                    'value');
                tmpstartTime = $("#dpstimein" + tmplineNumber).val();
                tmpendTime = $("#dpstimeout" + tmplineNumber).val();
                if (consumerId == tmpconsumerId) {
                    if (tmpendTime == "00:00 PM") {
                        consumerKeys = consumerKeys + consumerId + "," + tmpstartTime +
                            "|";
                    }
                }
            });
        }
        // If any consumers day service records selected:
        if (consumerKeys.length > 0 && timeError == "N") {
            // Hide the error box:
            errorMessage = "";
            $("#errorboxtext").text("");
            $("#errorbox").css("opacity", "0");
            $("#errorbox").css("display", "none");
            // Call the stored procedure:
            //dayServiceClockOut(consumerKeys, clockOutTime);
            updateDayServiceActivity(consumerKeys, inputType, inputTime, "");
        }
    }
}

function updateAllDSType() {
    //Took out all Commented code. Left function in case it is still being called from somewhere. -MAT(10/6/16)
}

function updateDSType(lineNumber, consumerId) {
    var inputType = "Service Type";
    var inputTime = "";
    var startTime;
    var consumerKey;
    // Get the selected day service type from the consumer day service activity line:
    var dayServiceType = $('#dsvalue' + lineNumber).val();    
    // Get the consumer id and start time:
    startTime = $("#dpstimein" + lineNumber).attr('value');
    StartTime = convertTimeToMilitary(startTime);
    // Set the consumer key for the input parameter to the stored procedure:
    consumerKey = consumerId + "," + StartTime + "|";
    // Hide the error box:
    errorMessage = "";
    $("#errorboxtext").text("");
    $("#errorbox").css("opacity", "0");
    $("#errorbox").css("display", "none");
    // Call the stored procedure:
    updateDayServiceActivity(consumerKey, inputType, inputTime, dayServiceType);
}
// Delete the selected day service records:

function deleteDayServices() {
    var lineNumber = "";
    var lineID = "";
    var consumerId;
    var startTime;
    var consumerKeys = "";
    // Hide the error box:
    errorMessage = "";
    $("#errorboxtext").text("");
    $("#errorbox").css("opacity", "0");
    $("#errorbox").css("display", "none");
    // For each consumer day service record:
    $(".invertedLine").each(function () {
        // Get the consumer id and start time:
        lineNumber = "";
        lineId = $(this).attr('id');
        for (var i = 0; i < lineId.length; i++) {
            if (isNaN(lineId.charAt(i)) != true) lineNumber = lineNumber + lineId.charAt(
                i);
        }
        consumerid = $(this).parent().attr("consumerid");
        startTime = $("#dpstimein" + lineNumber).attr('value');
        startTime = convertTimeToMilitary(startTime);
        var selectedLines = $(".invertedLine");
        if (selectedLines.length > 0) {
            // Add the consumer key to the input parameter for the stored procedure:
            consumerKeys = consumerKeys + consumerid + "," + startTime + "|";
        }
    });
    // If there were consumer day service records selected:
    if (consumerKeys.length > 0) {
        // Call the stored procedure:
        return Anywhere.promptYesNo("Are you sure you wish to delete the selected record(s)?", function () {
            deleteDayServiceActivity(consumerKeys);
        });
    }
}

function setErrorBox(msg) {
    $("#errorboxtext").text(msg);
    $("#errorbox").css("opacity", "1");
    $("#errorbox").css("display", "block");
}

function timeoutChange(tagid) {
    if ($('#' + tagid).val().length == 1) {
        $('#' + tagid).val('00:00 PM');
        validateConsumerDSLineTimeAndUpdate(tagid);
        //$('#' + tagid).val(valueText);
    }
}

function toggleSelected(recordId) {
    if (firstSelected) {
        firstSelected = false;
        $('.dayservicerecord').addClass("notselected");
        $('#consumerpane').fadeOut(600);
        $('#leftmenu').fadeOut(600);
        $('.topmenu').fadeOut(600);
    }
    if ($(recordId).hasClass("selected")) {
        $(recordId).removeClass("selected");
        $(recordId).addClass("notselected");
    } else {
        $(recordId).removeClass("notselected");
        $(recordId).addClass("selected");
        unSelectCards = true;
    }
}

function setErrorHeader(id) {
    if (id != null) {
        id = id.split("|");
        if (id.length > 2) {
            //do nothing
        } else {
            var card = $("div[consumerid=" + id[0] + "]")[0]; //grabs first id  
            $(card).children(".dsrecordheader").addClass("errorheader");
            var header = $(card).children(".dsrecordheader");
            errorMessage = "Time Conflict";
            $(".errorheader").append("<p class='errorText'>" + errorMessage + "</p>");
            //header.children('namebox').css('display', 'none');
            header.children('acuitybox').css('display', 'none');
        }
    }
}

function invertBar(event) {
    var line = event.currentTarget;
    if ($(line).parents().hasClass("selected")) {
        $(line).toggleClass("invertedLine");
    }
}

function filterDayServicesCards() {
    $("#actioncenter").children().each(function () {
        if ($("#rosterfilter").val().toLowerCase() < 1) {
            $(this).show();
        } else {
            //if there is something in the filter box, then try to filter
            var lastName = $(this).find(".dslastnametext").text().toLowerCase();
            var firstLetter = lastName.charAt(0);
            var searchListRecord = lastName.indexOf($("#rosterfilter").val().toLowerCase());
            var searchFirstLetter = $("#rosterfilter").val().toLowerCase().charAt(0);
            if (searchListRecord > -1 && searchFirstLetter == firstLetter) {
                $(this).show();
            } else {
                $(this).hide();
            }
        }
    });
}

function selectAllRows() {
    if (selectAll != false) {
        $(".dayservicerecord").removeClass("notselected");
        $(".dayservicerecord").addClass("selected");
        $(".inputbar").addClass("invertedLine");
        $("#selectrows").removeClass("selectallrows");
        $("#selectrows").addClass("unselectallrows");
        selectAll = false;
    } else {
        $(".dayservicerecord").addClass("notselected");
        $(".dayservicerecord").removeClass("selected");
        $(".inputbar").removeClass("invertedLine");
        $("#selectrows").removeClass("unselectallrows");
        $("#selectrows").addClass("selectallrows");
        selectAll = true;
    }
}

function removeErrorMessage() {
    $("#locationhelp").css("display", "none");
}

function createCIDropdown(res, existingStaffId, consumerId, startTime, ciButtonId, isBatched) {
    var optionsCIHtml = [];
    var tmpStaffId = '';
    var tmpFullName = '';//remove once drop down gets created and names formatted
    var ciDropdown = $('#' + ciButtonId);
    var classadd = "block";
    var count = 0;
    if (isBatched == 'N') {
        optionsCIHtml.push("<a href='#' class='nonselectedcivalue " + classadd +
                    "' fullname='" + "" + "' staffid='" + "" +
                    "' onClick='updateCIStaffAjax(\"" + consumerId + "\",\"" + "" + "\",\"" + startTime + "\",\"" + ciButtonId + "\",\"" + isBatched + "\")' >" + "" +
                    "</a>");
    }    

    $('result', res).each(function () {
        tmpFullName = $('fullName', this).text();
        tmpFullName = tmpFullName.split(' ').reverse().join(' ');
        tmpFullName = tmpFullName.replace(/,\s*$/, "");
        tmpStaffId = $('id', this).text();

        if (isBatched == 'Y') {
            if (tmpStaffId == existingStaffId) {
                optionsCIHtml.push("<a href='#' class='selectedcivalue " + classadd +
                        "' fullname='" + tmpFullName + "' staffid='" + tmpStaffId +
                        " ' onClick='updateCIStaffAjax(\"" + consumerId + "\",\"" + tmpStaffId + "\",\"" + startTime + "\",\"" + ciButtonId + "\",\"" + isBatched + "\")'>" + tmpFullName +
                        "</a>");
            } else if(count == 0) {
                optionsCIHtml.push("<a href='#' class='nonselectedcivalue " + classadd +
                    "' fullname='" + "" + "' staffid='" + "" +
                    "' onClick='updateCIStaffAjax(\"" + consumerId + "\",\"" + "" + "\",\"" + startTime + "\",\"" + ciButtonId + "\",\"" + isBatched + "\")' >" + "" +
                    "</a>");
                count++
            }
        } else {
            if (tmpStaffId == existingStaffId) {
                optionsCIHtml.push("<a href='#' class='selectedcivalue " + classadd +
                        "' fullname='" + tmpFullName + "' staffid='" + tmpStaffId +
                        "' onClick='updateCIStaffAjax(\"" + consumerId + "\",\"" + tmpStaffId + "\",\"" + startTime + "\",\"" + ciButtonId + "\",\"" + isBatched + "\")' >" + tmpFullName +
                        "</a>");
            } else {
                optionsCIHtml.push("<a href='#' class='nonselectedcivalue " + classadd +
                        "' fullname='" + tmpFullName + "' staffid='" + tmpStaffId +
                        "' onClick='updateCIStaffAjax(\"" + consumerId + "\",\"" + tmpStaffId + "\",\"" + startTime + "\",\"" + ciButtonId + "\",\"" + isBatched + "\")' >" + tmpFullName +
                        "</a>");
            }
        }               
    });

    optionsCIHtml = optionsCIHtml.join('');
    ciDropdown.html(optionsCIHtml);
    showCIDropdown(ciButtonId);
}

function showCIDropdown(ciButtonId) {
    //$('.cidropdownfilterpop').show();
    $("#" + ciButtonId).show();
}

function hideCIDropdown(ciButtonId) {
    $("#" + ciButtonId).hide();
}

function getExistingCIStaffIDFromResponse(res) {
    var staffId = '';
    $("result", res).each(function () {
        staffId = $('staffid', this).text();
    });
    return staffId;
}

function compareCIDate(res) {
    var today = new Date();
    ciDateToCompare = new Date(res[0].Setting_Value);
    $.ciDate = ciDateToCompare;

    if (ciDateToCompare <= today) {
        $.session.ciBShow = true;
    }
}