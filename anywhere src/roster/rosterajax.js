$.previousRosterGroup = "";
var dateboxDateObject;

function getRosterLocations(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getLocations/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () { },
        complete: function () { },
        success: function (response, status, xhr) {
            getLocationsWithUnreadNotesAjax(function (results) {
                //console.log(results);
                var hasNotesArr = results.map(function (el) { return el.loc_id; });
                var res = JSON.stringify(response);
                //alert('success: ' + res);
                //always check for errors before processing
                var allString = '<location><ID>000</ID><Name>All</Name><Residence>Y</Residence></location>';
                //res = res.slice(0, 34) + allString + res.slice(34);
                if (checkforErrors(res) == -1) {
                    if (callback) callback("error");
                    return;
                }
                var optionsHtml = [];
                var optionsHtml2 = [];
                var locations = $('#locationpop');
                var defaultlocations = $('#locationdefault2pop');
                var first = 0;
                var cId = 0;
                optionsHtml2.push(
                    "<a href='#' class='loclink block' locid='0' residence='Y' onClick='setDefaultValue(2, 0, event)' ><img class='houseicon' src='./images/new-icons/icon_house.png' />" +
                    "Remember Last Location" + "</a>");
                $('location', res).each(function () {
                    tmpName = $('Name', this).text();

                    //this is needed because quotes have symbolic meaning in javascript
                    var nameWithRemovedQuote = tmpName.replace(/\\['\\]|'/g, function (s) {
                        if (s == "'") return "";
                        else return s;
                    });

                    tmpId = $('ID', this).text();
                    tmpRes = $('Residence', this).text();
                    var classadd = "block";
                    //alert(tmpRes);
                    if (tmpRes == 'Y') {
                        icon =
                            "<img class='houseicon' src='./images/new-icons/icon_house.png' />";
                    } else {
                        icon =
                            "<img class='buildingicon' src='./images/new-icons/icon_building.png' />";
                    }
                    if (first == 0) {
                        if ($.session.defaultRosterLocation == 0) {
                            cId = readCookie('defaultRosterLocation');
                        } else {
                            cId = $.session.defaultRosterLocation;
                        }
                        if (cId == null || cId == 0) {
                            cId = tmpId;
                        }
                    }

                    if (cId == tmpId) {
                        //$.session.defaultRosterLocation = tmpId; //set this for other mods to use as their default location
                        var locTmpId = tmpId;
                        assignLocationProgressNotesButton(tmpId, tmpName.trim());
                        $('#locationbox').html("<div id='headertext' class='headertext'>" + tmpName.trim() + "</div>");
                        $.session.defaultRosterLocation = readCookie("defaultRosterLocation");
                        $.session.defaultRosterLocationFlag = readCookie("defaultRosterLocationFlag");
                        if ($.session.defaultRosterLocationFlag != null) {
                            if ($.session.defaultRosterLocationFlag == "true") {
                                $("#1").text("Remember Last Location");
                            } else {
                                $("#1").text(tmpName.trim());
                            }
                        }
                        $.session.defaultRosterLocation = tmpId; //set this for other mods to use as their default location
                        $('#locationbox').attr('locid', tmpId);
                        $('#locationbox').attr('residence', tmpRes);
                        resizeHeaderText('#headertext', tmpName.length);
                        first = 1;
                        if ($.session.applicationName == 'Gatekeeper') {//MAT temporary fix to issue with dropdowns
                            (function (tmpName) {
                                setTimeout(function () {
                                    if ($.loadedApp == "roster") {
                                        getConsumerGroups(locTmpId, tmpName);
                                    }
                                }, 500);
                            })(tmpName)
                            
                        } else {
                            if ($.loadedApp == "roster") {//Original if statement
                                getConsumerGroups(tmpId, tmpName);
                            }
                        }

                        classadd = "noblock";
                        if (tmpRes == 'Y') {
                            $('.locationicon').css('background-image',
                                'url(./Images/new-icons/location_house.png)'
                            );
                        } else {
                            $('.locationicon').css('background-image',
                                'url(./Images/new-icons/location.png)');
                        }
                    }
                    if ($("#headertext").text() == "") {
                        $('#locationbox').html("<div id='headertext' class='headertext'>Select Location</div>");
                        $("*").removeClass("waitingCursor");
                        resizeHeaderText('#headertext', 15);
                    }
                    var tempWithQuotes = '"' + tmpName + '"';
                    //var hasProgressNote = Math.random() >= 0.5;
                    var hasProgressNote = false;
                    if (hasNotesArr.indexOf(tmpId) >= 0) hasProgressNote = true;
                    optionsHtml.push("<a href='#' hasProgressNote='" + hasProgressNote + "' class='loclink " + classadd + "' locid='" + tmpId + "' residence='" + tmpRes + "' onClick='selectLocation(" + tmpId + ", " + hasProgressNote + ", \"" + tmpName + "\")' >" + icon + " " + tmpName + ((hasProgressNote == true && showNotesAndToDoList == true) ? " <img style='position:absolute;right:35px;' src='./Images/new-icons/icon_error.png' />" : "") + "</a>");
                    optionsHtml2.push("<a href='#' class='loclink " + classadd + "' locid='" + tmpId + "' residence='" + tmpRes + "' onClick='setDefaultValue(2," + tmpId + ", event," + tempWithQuotes + ")' >" + icon + " " + nameWithRemovedQuote + "</a>");
                });

                optionsHtml.push("<a href='#' class='loclink block' locid='000' residence='Y' onClick='selectLocation(000, false, event)' ><img class='houseicon' src='./images/new-icons/icon_house.png' />ALL</a>");
                //optionsHtml2.push("<a href='#' class='loclink block' locid='000' residence='Y' onClick='setDefaultValue(2, 000, event)' ><img class='houseicon' src='./images/new-icons/icon_house.png' />ALL</a>");


                optionsHtml = optionsHtml.join('');
                locations.html(optionsHtml);
                sortBy('#locationpop');
                optionsHtml2 = optionsHtml2.join('');
                defaultlocations.html(optionsHtml2);
                //$("#locationbox").addClass("waitingCursor");
                //$("#headertext").addClass("waitingCursor");
                $(document).trigger("moduleLoad");
                if (callback) callback();
            });
            
        },
        error: function (xhr, status, error) {
            if(callback) callback(error, null);
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n'+ xhr.responseText); },
        //complete: function (jqXHR, status) { alert('Status: ' + status + '\njqXHR: ' + JSON.stringify(jqXHR)); }
    });
    //fill in user config menus
    populateDefaultStaffLocationBox();
    defaultDayServiceLocations();
    $.session.defaultDayServiceLocationFlag = readCookie("defaultDayServiceLocationFlag");
    if ($.session.defaultDayServiceLocationFlag == "true" || $.session.defaultDayServiceLocationName == "") {
        $("#2").text("Remember Last Location");
    } else {
        $.session.defaultDayServiceLocationName = readCookie('defaultDayServiceLocationName');
        if ($.session.defaultDayServiceLocationName != null) {
            $("#2").text($.session.defaultDayServiceLocationName.trim());
        }
    }
    if (readCookie('defaultTimeClockLocationName') != '' && readCookie('defaultTimeClockLocationName') !== null) {
        $("#4").text(readCookie('defaultTimeClockLocationName'));
    }else{
        $("#4").text("Time Clock Location");
    }
    if (readCookie('defaultWorkshopLocationName') != '' && readCookie('defaultWorkshopLocationName') !== null) {
        $("#5").text(readCookie('defaultWorkshopLocationName'));
    } else {
        $("#5").text("Time Clock Location");
    }
}

