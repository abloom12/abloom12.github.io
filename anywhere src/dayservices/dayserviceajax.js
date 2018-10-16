// Gets all day service locations:

// struggle with "this" keyword, this is a temporary solution to add data to function updateDayService(inputId, text, value)
var combo = "Combo";
var c = "C";
var dayService = "Adult Day";
var a = "A";
var vocHab = "Voc. Hab.";
var v = "V";
var enclave = "Enclave";
var e = "E";
var nonBillable = "Non-Billable";
var n = "N";
var groupEmployment = "Group Employment";
var g = "G";

function getDayServiceLocations() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getDayServiceLocations/",
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + $('#dsdatebox').val() + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);

            //always check for errors before processing
            //if (checkforErrors(res) == -1){
            //    return;
            //};


            var optionsHtml = [];
            var locations = $('#dslocationpop');
            var first = 0;
            var showSelect = "Y";

            $('location', res).each(function () {
                tmpName = $('name', this).text();
                tmpId = $('locationId', this).text();
                tmpId2 = $('ID', this).text();
                tmpRes = $('Residence', this).text();

                if (tmpRes == 'Y') {
                    icon = "<img class='houseIcon' src='./images/new-icons/icon_house.png' />";
                } else {
                    icon = "<img class='buildingIcon' src='./images/new-icons/icon_building.png' />";
                }

                if (tmpId == '') {
                    tmpId = tmpId2;
                }

                // If more than 1 location for the selected consumers:
                if (serviceLocationCount > 1) {
                    // Populate the day services location box with all the locations and a link to the changeTheDSLocation function in dayservices.js:
                    optionsHtml.push("<a href='#' class='loclink' locid='" + tmpId + "' residence='" + tmpRes + "' onClick='changeTheDSLocation(" + tmpId + ")'>" + icon + " " + tmpName + "</a>");
                } else {
                    // If only 1 location for the selected consumers and the location id is the same as the selected location:
                    if (serviceLocationCount == 1 && locationIds[0] == currentlocationId) {
                        // If the location id = the selected location:
                        if (tmpId == currentlocationId) {

                            currentlocationId = tmpId;

                            // Display the location name:
                            $('#dslocationbox').html(tmpName + "<dslocationdownarrow id='dslocationdownarrow' class='locationdownarrow dropdownarrow' onClick='popDSLocation(event)'></dslocationdownarrow>");
                            $('#dslocationbox').attr('locid', tmpId);
                            resizeHeaderText('#dslocationbox', tmpName.length);
                            showSelect = "N";
                        }
                        else {
                            // Populate the day services location box with all the locations and a link to the changeTheDSLocation function in dayservices.js:
                            optionsHtml.push("<a href='#' class='loclink' locid='" + tmpId + "' residence='" + tmpRes + "' onClick='changeTheDSLocation(" + tmpId + ")'>" + icon + " " + tmpName + "</a>");
                        }
                    }
                    else {
                        // Populate the day services location box with all the locations and a link to the changeTheDSLocation function in dayservices.js:
                        optionsHtml.push("<a href='#' class='loclink' locid='" + tmpId + "' residence='" + tmpRes + "' onClick='changeTheDSLocation(" + tmpId + ")'>" + icon + " " + tmpName + "</a>");
                    }
                }
            });


            // If more than 1 location for the selected consumers:
            if (showSelect == "Y") {
                // Display "Select a Location":
                $('#dslocationbox').html("Select a Location" + "<dslocationdownarrow id='dslocationdownarrow' class='locationdownarrow dropdownarrow' onClick='popDSLocation(event)'></dslocationdownarrow>");
                $('#dslocationbox').attr('locid', 0);
                resizeHeaderText('#dslocationbox', 15);
                currentlocationId = 0;
            }

            optionsHtml = optionsHtml.join("");
            locations.html(optionsHtml);

            //if true gets history value for switching between modules but not reloading page
            if ($.session.dsLocationHistoryFlag == true && $.session.dsLocationHistoryValue != null) {
                changeTheDSLocation($.session.dsLocationHistoryValue);
            } else {
                if (readCookie('defaultDayServiceLocationName') == "Remember Last Location") {
                    changeTheDSLocation(readCookie('defaultDayServiceLocation'));
                } else {
                    changeTheDSLocation(readCookie('defaultDayServiceLocationNameValue'));
                }
                
            }

            if (currentlocationId != 0) {
                getConsumerDayServiceActivity();
            } else {
                $("#locationhelp").css("display", "block");
                $("#appbuttonbox").html("");
            }

        },

        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n'+ xhr.responseText); }
    });
}

