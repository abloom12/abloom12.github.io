function rosterServiceLoad() {
    //restore consumerlist to orginal state
    if ($.pages.rosterconsumerpane != "") {
        $('#consumerpane').html($.pages.rosterconsumerpane);
    }
    $("#rostersettingsbutton").addClass("buttonhighlight");
    getRosterLocations();
    refreshConsumerListHeight();
    // Retrieve cached roster data if available
    if ($.pages.roster != "" || $.pages.rosterconsumerlist != "" || $.banner == true) {
        $('#consumer-container').html($.pages.roster);
        //$('#actioncenter').html($.pages.roster);
        $('#actionbanner').html($.pages.rosterbanner);
        
        $('#consumerpanel').html($.pages.rostertoolbar);
        //$("#datebox").val($.format.date(new Date($.pages.rosterdate), 'MMM dd, yyyy'));
        $("#datebox").val($.format.date(new Date(), 'MMM dd, yyyy'));
        // Initialise the datepicker
        $(function () {
            $('#datebox').mobiscroll().date({
                dateFormat: 'M dd, yyyy',
                theme: 'wp',
                accent: 'steel',
                display: 'bubble',
                mode: 'scroller',
                maxDate: new Date(),
                onShow: function () {
                    $(this).mobiscroll('setDate', new Date($('#datebox').val()),
                        false);
                }
            });
        });
    } else {
        // Initialise the banner HTML
        // Set the default value of the date picker field to today
        $("#datebox").val($.format.date(new Date(), 'MMM dd, yyyy'));
        // Initialise the datepicker
        $(function () {
            $('#datebox').mobiscroll().date({
                dateFormat: 'M dd, yyyy',
                theme: 'wp',
                accent: 'steel',
                display: 'bubble',
                mode: 'scroller',
                maxDate: new Date(),
                onShow: function () {
                    $(this).mobiscroll('setDate', new Date($('#datebox').val()),
                        false);
                }
            });
        });
        // Retrieve the locations

        //Moved up higher in the function on 5/11/2016
        //getRosterLocations();
        //refreshConsumerListHeight();
        //refreshConsumerListHeight();

        $("*").addClass("waitingCursor");
        $("#search").addClass("waitingUnclickable");
        $(".rosterbutton").addClass("waitingUnclickable");
        $(".leftsidemenu").addClass("waitingUnclickable");
        $(".calendaricon").addClass("waitingUnclickable");
        $("#parentboxfordate").addClass("waitingUnclickable");

    }
    $('#actionpane').click(clearPops);
    $("#locationProgressNotes, #locationChecklist").show();
    
}

function populateDefaultStaffLocationBox() {
    var pushStr2 = ""; //"<a href='#' class='loclink' id=0 onClick='setDefaultValue(3,0);'>Last Location</a>";
    tmpId = $('locationbox').attr('locid');
    pushStr2 =
        "<a href='#' class='loclink block' locid='0' residence='Y' onClick='setDefaultValue(1," +
        tmpId + ", event)' ><img class='houseicon' src='./images/new-icons/icon_house.png' />" +
        "Remember Last Location" + "</a>";
    for (var i in $.session.locations) {
        pushStr2 = pushStr2 + "<a href='#' class='loclink' onClick='setDefaultValue(1," + $.session
            .locationids[i] + ", event);'>" + $.session.locations[i] + "</a>";
    }
    $('#locationdefault1pop').html(pushStr2);
}

function populateDefaultDayServiceLocation(xmlLocations) {
    var pushDefault = "";
    var pushStr3 = "";
    // I don't think the IF statement below is needed
    if ($.session.defaultDayServiceLocation == 0) {
        pushDefault = pushDefault + "<colorgreen id=0 >Remember Last Location</colorgreen>";
    }
    tmpId = $('locationbox').attr('locid');
    pushStr3 =
        "<a href='#' class='loclink block' locid='0' residence='Y' onClick='setDefaultValue(3," +
        tmpId + ", event)' ><img class='houseicon' src='./images/new-icons/icon_house.png' />" +
        "Remember Last Location" + "</a>";
    $('location', xmlLocations).each(function () {
        tmpName = $('name', this).text();

        //this is needed because quotes have symbolic meaning in javascript
        var nameWithRemovedQuote = tmpName.replace(/\\['\\]|'/g, function (s) {
            if (s == "'") return "";
            else return s;
        });

        tmpId = $('locationId', this).text();
        tmpId2 = $('ID', this).text();
        tmpRes = $('Residence', this).text();
        if ($.session.defaultDayServiceLocation == tmpId) {
            pushDefault = "<colorgreen id=" + tmpId + ">" + tmpName + "</colorgreen>";
        }
        pushStr3 = pushStr3 + "<a href='#' class='loclink' id=" + tmpId +
            " onClick='setDefaultValue(3," + tmpId + ", event," + '"' + nameWithRemovedQuote + '"' +
            ")'>" + tmpName + "</a>";
    });
    $('#locationdefault3pop').html(pushStr3);
    $.session.defaultDayServiceLocationFlag = readCookie("defaultDayServiceLocationFlag");
    if ($.session.defaultDayServiceLocationFlag == "true" || $.session.defaultDayServiceLocationFlag == null) {
        $("#2").text("Remember Last Location");
    } else {
        $.session.defaultDayServiceLocationName = readCookie('defaultDayServiceLocationName');
        if ($.session.defaultDayServiceLocationName != null && $.session.defaultDayServiceLocationName != "") {
            $("#2").text($.session.defaultDayServiceLocationName.trim());
        } else {
            $("#2").text("Day Service Location");
        }
    }
    populateTimeClockLocations();
    populateWorkshopLocations(xmlLocations);
}

function populateTimeClockLocations() {
    var tar = event.target.id;
    var optionsHtml = [];
    var locations = $('#locationdefault4pop');
    var pushStr = '';
    for (var i in $.session.locations) {
        //if ($.session.StaffLocId != $.session.locationids[i]) {
        pushStr = pushStr + "<a href='#' class='loclink' id=" + tmpId +
            " onClick='setDefaultValue(4," + $.session.locationids[i] + ", event," + '"' + $.session.locations[i] + '"' +
            ")'>" + $.session.locations[i] + "</a>";
        //}
    }
    locations.html(pushStr);
}

function populateWorkshopLocations(xmlLocations) {
    var tar = event.target.id;
    var optionsHtml = [];
    var locations = $('#locationdefault5pop');
    var pushStr = '';
    tmpId = $('locationbox').attr('locid');
    pushStr =
        "<a href='#' class='loclink block' locid='0' residence='Y' onClick='setDefaultValue(5," +
        tmpId + ", event)' ><img class='houseicon' src='./images/new-icons/icon_house.png' />" +
        "Remember Last Location" + "</a>";
    $('location', xmlLocations).each(function () {
        tmpName = $('name', this).text();

        //this is needed because quotes have symbolic meaning in javascript
        var nameWithRemovedQuote = tmpName.replace(/\\['\\]|'/g, function (s) {
            if (s == "'") return "";
            else return s;
        });

        tmpId = $('locationId', this).text();
        tmpId2 = $('ID', this).text();
        tmpRes = $('Residence', this).text();
        if ($.session.defaultWorkshopLocation == tmpId) {
            pushDefault = "<colorgreen id=" + tmpId + ">" + tmpName + "</colorgreen>";
        }
        pushStr = pushStr + "<a href='#' class='loclink' id=" + tmpId +
            " onClick='setDefaultValue(5," + tmpId + ", event," + '"' + nameWithRemovedQuote + '"' +
            ")'>" + tmpName + "</a>";
    });
    locations.html(pushStr);
}

function filterRoster() {
    $("#consumer-container").children().each(function () {
        if ($("#rosterfilter").val().toLowerCase() < 1) {
            $(this).show();
        } else {
            //if there is something in the filter box, then try to filter
            var lastName = $(this).find(".lastnametext").text().toLowerCase();
            var firstLetter = lastName.charAt(0);
            var searchListRecord = lastName.indexOf($("#rosterfilter").val().toLowerCase());
            var searchFirstLetter = $("#rosterfilter").val().toLowerCase().charAt(0);
            if (searchListRecord > -1 && searchFirstLetter == firstLetter) {
                $(this).show();
                //$(this).css("display", "none");
            } else {
                $(this).hide();
                //$(this).css("display", "none");
            }
        }
    });
    $('body').scrollTop(0);
}

function addConsumersToGroups(event) {
    resetGroupListDisplay();
    // Make the group list popup box visible
    $("grouplistpopupbox").show();
    $('grouplistpopupbox').css({
        'top': $(event.target).offset().top + 'px',
        'left': $(event.target).offset().left + 'px'
    });
    // Set the popupbox id to the consumer id
    tmpConsumerId = $(event.target).parent().attr('id');
    $('grouplistpopupbox').attr('id', tmpConsumerId);
    // Prepopulate checkboxes for groups where consumer is already a member of
    $("#groupoptions").children().each(function () {
        groupOption = $(this);
        tmpMembers = groupOption.attr("members");
        var arr = tmpMembers.split('|');
        // Loop through each member
        jQuery.each(arr, function () {
            if (tmpConsumerId == this) {
                // Check the checkbox
                groupOption.children('input').attr("checked", "checked");
                // Break Loop
                return false;
            }
        });
    });
}

function moveConsumerBox(event) {
    var tarId = "";
    var nodeName = "";
    var className = "";
    var Consumer;
    var consumerInfo;
   
    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
        tarId = event.srcElement.id;
        nodeName = event.srcElement.nodeName;
        className = event.srcElement.className;
        Consumer = $(event.srcElement).closest("consumer");
        consumerInfo = $(event.srcElement).closest("consumerInfo");
    } else {
        tarId = $(event.target).attr('id');
        nodeName = event.target.nodeName;
        className = event.target.className;
        Consumer = $(event.target).closest("consumer");
        consumerInfo = $(event.target).closest("consumerInfo");
    }

    var source = consumerInfo.parent().parent().attr('id');
    var source2 = consumerInfo.parent().parent();
    if (source == undefined) {
        source = consumerInfo.parent().parent().parent().attr("id");
    }
    //window.consumerInfo = consumerInfo;
    var consumerId = Consumer.attr('id');
    //alert("boxaction: " + source);
    //if it's not on roster, don't move people between boxes
    if ($.loadedApp != "roster" && $.loadedApp != "singleentry") {
            return;
    }
    if (source == "consumerlist" && $.loadedApp == "roster") {
        Consumer.hide('fast', function () {
            moveConsumerToAvailableList(Consumer);
            (function (event) {
                var datebox = $("#datebox").val();
                var dateboxDateObject = Date.parse(datebox);
                dateboxDateObject = new Date(dateboxDateObject);
                var statusDate = moment(dateboxDateObject).format('YYYY-MM-DD');

                
                return siteSlothFunctionalityAxax({
                    token: $.session.Token,
                    locationId: $('locationbox').attr('locid'),
                    consumerId: consumerId,
                    checkDate: statusDate,
                }, function (err, data) {
                    if (err) return;
                    var isAbsent = data[0].isAbsent;
                    var myConsumer = $("#actioncenter").find("#" + consumerId);
                    if (myConsumer[0]) {
                        if (isAbsent == 0) {
                            $(myConsumer[0]).find(".absenticon").removeClass("isAbsent");
                        }
                        else {
                            $(myConsumer[0]).find(".absenticon").addClass("isAbsent");
                        }
                    }
                });
            })(event)
        });
    } else if (source == "consumerlist" && $.loadedApp == "singleentry") {
        Consumer.hide('fast', function () {
            
            moveConsumerToSingleEntryCard(Consumer);
        });
    }
    //if (source == "actioncenter" && $.loadedApp == "roster") {
    if (source == "consumer-container" || source =="actioncenter") {
        //added to stop IE from added person to roster when the groups button is selected.  Open to better solution. --Joe
        if (tarId == "addConsumer" || tarId == "portraitselection" || className == "demonoteicon") { } else {
            Consumer.hide('fast', function () {
                moveConsumerToActiveList(Consumer);
                if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
                    //do nothing
                } else {
                    sortRosterList();
                }
                
            });
        }
    }
    //MAT - split this and above if statement up for readability 
    if ((source == "consumer-container" || source == "actioncenter") && $.loadedApp == "singleentry") {
        //added to stop IE from added person to roster when the groups button is selected.  Open to better solution. --Joe
        if (tarId == "addConsumer" || tarId == "portraitselection" || className == "demonoteicon") { } else {
            Consumer.hide('fast', function () {
                moveConsumerToActiveList(Consumer);
                if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
                    //do nothing
                } else {
                    sortRosterList();
                }

            });
        }
    }
}