function defaultDayServiceLocations() {
    fmt = new DateFmt();
    var res = "";
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getDayServiceLocations/",
        data: '{"token":"' + $.session.Token + '", "serviceDate":"' + fmt.format(new Date(),
            "%h:%M %T") + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            res = JSON.stringify(response);
            populateDefaultDayServiceLocation(res);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
        }
    });
    return res;
}

function selectLocation(locationId, isAll, name) {
    $("*").addClass("waitingCursor");
    //if (isAll) $("#locationProgressNotes, #locationChecklist").hide();
    //else $("#locationProgressNotes, #locationChecklist").show();

    if ($('#locationpop').css('display') == 'block') {
        var optionsHtml = [];
        //var optionsHtml2 = [];
        var locations = $('#locationpop');
        //var defaultlocations = $('#locationdefault2pop');
        $.session.lastMenuSelection = new Date();
        //optionsHtml2.push(
        //    "<a href='#' class='loclink block' locid='0' residence='Y' onClick='setDefaultValue(2, 0, event)' ><img class='houseicon' src='./images/new-icons/icon_house.png' />" +
        //    "Remember Last Location" + "</a>");
        $('#locationpop').children().each(function () {
            var tmpName = $(this).text();
            var tmpNameLength = tmpName;
            var tmpId = $(this).attr('locid');
            var tmpRes = $(this).attr('Residence');
            var classadd = "block";
            var hasProgressNote = $(this).attr("hasProgressNote") == "true";
            if (tmpRes == 'Y') {
                icon =
                    "<img class='houseicon' src='./images/new-icons/icon_house.png' />";
            } else {
                icon =
                    "<img class='buildingicon' src='./images/new-icons/icon_building.png' />";
            }
            if ($(this).attr('locid') == locationId) {
                $('#locationbox').html("<div id='headertext' class='headertext'>" +
                    tmpName.trim() + "</div>");
                $('#locationbox').attr('locid', tmpId);
                $('#locationbox').attr('residence', tmpRes);
                tmpNameLength = tmpNameLength.trim();
                resizeHeaderText('#headertext', tmpNameLength.length);
                // Save off the ID of the first location:
                currentlocationID = locationId;
                $.session.selectedGroupId = 0;
                // Populate the Groups filter
                getConsumerGroups(tmpId, tmpName);
                if (tmpRes == 'Y') {
                    $('.locationicon').css('background-image',
                        'url(./Images/new-icons/location_house.png)');
                } else {
                    $('.locationicon').css('background-image',
                        'url(./Images/new-icons/location.png)');
                }
                classadd = "noblock";
            }
            optionsHtml.push("<a href='#' hasProgressNote='" + hasProgressNote + "' class='loclink " + classadd + "' locid='" +
                tmpId + "' residence='" + tmpRes + "' onClick='selectLocation(" +
                tmpId + ", " + hasProgressNote + ", \"" + tmpName + "\")' >" + icon + " " + tmpName + (hasProgressNote == true ? " <img style='position:absolute;right:35px;' src='./Images/new-icons/icon_error.png' />" : "") + "</a>");
            //optionsHtml2.push("<a href='#' class='loclink " + classadd + "' locid='" +
            //    tmpId + "' residence='" + tmpRes + "' onClick='setDefaultValue(2," +
            //    tmpId + ", event)' >" + icon + " " + tmpName + "</a>");
        });
        optionsHtml = optionsHtml.join('');
        locations.html(optionsHtml);
        sortBy('#locationpop');
        //optionsHtml2 = optionsHtml2.join('');
        //defaultlocations.html(optionsHtml);

        var rosterLocationSetting = $("#1").text();
        if (rosterLocationSetting == "Remember Last Location") {
            //createCookie('defaultRosterLocation', locationId, 7);
            saveDefaultLocationValueAjax('2', locationId)
        }
        $.session.defaultRosterLocation = locationId;

        assignLocationProgressNotesButton(locationId, name);
    }
    $("#locationpop").css("display", "none");
    $("#locationsettingspop").css("display", "none");    
}