// Gets consumer day service activity records for display:
function getConsumerDayServiceActivity(errorId) {
    removeErrorMessage();
    var dsDate = $('#dsdatebox').val();
    if (dsDate == undefined) {
        var newDate = new Date();
        dsDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    }

    var currLoc = 0;
    if ($('#dslocationbox').attr('locid') == undefined) {
        currLoc = $.currentlocationId;
    } else {
        currLoc = $('#dslocationbox').attr('locid');
    }

    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getConsumerDayServiceActivity/",
        data: '{"token":"' + $.session.Token + '", "peopleList":"' + getSelectPeopleAsString() + '", "serviceDate":"' + dsDate + '", "locationId":"' + currLoc + '"}',

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);


            if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
                browserTypeAdds = "daybuttonsbaseIE";
            }

            var firstPass = "Y";

            if (firstPass == "Y") {
                // Message box:
                line = "<errorbox id='errorbox' class='errorbox'><img src='./Images/error.png' width='29' height='29'/><errorboxtext id='errorboxtext' class='errortext'></errorboxtext></errorbox>";
                firstPass = "N";
            } else {
                line = "";
                errorConsumerIds = "";
            }


            filleActionCenterWithDSData(res, errorId);
            if ($("#actioncenter").children().length == 0) {
                $("#actioncenter").append("<div class='consumerclockinhelptriangle'></div>");
                $("#actioncenter").append("<div id='consumerclockinhelp'>Click here to clock in</div>");
            }

            //make inputs unclickable if privilidges do no allow
            if ($.session.DayServiceUpdate != true) {
                $(".dayservicerecord").find('*').attr('onclick', '');
            }


            // Clear the background color for consumers:
            $("#consumerlist").children().css('background-color', '');

            //reset card selection
            $("#topbar").css("display", "flex");
            $("#leftmenu").css("display", "block");
            $("#consumerpane").css("display", "block");

            checkToggle = "All";
            displayDSSelect = "Y";

            // Hide the day service mass update icons:
            /* $("#trashcan").css("opacity", "0");
            $("#trashcan").css("display", "none");
            $("#timein").css("opacity", "0");
            $("#timein").css("display", "none");
            $("#timeout").css("opacity", "0");
            $("#timeout").css("display", "none");
            $("#dstype").css("opacity", "0");
            $("#dstype").css("display", "none"); */

            // Close any open pop boxes:
            /* $("#updateclockinboxpop").css("display", "none");
            $("#updateclockinboxpop").css("opacity", "0");
            $("#updateclockoutboxpop").css("display", "none");
            $("#updateclockoutboxpop").css("opacity", "0");
            $("#updatetimeinboxpop").css("display", "none");
            $("#updatetimeinboxpop").css("opacity", "0");
            $("#updatetimeoutboxpop").css("display", "none");
            $("#updatetimeoutboxpop").css("opacity", "0");
            $("#updatedsboxpop").css("display", "none");
            $("#updatedsboxpop").css("opacity", "0"); */

            getConsumerServiceLocations("checkConsumer");
            // sortRightSideConsumers();

            //----------------------------------------------------------------------

            // Check for time overlaps:
            //----------------------------------------------------------------------
            //            if (errorMessage.length > 0) {
            //                // Show the error box:
            //                $("#errorboxtext").text(errorMessage);
            //                $("#errorbox").css("opacity", "1");
            //                $("#errorbox").css("display", "block");

            //                consumerId = "";
            //                var lineNumber;

            //                // If consumer IDs exist:
            ////                if (errorConsumerIds.length > 0) {
            ////                    var cIds = errorConsumerIds.split("|");

            ////                    for (i = 0; i < cIds.length; i++) {
            ////                         highlightConsumers(cIds[i], '#ffcdcb', errorConsumerIds);
            ////                    }
            ////                };
            //            };
            //----------------------------------------------------------------------

            // Is this location already batched?:
            //----------------------------------------------------------------------
            if (isBatched == "Y") {
                //remove checkout/checkin buttons
                $("#appbuttonbox").html("");
                // Set the background for all consumer day service activity records:
                //$("dayservicerecord").css('background-color', '#faf3a2');
                //disable boxes
                $("#dpstimein1").attr('readonly', true);
                $("#dpstimeout1").attr('readonly', true);
                $("#dpsttype1").attr('readonly', true);
            } else {
                $("#dpstimein1").attr('readonly', false);
                $("#dpstimeout1").attr('readonly', false);
                $("#dpsttype1").attr('readonly', false);
            }
            //----------------------------------------------------------------------
            (function () {
                
                var dateBox = moment($("#dsdatebox").val());
                
                if (parseInt(currLoc, 10) != 0) {
                    getConsumersByLocationAbsentAjax(currLoc, dateBox.format('YYYY-MM-DD'), function (absentData) {
                        //$(".dayServicesConsumerList .absenticon").removeClass("isAbsent");    This is if the absent icon is the child, and is as dim as the parent
                        //$(".cloneAbsent").remove();                                           This is if the absent icon is a clone; this impacts ALL usages of $("#consumerlist").children()
                        absentData.forEach(function (el) {
                            //$(".dayServicesConsumerList").find("#" + el.consumer_id).addClass("notInGroup").find(".absenticon").addClass("isAbsent"); absent icon is child
                            if ($(".dayServicesConsumerList").find("#" + el.consumer_id).length) {
                                $(".dayServicesConsumerList").find("#" + el.consumer_id).addClass("notInGroup");
                                /*
                                Absent icon is clone
                                var icon = $(".dayServicesConsumerList").find("#" + el.consumer_id).find(".absenticon").clone(true);
                                icon.addClass("cloneAbsent").css({ position: "absolute", right: 0, top: $(".dayServicesConsumerList").find("#" + el.consumer_id).find(".absenticon").parent().position().top }).appendTo($(".dayServicesConsumerList"))
                                */
                            }
                        });
                    });
                }
                
            })()
            
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n'+ xhr.responseText); },
    });
}