//Added to sort roster list. The sort works but may need to remove in future---
function sortRosterList() {    
    var rosterList = $(".consumerlist").children();
    $("#consumerlist").children().each(function () {
        $(this).css("display", "block");
    });
    rosterList.sort(function (a, b) {
        var aString = a.textContent;
        var aSplit = aString.split(/(?=[A-Z])/);
        var aLastName = aSplit[1];
        var bString = b.textContent;
        var bSplit = bString.split(/(?=[A-Z])/);
        var bLastName = bSplit[1];
        return (aLastName == bLastName) ? 0 : (aLastName > bLastName) ? 1 : -1;
    });
    $(".consumerlist").html("");
    $(".consumerlist").html(rosterList);
}

function getSelectPeopleAsString() {
    var selected = "";
    $("#consumerlist").children().each(function () {
        if (selected.length == 0) {
            selected = $(this).attr("id");
        } else {
            selected = selected + "," + $(this).attr("id"); // "this" is the current element in the loop
        }
    });
    return selected;
}

function home() {
    window.location = "anywhere.html";
}

function isMemberOfCurrentGroup(consumerId) {
    var groupMembers = $('#filtertext').attr('groupmembers');
    var arr = groupMembers.split(',');
    var isMember = false;
    // Loop through each member
    jQuery.each(arr, function () {
        if (consumerId == this) {
            // Check the checkbox
            isMember = true;
            // Break Loop
            return false;
        }
    });
    return isMember;
}

function moveConsumerToActiveList(Consumer) {
    var consumerInfo = Consumer.find("consumerInfo");
    Consumer.removeClass("consumer");
    Consumer.addClass("consumerselected");
    Consumer.removeClass("singleentryselected");
    var img = Consumer.find("img");
    img.removeClass("portrait");
    img.addClass("portraitsselected");
    var namebox = Consumer.find("namebox");
    namebox.removeClass("nametext");
    namebox.addClass("nametextselected");
    var lastname = namebox.find("div");
    lastname.removeClass("lastnametext");
    lastname.addClass("lastnametextselected");
    Consumer.find('.addConsumer').css("display", "none");
    Consumer.find('.portraitselection').css("display", "none");
    consumerInfo.parent().find('spacer').css("display", "none");
    $("#consumerlist").append(Consumer);
    Consumer.show('fast');
    displayWidgetIcons();
    if ($.loadedApp == "singleentry") {
        buttonLogic();
    }
    
}
// Checks to see if consumer is actively selected

function isConsumerInActiveList(consumerId) {
    return $("#consumerlist").children("#" + consumerId).exists();
}

function moveConsumerToAvailableList(Consumer) {
    var consumerId = Consumer.attr('id');
    var consumerInfo = Consumer.find("consumerInfo");
    // If the consumer is a member of the group, add them back to the list or
    // drop them of they aren't a member of the group
    if (isMemberOfCurrentGroup(consumerId)) {
        // Add the consumer to the target list in alphabetical order
        var targetList = $("#actioncenter").find('.personspacer').siblings("consumer");
        var added = false;
        targetList.each(function () {
            if ($(this).find('.nametext').text().toUpperCase() > $(Consumer).find('.nametext').text().toUpperCase()) {
                $(Consumer).insertBefore($(this));
                added = true;
                return false;
            }
        });
        if (!added) {
            $(Consumer).appendTo($("#consumer-container"));
            //$(Consumer).appendTo($(".singleentryrecord"));
        }
        Consumer.find('.addConsumer').css("display", "block");
        Consumer.find('.portraitselection').css("display", "block");
        consumerInfo.parent().find('spacer').css("display", "block");
        Consumer.removeClass("consumerselected");
        Consumer.addClass("consumer");
        var img = Consumer.find("img");
        img.removeClass("portraitsselected");
        img.addClass("portrait");
        var namebox = Consumer.find("namebox");
        namebox.removeClass("nametextselected");
        namebox.addClass("nametext");
        var lastname = namebox.find("div");
        lastname.removeClass("lastnametextselected");
        lastname.addClass("lastnametext");
        Consumer.find('.addConsumer').css("display", "none");
        Consumer.find('.portraitselection').css("display", "none");
        consumerInfo.parent().find('spacer').css("display", "none");
        $(Consumer).show('fast');
        Consumer.find('.portraitselection').css("display", "flex");
        Consumer.find('.addConsumer').css("display", "block");
        //Test
    } else {
        Consumer.remove();
    }
    displayWidgetIcons();
}

