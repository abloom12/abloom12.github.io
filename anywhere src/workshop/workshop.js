$.minstart;
$.maxend;

function workshopLoad() {
    $("*").removeClass("highlightselected").removeClass("notselectedbuthasgoals");
    $("#workshopbutton").addClass("buttonhighlight");
    $('#actionbanner').html("");    
    if ($("#consumerlist").children().length > 0) {
        $("#roostertoolbar").html(
            "<button id='clockinicon' class='rosterbutton timeinicon'  onClick=workshopClockInOutTimeBox('clockininput')></button>" +
            "<button id='clockouticon'class='rosterbutton timeouticon' onClick=workshopClockInOutTimeBox('clockoutinput')></button>" +
            "<div id='clockininput' class='clockinhiddeninput'>" +
            "<div id='clockoutinput' class='clockouthiddeninput'>");
        $(document).trigger("moduleLoad");
        $("*").addClass("waitingCursor");
        createTopBar();
        buildWorkshopTable();        
    } else {
        $("#roostertoolbar").html("");
        rosterhelp = " helpfadeinslow";
        tid = setInterval(strobe, 1000);
        var splash = "<div class='wrapper'><div class='content'><div class='left-side'>" +
            "<div class='hrtriangleleft" + rosterhelp +
            "'></div><div id='rosterhelp' class='rosterhelp rosterhelpleft" + rosterhelp +
            "'><span class='helpheader'>Get started:</span><hr class='hrhelp'><span class='helptext'>Select the Roster Icon here. Add people to the right side by clicking or tapping them.</span></div><div class='left-side-stuff'><div class='headline'>Workshop</div><br>" +
            "This interface is designed to allow you to enter workshop data quickly and accurately so you can focus on spending your time assisting those in need of your help." +
            "<br><br></div></div><div class='right-side-guitar'>" +
            "</div></div></div>";
        // Set the day service action banner:
        $("#actionbanner").html("");
        $("#actioncenter").html(splash);
        $(document).trigger("moduleLoad");
        $("*").removeClass("waitingCursor");
    }
    
    //getEnabledConsumersForWorkshopAjax();
}

function createTopBar() {
    createWorkshopLocationDropDown();
    createJobCodedropDown();
    createSupervisorDropdown();
    //createDateBox();
    WorkshopPreBatchLoad(setMinAndMaxDates);
}

function createWorkshopLocationDropDown() {
    var button = $("<button>").addClass("bannericon").addClass("locationicon").attr("id", "locationicon");
    var box = $("<dateinput>").attr("id", "workshoplocationbox").addClass("locationbox");
    var inside = $("<name>").attr("id", "workshoplocationname");

    button.click(function () {
        box.children().trigger("click");
    });

    $('#actionbanner').append(button).append(box.append(inside));
    //WorkshopLocations();
}

function createJobCodedropDown() {
    var button = $("<button>").addClass("bannericon workshopbuttonicon").attr("id", "jobcodeicon");
    var box = $("<dateinput>").attr("id", "jobcodebox").addClass("locationbox");
    var inside = $("<name>").attr("id", "jobcodename");

    button.click(function () {
        box.children().trigger("click");
    }); 

    $('#actionbanner').append(button).append(box.append(inside));
}

function createSupervisorDropdown() {
    var button = $("<button>").addClass("bannericon billericon").attr("id", "supervisoricon");
    var box = $("<dateinput>").attr("id", "supervisorbox").addClass("locationbox");
    var inside = $("<name>").attr("id", "workshopsupervisorname");

    button.click(function () {
        box.children().trigger("click");
    });

    $('#actionbanner').append(button).append(box.append(inside));
}

