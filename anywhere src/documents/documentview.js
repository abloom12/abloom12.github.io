//Import C# class to be used 

function documentViewLoad(data) {
    //Splash Screen
    var rosterhelp = "";
    var docsshelp = "";
    goalshelp = " helpfadeinslow";
    var splash = "<div id='goalshelp' class='rosterhelp rosterhelpright" + docsshelp + "'><span class='helptext'>Select someone on the right side.</span></div>" +
        "<div class='hrtriangleright" + docsshelp + "'></div>" + "</div>";
    splash = splash + "<div class='wrapper'><div class='content'><div class='left-side'>" +
        "<div class='hrtriangleleft" + rosterhelp +
        "'></div><div id='rosterhelp' class='rosterhelp rosterhelpleft" + rosterhelp +
        "'><span class='helpheader'>Get started:</span><hr class='hrhelp'><span class='helptext'>Select the Roster Icon here. Add people to the right side by clicking or tapping them.</span></div><div class='left-side-stuff'><div class='headline'>Redirecting</div><br>" +
        "You are being redirected outside Anywhere to Intellivue. Please disable your browsers popup blocker." +
        "<br><br></div></div><div class='right-side'>" + "</div></div>";
    $(".actioncenter").html(splash);
    $(document).trigger("moduleLoad");
    //retrievePDFDataSetter();
    consumerId = data.currentTarget.id;
    getLoginCredentials(consumerId);
    //function that gets list of consumers with docs
}

function retrieveConsumerDocumentList(event, consumerId) {
    var par = $(event.target);
    if ($(par).hasClass("consumerselected")) {
    } else {
        par = $(par).closest('consumer');
    }
    par.removeClass("notselected");
    par.addClass("highlightselected");
    //Call to C# layer to get the list using consumerId and callback function
    //Take the result and pass to a build list function
    //getDocumetDetails(consumerId, buildDocList)
    
}

function buildDocList(res) {
    $("#actioncenter").html("");
    var instructionLabel = "<p id='instructionlabel'>Please select a document from the list below.</p>";
    $("#actioncenter").append(instructionLabel);
    var docTable = '<div class="docviewtableouterwrapper"><div class="docviewtable" >' + '<table >' + '</table>' + '</div></div>';
    $("#actioncenter").append(docTable);

    var docTableTwo = '<table>';
    //If statement that checks the array for data
    docTableTwo = docTableTwo + '<tr><td>Document Title</td><td>Document Type</td><td >Document Date</td><td>Document Size</td></tr>';
    //For loop to get info out of array and assign it to columns
    //assign data to temp variables each time through the loop
    $('result', res).each(function () {
        var tmpDocId = '';
        var tmpDocTitle = $('name', this).text();
        var tmpDocType = '';
        var tmpDocDate = '';
        var tmpDocSize = '';
        var link = $('address', this).text();
        docTableTwo = docTableTwo + '<tr id=' + tmpDocId + '><td class="dvdoctitle" onClick=testOpenPDF("' + link + '")>' + tmpDocTitle + '</td><td>' + tmpDocType + '</td><td>' + tmpDocDate + '</td><td>' + tmpDocSize + '</td></tr>';
    }); 

    $(".docviewtable").html(docTableTwo);
}
function testOpenPDF(link) {
    window.open(link);
}

function setIntellivueSessionId(res) {
    $('result', res).each(function () {
        $.session.intellivueSessionID = $('loginsessionid', this).text();
    });
}