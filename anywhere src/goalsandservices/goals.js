


// Initial load of the web page:
function goalsLoad() {

    addBrowserCSS = "";
    addCalendarCSS = "caledariconleft";
    addCelendarTextCSS = "dateboxleft";

    if ($.session.browser == "Explorer") {
        //addBrowserCSS = "daybuttonsbaseIE";
        //addCalendarCSS = "calendarIconIE";
        //addCelendarTextCSS = "dateboxleftIE";
    }

    // Set the day service action banner:
    $("#actionbanner").html("");
    $("#actionbanner").html(
                            "<goalsicon class='goalsheader'></goalsicon>" +
                            "<locationicon class='bannericon filtericon2' onClick='popGoalsFilter(event)'></locationicon>" +
                            "<dslocationbox id='dslocationbox' class='locationbox headertext' onClick='popDSLocation(event)'><locationdownarrow id='locationdownarrow' class='locationdownarrow' onclick=''>All Services&nbsp;<img src='./Images/arrow_down.png'></locationdownarrow></dslocationbox>" +
                            "<calendaricon id='calendaricon' class='bannericon calendaricon " + addCalendarCSS + "' onClick=popCalendarDateBox('dsdatebox')></calendaricon>" +
                            "<input id='goalsdatebox' class='datebox " + addCelendarTextCSS + "' fullDate='' onClick=popCalendarDateBox('goalsdatebox')></input>" +
                            "<dslocationpopupbox id='dslocationpop' class='dslocationpop'></dslocationpopupbox>");

    // Set the calendar date to the current date:
    $("#goalsdatebox").val($.format.date(new Date($.pages.rosterdate), 'MMM dd, yyyy'));

    //getDatatoFillBody


}