function createDateBox() {
    //WorkshopPreBatchLoad(setMinAndMaxDates);
    var button = $("<button>").addClass("bannericon").addClass("calendaricon");//.attr("id", "dateicon");
    var box = $("<dateinput>").attr("id", "workshopdatebox").addClass("locationbox");
    var inside = $("<name>").attr("id", "workshopdateboxinside");
    box.mobiscroll().date({
        dateFormat: 'mm/dd/yy',
        theme: 'wp',
        accent: 'steel',
        minDate: $.minstart,
        maxDate: new Date(),
        display: 'bubble',
        mode: 'scroller',
        preset: 'date',
        onSelect: function (valueText, inst) {
            $(this).data("date", moment(valueText)).trigger("workshopdateboxinside");
            //$(this).trigger("workshopdateboxinside", moment(valueText));
            $("#workshopdateboxinside").text($.format.date(new Date(valueText), 'MMM dd, yyyy'));
            $("#workshopdateboxinside").val($.format.date(new Date(valueText), 'MMM dd, yyyy'));
            filterSetup();
        },
    });

    box.click(function () {
        box.mobiscroll("show");
    })

    button.click(function () {
        box.trigger("click");
    });    
    $('#actionbanner').append(button).append(box.append(inside));
    $("#workshopdateboxinside").text($.format.date(new Date(), 'MMM dd, yyyy'));
    $("#workshopdateboxinside").val($.format.date(new Date(), 'MMM dd, yyyy'));
    WorkshopGetSupervisorsAjax();
    WorkshopLocations();
    //WorkshopGetJobCodeAjax();    
}

function setMinAndMaxDates(data) {
    if (data == null) {
        $.minstart = new Date("1/1/1980");
        $.maxend = new Date();
    }else if ((data[0] != undefined) && (data != null)) {
        $.minstart = data[0].startdate.substr(0, data[0].startdate.indexOf(' '));
        $.minstart = new Date($.minstart);
        $.maxend = data[0].enddate.substr(0, data[0].enddate.indexOf(' '));
        $.maxend = new Date($.maxend);
    } else {
        $.minstart = data.startdate.substr(0, data.startdate.indexOf(' '));
        $.minstart = new Date($.minstart);
        $.maxend = data.enddate.substr(0, data.enddate.indexOf(' '));
        $.maxend = new Date($.maxend);
    }
    test = $.minstart.getFullYear();
    startDate = ($.minstart.getMonth() + 1) + "/" + $.minstart.getDate() + "/" + $.minstart.getFullYear();
    endDate = ($.maxend.getMonth() + 1) + "/" + $.maxend.getDate() + "/" + $.maxend.getFullYear();
    if (data.length > 0) {
        $(".batchinfo").text(data[0].name + ": " + startDate + " - " + endDate);
    } else {
        $(".batchinfo").text(data.name + ": " + startDate + " - " + endDate);
    }
    
    createDateBox();
}

function populateLocations(err, data) {
    if (err) throw err;
    var arr = data.map(function (el) {
        return {
            id: el.id,
            text: el.name
        }
    });
    if ($.session.defaultWorkshopLocationId == "") {
        var defaultLocation = {
            id: 0,
            text: "Location"
        };
    } else {        
        var defaultLocation = {
            id: $.session.defaultWorkshopLocationId,
            text: ""
        }
        pretext = arr.filter(function (el) {
            if (el.id == defaultLocation.id) return el.text;
        })[0] || "";
        defaultLocation.text = pretext.text;
    } 
    
    arr.push(defaultLocation);
    if ($.session.defaultWorkshopLocationId != "") {
        var nullLocation = {
            id: 0,
            text: "Location"
        };
        arr.push(nullLocation);
    }
    var locationToUse = defaultLocation;
    $("#workshoplocationname").PSlist(arr, {
        callback: function (item) {
            $(this).text(item.text).attr("locationid", item.id);
            // console.log(`${item.text}, location to use`);
            resizeWsHeaderText('#workshoplocationname', item.text.length);
            getEnabledConsumersForWorkshopAjax();
            WorkshopGetJobCodeAjax();
        }
    }).trigger("PSlist-call", [locationToUse]);
    //getEnabledConsumersForWorkshopAjax();
    //WorkshopGetJobCodeAjax();
}