function filleActionCenterWithDSData(res, errorId) {
    //var errorbox     =  "<errorbox id='errorbox' class='errorbox'><errorboxtext id='errorboxtext' class='errortext'></errorboxtext></errorbox>";

    firstSelected = true;
    var optionsHtml = [];
    var headersHtml = [];
    var lineItemsHtml = [];
    var actioncenter = $('#actioncenter');
    var first = 0;
    var line = "";
    var lineNumber = 0;
    var serviceDate = "";
    var dayServiceText;
    var browserTypeAdds = "";
    var count = 1;
    var hasCIStaff = false;

    $("dayrow", res).each(function () {
        lineNumber = lineNumber + 1;
        tmpConsumerId = $('id', this).text();
        tmpServiceDateTime = $('Service_Date', this).text();
        tmpStartTime = $('Start_Time', this).text();
        tmpStopTime = $('Stop_Time', this).text();
        tmpDSType = $('Day_Service_Type', this).text();
        tmpFName = $('FirstName', this).text();
        tmpLName = $('LastName', this).text();
        tmpAcuity = $('Acuity', this).text();
        tmpIsBatched = $('IsBatched', this).text();
        tmpAllowNonBillable = $('AllowNonBillable', this).text();
        tmpCIStaffID = $('ciStaffID', this).text();

        if (tmpAllowNonBillable == "True") {
            $.session.DayServiceNonBillable = true;
        } else {
            $.session.DayServiceNonBillable = false;
        }

        if (tmpIsBatched == "True") {
            isBatched = "Y";
            $('#selectionbanner').addClass('unclickableElement');
            $('#selectedtrash').addClass('unclickableElement');
        } else {
            isBatched = "N";
            $('#selectionbanner').removeClass('unclickableElement');
            $('#selectedtrash').removeClass('unclickableElement');
        }

        if (tmpCIStaffID != "") {
            hasCIStaff = true;
        } else {
            hasCIStaff = false;
        }

        // Convert the dayservice value to a word text:
        dayServiceText = convertDSValueToText(tmpDSType);

        // Remove the time:
        for (var i = 0; i < tmpServiceDateTime.length; i++) {
            if (tmpServiceDateTime.charAt(i) != ' ') {
                serviceDate = serviceDate + tmpServiceDateTime.charAt(i);
            }
            else {
                break;
            }
        }

        if (serviceDate.length == 9)
            serviceDate = "0" + serviceDate;
        tStartTime = tmpStartTime;
        // Covert military times to AM/PM:
        if (tmpStartTime.length > 0)
            tmpStartTime = convertMilitaryTimeToAMPM(tmpStartTime);

        if (tmpStopTime.length > 0)
            tmpStopTime = convertMilitaryTimeToAMPM(tmpStopTime);
        else
            tmpStopTime = "00:00 PM";

        var result = false;

        var recordId = "record" + lineNumber;

        //"<errorbox class='errorbox' id='errorbox'></errorbox>" +

        if (!result) {
            // Line number, consumer ID and service date:
            line = line + "<div class='dayservicerecord' id='record" + lineNumber + "' consumerId='" + tmpConsumerId + "'>" +
                          "<div class='dsrecordheader' onclick='toggleSelected(" + recordId + ")'>" +
                          "<img id='img" + tmpConsumerId + "' class=dsportrait src=./images/portraits/" + tmpConsumerId + ".png onerror=this.src='./images/new-icons/default.jpg'>" +
                          "<namebox class='namebox2' id='namebox'><div id='dsnamebox' class='dsnametext'>" + tmpFName + "</div><div class='dslastnametext'>" + tmpLName + "</div></namebox>" +
                          "<acuitybox class='acuitybox'><div class='accdesc'>acuity</div><dspacuity  class='dspacuity'>" + tmpAcuity + "</dspacuity></acuitybox>" +
                          "</div><div class='barheader'><div class='barIn'>In</div><div class='barOut'>Out</div><div class='barType'>DS Type</div></div>";
            //<!-- <input id='consumerid" + lineNumber + "' name='consumer' value='" + tmpConsumerId + "' type='hidden'

            "<dsppersonid id='" + lineNumber + "'></dsppersonid>" +
            "<input id='servicedate" + lineNumber + "' name='servicedate' value='" + serviceDate + "' type='hidden'>";

            headersHtml[tmpConsumerId] = line;
            line = "<inputbar id='inputbar" + lineNumber + "' class='inputbar' onclick='invertBar(event)'>";

            // Time in:
            var pointerccs = " pointer";
            if ($.session.DenyClockUpdate == true) {
                pointerccs = "";
            }
            if (isBatched == 'Y') {
                tmpUnclick = ' unclickableElement';
            } else {
                tmpUnclick = ' click';
            }
            line = line + "<textinput id='dpstimein" + lineNumber + "' class='dpselement " + pointerccs + tmpUnclick + "' onClick=popDayServiceTimeBox('dpstimein" + lineNumber + "') value='" + tmpStartTime + "'><time id='starttime" + lineNumber + "'class='time'>" + tmpStartTime + "</time></textinput>";

            bodercolor = "";
            if (tmpStopTime == "00:00 PM") {
                bodercolor = "pinkhighlight ";
            }

            // Time out:
            line = line + "<textinput id='dpstimeout" + lineNumber + "' class='dpselement " + bodercolor + pointerccs + tmpUnclick + "' onClick=popDayServiceTimeBox('dpstimeout" + lineNumber + "'); onChange=timeoutChange('dpstimeout" + lineNumber + "'); value='" + tmpStopTime + "'><time class='time'>" + tmpStopTime + "</time></textinput>";

            line = line + "<dpstype align='left' id='dpsttype" + lineNumber + "' class='dpselement dstype" + tmpUnclick +"'  onClick=getDayServiceInput('dst" + lineNumber + "') >" + dayServiceText + "</dpstype>";
            line = line + "<dspdsvalue><input id='dsvalue" + lineNumber + "' name='dayservice' value='" + tmpDSType + "' type='hidden'></dspdsvalue>";
            tmpStartTime = tmpStartTime.replace(/\s+/g, '');
            //Day service changes CI button
            //MAT base if statement off of tmpDSType for whether or not to display button. If not displayed need to have ajax call to delete data in CI column in database
            if (tmpDSType == 'A' || tmpDSType == 'V' || tmpDSType == 'N') {
                tmpCIButtonID = 'cibutton' + lineNumber;
                if (hasCIStaff == true) {
                    line = line + "<button style='border:0' id='dpstimein" + lineNumber + "' class='dsCIButton" + pointerccs + ' cibutton' + lineNumber + ' dsCIButtonGreen' + "' onClick=populateCIDropdown(\"" + tmpConsumerId + "\",\"" + tmpStartTime + "\",\"" + tmpCIButtonID + "\",\"" + isBatched + "\")>CI</button>";
                    line = line + '<div class="cidropdownfilterpop" id=' + tmpCIButtonID + '></div>'
                } else {
                    line = line + "<button style='border:0' id='dpstimein" + lineNumber + "' class='dsCIButton" + pointerccs + ' cibutton' + lineNumber + "' onClick=populateCIDropdown(\"" + tmpConsumerId + "\",\"" + tmpStartTime + "\",\"" + tmpCIButtonID + "\",\"" + isBatched + "\")>CI</button>";
                    line = line + '<div class="cidropdownfilterpop" id=' + tmpCIButtonID + '></div>'
                }
            } else {
                //call to delete CI information from database
                deleteCIStaffIdAjax(tmpConsumerId, tmpStartTime);
            }
            line = line + "</inputbar>";
            line = line + '<dstypepop id="dst' + lineNumber + '" class="dsTypePop">' +
            '<a class=dsTypeLink onClick="updateDayService(dpsttype' + lineNumber + ', dsvalue' + lineNumber + ', dayService, a);" href="#DayService" value="A">Adult Day</a>' +
            '<a class=dsTypeLink onClick="updateDayService(dpsttype' + lineNumber + ', dsvalue' + lineNumber + ', combo, c);" href="#Combo" value="C">Combo</a>' +            
            '<a class=dsTypeLink onClick="updateDayService(dpsttype' + lineNumber + ', dsvalue' + lineNumber + ', enclave, e);" href="#Enclave" value="E">Enclave</a>' +
            '<a class=dsTypeLink onClick="updateDayService(dpsttype' + lineNumber + ', dsvalue' + lineNumber + ', groupEmployment, g);" href="#GroupEmployment" value="G">Group Employment</a>' +
            '<a class=dsTypeLink onClick="updateDayService(dpsttype' + lineNumber + ', dsvalue' + lineNumber + ', vocHab, v);" href="#VocHab" value="V">Voc. Hab.</a>' +
            '<a class=dsTypeLink onClick="updateDayService(dpsttype' + lineNumber + ', dsvalue' + lineNumber + ', nonBillable, n);" href="#NonBillable" value="N">Non-Billable</a>' +            
            '</dstypepop>';    
                                                                                                            
            if (typeof (lineItemsHtml[tmpConsumerId]) != "undefined") {
                lineItemsHtml[tmpConsumerId] = lineItemsHtml[tmpConsumerId] + line;
            } else {
                lineItemsHtml[tmpConsumerId] = line;
                //count = count + 1;
            }

            //optionsHtml.push(line);
            line = "";
        }
        //$('#record' + lineNumber ).append("<div class='cidropdownfilterpop' id='cidropdownfilterpop'></div>");
    }); //end loop

    //build html from arrays
    for (var key in headersHtml) {
        line = "";
        line = headersHtml[key];

        line = line + lineItemsHtml[key] + "</div>";
        //line = line + errorbox;
        optionsHtml.push(line);
    }
    //Sorting the cards in the action center by last name
    optionsHtml.sort(function (a, b) {
        var aName = a.substring(a.lastIndexOf("'dslastnametext'>") + 1, a.lastIndexOf("</div></namebox>"));
        var bName = b.substring(b.lastIndexOf("'dslastnametext'>") + 1, b.lastIndexOf("</div></namebox>"));
        return (aName == bName) ? 0 : (aName > bName) ? 1 : -1;

    });
    
    actioncenter.html(optionsHtml.join(''));
    //actioncenter.append("<div class='cidropdownfilterpop' id='cidropdownfilterpop'></div>");
    if ($.session.ciBShow == true) {
        $(".dsCIButton").show();
    }
    setErrorHeader(errorId);
}


