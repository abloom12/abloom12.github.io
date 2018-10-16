// Refresh the consumer day service activity records:
function refreshConsumerDayServiceActivity() {

    // Hide the error box:
    errorMessage = "";
    $("#errorboxtext").text("");
    $("#errorbox").css("opacity", "0");
    $("#errorbox").css("display", "none");

    // Call the stored procedure:
    getConsumerDayServiceActivity()
};


// Look to see if any checkboxes have been checked:
function canvassCheckBoxes() {
    // If the location has already been batched, return:
    if (isBatched == "Y") {

        return;
    };

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
        }
        else {
            // Hide it:
            $("#trashcan").css("opacity", "0");
            $("#trashcan").css("display", "none");
        };

        if (checkBoxCount == 1) {
            // Hide all actionbuttons except for the trashcan:
            $("#timein").css("opacity", "0");
            $("#timein").css("display", "none");
            $("#timeout").css("opacity", "0");
            $("#timeout").css("display", "none");
            $("#dstype").css("opacity", "0");
            $("#dstype").css("display", "none");
        };

        if (checkBoxCount > 1) {
            // Show all the actionbuttons:
            $("#timein").css("opacity", "1");
            $("#timein").css("display", "block");
            $("#timeout").css("opacity", "1");
            $("#timeout").css("display", "block");
            $("#dstype").css("opacity", "1");
            $("#dstype").css("display", "block");
        };
    };
};

function massCheckboxUpdate() {
    if (isBatched == "Y") {
        return;
    };

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
            };
            if (checkBoxCount > 1) {
                $("#trashcan").css("opacity", "1");
                $("#trashcan").css("display", "block");
                $("#timein").css("opacity", "1");
                $("#timein").css("display", "block");
                $("#timeout").css("opacity", "1");
                $("#timeout").css("display", "block");
                $("#dstype").css("opacity", "1");
                $("#dstype").css("display", "block");
            };
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
        };
    };
};


function getDayServiceInput(inputId) {

    $('#' + inputId).css('display', 'block');

    /*
     if (isBatched == "Y") {
     return;
     };

     if (displayDSSelect == "Y") {
     var lineNumber = "";
     var text = $('#' + inputId).text();

     // Get the line number of the selected time:
     for (var i = 0; i < inputId.length; i++) {
     if (isNaN(inputId.charAt(i)) != true)
     lineNumber = lineNumber + inputId.charAt(i);
     };

     displayDSSelect = "N";

     var selectChoices = createSelectOptions(text);

     $('#' + inputId).text('');
     $(".dpstype").css("border", "none");
     $('<select name="dayservicetype" id="dayservicetype' + lineNumber + '" class="dayservicetype" onChange=updateDSType(' + lineNumber + ')>' + selectChoices + '</select>').appendTo($('#' + inputId)).val(text).focus().blur(

     function () {
     var newValue = $('#dayservicetype' + lineNumber).val();
     var newText = convertDSValueToText(newValue);
     $('#' + inputId).text(newText);
     displayDSSelect = "Y";
     });
     }; */
};

function updateDayService(dpsttype, dsvalue, text, value) {
    var lineNumber = "";
    var dpsId = $(dpsttype).attr('id');
    var consumerId = $(dpsttype).parent().parent().attr('consumerId');

    $(dpsttype).text(text);
    $(dsvalue).attr('value', value);

    // Get the line number of the selected time:
    for (var i = 0; i < dpsId.length; i++) {
        if (isNaN(dpsId.charAt(i)) != true)
            lineNumber = lineNumber + dpsId.charAt(i);
    };

    updateDSType(lineNumber, consumerId);
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
            };
        }
    });

    $('#' + inputField).mobiscroll('show');

    return false;
};


// Show the day service type selections:
function popTypeUpdateBox(event) {
    /*  if (isBatched == "Y") {
     return;
     };

     if ($.session.DayServiceUpdate == false) {
     return false;
     }

     if ($("#updatedsboxpop").css("opacity") == "0") {
     var selectHTML;

     selectHTML = "<select name='dayservicetype' id='dayservicetype' onchange='updateAllDSType()'><option value='S'>Select" +
     "<option value='C'>Combo<option value='A'>Day Service<option value='V'>Voc. Hab.<option value='E'>Enclave" //+

     if ($.session.DayServiceNonBillable == true) {
     selectHTML = selectHTML + "<option value='N'>Non-Billable</select>";
     } else {
     selectHTML = selectHTML + "</select>";
     };

     $("#updatedsboxpop").html(selectHTML);

     // Display the popup box
     $("#updatedsboxpop").css("opacity", "1");
     $("#updatedsboxpop").css("display", "block");

     // Set focus():
     $("#dayservicetype").focus();
     } else {
     clearDayServicePops(event);
     }; */
}