function populateSupervisors(err, data) {
    if (err) throw err;
    var arr = data.map(function (el) {
        return {
            id: el.id,
            text: el.name
        }
    });
    arr.sort(function (a, b) {
        var nameA = a.text.toUpperCase().split(" ");
        var nameB = b.text.toUpperCase().split(" ");

        var lastA = nameA[nameA.length - 1];
        var lastB = nameB[nameB.length - 1];

        if (lastA < lastB) return -1;
        if (lastA > lastB) return 1;
        return 0;
    });
    var found = false;
    for(i = 0; i < arr.length; i++){
        if (arr[i].id == $.session.PeopleId) {
            found = true;
            break
        }
    }
    if (found) {
        var current = {
            id: $.session.PeopleId,
            text: $.session.Name + ' ' + $.session.LName
        };
        var selectSupervisor = {
            id: 0,
            text: "Supervisor"
        }
    } else {
        var current = {
            id: 0,
            text: "Supervisor"
        };
    }
    if (current.text == "Supervisor") {
        arr.push(current);
    } else {
        arr.push(selectSupervisor);
    }
    var supervisorToUse = current;
    $("#workshopsupervisorname").PSlist(arr, {
        callback: function (item) {
            $(this).text(item.text).attr("supervisorid", item.id);
            resizeWsHeaderText('#workshopsupervisorname', item.text.length);
        }
    }).trigger("PSlist-call", [supervisorToUse]);
}

function populateWorkCodes(err, data) {
    if (err) throw err;
    var arr = data.map(function (el) {
        return {
            id: el.jobstepid,
            acttype:el.activitytype,
            text: el.customercode + '-' + el.jobcode + '-' + el.jobstep + ' ' + el.shortdescription
        }
    });
    var current = {
        id: 0,
        text: 'Select A Job'
    };
    arr.push(current);
    var workCodeToUse = current;
    $("#jobcodename").PSlist(arr, {
        callback: function (item) {
            $(this).text(item.text).attr("jobstepid", item.id).attr("acttype", item.acttype);
            resizeWsHeaderText('#jobcodename', item.text.length);
            filterSetup();
        }
    }).trigger("PSlist-call", [workCodeToUse]);

}

function resizeWsHeaderText(tag, length) {
    if (length <= 11) {
        $(tag).css("font-size", "22px");
    }
    if (length > 11 && length <= 17) {
        $(tag).css("font-size", "20px");
    }
    if (length >= 17 && length < 28) {
        $(tag).css("font-size", "18px");
    }
    if (length >= 28 && length < 40) {
        $(tag).css("font-size", "15px");
    }
    if (length >= 40 && length < 56) {
        $(tag).css("font-size", "13px");
    }
    if (length >= 56 && length < 60) {
        $(tag).css("font-size", "12px");
    }
    if (length >= 60 && length < 72) {
        $(tag).css("font-size", "10px");
    }
    if (length > 72) {
        $(tag).css("font-size", "8px");
    }
}