//Single Entry Work to move consumer to card
function moveConsumerToSingleEntryCard(Consumer) {
    var consumerId = Consumer.attr('id');
    var consumerInfo = Consumer.find("consumerInfo");
    // If the consumer is a member of the group, add them back to the list or
    // drop them of they aren't a member of the group
    //if (isMemberOfCurrentGroup(consumerId)) {
        // Add the consumer to the target list in alphabetical order
        var targetList = $("#actioncenter").find('.personspacer').siblings("consumer");
        var added = false;
        targetList.each(function () {
            if ($(this).find('.nametext').text().toUpperCase() > $(Consumer).find(
                '.nametext').text().toUpperCase()) {
                $(Consumer).insertBefore($(this));
                added = true;
                return false;
            }
        });
        if (!added) {
            $(Consumer).appendTo($(".singleentryrecord"));
            // Update total consumer count
            
        }
        //Consumer.find('.addConsumer').css("display", "block");
        //Consumer.find('.portraitselection').css("display", "block");
        consumerInfo.parent().find('spacer').css("display", "block");
        Consumer.removeClass("consumerselected");
        Consumer.addClass("consumer");
        Consumer.addClass("singleentryselected");
        var img = Consumer.find("img");
        img.removeClass("portraitsselected");
        img.addClass("portrait");
        var namebox = Consumer.find("namebox");
        namebox.removeClass("nametextselected");
        namebox.addClass("nametext");
        var lastname = namebox.find("div");
        lastname.removeClass("lastnametextselected");
        lastname.addClass("lastnametext");
        //Consumer.find('.addConsumer').css("display", "none");
        //Consumer.find('.portraitselection').css("display", "none");
        consumerInfo.parent().find('spacer').css("display", "none");
        $(Consumer).show('fast');
        //Consumer.find('.portraitselection').css("display", "block");
        //Consumer.find('.addConsumer').css("display", "inline-block");

    //} else {
    //    Consumer.remove();
    //}
        displayWidgetIcons();
        buttonLogic();
}

function moveAllConsumersToAvailableList() {
    //fade out is huge performance hit in large numbers
    var consumerListCount = $("#consumerlist").children();
    if (consumerListCount.length > 500) {
        $("#consumerlist").children().each(function () {
            moveConsumerToAvailableList($(this));
        });
    } else {
        $("#consumerlist").children('Consumer').each(function () {
            $(this).fadeOut('fast', function () {
                moveConsumerToAvailableList($(this));
            });
        });
    }
    setTimeout(function () {
        getConsumersByGroup($("#filtertext").attr("groupcode"), $("#filtertext").attr("retrieveid"), $("#filtertext").text().trim());
    //    getConsumersByGroup($("#filtertext").attr("groupcode"), $("#locationbox").attr("locid"), $("#locationbox").text().trim());
    }, 500);
}

function moveAllConsumersToActiveList() {
    //fade out is huge performance hit in large numbers
    var actioncenterCount = $("#consumer-container").children();
    if (actioncenterCount.length > 500) {
        $("#consumer-container").children('Consumer').each(function () {
            moveConsumerToActiveList($(this));
        });
    } else {
        $("#consumer-container").children('Consumer').each(function () {
            $(this).fadeOut('fast', function () {
                moveConsumerToActiveList($(this));
                //Removed the sort from here for now. Not sure if the benefit is worth the time at this moment.
                //sortRosterList();
            });
        });
    }

} 

function groupBoxAction(event) {
    var group = $(event.target).closest('GROUPOPTION');
    var groupId = group.attr('id');
    var consumerId = group.parent().parent().attr('id');

    if (event.target.nodeName == "DELETEGROUPBUTTON") {
        return Anywhere.promptYesNo("Are you sure you wish to delete this group?", function () {
            removeCustomGroup(groupId);
        });
        //removeCustomGroup(groupId);
        //return;
    }
    // Toggle Check/Uncheck
    if (group.children('input').attr('checked') == 'checked') {
        // Uncheck
        if (event.target.nodeName != "INPUT") {
            group.children('input').removeAttr('checked');
        }
    } else {
        // Check
        if (event.target.nodeName != "INPUT") {
            group.children('input').attr("checked", "checked");
        }
    }
    // Add/Remove Consumer From Group
    if (group.children('input').attr('checked') == 'checked') {
        // Add Consumer To Group
        addConsumerToGroup(groupId, consumerId);
        // Add Consumer to members attribute
        tmpMembers = group.attr("members");
        var arr = tmpMembers.split('|');
        arr.push(consumerId);
        members = arr.join('|');
        group.attr("members", members);
    } else {
        // Remove Consumer From Group
        removeConsumerFromGroup(groupId, consumerId);
        // Remove Consumer from members attribute
        tmpMembers = group.attr("members");
        var arr = tmpMembers.split('|');
        arr = jQuery.grep(arr, function (value) {
            return value != consumerId;
        });
        members = arr.join('|');
        group.attr("members", members);
    }
}

function showGroupInput() {
    $('#createGroupLink').css("display", "none");
    $('#createGroupInputBox').css("display", "block");
    //for some reason focus() is failing on tablets.  This is duct tape fix
    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla" || $.session.browser == "Chrome") {
        $('#createGroupTextBox').focus();
    }
}

function hideGroupInput() {
    $('#createGroupLink').css("display", "block");
    $('#createGroupInputBox').css("display", "none");
}

function createGroup(event) {
    var locationId = $('#locationbox').attr('locid');
    var groupName = $('#createGroupTextBox').attr('value');
    if (groupName.length > 2) {
        addCustomGroup(groupName, locationId);
    }
}

function popLocation(event) {
    if ($("#locationpop").css("display") == "none") {
        $("#locationpop").css("display", "block");
    } else {
        clearPops(event);
    }
}

function popLocationStaffClock(event) {
    if ($.session.locations.length < 2) return;
    //if ($.session.DenyStaffClockUpdate) return;      Ticket asked for deny timeclock to be able to edit location
    if ($("#locationpop").css("display") == "none") {
        getTimeClockInput2(event);
        $("#locationpop").css("display", "block");
        $("#arr").css("display", "block");
    } else {
        clearPops(event);
    }
}

function popFilter(event, groupId) {
    if ($("#filterpop").css("display") == "none") {
        $("#filterpop").css("display", "block");
    } else {
        clearPops(event);
    }
}

