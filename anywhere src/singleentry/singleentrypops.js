function popSingleEntryTimeBox(tagname) {
    if ($.session.DenyClockUpdate == true) {
        return false;
    }
    var strtTime = $('#singleEntryStart').text(),
        endTime = $("#singleEntryEnd").text();
    strtTime = convertTimeToMilitaryNew(strtTime);
    endTime = convertTimeToMilitaryNew(endTime);

    
    var seStartTime = new Date(),
        seEndTime = new Date();

    seStartTime.setHours(strtTime.substring(0, 2), strtTime.substring(3, 5), strtTime.substring(6, 8), 0);
    seStartTime = seStartTime.setSeconds(seStartTime.getSeconds() + 60);
    seStartTime = new Date(seStartTime);

    seEndTime.setHours(endTime.substring(0, 2), endTime.substring(3, 5), endTime.substring(6, 8), 0);
    //seEndTime = seEndTime.setSeconds(seEndTime.getSeconds() + 60);
    seEndTime = new Date(seEndTime);

    
    var now = new Date();
    originalText = $('#' + tagname).text();
    var fmt = new DateFmt();
    //set default time. if it's 00:00, then use now, if not use value.
    if ($('#' + tagname).text() == '00:00 PM') {
        $('#' + tagname).text(fmt.format(now, "%h:%M %T"));
    }
    if (tagname == "singleEntryStart") {
        var settings = {
            minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            dateFormat: 'M dd',
            theme: 'wp',
            accent: 'steel',
            display: 'bubble',
            mode: 'scroller',
            onSelect: function (valueText, inst) {

                if (valueText == "00:00 PM") return;
                $('#' + tagname).text(valueText);

                $($(this).data("target")).trigger("calculate");
            }
        };
        if (!isNaN(seEndTime.getTime())) {
            settings.maxDate = seEndTime;
        }
        $('#' + tagname).mobiscroll().time(settings);
    } else {
        $('#' + tagname).mobiscroll().time({
            minDate: new Date(seStartTime.getFullYear(), seStartTime.getMonth(), seStartTime.getDate(), seStartTime.getHours(), seStartTime.getMinutes()),
            dateFormat: 'M dd',
            theme: 'wp',
            accent: 'steel',
            display: 'bubble',
            mode: 'scroller',
            onSelect: function (valueText, inst) {

                if (valueText == "00:00 PM") return;
                $('#' + tagname).text(valueText);

                $(this).data("target").trigger("calculate");
            }
        });
    }
    
    $('#' + tagname).mobiscroll('show');
    $('#' + tagname).text(originalText);
    return false;
}

function popSingleEntryCalendarDateBox(inputField, startDate, endDate, isWithinDateRange) {
    var now = startDate;

    var currVal = new Date($(inputField).text());

    var inputDate;
    var billable = $("#singleEntryWorkCode").attr("billable");
    var opt = {
        minDate: now,
        maxDate: endDate,
        dateFormat: 'mm/dd/yy',
        theme: 'wp',
        accent: 'steel',
        display: 'bubble',
        mode: 'scroller',
        preset: 'date',
        onShow: function () {
            $(this).scroller('setDate', new Date(currVal.getFullYear(), currVal.getMonth(),
                currVal.getDate()), false);
                
            $('.dw-arr').css('display', 'none');
        },
        onSelect: function (valueText, inst) {
            $(inputField).text(valueText);
            buttonLogic();
        }
    };
    inputField.mobiscroll().date(opt).mobiscroll('show');
    
    return false;
}