function buildWorkshopTable(dataArray, overlapData) {
    var batchInfoText = $(".batchinfo").text();
    $("#actioncenter").html("");    
    var workshopTable = '<div class="wstableouterwrapper"><div class="workshoptable" id="workshoptableid"  >' + '<table >' + '</table>' + '</div></div>';
    clockoutinput = "clockoutinput";
    $("#actioncenter").append(workshopTable);
    var workshopTable2 = '<table>';    
    workshopTable2 = workshopTable2 + '<div class="batchinfo"></div>';
    workhopTable2 = workshopTable2 + '<div class="wsfirsttr"><tr id="wsfirsttr"><td id="wsfrconsumertd">Consumer</td><td id="wsfrstarttimetd">Start Time</td><td id="wsfrendtimetd">End Time</td><td id="wsfrjobcodetd">Job Code</td><td id="wsfrjobsteptd">Job Step</td><td id="wsfrhourstd">Hours</td><td id="wsfrqtytd">Quantity</td><td id="wsfrsvtd">Supervisor</td><td id="filter">Delete</td></tr></div>';
    if (dataArray != undefined && dataArray.length > 0) {
        var wsHours;
        for (i = 0; i < dataArray.length; i++) {
            startTime = formatTimeFromDB(dataArray[i].starttime);
            if (dataArray[i].hours.indexOf('23.983') != -1) {
                wsHours = '24'
            } else {
                wsHours = parseFloat(dataArray[i].hours);
            }
            if (isNaN(wsHours)) {
                wsHours = ""
            }
            if (dataArray[i].endtime == "") {
                endTime = "";                
            } else {
                if (dataArray[i].endtime == '23:59:59') {
                    endTime = formatTimeFromDB('00:00:00');
                } else {
                    endTime = formatTimeFromDB(dataArray[i].endtime);
                }                
                
            }
            if (dataArray[i].activitytype == 'P') {
                workhopTable2 = workhopTable2 + '<tr ' + "" + 'id=' + dataArray[i].jobactid + '><td id="wsconsumertd">' + dataArray[i].name + '</td><td id="wsstarttimetd" onclick=workshopClockInOutTimeBox("clockininput",\"' + dataArray[i].jobactid + '\")>' + startTime + '</td><td id="wsendtimetd" onclick=workshopClockInOutTimeBox("clockoutinput",\"' + dataArray[i].jobactid + '\")>' + endTime + '</td><td id="wsjobcodetd">' + dataArray[i].jobcode + '</td><td id="wsjobsteptd">' + dataArray[i].jobstep + '</td><td id="wshourstd">' + wsHours + '</td><td id="wsqtytd"><input type="number"  onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="' + dataArray[i].quantity + '"></td><td id="wssvtd">' + dataArray[i].supervisor + '</td><td id="workshoptrashcan" onclick=deleteWorkshopEntry("' + dataArray[i].jobactid + '")></td></tr>';
            } else {
                workhopTable2 = workhopTable2 + '<tr ' + "" + 'id=' + dataArray[i].jobactid + '><td id="wsconsumertd">' + dataArray[i].name + '</td><td id="wsstarttimetd" onclick=workshopClockInOutTimeBox("clockininput",\"' + dataArray[i].jobactid + '\")>' + startTime + '</td><td id="wsendtimetd" onclick=workshopClockInOutTimeBox("clockoutinput",\"' + dataArray[i].jobactid + '\")>' + endTime + '</td><td id="wsjobcodetd">' + dataArray[i].jobcode + '</td><td id="wsjobsteptd">' + dataArray[i].jobstep + '</td><td id="wshourstd">' + wsHours + '</td><td id="wsqtytd">' + dataArray[i].quantity + '</td><td id="wssvtd">' + dataArray[i].supervisor + '</td><td id="workshoptrashcan" onclick=deleteWorkshopEntry("' + dataArray[i].jobactid + '")></td></tr>';
            }
            //workhopTable2 = workhopTable2 + '<tr ' + "" + 'id=' + dataArray[i].jobactid + '><td id="wsconsumertd">' + dataArray[i].name + '</td><td id="wsstarttimetd">' + startTime + '</td><td id="wsendtimetd">' + endTime + '</td><td id="wsjobcodetd">' + dataArray[i].jobcode + '</td><td id="wsjobsteptd">' + dataArray[i].jobstep + '</td><td id="wshourstd">' + dataArray[i].hours + '</td><td id="wsqtytd">' + dataArray[i].quantity + '</td><td id="wssvtd">' + dataArray[i].supervisor + '</td><td id="workshoptrashcan" onclick=deleteWorkshopEntry("' + dataArray[i].jobactid + '")></td></tr>';
            
        }
        workhopTable2 = workhopTable2 + '</table>' + '</div>';

    } else {
        workhopTable2 = workhopTable2 + '<tr><td class="workshoptablenodata">No workshop data available within search parameters.</td></tr>';
        workhopTable2 = workhopTable2 + '<tr><td class="workshoptablenodata"></td></tr>';
        workhopTable2 = workhopTable2 + '</table>';
    }     
    
    $(".workshoptable").html(workhopTable2);
    if (batchInfoText != "") {
        $(".batchinfo").text(batchInfoText);
    }
    var errorMessageHeight = 0;//parseInt($("#casenoteoverlaperrormessage").css("height"), 10);
    var baseHeight = 120;   
    $("#firsttr").css("top", (baseHeight + errorMessageHeight) + "px");
    //$('#filter').click(function () {
    //    filterSetup();
    //});
    //$('#workshoptrashcan').click(function () { //Needs rewritten
    //    deleteWorkshopEntry(this);
    //});

    workshopTableValidationInit(dataArray, overlapData);
    $("*").removeClass("waitingCursor");
}