function selectGroup(groupCode, groupId) {
    $("#actioncenter").find(".progressnoteicon").each(function (ind, el) { $(el).parent().parent().show(); });
    var optionsHtml = [];
    var lists = $('#filterpop');
    $('#filterpop').children('a').each(function () {
        var tmpName = $(this).text();
        var tmpId = $(this).attr('retrieveId');
        var tmpCode = $(this).attr('groupCode');
        var classadd = "block";
        if (($(this).attr('groupCode') == groupCode) && ($(this).attr('retrieveId') ==
            groupId)) {
            optionsHtml.push("<a href='#' class='loclink' groupCode='" + $(
                    '#filtertext').attr('groupCode') + "' groupName='" + $(
                    '#filtertext').attr('groupName') + "' retrieveId='" + $(
                    '#filtertext').attr('retrieveId') +
                "' groupMembers='' onClick='selectGroup(\"" + $('#filtertext').attr(
                    'groupCode') + "\"," + $('#filtertext').attr('retrieveId') +
                ")'  >" + $('#filtertext').text() + "</a>");
            $('#filtertext').html(tmpName +
                "<filterdownarrow id='filterdownarrow' class='filterdownarrow'  />&nbsp;</filterdownarrow>"
            ); //<img src='./Images/arrow_down.png' />
            $('#filtertext').attr('groupCode', tmpCode);
            $('#filtertext').attr('retrieveId', tmpId);
            tmpName = tmpName.trim();
            resizeHeaderText('#filtertext', tmpName.length);
            $.previousRosterGroup = tmpId + "|" + tmpCode;
            // Get people from selected group
            getConsumersByGroup(groupCode, groupId, tmpName, $("#locationbox").attr("locid"));
            classadd = "noblock";
        } else {
            optionsHtml.push("<a href='#' class='loclink " + classadd + "' groupCode='" +
                tmpCode + "' groupName='" + tmpName + "' retrieveId='" + tmpId +
                "' onClick='selectGroup(\"" + tmpCode + "\"," + tmpId + ")' >" +
                tmpName + "</a>");
        }
    });
    // Convert array into string
    optionsHtml = optionsHtml.join('');
    lists.html(optionsHtml);
    // Sort the HTML elements by group
    sortBy("#filterpop", "[groupCode='CST']");
    sortBy("#filterpop", "[groupCode='TRA']");
    // Inject <hr> tags after each group code to separate them visually
    $("<hr>").insertAfter($('#filterpop').children("[groupCode='CST']").last());
    $("<hr>").insertAfter($('#filterpop').children("[groupCode='TRA']").last());
    $("<hr>").insertAfter($('#filterpop').children("[groupCode='ALL']").last());
    $("<hr>").insertAfter($('#filterpop').children("[groupCode='CAS']").last());
    $.session.selectedGroupId = groupId;
    $.session.selectedGroupCode = groupCode;
    if ($.session.deletedGroupId != 0) {
        $('#filterpop').find('[retrieveId="' + $.session.deletedGroupId + '"][groupCode="CST"]').remove();
        $('#groupoptions').find('groupoption[id="' + $.session.deletedGroupId + '"]').remove();
        $.session.deletedGroupId = 0;
    }
    $('#filterpop').hide();
}
//This is a after the fact sort, meaning the data already needs to be generated into it's place before this can be run.
//Hugely ineffiecent, but functional