function dayServiceClockIn(consumerIds, startTime) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/addDayServiceActivityMassClockInConsumer/",
        data: '{"token":"' + $.session.Token + '", "consumerIds":"' + consumerIds + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationId":"' + $('#dslocationbox').attr('locid') + '", "startTime":"' + startTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response, status, xhr) {
            var res = JSON.stringify(response);

            errorMessage = "";
            var errorId;
            var errorConsumerIds;

            $("dayrow", res).each(function () {
                // Look for errors:
                $("errors", res).each(function () {
                    // Get the error code:
                    tmpErrorCode = $("error_code", this).text();
                    // If time overlaps:
                    if (tmpErrorCode == "615") {
                        // Set the error message:
                        errorMessage = " Time overlaps found, with people exsiting in the database";
                        setErrorBox(errorMessage);
                        // Get the consumer IDs:
                        errorConsumerIds = $("consumers", this).text();
                    }
                });
            });

            //alert('success: ' + res);

            // After clockin, refresh data
            if (errorConsumerIds != null) {
                getConsumerDayServiceActivity(errorConsumerIds);
            } else {
                getConsumerDayServiceActivity();
            }
        },

        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function dayServiceClockOut(consumerIds, stopTime) {

    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/addDayServiceActivityMassClockOutConsumer/",
        data: '{"token":"' + $.session.Token + '", "consumerIds":"' + consumerIds + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationId":"' + $('#dslocationbox').attr('locid') + '", "stopTime":"' + stopTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);

            //<error><error_code>615</error_code><consumers>156|156|</consumers></error>
            errorMessage = "";

            $("dayrow", res).each(function () {
                // Look for errors:
                $("errors", res).each(function () {
                    // Get the error code:
                    tmpErrorCode = $("error_code", this).text();
                    // If time overlaps:
                    if (tmpErrorCode == "615") {
                        // Set the error message:
                        errorMessage = " Time overlaps found, with people exsiting in the database";
                        setErrorBox(errorMessage);
                        // Get the consumer IDs:
                        errorConsumerIds = $("consumers", this).text();
                    }
                });
            });

            // After clockout, refresh data
            getConsumerDayServiceActivity();
        },

        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function sortRightSideConsumers() {

    // Move "inactive" consumers to the bottom of the consumer list:
    //----------------------------------------------------------------------
    var optionsHtml1 = [];
    var optionsHtml2 = [];
    var serviceLocations;
    var consumerId;
    var consumerInfo;

    //Tom has concerns about this code
    $("consumer").each(function () {
        //serviceLocations = $(this).attr("servicelocations");
        consumerIds = $(this).attr("id");
        //
        var line = $('#' + consumerIds).clone().html();

        if ($(this).children().css("opacity") == "1") {
            optionsHtml1.push(line);
        } else {
            optionsHtml2.push(line);
        }
    });


}