function workshopClockInOutTimeBox(inputField, jobActId) {
    var now = new Date();
    if (!checkSingleClockIn()) return;
    setupTimeInputBox([{ id: inputField}], {
        x: 80, y: 80,
    }, {
        callback: function (timeDigitsEntered) {
            $('#' + inputField).val(timeDigitsEntered);
            var wsRow, startTime, endTime, startTimeVal = null, endTimeVal = null, timeDigitsEnteredMilitary = convertTimeToMilitaryNew(timeDigitsEntered);

            if (inputField == "clockininput" || inputField == "clockinsingle" || inputField == "selectedclockininput") {

                if (jobActId !== undefined && jobActId !== null) {
                    wsRow = document.getElementById(jobActId);
                    endTime = wsRow.querySelector('#wsendtimetd').innerHTML;
                    endTimeVal = convertTimeToMilitaryNew(endTime);
                }

                if (timeDigitsEnteredMilitary >= endTimeVal && endTimeVal !== null) {
                    //do nothing show pop up
                    timeOverlapPopup("Start time can not be set after end time.");
                } else {
                    $("*").addClass("waitingCursor");
                    setWorkshopClockInOutTime(inputField, timeDigitsEntered, jobActId);
                }                
            }

            if (inputField == "clockoutinput" || inputField == "clockoutsingle" || inputField == "selectedclockoutinput") {
                if (jobActId !== undefined && jobActId !== null) {
                    wsRow = document.getElementById(jobActId);
                    startTime = wsRow.querySelector('#wsstarttimetd').innerHTML;
                    startTimeVal = convertTimeToMilitaryNew(startTime);
                }

                if (timeDigitsEnteredMilitary <= startTimeVal && startTimeVal !== null) {
                    //do nothing show pop up
                    timeOverlapPopup("End time can not be set before start time or after 12AM.");
                } else {
                    $("*").addClass("waitingCursor");
                    setWorkshopClockInOutTime(inputField, timeDigitsEntered, jobActId);
                }
                
            }
            //$('#' + inputField).val(timeDigitsEntered);
            //setClockInTime(inputField);
        },
    })
    return false;
}

function setWorkshopClockInOutTime(inputField, timeEntered, jobActid) {
    var consumerIds = "";
    var consumerCount = $('.highlightselected').length;
    var loopCount = 0;
    timeEntered = convertTimeToMilitary(timeEntered);
    if ($(".highlightselected").length < 1) {
        //save all. save multiple ajax call
        $('.consumerselected:not(.idnotactiveemployee)').each(function (index) {
            consumerCount = $('.consumerselected:not(.idnotactiveemployee)').length;
            selectedRosterUserId = $(this).attr('id');
            loopCount++;
            if (loopCount < consumerCount) {
                consumerIds = consumerIds + selectedRosterUserId + '|';
            } else {
                consumerIds = consumerIds + selectedRosterUserId + '|';
            }
        });
    } else  {
        //save selected
        $('.highlightselected').each(function (index) {
            selectedRosterUserId = $(this).attr('id');
            loopCount++;
            if (loopCount < consumerCount) {
                consumerIds = consumerIds + selectedRosterUserId + '|';
            } else {
                consumerIds = consumerIds + selectedRosterUserId + '|';
            }            
        });
    }
    if (inputField == "clockininput") {
        setWorkshopClockinSelection(timeEntered, consumerIds, jobActid);
    } else {
        setWorkshopClockoutSelection(timeEntered, consumerIds, jobActid);
    }
}