function sortBy(elementName, attributeName) {
    var mylist = $(elementName);
    var listitems = mylist.children(attributeName).get();
    listitems.sort(function (a, b) {
        return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
    });
    $.each(listitems, function (idx, itm) {
        mylist.append(itm);
    });
}
// Extends JQuery Selector to test if DOM object exists
$.fn.exists = function () {
    return this.length !== 0;
};
//gets consumer groups from the database for a particular location

function getConsumersByGroup(groupCode, locationId, locationName, locationOverrideFromGroupDropdown) {
    var daysBackDate = convertDaysBack($.session.defaultProgressNoteReviewDays);
    var datebox = $("#datebox").val();
    dateboxDateObject = Date.parse(datebox);
    dateboxDateObject = new Date(dateboxDateObject);

    //if date is null, then use today. Happens comming from outside pages
    if (datebox === undefined) {
        var d = new Date();
        datebox = d.getShortMonthName() + " " + d.getDate() + ", " + d.getFullYear();
        dateboxDateObject = new Date(datebox);
    }
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getConsumersByGroup/",
        data: '{"groupCode":"' + groupCode + '", "retrieveId":"' + locationId + '", "token":"' + $.session.Token + '", "serviceDate":"' + datebox + '", "daysBackDate":"' + daysBackDate + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = JSON.stringify(response);
                getConsumersWithUnreadNotesByEmployeeAndLocationAjax(locationId, function (data) {
                    if (locationOverrideFromGroupDropdown) locationId = locationOverrideFromGroupDropdown;
                    getConsumersByLocationAbsentAjax($("#locationbox").attr("locid"), dateboxDateObject, function (absentData) {
                        //combineConsumersAndNotes(data, res, locationId, locationName, dateboxDateObject, absentData);
                        combineConsumersAndNotes(data, res, $("#locationbox").attr("locid"), locationName, dateboxDateObject, absentData);
                        updateConsumersListAbsentIcon(absentData.map(function (el) { return el.consumer_id; }));
                    });
                    $("*").removeClass("waitingCursor");
                })
            }
            catch (e) {
                combineConsumersWithLocations([], res, locationId);
            }
            
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function combineConsumersWithLocations(id, locationId, serviceIds, LastName, FirstName, hasProgressNote, hasCheckList, locationName, statusDate, hasAbsent) {
    var combinedStr = "<consumer class='consumer' id='" + id + "' serviceLocations='" + serviceIds + "' onclick='boxAction(event)'>" +
        "<consumerinfo id='" + id + "ci' class='rosterAvailable'>" +
        "<picbox class='picbox'><statusbar class='statusbar'></statusbar><img id='img" + id +
        "' class='portrait' src='./images/portraits/" + id +
        ".png?rng=" + +(new Date()) + "' onerror=this.src='./images/new-icons/default.jpg' />" +
        "</picbox>" +
        "<consumerbodybox id='cbb' class='consumerbodybox'>" +
        "<namebox id='namebox' class='namebox nametext'>" +
        FirstName + "<div class='lastnametext'>" + LastName +
        "</div>" +
        "</namebox></consumerinfo>" +
        "<div class='portraitselection'>" +
        "<label for='PhotoPicker" + id + "' class='customFileUpload'></label>" +
        "<input id='PhotoPicker" + id + "' class='fileSelector' type='file' accept='image/*' onchange='sendPortrait(event," + id + ")' />" +

        "<label class='simpledemoicon' onclick='getConsumerDemographics(" + id + ")'></label>" +
        "<label class='demonoteicon' onclick='getDemographicsNotes(" + id + ")'></label>";
    if (showNotesAndToDoList == true && locationId != 0) {
        combinedStr += "<label class='progressnoteicon ";
        if (hasProgressNote == true) combinedStr += "progressNoteIconHasUnread";
        combinedStr += "' onclick='event.stopPropagation(); return selectNotesByConsumerAndLocationAjax(" + id + ", " + locationId + ", \"" + [FirstName, LastName].join(" ").split("'").join(" ") + "\", \"" + locationName + "\")'></label>" + "";
        /*"<label class='checklisticon' style='display: block;";
        if(hasCheckList == true) combinedStr += "background-color:red;";
        combinedStr += "' onclick='getConsumerDemographics(" + id + ")'></label>";*/
    }
    combinedStr += "<label class='absenticon'></label>";
    combinedStr +=  "</div>" +
        "</consumerbodybox><icon id='addConsumer' class='addConsumer' onClick='addConsumersToGroups(event)'>Groups</icon></consumer>";

    var temp = $(combinedStr);
    temp.find(".absenticon").attr("date", statusDate).attr("onclick", "event.stopPropagation(); return selectAbsentAjax(" + [id, locationId, '$(this).attr("date")', "\"" + [FirstName, LastName].join(" ").split("'").join(" ") + "\"", "\"" + locationName + "\""].join(", ") + ")");
    var tempAbsentIcon = temp.find(".absenticon").clone(true).hide();
    if (hasAbsent == true) {
        temp.find(".absenticon").addClass("isAbsent");
        //tempAbsentIcon.addClass("isAbsent");
        temp.addClass("showAbsentInList");
        //tempAbsentIcon.addClass("isAbsent")
    }
    if (locationName.toUpperCase().trim() === "ALL") {
        temp.find(".absenticon").hide();
    }

    //JDL 2018/02/09 - May use this in the future
    //if ($.session.applicationName == 'Gatekeeper') {
    //    temp.find(".absenticon").hide();
    //}
    
    temp.append(tempAbsentIcon);
    return temp[0].outerHTML;
}