function updateDayServiceActivity(consumerIds, inputType, inputTime, dayServiceType) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/updateDayServiceActivity/",
        data: '{"token":"' + $.session.Token + '", "consumerIds":"' + consumerIds + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationId":"' + $('#dslocationbox').attr('locid') + '", "inputType":"' + inputType + '", "inputTime":"' + inputTime + '", "dayServiceType":"' + dayServiceType + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            var errorId;
            errorMessage = "";
            var errorConsumerIds;

            $("dayrow", res).each(function () {
                // Look for errors:
                $("errors", res).each(function () {
                    // Get the error code:
                    tmpErrorCode = $("error_code", this).text();
                    // If time overlaps:

                    if (tmpErrorCode == "615" && inputTime != "00:00:00") {
                        // Get the consumer IDs:
                        errorConsumerIds = $("consumers", this).text();
                    }
                });
            });

            // After update, refresh data
            if (errorConsumerIds != null) {
                getConsumerDayServiceActivity(errorConsumerIds);
            } else {
                getConsumerDayServiceActivity();
            }

        },

        error: function (xhr, status, error) { alert("Error\n-----\n" + error + " \n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function deleteDayServiceActivity(consumerIds) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/deleteDayServiceMassDeleteConsumerActivity/",
        data: '{"consumerIds":"' + consumerIds + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationID":"' + $('#dslocationbox').attr('locid') + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response, status, xhr) {
            var res = JSON.stringify(response);

            // After delete, refresh data
            getConsumerDayServiceActivity();
        },

        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); }
    });
}