function setWorkshopClockinSelection(timeEntered, consumerIds, jobActid) {
    if (jobActid != undefined) {
        singleClockInData = {
            token: $.session.Token,
            jobActivityId: jobActid,
            timeEntered: timeEntered
        };
        updateWorkshopClockInAjax(singleClockInData);
    } else {
        setUpClockInSave(consumerIds, timeEntered);
    }
}

function setUpClockInSave(consumerIds, timeEntered) {
    if ($("#jobcodename").html() == 'Select A Job') {
        $("*").removeClass("waitingCursor");
        alert("Please select a job.");
    } else {
        clockInData = {
            token: $.session.Token,
            selectedDate: $("#workshopdateboxinside").html(),
            jobString: $("#jobcodename").html(),
            jobStepId: $("#jobcodename").attr("jobstepid"),
            jobActType: $("#jobcodename").attr("acttype"),
            location: $("#workshoplocationname").attr("locationid"),
            supervisor: $("#workshopsupervisorname").attr("supervisorid"),
            time: timeEntered,
            batchId: $.session.workshopBatchId,
            consumerids: consumerIds,
            startOrEnd: 'Start'
        };
        WorkshopClockInAjax(clockInData);
    }    
}

function setWorkshopClockoutSelection(timeEntered, consumerIds, jobActid) {
    if (jobActid != undefined) {
        singleClockOutData = {
            token: $.session.Token,
            jobActivityId: jobActid,
            timeEntered: timeEntered
        };
        clockoutWorkshopSingleAjax(singleClockOutData);
    } else {
        setupClockOutSave(consumerIds, timeEntered);
    }
}

function setupClockOutSave(consumerIds, timeEntered) {
    clockOutData = {
        token: $.session.Token,
        selectedDate: $("#workshopdateboxinside").html(),
        jobString: "",
        jobStepId: $("#jobcodename").attr("jobstepid"),
        jobActType: "",
        location: $("#workshoplocationname").attr("locationid"),
        supervisor: $("#workshopsupervisorname").attr("supervisorid"),
        time: timeEntered,
        batchId: $.session.workshopBatchId,
        consumerids: consumerIds,
        startOrEnd: 'End'
    };
    WorkshopClockOutAjax(clockOutData);
}

function deleteWorkshopEntry(data) {
    $("*").addClass("waitingCursor");
    deleteData = {
        token: $.session.Token,
        jobActivityId: data
    };
    filterSetup();
    deleteWorkshopEntryAjax(deleteData)
}

function highlightPersonWorkshop(event) {
    var par = $(event.target);
    if ($(par).hasClass("consumerselected")) {
        //not sure if this is still being hit ever -Joe
    } else {
        par = $(par).closest('consumer');
    }
    // Set the background color for persons
    $("#consumerlist").children().css('background-color', '');

    var consumerId = par.attr('id');
    //This if/else added to remove selection from user individually
    if ($(par).hasClass("highlightselected")) {
        //This part is added
        par.removeClass("highlightselected");
    } else {
        par.removeClass("notselected");
        par.addClass("highlightselected");
    }
}

function filterSetup(overlapData) {
    var consumerIds = "";
    var consumerCount = $('.highlightselected').length;
    var loopCount = 0;
    if (consumerCount > 0) {
        $('.highlightselected').each(function (index) {
            selectedRosterUserId = $(this).attr('id');
            loopCount++;
            if (loopCount < consumerCount) {
                consumerIds = consumerIds + selectedRosterUserId + ',';
            } else {
                consumerIds = consumerIds + selectedRosterUserId;
            }

        });
    } else {
        $('.consumerselected:not(.idnotactiveemployee)').each(function (index) {
            consumerCount = $('.consumerselected:not(.idnotactiveemployee)').length;
            selectedRosterUserId = $(this).attr('id');
            loopCount++;
            if (loopCount < consumerCount) {
                consumerIds = consumerIds + selectedRosterUserId + ',';
            } else {
                consumerIds = consumerIds + selectedRosterUserId;
            }
        });
    }
    data = {
        token: $.session.Token,
        selectedDate: $("#workshopdateboxinside").html(),
        consumerIds: consumerIds,
        locationId: $("#workshoplocationname").attr("locationid"),
        jobStepId: $("#jobcodename").attr("jobstepid"),
        application: $.session.applicationName,
        batchId: $.session.workshopBatchId
    };
    WorkshopFilterListAjax(data, overlapData);
}