function getConsumerGroups(locationId, locationName) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getConsumerGroups/",
        data: '{"locationId":"' + locationId + '", "token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
            var filterListHtml = [];
            var locations = $('#filterpop');
            var groupOptionsHtml = [];
            var groupList = $('#groupoptions');
            var defaultGroupCode = "ALL";
            var defaultRetrieveId = "";
            var defaultGroup;
            var previousGroup;
            // Return the "ALL" group as the default group
            defaultGroup = $("GroupCode:contains('ALL')", res).parent();
            // Check to see after retrieve if the previously selected Group still exists. If so, make it the default.
            //Removing for now to fix other issue. Not sure if this functionality is needed any more. MAT
            //if ($.previousRosterGroup != "") {
            //    previousGroup = $("RetrieveID:contains('" + $.previousRosterGroup.split(
            //        '|')[0] + "')", $("group:contains('" + $.previousRosterGroup
            //        .split('|')[1] + "')", res)).parent();
            //    if (previousGroup.exists()) {
            //        defaultGroup = previousGroup;
            //    }
            //}
            // Get the default retrieve ID and groupCode so we can display it in the filter box
            defaultRetrieveId = $('RetrieveID', defaultGroup).text();
            if ($.session.selectedGroupId != 0) {
                defaultGroupCode = $.session.selectedGroupCode;
            } else {
                
                deafultGroupCode = $('GroupCode', defaultGroup).text();
            }

            //filterListHtml.push("<a href='#' class='loclink' groupCode='' groupName='' retrieveId='75' onClick='filterOutReadNotes()'>Needs Attention</a>")
            
            $('group', res).each(function () {
                tmpCode = $('GroupCode', this).text();
                tmpId = $('RetrieveID', this).text();
                tmpName = $('GroupName', this).text();
                // For User-Defined Groups only
                tmpMembers = $('Members', this).text();
                if ((tmpCode == defaultGroupCode) && (tmpId ==
                    defaultRetrieveId)) {
                    $('#filtertext').html(tmpName +
                        "<filterdownarrow id='filterdownarrow' class='filterdownarrow'  />&nbsp;</filterdownarrow>"
                    ); //<img src='./Images/arrow_down.png' />  Removed for consistency within menu
                    resizeHeaderText('#filtertext', tmpName.length);
                    $('#filtertext').attr('groupCode', tmpCode);
                    $('#filtertext').attr('retrieveId', tmpId);
                    getConsumersByGroup(tmpCode, tmpId, locationName);
                } else {
                    filterListHtml.push(
                        "<a href='#' class='loclink' groupCode='" +
                        tmpCode + "' groupName='" + tmpName +
                        "' retrieveId='" + tmpId +
                        "' onClick='selectGroup(\"" + tmpCode + "\"," +
                        tmpId + ")' onclick='selectGroup(\"" +
                        tmpCode + "\"," + tmpId + ")'>" + tmpName +
                        "</a>");
                    if (tmpCode == "CST") {
                        groupOptionsHtml.push("<groupoption id='" + tmpId +
                            "' class='groupoption' members='" +
                            tmpMembers +
                            "' onclick='groupBoxAction(event)'><input name='groupOption' type='checkbox' class='check'/> " +
                            tmpName +
                            "<deletegroupbutton class='groupdeletebutton'/></groupoption>"
                        );
                    }
                }
            });
            filterListHtml = filterListHtml.join('');
            locations.html(filterListHtml);
            groupOptionsHtml = groupOptionsHtml.join('');
            groupList.html(groupOptionsHtml);
            // Inject <hr> tags after each group code to separate them visually
            $("<hr>").insertAfter($('#filterpop').children("[groupCode='CST']").last());
            $("<hr>").insertAfter($('#filterpop').children("[groupCode='TRA']").last());
            $("<hr>").insertAfter($('#filterpop').children("[groupCode='ALL']").last());
            $("<hr>").insertAfter($('#filterpop').children("[groupCode='CAS']").last());
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function removeCustomGroup(groupId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/removeCustomGroup/",
        data: '{"groupId":"' + groupId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
            // Remove the group from the filterlist and group options box
            $('#filterpop').find('[retrieveId="' + groupId + '"][groupCode="CST"]')
                .remove();
            $('#groupoptions').find('groupoption[id="' + groupId + '"]').remove();
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
    $.session.deletedGroupId = groupId;
}