function checkConsumersForDate(locationId) {
    //massUserCheckByDate
    var consumerIds = "";

    // For every consumer that is "active":
    $("#consumerlist").children().each(function () {
        // Add the consumer day service record for update:
        consumerId = $(this).attr("id");
        consumerIds = consumerIds + consumerId + "|";
    });

    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/massUserCheckByDate/",
        data: '{"consumerIds":"' + consumerIds + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationId":"' + locationId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response, status, xhr) {
            var res = JSON.stringify(response);

            //Commented below code out because I do not believe 3.0 uses this to check date range at the moment.  Need to do more research  -Joe

            //$("result", res).each(function () {
            //    tmpconsumerid = $('consumerid', this).text();
            //    tmpvalid = $('locationvalid', this).text();


            //    if (tmpvalid == '0') {
            //        $("#consumerlist").children().each(function () {
            //            if (tmpconsumerid == $(this).attr("id")) {
            //                $(this).css("opacity", "1");
            //            }
            //        });
            //    } else {
            //        $("#consumerlist").children().each(function () {
            //            if (tmpconsumerid == $(this).attr("id")) {
            //                $(this).css("opacity", ".2");
            //                $(this).css("pointer-events", "none");
            //            }
            //        });
            //    }

            //});
        },

        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });

}