function clearPops(event) {
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
        //fixes issue with closing menus without allow scroll
        if (event.type == "click") {
            if (nodeName == "A" || tarId == "locationpop") {
                return;
            }
        }
        //alert($.session.browser);
        // alert("clicked: event.target.id=" + event.srcElement.id + " $(event.target).attr('id'):" + $(event.target).attr('id'));
        //alert("event.target.nodeName=" + event.target.nodeName + " $(event.target).attr('class')=" + $(event.target).attr('class'));
        //alert("clicked: event.target.id=" + event.target.id + " \n event.target.nodeName=" + event.target.nodeName + " \n  $(event.target).parent().attr('id')=" + $(event.target).parent().attr('id') + " \n $(event.target).parent().parent().parent().attr('id')=" + $(event.target).parent().parent().parent().attr('id'));
        if (nodeName == "ICON" || nodeName == "GROUPLISTPOPUPBOX" || event.srcElement.className ==
            "groupoption" || className == "check" || tarId == "createGroupLink" || tarId ==
            "createGroupTextBox" || nodeName == "CREATEGROUPBUTTON" || nodeName ==
            "DELETEGROUPBUTTON") {
            //do nothing
        } else {
            // Hide the group list box
            $("grouplistpopupbox").css("display", "none");
        }
        if (tarId == "locationicon" ||
            tarId == "settings" ||
            tarId == "rostersettingstext" ||
            tarId == "help" ||
            tarId == "settingsheader" ||
            tarId == "settingsbox" ||
            tarId == "cnpersonalprefs" ||
            //should probably just use defined className var?
            event.srcElement.className == "settingstext" ||
            event.srcElement.className == "locationsettingstext" ||
            event.srcElement.className == "defaultselection boxvert" ||
            event.srcElement.className == "settingsicon rostermenubutton buttonhighlight" ||
            event.srcElement.className == "loclink noblock" ||
            event.srcElement.className == "loclink block" ||
            tarId == "locationbox" ||
            nodeName == "STAFFLOCATION" ||
            nodeName == "LOCATIONPOPUPBOX" ||
            tarId == "headertext")
        {
            //do nothing
        } else {
            $("#helpbox").css("display", "none");
            $("#settingsbox").css("display", "none");
            $("#locationsettingspop").css("display", "none");
            $("locationpopupbox").css("display", "none");
            //resizeActionCenter();
        }
        if (event.srcElement.parentNode != null) {
            if (event.srcElement.parentNode.tagName == "LOCATIONPOPUPBOX" || event.srcElement.parentNode
                .tagName == "TOPBAR") {
                //$("#settingsbox").css("display", "block");
                $("locationpopupbox").css("display", "none");
            }
        }
    }
    if (tarId == "locationbox" || tarId == "locationdownarrow" || tarId == "headertext" ||
        tarId == "locationbox" || tarId == "locationicon" || nodeName == "STAFFLOCATION") {
        //do nothing
    } else {
        $("#locationpop").css("display", "none");
    }
    if (tarId == "filterbox" || tarId == "filterdownarrow" || tarId == "filtericon" || tarId ==
        "filtertext") {
        //do nothing
    } else {
        $("#filterpop").css("display", "none");
    }

    if (tarId == "basicdemowindow" || className == "simpledemoicon" || className == "allrelationshipscontainer" ||
	    className.indexOf("demo") > -1 || className == "basicdemowindowtablet") {
        //do nothing
    } else {
        $("#basicdemowindow").remove();
    }

    if (tarId == "demographicsnoteswindow" || className == "demonoteicon" || className == "allrelationshipscontainer" ||
    className.indexOf("demo") > -1 || className == "basicdemowindowtablet") {
        //do nothing
    } else {
        $("#demographicsnoteswindow").remove();
    }
    //var t = $('.goalsnote').is(":visible");
    // goals card flip back to front
    if ((tarId == "actioncenter" || tarId == "actionpane") && !$('.goalsnote').is(":visible")) {
        //if ((tarId == "actioncenter" || tarId == "actionpane")) {
        var t = document.querySelector(".flipped");
        if (t != null) {            
            z = t.parentNode.id;
            //This line below works to see if the save button is on the screen. I added the alert to test.
            //This is called when clicking off the card.
            // Needs to be in goals.js not roster since it has nothing to do with roster.
            //if ($('#goalsavebutton').css('display') !== 'none') {
            test = $('*').find('.card').hasClass('flipped');
            if (test && $('*').find('.card.flipped').find('#goalsavebutton').css('display') !== 'none') {
                // show popup
                $.fn.PSmodal({
                    body: "Would you like to save your changes?",
                    immediate: true,
                    buttons: [
                        {
                            text: "Yes",
                            callback: function (event) {
                                $(".modalcontainer").hide();
                                $('.card.flipped').find('#goalsavebutton').click();
                                //var cardBack = t.querySelector(".cardback");
                                //var goalId = cardBack.getAttribute("goalid");
                                //var objId = cardBack.getAttribute("objid");

                                //goalValidateForSave(event, 1272, 7856, undefined);
                            }
                        },
                        {
                            text: "No",
                            callback: function () {
                                flipCardToFront(z);
                                $('.card.flipped').find('.result-picker .selected').children().css('background-color', '#70b1d8');
                                $('.card.flipped').children().removeClass("selected");
                                $('.card.flipped').find('.result-picker').children().css('width', '22px');
                                $('.card.flipped').find('#goalsavebutton').css('display', 'none');
                                $(".modalcontainer").hide();
                            }
                        }
                    ]
                });
            } else {
                $('.card.flipped').find('.result-picker .selected').children().css('background-color', '#70b1d8');
                $('.card.flipped').children().removeClass("selected");
                $('.card.flipped').find('.result-picker').children().css('width', '22px');
                $('.card.flipped').find('#goalsavebutton').css('display', 'none');
                flipCardToFront(z);
            }
            
        } else {
            $('.card').removeClass('flipped');
        }
        
        //t.parentNode.classList.remove("goalhistselected");        
        
        
        
        if ($.browser.mozilla || $.browser.msie) {
            $(".cardfront").removeClass("forceflip");
            $(".cardback").addClass("forceflip");
        }
    }
    if (tarId == "actioncenter" || tarId == "actionpane") {
        $('#filterpop').hide();
        $('#basicdemowindow').hide();
    }


}

function resetGroupListDisplay() {
    // Scroll to top of options
    $('#groupoptions').scrollTop(0);
    hideGroupInput();
    $('#createGroupTextBox').attr('value', '');
    // Reset all checkboxes
    $("#groupoptions").children().each(function () {
        $(this).children('input').removeAttr('checked');
    });
}