function removeConsumerFromGroup(groupId, consumerId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/removeConsumerFromGroup/",
        data: '{"groupId":"' + groupId + '","consumerId":"' + consumerId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function addConsumerToGroup(groupId, consumerId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/addConsumerToGroup/",
        data: '{"groupId":"' + groupId + '","consumerId":"' + consumerId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function addCustomGroup(groupName, locationId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/addCustomGroup/",
        data: '{"groupName":"' + groupName + '","locationId":"' + locationId +
            '","token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
            var groupList = $('#groupoptions');
            var newGroupId = $('CustomGroupID', res).text();
            // Add New Group to Group Options
            groupList.append("<groupoption id='" + newGroupId +
                "' class='groupoption' members='' onclick='groupBoxAction(event)'><input name='groupOption' type='checkbox' class='check'/> " +
                groupName +
                "<deletegroupbutton class='groupdeletebutton'/></groupoption>");
            // Scroll to new Option
            groupList.scrollTop(groupList.height());
            // Clear out text box
            $('#createGroupTextBox').attr('value', '');
            // Add New List to filter drop down list
            $('#filterpop').append(
                "<a href='#' class='loclink' groupCode='CST' retrieveId='" +
                newGroupId + "' onClick='selectGroup(\"CST\"," + newGroupId +
                ")'>" + groupName + "</a>");
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function updatePortrait(imageFile, id, portraitPath) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/updatePortrait/",
        data: '{"token":"' + $.session.Token + '","employeeUserName":"' + $.session.UserId + '","imageFile":"' + imageFile + '","id":"' + id + '","portraitPath":"' + portraitPath + '"}',
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

function getDefaultAnywhereSettings() {
    var defaultReviewDays = '';
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getDefaultAnywhereSettings/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $('results', res).each(function () {
                $.session.anAdmin = $('administrator', this).text();
                defaultReviewDays = $('setting_value', this).text();
                noteDaysBack = $('notes_days_back', this).text();
                checklistDaysBack = $('checklist_days_back', this).text();
                $.session.applicationName = $('application', this).text();                
                $.session.portraitPath = $('portraitPath', this).text();
                $.session.outcomesPermission = $('outcomesPermission', this).text();
                $.session.dayServicesPermission = $('dayServicesPermission', this).text();
                $.session.caseNotesPermission = $('caseNotesPermission', this).text();
                $.session.singleEntryPermission = $('singleEntryPermission', this).text();
                $.session.workshopPermission = $('workshopPermission', this).text();
                $.session.intellivuePermission = $('intellivuePermission', this).text();
                $.session.schedulingPermission = $('schedulingPermission', this).text();
                $.session.singleEntryApproveEnabled = $('singleEntryApproveEnabled', this).text();
                $.session.singleEntryLocationRequired = $('singleEntryLocationRequired', this).text();
                //Default Location Work
                defaultRosterLocationValue = $('defaultrosterlocation', this).text();
                defaultRosterLocationName = $('defaultrosterlocationname', this).text();
                defaultDayServiceLocationValue = $('defaultdayservicelocation', this).text();
                defaultDayServiceLocationName = $('defaultdayservicelocationname', this).text();
                defaultTimeClockLocationValue = $('defaulttimeclocklocation', this).text();
                defaultTimeClockLocationName = $('defaulttimeclocklocationname', this).text();
                defaultWorkshopLocationValue = $('defaultworkshoplocation', this).text();
                defaultWorkshopLocationName = $('defaultworkshoplocationname', this).text();
                $.session.defaultWorkshopLocation = defaultWorkshopLocationName;
                $.session.defaultWorkshopLocationId = defaultWorkshopLocationValue;
                setDefaultCookies(defaultRosterLocationValue, defaultRosterLocationName, defaultDayServiceLocationValue, defaultDayServiceLocationName,
                    defaultTimeClockLocationValue, defaultTimeClockLocationName, defaultWorkshopLocationValue, defaultWorkshopLocationName);
    
                if (defaultReviewDays != "") {
                    $.session.defaultCaseNoteReviewDays = defaultReviewDays;
                } else {
                    $.session.defaultCaseNoteReviewDays = '7';
                }
                if (noteDaysBack != "") {
                    $.session.defaultProgressNoteReviewDays = noteDaysBack;
                } else {
                    $.session.defaultProgressNoteReviewDays = '7';
                }
                if (checklistDaysBack != "") {
                    $.session.defaultProgressNoteChecklistReviewDays = checklistDaysBack;
                } else {
                    $.session.defaultProgressNoteChecklistReviewDays = '7';
                } 
                $("#casenotesdaysback").val($.session.defaultCaseNoteReviewDays);
                $("#progressnotesdaysback").val($.session.defaultProgressNoteReviewDays);
                $("#progressnoteschecklistdaysback").val($.session.defaultProgressNoteChecklistReviewDays);
                disableModules();
                loadApp("home");
                //if ($.session.applicationName == 'Gatekeeper') {
                //    $("#my_audio").get(0).play();
                //}
            });
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Gets user permissions pertaining to what modules they can see. May need moved.
function getUserPermissions(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/getUserPermissions/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            $.session.permissionString = res;

            //checks if any role of employee has 'y' for viewing casenotes
            if (res.indexOf('<window_name>EnableCaseNotes</window_name><permission>Y</permission>') > -1) {
                $.session.CaseNotesTablePermissionView = true;
            }
            //Check if user is supervisor and can see Admin Single Entry Module
            if (res.indexOf('<window_name>Supervisor</window_name><permission>Y</permission>') > -1) {
                $.session.ViewAdminSingleEntry = true;
            }
            //Update doc time editable
            if ((res.indexOf('<window_name>UpdateDocTime</window_name><permission>Update Doc Time</permission>') > -1) || (res.indexOf('<window_name>Anywhere Case Notes</window_name><permission>Update Doc Time</permission>') > -1)) {
                $.session.UpdateCaseNotesDocTime = true;
            } else {
                $.session.UpdateCaseNotesDocTime = false;
            }
            //View Admin Single Entry Widget
            if (res.indexOf('<window_name>SESupervisorApprove</window_name><permission>Y</permission>') > -1) {
                $.session.SEViewAdminWidget = true;
            }
            setSessionVariables();
            //check to see which modules should be disabled
            checkModulePermissions();
            if (callback) callback();
            $("#userName").text($.session.Name);
            $("#firstName").text($.session.Name);
            $("#lastName").text($.session.LName);
            $('results', res).each(function () {
                //Have not done anything with the results string, but it is coming back across.
            });
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function featureLogging(appName) {
    if (appName != 'roster') {
        var featureDescription = "Anywhere " + appName;
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                "/" + $.webServer.serviceName + "/featureLogging/",
            data: '{"token":"' + $.session.Token + '","featureDescription":"' + featureDescription + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, status, xhr) {
                var res = JSON.stringify(response);
                var test;
            },
            error: function (xhr, status, error) {
                //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
            },
        });
    }
}

//Needs added to demographics ajax when it is created. 
function getConsumerDemographics(consumerId) {
    $("#basicdemowindow").remove();
    loadSimpleDemographicWindow(consumerId);

    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getConsumerDemographics/",
        data: '{"token":"' + $.session.Token + '","consumerId":"' + consumerId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            populateDemographicsData(res, consumerId);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getDemographicsNotes(consumerId) {
    $("#demographicsnoteswindow").remove();
    loadDemographicNotesWindow(consumerId);

    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getDemographicsNotes/",
        data: '{"token":"' + $.session.Token + '","consumerId":"' + consumerId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            populateDemographicsNotesData(res);
            var test;

        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function siteSlothFunctionalityAxax(data, callback) {//token, locationId, consumerId, checkDate
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/checkForIndividualAbsent/",
        //data: '{"token":"' + $.session.Token + '","consumerId":"' + consumerId + '"}',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                var res = JSON.parse(response.checkForIndividualAbsentResult);
                callback(null, res);
            }
            catch (e) {
                callback("There was a problem parsing checkForIndividualAbsentResult");
            }
            
        },
        error: function (xhr, status, error) {
            callback(error, null);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getPSIUserOptionListAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getPSIUserOptionList/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.parse(response.getPSIUserOptionListResult);
            callback(null, res);            
        },
        error: function (xhr, status, error) {
            callback(error, null);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getAllAttachments(data, callback) {//token, locationId, consumerId, checkDate
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getAllAttachments/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            try {
                //console.log(response);
                callback(null, response.getAllAttachmentsResult);
                /*var res = JSON.parse(response.checkForIndividualAbsentResult);
                callback(null, res);
                */
            }
            catch (e) {
                callback("There was a problem parsing checkForIndividualAbsentResult");
            }

        },
        error: function (xhr, status, error) {
            callback(error, null);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function getConsumerScheduleLocationAjax(consumerId) {
    data = {
        token: $.session.Token,        
        consumerId: consumerId
    };
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getConsumerScheduleLocation/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            data = response.getConsumerScheduleLocationResult;            
            populateConsumerScheduleLocationsDropdown(null, data,consumerId);
            populateConsumerScheduleAjax(data[0].id, consumerId);
        },
        error: function (xhr, status, error) {
            callback(error, null);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

function populateConsumerScheduleAjax(locationId, consumerId) {
    data = {
        token: $.session.Token,
        locationId: locationId,
        consumerId:consumerId
    };
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/populateConsumerSchedule/",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {            
            scheduleData = response.populateConsumerScheduleResult;
            populateConsumerSchedule(scheduleData); //not sure how this is working
        },
        error: function (xhr, status, error) {
            callback(error, null);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}