function populateCIDropdown(consumerId, startTime, ciButtonId, isBatched) {
    startTime = convertTimeToMilitary(startTime);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getCIStaffDropdown/",
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationID":"' + $('#dslocationbox').attr('locid') + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            getExistingCIStaffIdAjax(consumerId, startTime, res, ciButtonId, isBatched);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getExistingCIStaffIdAjax(consumerId, startTime, resIn, ciButtonId, isBatched) {
    startTime = convertTimeToMilitary(startTime);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getExistingCIStaffId/",
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationID":"' + $('#dslocationbox').attr('locid') + '", "consumerId":"' + consumerId + '", "startTime":"' + startTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            staffId = getExistingCIStaffIDFromResponse(res);
            createCIDropdown(resIn, staffId, consumerId, startTime, ciButtonId, isBatched);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function updateCIStaffAjax(consumerId, staffId, startTime, ciButtonId, isBatched) {
    if (isBatched == 'N') {
        startTime = convertTimeToMilitary(startTime);
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                    "/" + $.webServer.serviceName + "/updateCIStaff/",
            data: '{"token":"' + $.session.Token + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationID":"' + $('#dslocationbox').attr('locid') + '", "consumerId":"' + consumerId + '", "startTime":"' + startTime + '", "staffId":"' + staffId + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
                if (staffId != "") {
                    $('.' + ciButtonId).addClass("dsCIButtonGreen");
                } else {
                    deleteCIStaffIdAjax(consumerId, startTime);
                    $('.' + ciButtonId).removeClass("dsCIButtonGreen");
                }
                hideCIDropdown(ciButtonId);
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
    } else {
        hideCIDropdown(ciButtonId);
    }    
}

function deleteCIStaffIdAjax(consumerId, startTime) {
    startTime = convertTimeToMilitary(startTime);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/deleteCIStaffId/",
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + $('#dsdatebox').val() + '", "locationID":"' + $('#dslocationbox').attr('locid') + '", "consumerId":"' + consumerId + '", "startTime":"' + startTime + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//May remove later. Need it now for dynamic display of CI button
//Based off of date in DB. This is only here to make upgrades easier.
function getDateToCheckShowCIAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getDateToCheckShowCI/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.parse(response.getDateToCheckShowCIResult);
            callback(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}