function displayWidgetIcons() {
    //alert($("#consumerlist").children().length);
    if ($("#consumerlist").children().length > 0) {
        $("#hpc").removeClass("hidden");
        $("#hpc").addClass("visible");
        $("#day").removeClass("hidden");
        $("#day").addClass("visible");
        if (!$.session.DayServiceView == false) $("#day").css("-webkit-filter", "grayscale(0%)");
        $("#goals").removeClass("hidden");
        $("#goals").addClass("visible");
        $("#notes").removeClass("hidden");
        $("#notes").addClass("visible");
    }
    if ($("#consumerlist").children().length == 0) {
        $("#hpc").removeClass("visible");
        $("#hpc").addClass("hidden");
        $("#day").removeClass("visible");
        $("#day").addClass("hidden");
        $("#day").css("-webkit-filter", "grayscale(100%)");
        $("#goals").removeClass("visible");
        $("#goals").addClass("hidden");
        $("#notes").removeClass("visible");
        $("#notes").addClass("hidden");
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function extendSearchBox() {
    $('#searchbox').addClass('searchboxextended');
    $('#rosterfilter').addClass('searchinputextended');
    $('#cancelsearch').addClass('cancelsearchextended');
    $('#rosterfilter').focus();
}

function hideSearchBox() {
    $('#rosterfilter').val('');
    filterRoster();
    $('#searchbox').removeClass('searchboxextended');
    $('#rosterfilter').removeClass('searchinputextended');
    $('#cancelsearch').removeClass('cancelsearchextended');
}

function popCalendarBox() {
    $("#parentboxfordate").blur();
    $('#datebox').mobiscroll('show');
    return false;
}

function sendPortrait(e, id) {
    var imageId = "img" + id;
    e.preventDefault();
    $("#" + imageId).attr("src", URL.createObjectURL(event.target.files[0]));

    //canvasy things to avoid reading direct file
    var canvas = document.createElement('canvas');
    canvas.height = 127;
    canvas.width = 150;
    var ctx = canvas.getContext('2d');
    var imageObj = new Image(152, 127);
    imageObj.onload = function () {
        if (checkOrientation() == "landscape") {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(imageObj, -imageObj.width / 2, -imageObj.height / 2, 152, 127);
            ctx.rotate(-Math.PI / 2);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            //ctx.drawImage(imageObj, 0, 0, 152, 127);
        }
        else {
            ctx.drawImage(imageObj, 0, 0, 152, 127);
        }
        

        var srcData = canvas.toDataURL('image/jpeg');
        srcData = srcData.replace("data:image/jpeg;base64,", "");
        updatePortrait(srcData, id, $.session.portraitPath);
    };
    imageObj.src = $("#" + imageId).attr("src");
    ctx.drawImage(imageObj, 0, 0, 152, 127);
}

function populateDemographicsData(res, consumerId) {
    $('results', res).each(function () {
        var fullName = $('firstname', this).text();
        fullName = fullName + " ";
        fullName = fullName + $('lastname', this).text();// + "</br>";

        // Containers
        var infoAndAttachmentsHolder = $("<div>").appendTo($("#basicdemowindow")).attr("id", "infoAndAttachmentsHolder");
        var infographicsHolder = $("<div>").appendTo(infoAndAttachmentsHolder).attr("id", "infographicsHolder");
        var attachmentsHolder = $("<div>").appendTo(infoAndAttachmentsHolder).attr("id", "attachmentsHolder").hide();
        var scheduleHolder = $("<div>").appendTo(infoAndAttachmentsHolder).attr("id", "scheduleHolder").hide();
        var consumerScheduleContainer = $("<div>").attr("id", "consumerScheduleContainer").appendTo(scheduleHolder);

        // Buttons
        var infoButtonHolder = $("<div>").appendTo($("#basicdemowindow")).attr("id", "infoButtonHolder");
        var showInfoButton = $("<div id='infographicsLI'><span class='myImg'></span><span>Demographics</span></div>").appendTo(infoButtonHolder).click(function (e) {
            attachmentsHolder.hide();
            scheduleHolder.hide();
            infographicsHolder.show();
        });
        var showAttachmentsButton;
        var intellivueButton;
        var showScheduleButton;
        var buttonsArray;

        
        //I do it this way so I have the full name without the <br /> in it - JDL 2018-03-01
        (function (fullName) {
            showAttachmentsButton = $("<div id='attachmentsLI'><span class='myImg'></span><span>Attachments</span></div>").appendTo(infoButtonHolder).click(function (e) {
                //console.log(e.target);
                attachmentsHolder.show().html("Loading...");
                infographicsHolder.hide();
                scheduleHolder.hide();
                getAllAttachments({ token: $.session.Token, consumerId: consumerId }, function (err, data) {
                    if (err) throw err;
                    //console.log(data);
                    if (!data.length) {
                        attachmentsHolder.html("No attachments found")
                    }
                    else {
                        attachmentsHolder.html("");
                        attachmentsHolder.append($("<div>").html(fullName + " - Attachments"));
                        var tbody = $("<table class='attachmentsTable'><tbody></tbody></table>").appendTo(attachmentsHolder).find("tbody");
                        data.forEach(function (attachment) {
                            var tr = $("<tr>");
                            var filename = attachment.filename;
                            var id = attachment.attachmentid;
                            var name = filename.split(".");
                            var ext = name.pop();
                            name = name[0];
                            //name.pop();

                            tr.append($("<td>").addClass("attachmentCell").html(name).click(function (e) {
                                var form = $("<form />", {
                                    action: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getIndividualAttachment/",
                                    method: "POST",
                                    target: "_blank",
                                    enctype: "application/json"
                                });
                                form.hide().append("<input name='token' id='token' value='" + $.session.Token + "' />");
                                form.append("<input name='attachmentId' id='attachmentId' value='" + id + "' />");
                                form.appendTo($("body"));
                                form.submit();
                            }));
                            tr.append($("<td>").html(ext));
                            tr.appendTo(tbody);
                        });
                    }
                });
            });
            if ($.session.intellivuePermission != '') {
                intellivueButton = $("<div class='intellivueBtn' id='" + consumerId + "'><span class='myImg'></span><span>Intellivue</span></div>").appendTo(infoButtonHolder).click(function (e) {
                    //console.log(e.target);
                    loadApp("documentview", e);
                });
            }
            if ($.session.viewLocationSchedulesKey) {
                showScheduleButton = $('<div id="scheduleLI"><span class="myImg"></span><span>Schedule</span></div>').appendTo(infoButtonHolder).click(function (e) {
                    attachmentsHolder.hide();
                    infographicsHolder.hide();
                    scheduleHolder.show();
                    getConsumerScheduleLocationAjax(consumerId);
                });
            }
            
        })(fullName);

        if ($.session.DemographicsViewAttachments == true) {
            $("#attachmentsLI").show();
        }

        [infographicsHolder, attachmentsHolder, infoButtonHolder, scheduleHolder].forEach(function (el) {
            el.click(function (e) {
                e.stopPropagation();
            })
        });

        if (showScheduleButton) {
            buttonsArray = [showInfoButton, showAttachmentsButton, showScheduleButton];
        } else {
            buttonsArray = [showInfoButton, showAttachmentsButton];
        }

        buttonsArray.forEach(function (el) {
            el.click(function () {
                buttonsArray.forEach(function (el2) {
                    el2.children(".myImg").css("borderColor", "#cfe371");
                })
                el.children(".myImg").css('borderColor', 'red')
            })
        });

        showInfoButton.click();

        fullName += "<br />"
        infographicsHolder.html(fullName).append(
            "<div class='demoaddresscontainer'>" +

                "<div class='demoaddressrow'>" +
                  "<label class='demolabel'>Address:</label> " +
                  "<label id='demoaddress' class='demodata'>&nbsp;</label>" +
                  "<label id='demoaddresstwo' class='demodata'>&nbsp;</label>" +
                "</div>" +

                "<div class='demoaddressrow'>" +
                  "<label class='demolabel'>City:</label>" +
                  "<label id='democity' class='demodata'>&nbsp;</label>" +

                  "<label class='demolabel'>State:</label>" +
                  "<label id='demostate' class='demodata'>&nbsp;</label>" +

                  "<label class='demolabel'>Zip Code:</label>" +
                  "<label id='demozipcode' class='demodata'>&nbsp;</label>" +
                "</div>" +
            
            "</div> </br>" +

             "<div class='demophonecontainer'>" +
                "<label class='demolabel'>#1 Phone:</label> " +
                "<label id='demoprimaryphone' class='demodata'>&nbsp;</label>" +

                "<label class='demolabel'>#2 Phone:</label>" +
                "<label id='demosecondaryphone' class='demodata'>&nbsp;</label>" +
            "</div></br>"
        );

        var test = $('firstname', this).text();
        var test2 = $('addressone', this).text();
        $('#demofirstname').text($('firstname', this).text());
        $('#demolastname').text($('lastname', this).text());
        $('#demonickname').text($('nickname', this).text());
        var primaryPhone = $('primaryphone', this).text();
        primaryPhone = primaryPhone.substring(0, 3) + '-' + primaryPhone.substring(3, 6) + '-' + primaryPhone.substring(6);
        //$('#demoprimaryphone').text($('primaryphone', this).text());
        $('#demoprimaryphone').text(primaryPhone);
        var secondaryPhone = $('secondaryphone', this).text();
        secondaryPhone = secondaryPhone.substring(0, 3) + '-' + secondaryPhone.substring(3, 6) + '-' + secondaryPhone.substring(6);
        //$('#demosecondaryphone').text($('secondaryphone', this).text());
        $('#demosecondaryphone').text(secondaryPhone);
        $('#demoaddress').text($('addressone', this).text());
        var test3 = $('addresstwo', this).text();
        if (test3 != '') {
            $("#demoaddresstwo").css("display", "block");
            $(".demolabeladdtwo").css("display", "block");
        }
        $('#demoaddresstwo').text($('addresstwo', this).text());
        $('#democity').text($('mailcity', this).text());
        $('#demostate').text($('mailstate', this).text());
        //Format the zip code
        var tmpZip = $('mailzipcode', this).text();
        if (tmpZip.length > 5) {
            tmpZip = [tmpZip.slice(0, 5), '-', tmpZip.slice(5)].join('');
        }
                
        $('#demozipcode').text(tmpZip);
        //$('#demozipcode').text($('mailzipcode', this).text());
        $('#demoemail').text($('email', this).text());
        infographicsHolder.append("<div class='allrelationshipscontainer'></div>")
        $('relationship', res).each(function () {
            var relationshipDisplayName = '';
            var tempRelationshipFirstName = $('relationfirstname', this).text();
            var tempRelationshipLastName = $('relationlastname', this).text();
            var tempRelationshipCompany = $('relationcompanyname', this).text();
            var tempRelationshipPrimaryPhone = $('relationprimaryphone', this).text();
            //phonenumber work
            tempRelationshipPrimaryPhone = tempRelationshipPrimaryPhone.substring(0, 3) + '-' + tempRelationshipPrimaryPhone.substring(3, 6) + '-' + tempRelationshipPrimaryPhone.substring(6);
            var tempRelationshipType = $('description', this).text();
            var tempRelationshipFullName = tempRelationshipFirstName + " " + tempRelationshipLastName;
            if (tempRelationshipFullName == " ") {
                relationshipDisplayName = tempRelationshipCompany;
            } else if (tempRelationshipCompany == ""){
                relationshipDisplayName = tempRelationshipFullName;
            } else {
                relationshipDisplayName = tempRelationshipFullName + ' - ' + tempRelationshipCompany;
            }

            $(".allrelationshipscontainer").append(
                "<div class='demorelationshipscontainer'>" +
                    "<div class='demorelationshiprow'>" +
                        "<label class='demolabel'>Relation:</label>" +
                        "<label class='demodata relationtype'>" + tempRelationshipType + "&nbsp;</label>" +
                    "</div>" +

                    "<div class='demorelationshiprow'>" +
                        "<label class='demolabel'>Name:</label>" +
                        "<label class='demodata relationname'>" + relationshipDisplayName + "&nbsp;</label>" +
                    "</div>" +

                    "<div class='demorelationshiprow'>" +
                        "<label class='demolabel'>Phone:</label>" +
                        "<label class='demodata relationphone'>" + tempRelationshipPrimaryPhone + "&nbsp;</label>" +
                    "</div>" +

                "</div>"
            )
            
            //$('#relationtype').text(tempRelationshipType);
            //$('#relationname').text(tempRelationshipFullName);
            //$('#relationphone').text(tempRelationshipPrimaryPhone);

        });
        //Note work. There is no note date for Gatekeeper       
        if ($.session.applicationName == 'Gatekeeper') {
            var note = $('notes', this).text();
            note = removeUnsavableNoteText(note);
        } else {
            $('notedata', res).each(function () {
                var note = $('note', this).text();
                note = removeUnsavableNoteText(note);
                var noteDate = $('notedate', this).text();
            });
        }

        if ($.session.DemographicsBasicDataView === true) {
            //show basic demographic info
            $(".demoaddresscontainer").css("display", "block");
            $(".demophonecontainer").css("display", "block");
        }

        if ($.session.DemographicsRelationshipsView === true) {
            //show demographic relationships
            $(".allrelationshipscontainer").css("display", "block");
        }
    });
}

function populateDemographicsNotesData(res) {
    //Note work. There is no note date for Gatekeeper       
    if ($.session.applicationName == 'Gatekeeper') {
        $('notedata', res).each(function () {
            //var note = $('notes', this).text();
            //note = removeBadNoteTextToDisplay(note);
            //$("#demographicsnoteswindow").append("<textarea id='demonotestextarea' disabled>" + note + "</textarea>");
            var note = $('note', this).text();
            note = removeBadNoteTextToDisplay(note);
            var noteType = $('notetype', this).text();
            var date = $('notedate', this).text();
            if (date == "") {
                date = '00/00/00';
            } else {
                date = $.format.date(new Date(date), 'MM/dd/yy');
            }
            $("#demographicsnoteswindow").append("<p class='notetype'>Type: " + noteType + "</p>");
            $("#demographicsnoteswindow").append("<div><textarea id='demonotestextarea' disabled>" + note + "</textarea></div>");
            $("#demographicsnoteswindow").append("<p class='notedate'>" + date + "</p></br>");
        });
    } else { //Advisor
        $('notedata', res).each(function () {         
            var note = $('note', this).text();
            note = removeBadNoteTextToDisplay(note);
            var noteType = $('notetype', this).text();
            var date = $('notedate', this).text();
            if (date == "") {
                date = '00/00/00';
            }else{
                date = $.format.date(new Date(date), 'MM/dd/yy');
            }           
            $("#demographicsnoteswindow").append("<p class='notetype'>Type: " + noteType + "</p>");
            $("#demographicsnoteswindow").append("<div><textarea id='demonotestextarea' disabled>" + note + "</textarea></div>");
            $("#demographicsnoteswindow").append("<p class='notedate'>" + date + "</p></br>");
        });
    }
}

function loadSimpleDemographicWindow(consumerId) {
    var basicDemoWindow = null, consumerCard = null, offset = null, windowWidth = null;
    
    $("consumer").each(function () {
        if ($(this).attr("id") == consumerId) {
            consumerCard = $(this)
        }
    });
    if (consumerCard != null) {
        basicDemoWindow = "<div id='basicdemowindow' class='basicdemowindow'></div>";
        offset = consumerCard.offset();
        windowWidth = window.innerWidth;

        if (offset.left > 750) {
            basicDemoWindow = "<div id='basicdemowindow' class='basicdemowindowshifted'></div>"
        }

        if (windowWidth < 1370) {
            basicDemoWindow = "<div id='basicdemowindow' class='basicdemowindowtablet'></div>"
        }
        consumerCard.append(basicDemoWindow);
    }
}

function loadDemographicNotesWindow(consumerId) {
    var noteWindow;
    noteWindow = "<div id='demographicsnoteswindow' class='demographicsnoteswindow'>" +
        "<h3 class='notetitle'>Notes</h3>" +
        "</div>";
    var consumerCard = $("#" + consumerId)[0];
    var offset = $(consumerCard).offset();
    var windowWidth = window.innerWidth
    if (offset.left > 750) {
        noteWindow = "<div id='demographicsnoteswindow' class='demographicsnoteswindowshifted'>" +
        "<h3 class='notetitle'>Notes</h3>" +
        "</div>";
    }

    if (windowWidth < 1370) {
        noteWindow = "<div id='demographicsnoteswindow' class='demographicsnoteswindowtablet'>" +
        "<h3 class='notetitle'>Notes</h3>" +
        "</div>";
    }
    $("#" + consumerId).append(noteWindow);
}

// turns off modules customers did not purchase. Links to modules table.
function disableModules() {
    if ($.session.applicationName == 'Gatekeeper') {
        $('#singleentrysettingsdiv').css('display', 'none');
        $('#adminsingleentrysettingsdiv').css('display', 'none');
        $('#customlinks').css('display', 'none');
    }

    if ($.session.dayServicesPermission == "Anywhere_DayServices") {
        // leave module on
    } else {
        $("#dayservicesettingsdiv").css("display", "none");
    }

    if ($.session.outcomesPermission == "Anywhere_Outcomes") {
        // leave module on
    } else {
        $("#goalssettingsdiv").css("display", "none");
        //MAT - commented this out because it is in wrong spot.
        //$("#singlebuttondiv").css("display", "none");
    }
    
    if ($.session.workshopPermission == "Anywhere_Workshop") {
        // leave module on
    } else {
        $("#workshopsettingsdiv").hide();
    } 

    if ($.session.intellivuePermission == "Intellivue") {
        // leave module on
    } else {
        $("#intellivuesettingsdiv").hide();
    }

    if ($.session.caseNotesPermission == "Anywhere_CaseNotes") {
        // leave module on
    } else {
        $("#casenotessettingsdiv").css("display", "none");
    }

    if ($.session.singleEntryPermission == "Anywhere_SingleEntry") {
        // leave module on
    } else {
        $("#singleentrysettingsdiv").css("display", "none");
    }

    if ($.session.singleEntryApproveEnabled == 'Y') {
        //Leave module on
    } else {        
        //$("#adminsingleentrysettingsdiv").css("display", "none");
    }
}

function setDefaultCookies(defaultRosterLocationValue, defaultRosterLocationName, defaultDayServiceLocationValue, defaultDayServiceLocationName,
                    defaultTimeClockLocationValue, defaultTimeClockLocationName, defaultWorkshopLocationValue, defaultWorkshopLocationName) {
    createCookie('defaultDayServiceLocation', defaultDayServiceLocationValue, 7);
    createCookie('defaultDayServiceLocationName', defaultDayServiceLocationName, 7);
    createCookie('defaultDayServiceLocationNameValue', defaultDayServiceLocationValue, 7);
    if (defaultDayServiceLocationName == 'Remember Last Location') {
        createCookie('defaultDayServiceLocationFlag', true, 7);
    } else {
        createCookie('defaultDayServiceLocationFlag', false, 7);
    }    
    createCookie('defaultRosterLocation', defaultRosterLocationValue, 7);
    createCookie('defaultRosterLocationName', defaultRosterLocationName, 7);
    if (defaultRosterLocationName == 'Remember Last Location') {
        createCookie('defaultRosterLocationFlag', true, 7);
    } else {
        createCookie('defaultRosterLocationFlag', false, 7);
    }
    if (defaultWorkshopLocationName == 'Remember Last Location') {
        createCookie('defaultWorkshopLocationFlag', true, 7);
    } else {
        createCookie('defaultWorkshopLocationFlag', false, 7);
    }
    createCookie('defaultTimeClockLocationName', defaultTimeClockLocationName, 7);
    createCookie('defaultTimeClockLocationValue', defaultTimeClockLocationValue, 7);
    createCookie('defaultWorkshopLocationName', defaultWorkshopLocationName, 7);
    createCookie('defaultWorkshopLocationValue', defaultWorkshopLocationValue, 7);
}

function combineConsumersAndNotes(JSONres, res, locationId, locationName, dateboxDateObject, absentData) {
    //console.log(JSON.parse(JSONres.selectAllUsersConsumersNotesResult));
    var optionsHtml = [];
    var actioncenter = $('#actioncenter');
    var consumerContainer = $("<div>").attr("id", "consumer-container");
    var groupMembers = "";
    var inactiveDate;
    var testDateConversion;
    var consumerCount = 0;
    $.roster.moveable = false;
    $("#noconsumermessage").remove();
    var hasNote = JSONres.map(function (el) { return el.c_id; });
    var hasAbsentArr = absentData.map(function (el) { return el.consumer_id; });

    if (locationName.toUpperCase().trim() === "ALL") {
        $("#multipleAbsent").hide();
    }
    else {
        $("#multipleAbsent").show();
    }
    //JDL 2018/02/09 - May use this in the future
    //if ($.session.applicationName == 'Gatekeeper') {
    //    $("#multipleAbsent").hide();
    //}

    //this loop should be rewritten.  It is functional but unclear
    $('c', res).each(function () {
        tmpId = $('id', this).text();
        tmpFName = $('FN', this).text();
        tmpLName = $('LN', this).text();
        tmplocID = $('LId', this).text();
        tmpInactiveDate = $('IDa', this).text();
        statusDate = $('SD', this).text();
        var hasProgressNote = false;
        if (hasNote.indexOf(tmpId) > -1) hasProgressNote = true;

        var hasAbsent = false;
        if (hasAbsentArr.indexOf(tmpId) > -1) hasAbsent = true;

        var hasCheckList = false;//Math.random() >= 0.5;

        //convert string date to Date object
        if (tmpInactiveDate != "") {
            // make sure not to convert "A" or "I" from gatekeeper as a date
            testDateConversion = new Date(tmpInactiveDate);
            if (testDateConversion instanceof Date) {
                inactiveDate = testDateConversion;
            }
        }

        if (statusDate != "") {
            statusDate = Date.parse(statusDate)
            statusDate = new Date(statusDate);
        }

        if (groupMembers == "") {
            groupMembers = tmpId;
        } else {
            groupMembers = groupMembers + ',' + tmpId;
        }
        // Do not add the consumer on the left if they already exist on the right
        var result = isConsumerInActiveList(tmpId);
        if (!result && (tmpInactiveDate == "" || inactiveDate > dateboxDateObject || (tmpInactiveDate == "A" && (statusDate < dateboxDateObject)))) {  //empty inactive date means there is no inactive date in DB for advisor.  "A" and null means acitve in GK.  
            optionsHtml.push(combineConsumersWithLocations(tmpId, locationId, tmplocID, tmpLName, tmpFName, hasProgressNote, hasCheckList, locationName, dateboxDateObject, hasAbsent));
        }


    }); //end for each
    consumerCount = optionsHtml.length;
    optionsHtml = optionsHtml.join('');
    $.session.concountocerride = false;
    if (optionsHtml == "" && $.session.infiniteLoopFlag == false) {
        $("#consumer-container").html("");
        //$("#actioncenter").html("");
        getConsumersByGroup($("#filtertext").attr("groupcode"), $("#filtertext").attr("retrieveid"), $("#filtertext").text().trim());
        //$('*').removeClass('isAbsent');
        $.session.concountocerride = true;
        $.session.infiniteLoopFlag = true;
    } else {
        $.session.concountocerride = false;
        $.session.infiniteLoopFlag == false;
        if ($("#consumer-container").length === 0) {
            consumerContainer.appendTo(actioncenter);
        }
        $("#consumer-container").html(optionsHtml);
    }
    
    /*"<controlarea class='controlarea'><toolbar class='toolbar floatright'>" +
                       "<moveAllButton class='rosterbutton doubleright' onClick='moveAllConsumersToAvailableList()'></moveAllButton><movetext class='movetext'>Move All</movetext>" +
                       "<moveAllButton class='rosterbutton doubleleft' onClick='moveAllConsumersToActiveList()'></moveAllButton>" +
                       "</toolbar></controlarea><hr class='style-two'/>" +
                       "<spacer class='personspacer'></spacer>" + optionsHtml); */
    // No consumers found
    if ($('c', res).length == 0) {
        //actioncenter.append("<warning class='warning'>None of the consumers in this group are assigned to " + $("#locationbox").text() + " for " + $("#datebox").val() + ".</warning>");
    }
    $('#filtertext').attr('groupMembers', groupMembers);

    $("*").removeClass("waitingCursor");
    if (consumerCount > 2500) {
        $.roster.moveable = false;
        $("#search").addClass("waitingUnclickable");
        $(".rosterbutton").addClass("waitingUnclickable");
        $(".leftsidemenu").addClass("waitingUnclickable");
        $(".calendaricon").addClass("waitingUnclickable");
        $("#parentboxfordate").addClass("waitingUnclickable");
        alert("The selected location contains " + consumerCount + " active consumers. Please select a location with no more than 2500 active consumers.");
    } else if (consumerCount === 0 && groupMembers == "" && !$.session.concountocerride) {
        $.roster.moveable = true;
        // Changed 8/20
        //actioncenter.append("<warning class='warning'>There are no active consumers in this group assigned to " + $("#locationbox").text() + " for " + $("#datebox").val() + ".</warning>");
        consumerContainer.append("<warning class='warning'>There are no active consumers in this group assigned to " + $("#locationbox").text() + " for " + $("#datebox").val() + ".</warning>");
        //$("#actionpane").append("<p id='noconsumermessage'>There are no active consumers for this location and group</p>");
        //alert("There are no active consumers for this location");
    } else {
        $.roster.moveable = true;
        $("*").removeClass("waitingCursor");
        $("*").removeClass("waitingUnclickable");
    }

    if ($.session.DemographicsView === true) {
        //turn on demographics
        $(".simpledemoicon").css("display", "block");
    }

    if ($.session.DemographicsPictureUpdate === true) {
        //turn on photo capture
        $(".customFileUpload").css("display", "block");
    }

    if ($.session.DemographicsNotesView === true) {
        //turn on notes
        $(".demonoteicon").css("display", "block");
    }
}

function filterOutReadNotes() {
    $("#actioncenter").find(".progressnoteicon").each(function (ind, el) { $(el).parent().parent().show(); });
    $("#actioncenter").find(".progressnoteicon").not(".progressNoteIconHasUnread").each(function (ind, el) { $(el).parent().parent().hide(); });
    return false;
}

function populateConsumerScheduleLocationsDropdown(err, data, consumerId) {
    $.roster.scheduleConsumerId = consumerId;
    if (err) throw err;
    if ($("#locationDropdown").length === 0) {
        var arr = data.map(function (el) {
            return {
                id: el.id,
                text: el.name
            }
        });
        // Build Location Dropdown
        var locationDropdown = $("<div>").attr("id", "locationDropdownWrap");
        var locationDropdownText = $("<p>Locations</p>").attr("class", "locationDropdownText");
        var locationSelect = $("<select>").attr("id", "locationDropdown");
        arr.forEach(function (location) {
            var option = $("<option id='" + location.id + "'>" + location.text + "</option>").appendTo(locationSelect);;
        });
        locationDropdown.append(locationDropdownText);
        locationDropdown.append(locationSelect);
        locationDropdown.prependTo(scheduleHolder);

        locationSelect.change(function (event) {
            var optionSelected = $("option:selected", this);
            var selectedLocationId = parseInt(optionSelected.attr('id'));
            populateConsumerScheduleAjax(selectedLocationId, $.roster.scheduleConsumerId);
        });
    }
}

function populateConsumerSchedule(scheduleData) {
    $("#consumerScheduleContainer").html("");
    var scheduleContainer = $("#consumerScheduleContainer");
    var daysOfTheWeekRow = $("<div>").attr("class", "scheduleRowDays").appendTo(scheduleContainer);
    var daysOfTheWeek = ["", "SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];
    // Append days of the week
    daysOfTheWeek.forEach(function (day) {
        var dayOfWeek = $("<div>" + day + "</div>");
        dayOfWeek.appendTo(daysOfTheWeekRow);
    });
    // Append schedule data
    scheduleData.forEach(function (week) {
        Object.keys(week).forEach(function (day) {
            var time = week[day];
            week[day] = convertTimeFromMilitary(time);
            //if (time > "12:00:00") {
            //    console.log('PM');
            //} else {
            //    console.log('AM');
            //}
        });
        //console.log(week);

        // Schedule 1
        var scheduleRowIn = $("<div>").attr("class", "scheduleRow scheduleRowIn");
        var scheduleRowOut = $("<div>").attr("class", "scheduleRow scheduleRowOut");
        var timeIn = $("<div>IN</div>").attr("class", "scheduleInOut");
        var timeOut = $("<div>OUT</div>").attr("class", "scheduleInOut");

        var mondayIn = $("<div>").attr("class", "scheduleDay").text(week.MonStart === "" ? "" : week.MonStart.slice(0, 8));
        var mondayOut = $("<div>").attr("class", "scheduleDay").text(week.MonEnd === "" ? "" : week.MonEnd.slice(0, 8));
        var tuesdayIn = $("<div>").attr("class", "scheduleDay").text(week.TuesStart === "" ? "" : week.TuesStart.slice(0, 8));
        var tuesdayOut = $("<div>").attr("class", "scheduleDay").text(week.TuesEnd === "" ? "" : week.TuesEnd.slice(0, 8));
        var wednesdayIn = $("<div>").attr("class", "scheduleDay").text(week.WedStart === "" ? "" : week.WedStart.slice(0, 8));
        var wednesdayOut = $("<div>").attr("class", "scheduleDay").text(week.WedEnd === "" ? "" : week.WedEnd.slice(0, 8));
        var thursdayIn = $("<div>").attr("class", "scheduleDay").text(week.ThurStart === "" ? "" : week.ThurStart.slice(0, 8));
        var thursdayOut = $("<div>").attr("class", "scheduleDay").text(week.ThurEnd === "" ? "" : week.ThurEnd.slice(0, 8));
        var fridayIn = $("<div>").attr("class", "scheduleDay").text(week.FriStart === "" ? "" : week.FriStart.slice(0, 8));
        var fridayOut = $("<div>").attr("class", "scheduleDay").text(week.FriEnd === "" ? "" : week.FriEnd.slice(0, 8));
        var saturdayIn = $("<div>").attr("class", "scheduleDay").text(week.SatStart === "" ? "" : week.SatStart.slice(0, 8));
        var saturdayOut = $("<div>").attr("class", "scheduleDay").text(week.SatEnd === "" ? "" : week.SatEnd.slice(0, 8));
        var sundayIn = $("<div>").attr("class", "scheduleDay").text(week.SunStart === "" ? "" : week.SunStart.slice(0, 8));
        var sundayOut = $("<div>").attr("class", "scheduleDay").text(week.SunEnd === "" ? "" : week.SunEnd.slice(0, 8));
        // Schedule 2
        var scheduleRowIn2 = $("<div>").attr("class", "scheduleRow scheduleRowIn");
        var scheduleRowOut2 = $("<div>").attr("class", "scheduleRow scheduleRowOut");
        var timeIn2 = $("<div>IN</div>").attr("class", "scheduleInOut");
        var timeOut2 = $("<div>OUT</div>").attr("class", "scheduleInOut");

        var mondayIn2 = $("<div>").attr("class", "scheduleDay").text(week.MonStart2 === "" ? "" : week.MonStart2.slice(0, 8));
        var mondayOut2 = $("<div>").attr("class", "scheduleDay").text(week.MonEnd2 === "" ? "" : week.MonEnd2.slice(0, 8));
        var tuesdayIn2 = $("<div>").attr("class", "scheduleDay").text(week.TuesStart2 === "" ? "" : week.TuesStart2.slice(0, 8));
        var tuesdayOut2 = $("<div>").attr("class", "scheduleDay").text(week.TuesEnd2 === "" ? "" : week.TuesEnd2.slice(0, 8));
        var wednesdayIn2 = $("<div>").attr("class", "scheduleDay").text(week.WedStart2 === "" ? "" : week.WedStart2.slice(0, 8));
        var wednesdayOut2 = $("<div>").attr("class", "scheduleDay").text(week.WedEnd2 === "" ? "" : week.WedEnd2.slice(0, 8));
        var thursdayIn2 = $("<div>").attr("class", "scheduleDay").text(week.ThurStart2 === "" ? "" : week.ThurStart2.slice(0, 8));
        var thursdayOut2 = $("<div>").attr("class", "scheduleDay").text(week.ThurEnd2 === "" ? "" : week.ThurEnd2.slice(0, 8));
        var fridayIn2 = $("<div>").attr("class", "scheduleDay").text(week.FriStart2 === "" ? "" : week.FriStart2.slice(0, 8));
        var fridayOut2 = $("<div>").attr("class", "scheduleDay").text(week.FriEnd2 === "" ? "" : week.FriEnd2.slice(0, 8));
        var saturdayIn2 = $("<div>").attr("class", "scheduleDay").text(week.SatStart2 === "" ? "" : week.SatStart2.slice(0, 8));
        var saturdayOut2 = $("<div>").attr("class", "scheduleDay").text(week.SatEnd2 === "" ? "" : week.SatEnd2.slice(0, 8));
        var sundayIn2 = $("<div>").attr("class", "scheduleDay").text(week.SunStart2 === "" ? "" : week.SunStart2.slice(0, 8));
        var sundayOut2 = $("<div>").attr("class", "scheduleDay").text(week.SunEnd2 === "" ? "" : week.SunEnd2.slice(0, 8));

        timeIn.appendTo(scheduleRowIn);
        sundayIn.appendTo(scheduleRowIn);
        mondayIn.appendTo(scheduleRowIn);
        tuesdayIn.appendTo(scheduleRowIn);
        wednesdayIn.appendTo(scheduleRowIn);
        thursdayIn.appendTo(scheduleRowIn);
        fridayIn.appendTo(scheduleRowIn);
        saturdayIn.appendTo(scheduleRowIn);

        timeOut.appendTo(scheduleRowOut);
        sundayOut.appendTo(scheduleRowOut);
        mondayOut.appendTo(scheduleRowOut);
        tuesdayOut.appendTo(scheduleRowOut);
        wednesdayOut.appendTo(scheduleRowOut);
        thursdayOut.appendTo(scheduleRowOut);
        fridayOut.appendTo(scheduleRowOut);
        saturdayOut.appendTo(scheduleRowOut);


        timeIn2.appendTo(scheduleRowIn2);
        sundayIn2.appendTo(scheduleRowIn2);
        mondayIn2.appendTo(scheduleRowIn2);
        tuesdayIn2.appendTo(scheduleRowIn2);
        wednesdayIn2.appendTo(scheduleRowIn2);
        thursdayIn2.appendTo(scheduleRowIn2);
        fridayIn2.appendTo(scheduleRowIn2);
        saturdayIn2.appendTo(scheduleRowIn2);

        timeOut2.appendTo(scheduleRowOut2);
        sundayOut2.appendTo(scheduleRowOut2);
        mondayOut2.appendTo(scheduleRowOut2);
        tuesdayOut2.appendTo(scheduleRowOut2);
        wednesdayOut2.appendTo(scheduleRowOut2);
        thursdayOut2.appendTo(scheduleRowOut2);
        fridayOut2.appendTo(scheduleRowOut2);
        saturdayOut2.appendTo(scheduleRowOut2);

        scheduleRowIn.appendTo(scheduleContainer);
        scheduleRowOut.appendTo(scheduleContainer);

        scheduleRowIn2.appendTo(scheduleContainer);
        scheduleRowOut2.appendTo(scheduleContainer);
    });
}