function preFilterListDataSetup(err, data, overlapData) {
    if (err) throw err;
    var arr = data.map(function (el) {
        return {
            jobactid: el.jobactid,
            name: el.name,
            starttime: el.starttime,
            endtime: el.endtime,
            jobstep: el.jobstep,
            jobcode: el.jobcode,
            hours: el.hours,
            quantity: el.quantity,
            supervisor: el.supervisor,
            activitytype: el.activitytype
        }
    });
    buildWorkshopTable(arr, overlapData);
}

function disableNonWorkshopConsumers(res) {
    var arr = res.map(function (el) {
        return el.employee_id;
    })
    var list = $.pages.rosterconsumerlist.split("</consumer>");
    $('.consumerselected', list).each(function (ind, el) {
        var tmpId = this.id;
        var htmlId = "#" + tmpId;
        //console.log(arr.indexOf(tmpId))
        var n = arr.indexOf(tmpId);
        if (n == -1) {
            $(this).addClass("idnotactiveemployee");//.idnotactiveemployee
        } else {
            $(this).removeClass("idnotactiveemployee");
        }   
    });
}

function displaySelectBatch(data, callback) {
    var overlay = $("<div>")
        .addClass("modaloverlay")
        .css({
            "backgroundColor": "rgba(0, 0, 0, 0.15)"
        }).appendTo($("body"));
    $("#roostertoolbar").hide();
    $.ajax({
        type: "GET",
        url: "./workshop/selectbatch.html?RNG=" + +(new Date()),
        success: function (HTMLresponse, status, xhr) {
            var card = $("<div>").replaceWith(HTMLresponse);
            i = 0;            
            overlay.click(function () {
                $(this).remove();
            }).append(card);

            card.click(function (e) {
                e.stopPropagation();
            }).bind("remove", function () {
                overlay.remove();
            });
            
            data.forEach(function () {
                var li = $("<li>").attr("arrplace", i).text([data[i].name]);
                li.click(function () {
                    $("#roostertoolbar").show();
                    $.session.workshopBatchId = data[$(this).attr("arrplace")].id;
                    callback(data[$(this).attr("arrplace")]);
                    card.trigger("remove");
                });
                $("#selectbatchlist").append(li);
                i++;
            })           
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    })
    return;
}

function displayNoBatch(data, callback) {
    var overlay = $("<div>")
        .addClass("modaloverlay")
        .css({
            "backgroundColor": "rgba(0, 0, 0, 0.15)"
        }).appendTo($("body"));

    $.ajax({
        type: "GET",
        url: "./workshop/nobatch.html?RNG=" + +(new Date()),
        success: function (HTMLresponse, status, xhr) {
            var card = $("<div>").replaceWith(HTMLresponse);
            overlay.click(function () {
                $(this).remove();
            }).append(card);

            card.click(function (e) {
                e.stopPropagation();
            }).bind("remove", function () {
                overlay.remove();
            });
            var li = $("<li>").text("There are no batches available for this date.  Please contact your workshop administrator.");
            $("#nobatchlist").append(li);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    })
    return;
}

function clearWorkshopPops(event) {
    var tarId = "";
    var nodeName = "";
    var className = "";
    var parentX2 = "";
    //$.locs = [];
    clearPops(event); // for non day service "global" clear pops  e.g. settings popup
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

    if (tarId == "actioncenter" || tarId == "actionpane" || tarId == "consumerlist" || tarId == "topbar" || tarId == "leftmenu") {
        //I'm pretty sure this if condition makes this never be called.  Leaving it for now because we are close to release  -Joe
        if ($.loadedApp != 'goals') {
            $('.consumerselected').removeClass('highlightselected');
        }
    }
}

function workshopTableValidationInit(dataArray, overlapDataArray) {

    if (dataArray != undefined && dataArray.length > 0) {
        // endTime Validation
        var endTimeBoxesNl = document.querySelectorAll('#wsendtimetd');
        var endTimeBoxes = Array.from(endTimeBoxesNl);
        endTimeBoxes.forEach(validateEndTime);

        // qtyBox Validation & Toggle
        var qtyBoxes = [];
        dataArray.forEach(function(el) {
            if (el.activitytype === '' || el.activitytype === 'H') return;
            var row = document.getElementById(el.jobactid);
            var box = row.querySelector('#wsqtytd');
            qtyBoxes.push(box);
        });
        qtyBoxes.forEach(validateQty);
        qtyNavToggle(qtyBoxes);

        // overlapTime Validation
        var workshopRowsNl = document.querySelectorAll('.workshoptable tr');
        var workshopRows = Array.from(workshopRowsNl);

        workshopRows.forEach(function (el) {
            el.classList.remove('error');
        });

        // handles overlap data validation
        if (overlapDataArray != undefined && overlapDataArray.length > 0) {
            overlapDataArray.forEach(function (el) {
                var overlapRow = document.getElementById(el);
                if (overlapRow != null) {
                    timeOverlapToggle(overlapRow);
                }                
                timeOverlapPopup("The time you entered is overlapping with a previously entered time.");
            });
        }
    }

}

function timeOverlapPopup(message) {
    var actionCenter = document.getElementById('actioncenter');

    var popup = document.createElement('div');
    popup.classList.add('timeOverlapPopupContainer');

    var closePopupBtn = document.createElement('button');
    closePopupBtn.classList.add('closePopupBtn');
    closePopupBtn.id = 'closePopupTrigger';
    closePopupBtn.innerText = 'X';
    closePopupBtn.addEventListener('click', function () {
        actionCenter.removeChild(popup);
    });

    var popupMessage = document.createElement('p');
    popupMessage.classList.add('popupMessage');
    popupMessage.innerText = message;

    popup.appendChild(closePopupBtn);
    popup.appendChild(popupMessage);
    actionCenter.appendChild(popup);
    $("*").removeClass("waitingCursor");
}

function timeOverlapToggle(el) {
    el.classList.add('error');
}

function validateEndTime(el) {
    if (!el.innerHTML) {
        el.classList.add('error');
    } else {
        el.classList.remove('error');
    }
}

function validateQty(el) {
    // checking for input inside of qtyBox
    var input = el.querySelector('input');
    if (!input.value) {
        el.classList.add('error');
    } else {
        el.classList.remove('error');
    }
}

function qtyNavToggle(elArray) {
    var qtyInputs = [];

    function toggle(el, keycode) {
        var currentInd = parseInt(el.id.substring(6, 7));
        var targetInd;
        var targetInput;

        // return if target would be outside of range
        if (keycode === 38 && currentInd === 0) return;
        if (keycode === 40 && currentInd === (qtyInputs.length - 1)) return;

        // set targetInd based off keycode
        if (keycode === 38) {
            targetInd = currentInd - 1;
        } else {
            targetInd = currentInd + 1;
        }

        // move focus
        targetInput = 'input-' + targetInd;
        document.getElementById(targetInput).focus();

    }

    elArray.forEach(function (el, ind) {
        var input = el.querySelector('input');
        input.setAttribute('id', 'input-' + ind);
        input.addEventListener('keydown', function (ev) {
            if (ev.keyCode === 38 || ev.keyCode === 40) {
                ev.preventDefault();
                toggle(ev.target, ev.keyCode);
            }
        });
        input.addEventListener('blur', function (ev) {
            validateQty(ev.target.parentNode);
        });
        input.addEventListener('change', function (ev) {
            row = '#' + ev.target.parentNode.parentNode.id;
            quantity = $(row + ' #wsqtytd input').val();
            updateWorkshopQuantityAjax(quantity, ev.target.parentNode.parentNode.id);
            
        });

        qtyInputs.push(input);

    });

}