function sortDaySerivces(container, parentNode, childNodeSortOn, style) {
    var sortArray = new Array();

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

        $('#' + childNodeSortOn + 'arrow').removeClass('down2')
        $('#' + childNodeSortOn + 'arrow').addClass('up')
    } else {
        $('#' + childNodeSortOn).attr('order', 'forward');
        $('#' + childNodeSortOn + 'arrow').removeClass('up')
        $('#' + childNodeSortOn + 'arrow').addClass('down2')
    };


    var newhtml = "";
    $(sortArray).each(function () {
        var id = this.html.substring(this.html.indexOf('<dspersonid id="') + 18);
        id = id.substring(0, id.indexOf('"'));

        newhtml = newhtml + "<" + parentNode + " id='" + id + "' class='" + $("dayservicerecord[id='" + id + "']").attr('class') + "' style=" + $("dayservicerecord[id='" + id + "']").attr('style') + " >" + this.html + "</" + parentNode + ">";
    });

    $(parentNode).parent().html(newhtml);
};


function createSelectOptions(DSType) {
    /*    var selectOptions;
     selectOptions = ''

     selectOptions = selectOptions + '<option ';
     if (DSType.length == 5) { selectOptions = selectOptions + 'selected '; };
     selectOptions = selectOptions + 'value="C">Combo</option>';

     selectOptions = selectOptions + '<option ';
     if (DSType.length == 13) { selectOptions = selectOptions + 'selected '; };
     selectOptions = selectOptions + 'value="A">Day Service</option>';

     selectOptions = selectOptions + '<option ';
     if (DSType.length == 11) { selectOptions = selectOptions + 'selected '; };
     selectOptions = selectOptions + 'value="V">Voc. Hab.</option>';

     selectOptions = selectOptions + '<option ';
     if (DSType.length == 9) { selectOptions = selectOptions + 'selected '; };
     selectOptions = selectOptions + 'value="E">Enclave</option>';

     if ($.session.DayServiceNonBillable == true) {
     selectOptions = selectOptions + '<option ';
     if (DSType.length == 14) { selectOptions = selectOptions + 'selected '; };
     selectOptions = selectOptions + 'value="N">Non-Billable</option>';
     };

     return selectOptions;
     */
};

function updateAllDSType() {
    /*  var lineNumber;
     var consumerId;
     var consumerKeys;
     var startTime;
     var inputType = "DS Type";
     var inputTime = "";

     // Get the selected day service type:
     var selectValue = $("#dayservicetype").val();

     // If no day service type was actually selected (default is "S"):
     if (selectValue == "S") {
     $("#updatedsboxpop").css("display", "none");
     $("#updatedsboxpop").css("opacity", "0");
     return;
     };

     consumerKeys = "";

     // For each consumer day service activity record:
     $("dayservicerecord").each(function () {
     // Get the consumer id and start time:
     lineNumber = $(this).attr('id');
     consumerId = $(this).find('#consumerid' + lineNumber).attr('value');
     startTime = $("#starttime" + lineNumber).attr('value');
     startTime = convertTimeToMilitary(startTime);

     // If the consumer day service activity record checkbox is checked:
     if ($(this).find('#dscheckbox').attr('checked')) {
     // Add a consumer to the stored procedure input parameter:
     consumerKeys = consumerKeys + consumerId + "," + startTime + "|";
     };
     });

     // If any consumer day service activity records have been selected:
     if (consumerKeys.length > 0) {
     // Hide the error box:
     errorMessage = "";
     $("#errorboxtext").text("");
     $("#errorbox").css("opacity", "0");
     $("#errorbox").css("display", "none");

     */
    //  Call the stored procedure:
    //     updateDayServiceActivity(consumerKeys, inputType, inputTime, selectValue);
    //   };
};

// Delete the selected day service records:
function deleteDayServices() {
    var lineNumber;
    var consumerId;
    var startTime;
    var consumerKeys = "";

    // Hide the error box:
    errorMessage = "";
    $("#errorboxtext").text("");
    $("#errorbox").css("opacity", "0");
    $("#errorbox").css("display", "none");

    // For each consumer day service record:
    $("dayservicerecord").each(function () {
        // Get the consumer id and start time:
        lineNumber = $(this).attr('id');
        consumerId = $(this).find('#consumerid' + lineNumber).attr('value');
        startTime = $("#starttime" + lineNumber).attr('value');
        startTime = convertTimeToMilitary(startTime);

        // If the checkbox is checked:
        if ($(this).find('#dscheckbox').attr('checked')) {
            // Add the consumer key to the input parameter for the stored procedure:
            consumerKeys = consumerKeys + consumerId + "," + startTime + "|";
        };
    });

    // If there were consumer day service records selected:
    if (consumerKeys.length > 0) {
        // Call the stored procedure:
        deleteDayServiceActivity(consumerKeys);
    };
};
