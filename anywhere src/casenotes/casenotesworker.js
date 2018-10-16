function handleChange(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 1440) {
        input.value = '';
        $("#casenoteerrormessage").text('You must enter a travel time of 1440 minutes or less');
    } else {
        $("#casenoteerrormessage").text('');
    }
}
//return event.charCode >= 48 && event.charCode <= 57; 
function ForNumbers(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;

    if (
        //0~9
    charCode >= 48 && charCode <= 57 ||
        //number pad 0~9
       charCode >= 96 && charCode <= 105
    ) {
        ////make sure the new value below 20
        //if (parseInt(this.value + String.fromCharCode(charCode), 10) <= 20)
        return true;
    }

    //evt.preventDefault();
    //evt.stopPropagation();

    return false;
}


//Need this to clear the date field when a user clicks into it. *Called with onClick
function clearServiceDateField() {
    $("#newcasenoteservicedatebox").text('').val('');
    $(".caseservicedateentrynew").mask("99/99/9999", { placeholder: " " });
}

function editCaseNote() {
    $("#actioncenter").html("");
    var selectedConsumerCount = $(".highlightselected").length;
    if (selectedConsumerCount < 1) {
        $("#actioncenter").append("<div>Select a consumer to edit please</div>");
    } else {
        $("#actioncenter")
            .append("<div class='casedateentry'>Service Dates</div>")
            .append("<div class='casedateentry'>Dates Entered</div>")
            .append("<div class='casedateentry1'>List of Filtered Notes</div>");

    }
}

function clearCaseDateFilter() {
    //$('.casedateentry').val('');
    //$('.casedateentry').text(''); 
    $('#casenotesservicestartdatebox').val('').text('');
    $('#casenotesserviceenddatebox').val('').text('');
    //getFilteredCaseNotesListDataSetter();
}

function clearCaseDateEnteredFiltered() {
    $('#casenotesdateenteredstartdatebox').val('').text('');
    $('#casenotesdateenteredenddatebox').val('').text('');
}

function checkIfCompleteDate(event) {
    var length = event.currentTarget.value;
    var lengthIndex = length.indexOf(" ");
    if (lengthIndex < 0) {
        //convertDaysBackForCaseNoteLoadFilter($.session.defaultCaseNoteReviewDays);
    }

}

function clearCasenotesPops() {
    var tarId = "";
    var nodeName = "";
    var className = "";
    var parentX2 = "";
    var removeVendor = false;

    //abstracted out code that should live in global place to clear settings right bar
    //probably belongs up one level in dayservice.js
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

    //clear search box, reset consumer list, clear highlight selection, clear vendor drop down
    if (className == "actionpane" || className == "topmenu") {
        $('#caseconsumersearchbox').val('');
        removeVendor = true;
        caseConsumerFilter(removeVendor);
        if ($.session.useSessionFilterVariables == true) {
            //Do nothing
        } else {
            $(".consumerselected").removeClass("highlightselected");
        }
        if ($.session.keepVendor != true) {
            $('#cnvendordropdownfilterbox').html('').attr('vendorid', '');
        }
        $('.casenoteselectednamedetails').css("display", "none");
        if ($.session.gkGroupEdit == true || $.session.advGroupEdit == true) {
            //    existingConsumers = $('.groupcasenotenamedetails').html();
            var consumerGroupCount = $('.highlightselected').length;
            if (consumerGroupCount > 0) {
                $("#casenotesavebutton").css("display", "block");
            } else {
                $('.groupcasenoteadditionalnamedetails').html("");
                $("#casenotesavebutton").css("display", "none");
            }
        }
        if ($.session.isSingleEdit == true) {
            $('.groupcasenoteadditionalnamedetails').html("");
            $.session.changeFromSingleToGroupNote == false;
        }
    } else {
        caseConsumerFilter(removeVendor);
        //do nothing
    }

    if (tarId == "casenotesbillerfiltertext" || className == "billerfilterpop" || className == "casedropdown" || className == "billerlink block" || tarId == "cnservicelocationdropdownfilterbox" ||
        tarId == "cnneeddropdownfilterbox" || tarId == "cnbillingcodedropdownfilterbox" || tarId == "cnlocationdropdownfilterbox" || tarId == "cnservicedropdownfilterbox" || tarId == "cncontactdropdownfilterbox") {
        //Do nothing
    } else {
        $([
            "#billerfilterpop",
            "#cncontactfilterpop",
            "#cnvendorfilterpop",
            "#cnneedfilterpop",
            "#cnbillingcodefilterpop",
            "#casenotedropdownfilterpop",
            ".casenotedropdownfilterpop",
            "#cnneedfilterpop"
        ].join(", ")).css("display", "none");
    }
    if (tarId == "cnblowupwindow" || tarId == "cnblowuptextarea" || className == "cnnotesummary") {                                                                                                        //Had to undo changes because it was breaking locations and sub-locations displaying                                                                                            
        //do nothing
    } else {
        $("#cnblowupwindow").remove();
    }
}

function caseConsumerFilter(removeVendor) {
    var checker = false;
    $("#consumerlist").children().each(function () {
        var test = $("#caseconsumersearchbox").val().toLowerCase();
        if ($("#caseconsumersearchbox").val().toLowerCase() < 1) {
            $(this).show();
            var consumerCount = $('.highlightselected').length;
            if (consumerCount == 1 && !removeVendor) {
                var consumerId = $('.highlightselected').attr('id');
                if (checker == false) {
                    getConsumerSpecificVendors(consumerId);
                    $("*").addClass("waitingCursor");
                    checker = true;
                }
            }
        } else {
            var lastName = $(this).find(".lastnametextselected").text().toLowerCase();

            var test1 = $(this).find(".lastnametextselected").text().toLowerCase();
            var firstLetter = lastName.charAt(0);
            var searchListRecord = lastName.indexOf($("#caseconsumersearchbox").val().toLowerCase());
            var searchFirstLetter = $("#caseconsumersearchbox").val().toLowerCase().charAt(0);
            if (searchListRecord > -1 && searchFirstLetter == firstLetter) {
                $(this).show();
            } else {
                $(this).hide();
            }
        }
    });
}

function assignVendorDropDownData(res) {
    var vendorHtml = [];
    var vendorFp = $('#cnvendorfilterpop');
    var classadd = "block";
    var vendorId = '';
    var vendorName = '';
    var count = 0;
    $("result", res).each(function () {
        vendorId = $('vendorId', this).text();
        vendorName = $('vendorName', this).text();
        var nameWithRemovedQuote = vendorName.replace(/\\['\\]|'/g, function (s) {
            if (s == "'") return "";
            else return s;
        });
        vendorName = nameWithRemovedQuote;
        $('#cnvendordropdownfilterbox').html(vendorName).attr('vendorid', vendorId);
        //vendorHtml.push("<a href='#' class='billerlink " + classadd +
        //    "' vendorid='" + vendorId + "' vendorname='" + vendorName +
        //    "' onClick='changeCNVendor(\"" + vendorId + "\",\"" + vendorName + "\")' >" + vendorName +
        //    "</a>");
    });
    vendorHtml = vendorHtml.join('');
    vendorFp.html(vendorHtml);
    sortBy('#cnvendorfilterpop');
}

function assignDropdownData(res, editResponse) {
    $.dropdownData = [];
    $("billingcode", res).each(function () {
        var locPos = 0,
            conPos = 0,
            serPos = 0,
            needPos = 0,
            tmpServiceCode = $('codename', this).text(),
            tmpServiceId = $('serviceid', this).text(),
            tmpServiceFunding = $('includeinfunding', this).text(),
            tmpServiceRequired = $('servicerequired', this).text(),
            tmpLocationRequired = $('locationrequired', this).text(),
            tmpNeedRequired = $('needrequired', this).text(),
            tmpContactRequired = $('contactrequired', this).text(),
            tmpAllowGroupNotes = $('allowgroupnotes', this).text(),
            tmpMileageRequired = $('mileagerequired', this).text(),
            tmpDocTimeRequired = $('doctimerequired', this).text(),
            tmpTravelTimeRequired = $('traveltimerequired', this).text(),
            billCodeObj = new BillingCode(tmpServiceCode, tmpServiceId, tmpServiceFunding, tmpServiceRequired, tmpLocationRequired, tmpNeedRequired, tmpContactRequired, tmpAllowGroupNotes, tmpMileageRequired, tmpDocTimeRequired, tmpTravelTimeRequired);
        $("location", this).each(function () {
            tmpLocName = $('locname', this).text();
            tmpLocCode = $('loccode', this).text();
            var locOb = new BillingCodeLocations(tmpLocName, tmpLocCode);
            billCodeObj.billingCodeLocations[locPos] = locOb;
            locPos++;
        });//end location
        $("contact", this).each(function () {
            tmpContactName = $('contactname', this).text();
            tmpContactCode = $('contactcode', this).text();
            var contactOb = new BillingCodeContacts(tmpContactName, tmpContactCode);
            billCodeObj.billingCodeContacts[conPos] = contactOb;
            conPos++;
        });//end contact
        $("service", this).each(function () {
            tmpServiceName = $('servicename', this).text();
            tmpServiceCode = $('servicecode', this).text();
            var serviceOb = new BillingCodeServices(tmpServiceName, tmpServiceCode);
            billCodeObj.billingCodeServices[serPos] = serviceOb;
            serPos++;
        });//end service
        $("need", this).each(function () {
            tmpNeedName = $('needname', this).text();
            tmpNeedCode = $('needcode', this).text();
            var needOb = new BillingCodeNeeds(tmpNeedName, tmpNeedCode);
            billCodeObj.billingCodeNeeds[needPos] = needOb;
            needPos++;
        });//end service
        $.dropdownData.push(billCodeObj);
    });
    createBillingCodeDropdown(editResponse);
}

function createBillingCodeDropdown(editResponse) {
    //var billingCodeDropDown = [];
    var optionsHtml = [],
        tmpBillCodeName = '',
        tmpBillCodeId = '',
        tmpServiceFunding = '',
        tempServiceRequired = '',
        tempLocationRequired = '',
        tempNeedRequired = '',
        tempContactRequired = '',
        tmpAllowGroupNotes = '',
        tempMileageRequired = '',
        tempDocTimeRequired = '',
        tmpTravelTimeRequired = '',
        count = 0,
        codes = $('#cnbillingcodefilterpop');
    for (var i = 0; i < $.dropdownData.length; i++) {
        var classadd = "block";
        //billingCodeDropDown.push($.dropdownData[i].serviceCode + ',' + $.dropdownData[i].serviceId);
        tmpBillCodeId = $.dropdownData[i].serviceId;
        tmpBillCodeName = $.dropdownData[i].serviceCode;
        tmpServiceFunding = $.dropdownData[i].serviceFunding;
        tmpAllowGroupNotes = $.dropdownData[i].allowGroupNotes;
        //this is needed because quotes have symbolic meaning in javascript
        var nameWithRemovedQuote = tmpBillCodeName.replace(/\\['\\]|'/g, function (s) {
            if (s == "'") return "";
            else return s;
        });
        //Variables that tell whether or not other drop downs are required
        tempServiceRequired = $.dropdownData[i].serviceRequired
        tempLocationRequired = $.dropdownData[i].locationRequired;
        tempNeedRequired = $.dropdownData[i].needRequired;
        tempContactRequired = $.dropdownData[i].contactRequired;
        tempMileageRequired = $.dropdownData[i].mileageRequired;
        tempDocTimeRequired = $.dropdownData[i].docTimeRequired;
        tempTravelTimeRequired = $.dropdownData[i].travelTimeRequired;
        //sets initial dropdown value
        if (count == 0 && $.session.defaultSeviceId == '') {
            $('#cnbillingcodedropdownfilterbox')
                .html('')
                .attr('billingcodeid', '')
                .attr('servicefunding', '');
        } else if (tmpBillCodeId == $.session.defaultSeviceId) {//&& !$.session.caseNotePreferencesSet) {
            if ($.session.applicationName == 'Gatekeeper') {
                //setRequiredMileageAndTimeData(tempMileageRequired, tempDocTimeRequired, tempTravelTimeRequired);
                //if (tempDocTimeRequired == 'Y' && $.session.cnEdit == false) {
                //    $('.casenotedoctime').show();
                //    var answer = confirm("This service code allows doc time. Would you like to start the timer?")
                //    if (answer) {
                //        startCaseNoteTimer();
                //    }
                //    else {
                //        //Do Nothing
                //    }
                //}
            }
            if ($.session.cnEdit == false) {
                $('#cnbillingcodedropdownfilterbox')
                    .html(nameWithRemovedQuote)
                    .attr('billingcodeid', tmpBillCodeId)
                    .attr('servicefunding', tmpServiceFunding);
            }
            if (tmpServiceFunding == 'Y' && $.session.applicationName == 'Advisor') {
                $.session.tempServiceFunding = 'Y';
                $("#groupcncheckbox").css("display", "none");
                $('.dynamic').css('display', 'block');
                getServiceLocationsForCaseNoteDropDown();
            } else if (tmpServiceFunding == 'N' && $.session.applicationName == 'Advisor') {
                $.session.tempServiceFunding = 'N';
                $('.casenotedoctime').hide();
                $("#groupcncheckbox").css("display", "block");
            } else if ((tmpAllowGroupNotes == 'Y' || tmpAllowGroupNotes == '') && $.session.applicationName == 'Gatekeeper') {//new stuff
                $.session.tempServiceFunding = tmpServiceFunding;
                $('.casenotedoctime').hide();
                $("#groupcncheckbox").css("display", "block");
                $('.casenotedoctime').hide();
            } else if (tmpAllowGroupNotes == 'N' && $.session.applicationName == 'Gatekeeper') {//new stuff
                $.session.tempServiceFunding = tmpServiceFunding;
                $("#groupcncheckbox").css("display", "none");
                //}                
            } else {
                $.session.tempServiceFunding = tmpServiceFunding;
                //$("#groupcncheckbox").css("display", "block");
            }
            populateCaseNoteDropdowns(tmpBillCodeId, nameWithRemovedQuote);
            if ($.session.caseNotePreferencesSet != true) {
                setRequiredDropDowns(tempServiceRequired, tempLocationRequired, tempNeedRequired, tempContactRequired);
            } else {
                $('#endreqerror').addClass("cnresultserrorbox");
                if ($('#casenotetext').val() == '') {
                    $('.casenotetextimage').css('background-color', 'red').addClass("neednote");
                } else {
                    $('.casenotetextimage').css('background-color', '#70b1d8').removeClass("neednote");
                }
            }
            if ($.session.cnEdit == false) {
                setRequiredMileageAndTimeData(tempMileageRequired, tempDocTimeRequired, tempTravelTimeRequired, tmpAllowGroupNotes);
            }
            //setRequiredMileageAndTimeData(tempMileageRequired, tempDocTimeRequired, tempTravelTimeRequired, tmpAllowGroupNotes);
        }
        //} else if ($.session.caseNotePreferencesSet == true) {
        //    $('#cnbillingcodedropdownfilterbox').html($.session.caseNoteBillingCodeNamePreference);
        //    $('#cnbillingcodedropdownfilterbox').attr('billingcodeid', $.session.caseNoteBillingCodeCodePreference);
        //    $('#cnbillingcodedropdownfilterbox').attr('servicefunding', $.session.caseNoteBillingCodeServiceFundingPreference);
        //    //populateCaseNoteDropdowns(tmpBillCodeId, nameWithRemovedQuote);
        //}
        optionsHtml.push("<a href='#' class='billerlink " + classadd +
            "' billcodeid='" + tmpBillCodeId + "' servicefunding='" + tmpServiceFunding + "' billcodename='" + nameWithRemovedQuote +
            "' onClick='changeCNBillingCode(\"" + tmpBillCodeId + "\",\"" + tmpServiceFunding + "\",\"" + nameWithRemovedQuote + "\",\"" + tempServiceRequired + "\",\"" + tempLocationRequired +
            "\",\"" + tempNeedRequired + "\",\"" + tempContactRequired + "\",\"" + tmpAllowGroupNotes + "\",\"" + tempMileageRequired + "\",\"" + tempDocTimeRequired + "\",\"" + tempTravelTimeRequired + "\")' >" + nameWithRemovedQuote +
            "</a>");
        count++;
        serviceRequired = tempServiceRequired;
        locationRequired = tempLocationRequired;
        needRequired = tempNeedRequired;
        contactRequired = tempContactRequired;
    }
    //if ($.session.caseNotePreferencesSet == true) {
    //    populateCaseNoteDropdowns(tmpBillCodeId, nameWithRemovedQuote);
    //}
    optionsHtml = optionsHtml.join('');
    codes.html(optionsHtml);
    sortBy('#cnbillingcodefilterpop');
    if ($.session.caseNoteEdit == true) {
        assignCaseNoteEditData(editResponse);
        $.session.caseNoteEdit = false;
        $.session.keepVendor = true;
    } else {
        $.session.keepVendor = false;
    }
    //if (tempMileageRequired == 'Y' && $.session.applicationName == 'Gatekeeper') {
    //    $('#cnmileage').show();
    //} 
    //if (tempTravelTimeRequired == 'Y' && $.session.applicationName == 'Gatekeeper') {
    //    $('#cntraveltime').show();
    //}
}

//Populate the rest of the case notes drop downs based off of selected billing code
function populateCaseNoteDropdowns(billCodeId, billCodeName) {
    var locationsHtml = [];
    var contactsHtml = [];
    var servicesHtml = [];
    var needsHtml = [];
    var locationsFp = $('#cnlocationfilterpop');
    var contactsFp = $('#cncontactfilterpop');
    var servicesFp = $('#cnservicefilterpop');
    var needsFp = $('#cnneedfilterpop');
    var count = 0;
    clearCaseNoteDropdownValues();
    for (var i = 0; i < $.dropdownData.length; i++) {
        var classadd = "block";
        if ($.dropdownData[i].serviceId == billCodeId) {
            //Location drop down
            var templocCode = '';
            var templocName = '';
            for (var j = 0; j < $.dropdownData[i].billingCodeLocations.length; j++) {
                templocCode = $.dropdownData[i].billingCodeLocations[j].locCode;
                tempLocName = $.dropdownData[i].billingCodeLocations[j].locName;
                //this is needed because quotes have symbolic meaning in javascript
                var locNameWithRemovedQuote = tempLocName.replace(/\\['\\]|'/g, function (s) {
                    if (s == "'") return "";
                    else return s;
                });
                //Sets initial dropdown value  
                //MAT - May need to check session variable instead of check box for the if and else if
                if ($.session.usePersonalPrefernces == 'Y' && count == 0 && $.session.billingCodeDropDownChange == false) {
                    locationsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' loccode='" + '' + "' locname='" + '' +
                    "' onClick='changeCNLocation(\"" + '' + "\",\"" + '' + "\")' >" + '' +
                    "</a>");
                    $('#cnlocationdropdownfilterbox').html($.session.caseNoteLocationNamePreference);
                    $('#cnlocationdropdownfilterbox').attr('loccode', $.session.caseNoteLocationCodePreference);
                } else if ((count == 0 && !($('#personalpreferencescb').is(':checked'))) || ($.session.billingCodeDropDownChange == true && count == 0)) {
                    locationsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' loccode='" + '' + "' locname='" + '' +
                    "' onClick='changeCNLocation(\"" + '' + "\",\"" + '' + "\")' >" + '' +
                    "</a>");
                    $('#cnlocationdropdownfilterbox').html('');
                    $('#cnlocationdropdownfilterbox').attr('loccode', '');
                }
                locationsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' loccode='" + templocCode + "' locname='" + locNameWithRemovedQuote +
                    "' onClick='changeCNLocation(\"" + templocCode + "\",\"" + locNameWithRemovedQuote + "\")' >" + locNameWithRemovedQuote +
                    "</a>");
                count++;
            }
            //Contact drop down
            var tempContactCode = '';
            var tempContactName = '';
            count = 0;
            for (var k = 0; k < $.dropdownData[i].billingCodeContacts.length; k++) {
                tempContactCode = $.dropdownData[i].billingCodeContacts[k].contactCode;
                tempContactName = $.dropdownData[i].billingCodeContacts[k].contactName
                //this is needed because quotes have symbolic meaning in javascript
                var contactNameWithRemovedQuote = tempContactName.replace(/\\['\\]|'/g, function (s) {
                    if (s == "'") return "";
                    else return s;
                });
                //Sets initial dropdown value
                if ($.session.usePersonalPrefernces == 'Y' && count == 0 && $.session.billingCodeDropDownChange == false) {
                    contactsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' contactcode='" + '' + "' contactname='" + '' +
                    "' onClick='changeCNContact(\"" + '' + "\",\"" + '' + "\")' >" + '' +
                    "</a>");
                    $('#cncontactdropdownfilterbox').html($.session.caseNoteContactNamePreference);
                    $('#cncontactdropdownfilterbox').attr('contactcode', $.session.caseNoteContactCodePreference);
                } else if ((count == 0 && !($('#personalpreferencescb').is(':checked'))) || ($.session.billingCodeDropDownChange == true && count == 0)) {
                    contactsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' contactcode='" + '' + "' contactname='" + '' +
                    "' onClick='changeCNContact(\"" + '' + "\",\"" + '' + "\")' >" + '' +
                    "</a>");
                    $('#cncontactdropdownfilterbox').html('');
                    $('#cncontactdropdownfilterbox').attr('contactcode', '');
                }
                contactsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' contactcode='" + tempContactCode + "' contactname='" + contactNameWithRemovedQuote +
                    "' onClick='changeCNContact(\"" + tempContactCode + "\",\"" + contactNameWithRemovedQuote + "\")' >" + contactNameWithRemovedQuote +
                    "</a>");
                count++;
            }
            //Service drop down
            var tempServiceCode = '';
            var tempServiceName = '';
            var tempServiceFunding = '';
            count = 0;
            if ($.dropdownData[i].billingCodeServices.length == 0) {
                $(".dynamic").css("display", "none");
            }
            for (var l = 0; l < $.dropdownData[i].billingCodeServices.length; l++) {
                tempServiceCode = $.dropdownData[i].billingCodeServices[l].serviceCode;
                tempServiceName = $.dropdownData[i].billingCodeServices[l].serviceName;
                //Variable that tells whether or not a check box for funding was checked in Advisor or Gatekeeper
                //Will determine whether or not to show Service Location drop down
                tempServiceFunding = $.dropdownData[i].billingCodeServices[l].serviceFunding;
                //this is needed because quotes have symbolic meaning in javascript
                var serviceNameWithRemovedQuote = tempServiceName.replace(/\\['\\]|'/g, function (s) {
                    if (s == "'") return "";
                    else return s;
                });
                //Sets initial dropdown value
                //MAT - May need to check session variable instead of check box for the if and else if
                if ($.session.usePersonalPrefernces == 'Y' && count == 0 && $.session.billingCodeDropDownChange == false) {
                    servicesHtml.push("<a href='#' class='billerlink " + classadd +
                    "' servicecode='" + '' + "' servicename='" + '' +
                    "' onClick='changeCNService(\"" + '' + "\",\"" + '' + "\",\"" + '' + "\")' >" + '' +
                    "</a>");
                    $('#cnservicedropdownfilterbox').html($.session.caseNoteServiceNamePreference);
                    $('#cnservicedropdownfilterbox').attr('servicecode', $.session.caseNoteServiceCodePreference);
                } else if ((count == 0 && !($('#personalpreferencescb').is(':checked'))) || ($.session.billingCodeDropDownChange == true && count == 0)) {
                    servicesHtml.push("<a href='#' class='billerlink " + classadd +
                    "' servicecode='" + '' + "' servicename='" + '' +
                    "' onClick='changeCNService(\"" + '' + "\",\"" + '' + "\",\"" + '' + "\")' >" + '' +
                    "</a>");
                    $('#cnservicedropdownfilterbox').html('');
                    $('#cnservicedropdownfilterbox').attr('servicecode', '');
                }
                servicesHtml.push("<a href='#' class='billerlink " + classadd +
                    "' servicecode='" + tempServiceCode + "' servicename='" + serviceNameWithRemovedQuote +
                    "' onClick='changeCNService(\"" + tempServiceCode + "\",\"" + serviceNameWithRemovedQuote + "\")' >" + serviceNameWithRemovedQuote +
                    "</a>");
                count++;
            }
            //Need drop down
            var tempNeedCode = '';
            var tempNeedName = '';
            count = 0;
            for (var m = 0; m < $.dropdownData[i].billingCodeNeeds.length; m++) {
                tempNeedCode = $.dropdownData[i].billingCodeNeeds[m].needCode;
                tempNeedName = $.dropdownData[i].billingCodeNeeds[m].needName;
                var needNameWithRemovedQuote = tempNeedName.replace(/\\['\\]|'/g, function (s) {
                    if (s == "'") return "";
                    else return s;
                });
                //Sets initial dropdown value
                //MAT - May need to check session variable instead of check box for the if and else if
                if ($.session.usePersonalPrefernces == 'Y' && count == 0 && $.session.billingCodeDropDownChange == false) {
                    needsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' needcode='" + '' + "' needname='" + '' +
                    "' onClick='changeCNNeed(\"" + '' + "\",\"" + '' + "\")' >" + '' +
                    "</a>");
                    $('#cnneeddropdownfilterbox').html($.session.caseNoteNeedNamePreference);
                    $('#cnneeddropdownfilterbox').attr('needcode', $.session.caseNoteNeedCodePreference);
                } else if ((count == 0 && !($('#personalpreferencescb').is(':checked'))) || ($.session.billingCodeDropDownChange == true && count == 0)) {
                    needsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' needcode='" + '' + "' needname='" + '' +
                    "' onClick='changeCNNeed(\"" + '' + "\",\"" + '' + "\")' >" + '' +
                    "</a>");
                    $('#cnneeddropdownfilterbox').html('');
                    $('#cnneeddropdownfilterbox').attr('needcode', '');
                }
                needsHtml.push("<a href='#' class='billerlink " + classadd +
                    "' needcode='" + tempNeedCode + "' needname='" + needNameWithRemovedQuote +
                    "' onClick='changeCNNeed(\"" + tempNeedCode + "\",\"" + needNameWithRemovedQuote + "\")' >" + needNameWithRemovedQuote +
                    "</a>");
                count++;
            }
        }
    }
    if ($.session.caseNotePreferencesSet == true && $.session.billingCodeDropDownChange == false) {
        $('#cnbillingcodedropdownfilterbox').html($.session.caseNoteBillingCodeNamePreference)
                .attr('billingcodeid', $.session.caseNoteBillingCodeCodePreference)
                .attr('servicefunding', $.session.caseNoteBillingCodeServiceFundingPreference);
        if ($.session.caseNoteDisplayGroupNoteDivPreference = false) {
            $('#groupcncheckbox').css('display', 'none');
        } else {
            $('.casenotedoctime').hide();
            $('#groupcncheckbox').css('display', 'block');
        }
        //if ($.session.caseNoteDisplayGroupNoteCheckedPreference = false) {
        //    $('#groupcasenotecb').attr('checked', false);
        //} else {
        //    $('#groupcasenotecb').attr('checked', true);
        //}
        //populateCaseNoteDropdowns(tmpBillCodeId, nameWithRemovedQuote);           

    }
    $.session.billingCodeDropDownChange = false;
    locationsHtml = locationsHtml.join('');
    contactsHtml = contactsHtml.join('');
    servicesHtml = servicesHtml.join('');
    needsHtml = needsHtml.join('');
    needsFp.html(needsHtml);
    servicesFp.html(servicesHtml);
    contactsFp.html(contactsHtml);
    locationsFp.html(locationsHtml);
}

function getSelectedConsumerIdForVendowDropDown() {
    //May eventually need to make this multiple, this was done for the search. Look for this code - $('.highlightselected').each(function (index) 
    var consumerId = $('.highlightselected').attr('id');
    getConsumerSpecificVendors(consumerId);
    $.session.vendorFlag = true;
}

//Converts days back into calendar dates to send to filter for initial load
function convertDaysBackForCaseNoteLoadFilter(defaultReviewDays) {
    var onLoad = 'true';
    var dateOffset = (24 * 60 * 60 * 1000) * defaultReviewDays;
    var todaysDate = new Date();
    var daysBackDate = new Date();
    daysBackDate.setTime(daysBackDate.getTime() - dateOffset);
    var startDate = (daysBackDate.getFullYear() + '-' + (daysBackDate.getMonth() + 1) + '-' + daysBackDate.getDate());
    var endDate = (todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate());
    $.session.serviceStartDate = startDate;
    $.session.serviceEndDate = endDate;
    getFilteredCaseNotesListDataSetter(onLoad, startDate, endDate);
}

function filterByButtonSearch() {
    $.session.useSessionFilterVariables = true;
    $.session.filterServiceStart = $("#casenotesservicestartdatebox").val();
    $.session.filterServiceEnd = $("#casenotesserviceenddatebox").val();
    $.session.filterDateEnteredStart = $('#casenotesdateenteredstartdatebox').val();
    $.session.filterDateEnteredEnd = $('#casenotesdateenteredenddatebox').val();
    $.session.filterBillerId = $('#casenotesbillerfiltertext').attr('billerid');
    $.session.filterBillerName = $('#casenotesbillerfiltertext').text();
    getFilteredCaseNotesListDataSetter();
}

function assignSavedFilterParameters() {
    $("#casenotesservicestartdatebox").val($.session.filterServiceStart);
    $("#casenotesserviceenddatebox").val($.session.filterServiceEnd);
    $('#casenotesdateenteredstartdatebox').val($.session.filterDateEnteredStart);
    $('#casenotesdateenteredenddatebox').val($.session.filterDateEnteredEnd);
    $('#casenotesbillerfiltertext').attr('billerid', $.session.filterBillerId).text($.session.filterBillerName);
    //getFilteredCaseNotesListDataSetter();
}

function convertDaysBackToPopulateServiceDate() {
    var dateOffset = (24 * 60 * 60 * 1000) * $.session.defaultCaseNoteReviewDays;
    var todaysDate = new Date();
    var daysBackDate = new Date();
    daysBackDate.setTime(daysBackDate.getTime() - dateOffset);
    var startDate = (("0" + (daysBackDate.getMonth() + 1)).slice(-2) + '/' + ("0" + daysBackDate.getDate()).slice(-2) + '/' + daysBackDate.getFullYear());
    var endDate = (("0" + (todaysDate.getMonth() + 1)).slice(-2) + '/' + ("0" + todaysDate.getDate()).slice(-2) + '/' + todaysDate.getFullYear());
    $("#casenotesservicestartdatebox").val(startDate);
    $("#casenotesserviceenddatebox").val(endDate);
}

//Sets up all of the data for the getFilteredCaseNotesList ajax call 
function getFilteredCaseNotesListDataSetter(onLoad, startDate, endDate) {
    var serviceStartDate = "";
    var serviceEndDate = "";
    var billerId = $('#casenotesbillerfiltertext').attr('billerid');
    //if (onLoad === undefined) {
    //    $("#daysbacklabel").addClass("blankopacity");
    //}
    if (billerId == undefined || billerId === "") {
        billerId = $.session.PeopleId;
    };
    var selectedRosterUserId = '';
    if (selectedRosterUserId == undefined) { selectedRosterUserId = '' };
    var newDate = new Date();
    if (onLoad != undefined && $.session.useSessionFilterVariables == false) {
        serviceStartDate = startDate;
        serviceEndDate = endDate;
    } else {
        serviceStartDate = $('#casenotesservicestartdatebox').val();
        if (serviceStartDate == undefined || serviceStartDate === "") {
            //serviceStartDate = $.session.serviceStartDate;
            serviceStartDate = '1900-1-1';
        } else {
            serviceStartDate = new Date(serviceStartDate);
            serviceStartDate = (serviceStartDate.getFullYear() + '-' + (serviceStartDate.getMonth() + 1) + '-' + serviceStartDate.getDate());
        }
        serviceEndDate = $('#casenotesserviceenddatebox').val();
        if (serviceEndDate == undefined || serviceEndDate === "") {
            //serviceEndDate = $.session.serviceEndDate;
            serviceEndDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
        } else {
            serviceEndDate = new Date(serviceEndDate);
            serviceEndDate = (serviceEndDate.getFullYear() + '-' + (serviceEndDate.getMonth() + 1) + '-' + serviceEndDate.getDate());
        }
    }
    var dateEnteredStart = $('#casenotesdateenteredstartdatebox').val();
    if (dateEnteredStart == undefined || dateEnteredStart === "") {
        dateEnteredStart = '1900-1-1';
    } else {
        dateEnteredStart = new Date(dateEnteredStart);
        dateEnteredStart = (dateEnteredStart.getFullYear() + '-' + (dateEnteredStart.getMonth() + 1) + '-' + dateEnteredStart.getDate());
    }
    var dateEnteredEnd = $('#casenotesdateenteredenddatebox').val();
    if (dateEnteredEnd == undefined || dateEnteredEnd === "") {
        dateEnteredEnd = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
    } else {
        dateEnteredEnd = new Date(dateEnteredEnd);
        dateEnteredEnd = (dateEnteredEnd.getFullYear() + '-' + (dateEnteredEnd.getMonth() + 1) + '-' + dateEnteredEnd.getDate());
    }
    var consumerIncludedSearch = false;
    var userIdString = "";

    if ($.session.CaseNotesCaseloadRestriction == true) {
        var newCaseloadArray = [];
        var consumerCount = 0;
        $('.highlightselected').each(function (index) {
            selectedRosterUserId = $(this).attr('id');
            var test = $.session.consumerIdArray.indexOf(selectedRosterUserId);
            if ($.session.consumerIdArray.indexOf(selectedRosterUserId) != -1) {
                newCaseloadArray.push(selectedRosterUserId);
            }
            consumerIncludedSearch = true;
        });
        if (consumerIncludedSearch == true) {
            consumerCount = newCaseloadArray.length;
            if (consumerCount > 0) {
                for (var i = 0; i < newCaseloadArray.length; i++) {
                    selectedRosterUserId = newCaseloadArray[i];
                    getFilteredCaseNotesList(billerId, selectedRosterUserId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd, consumerCount);
                    //consumerIncludedSearch = true;
                }
            } else {
                getFilteredCaseNotesList('000', '000', serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd, consumerCount);
            }
        }
    } else {
        var consumerCount = $('.highlightselected').length;
        var loopCount = 0;
        $('.highlightselected').each(function (index) {
            selectedRosterUserId = $(this).attr('id');
            loopCount++;
            if (loopCount < consumerCount) {
                userIdString = userIdString + selectedRosterUserId + ',';
            } else {
                userIdString = userIdString + selectedRosterUserId;
            }

        });
        getFilteredCaseNotesList(billerId, userIdString, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd, consumerCount);
        consumerIncludedSearch = true;
    }
    if (consumerIncludedSearch == false) {
        if ($.session.CaseNotesCaseloadRestriction == true) {
            //loop over this array $.session.consumerIdArray
            var consumerCount = $.session.consumerIdArray.length;
            var loopCount = 0;
            for (var i = 0; i < $.session.consumerIdArray.length; i++) {
                selectedRosterUserId = $.session.consumerIdArray[i];
                loopCount++;
                if (loopCount < consumerCount) {
                    userIdString = userIdString + selectedRosterUserId + ',';
                } else {
                    userIdString = userIdString + selectedRosterUserId;
                }
            }
            getFilteredCaseNotesList(billerId, userIdString, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd, consumerCount);
        } else {
            getFilteredCaseNotesList(billerId, selectedRosterUserId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd);
        }
        //getFilteredCaseNotesList(billerId, selectedRosterUserId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd);
    }

}

//Creates the biller drop down at the top of page for case notes
function createBillerDropdown(res) {
    var optionsHtml = [];
    var optionsHtml2 = [];
    var tempBillerId = '';
    var tempBillerName = '';
    var billers = $('#billerfilterpop');
    var defaultBillerName = '';
    $('biller', res).each(function () {
        tempBillerId = $('billerId', this).text();
        tempBillerName = $('billerName', this).text();
        var classadd = "block";
        //classadd = 'noblock';
        //this is needed because quotes have symbolic meaning in javascript
        var nameWithRemovedQuote = tempBillerName.replace(/\\['\\]|'/g, function (s) {
            if (s == "'") return "";
            else return s;
        });
        if (tempBillerId == $.session.PeopleId && $.session.useSessionFilterVariables == false) {
            $('#casenotesbillerfiltertext').html(nameWithRemovedQuote);
            $('#casenotesbillerfiltertext').attr('billerid', tempBillerId);
            defaultBillerName = nameWithRemovedQuote;
        }
        optionsHtml.push("<a href='#' class='billerlink " + classadd +
            "' billerid='" + tempBillerId + "' billername='" + nameWithRemovedQuote +
            "' onClick='changeBillerForFilter(" + tempBillerId + ",\"" + nameWithRemovedQuote + "\")' >" + nameWithRemovedQuote +
            "</a>");
    });
    optionsHtml = optionsHtml.join('');
    billers.html(optionsHtml);
    if ($('#casenotesbillerfiltertext').html() == 'Biller') {
        $('#casenotesbillerfiltertext').html('All').attr('billerid', '000');
        defaultBillerName = 'All';
        //$.session.defaultCaseNoteReviewDays = 20;
        $("#casenotesdaysback").val($.session.defaultCaseNoteReviewDays);
    }
    //$("#daysbacklabel").text("last " + $.session.defaultCaseNoteReviewDays + " days back for " + defaultBillerName);
    $.caseNotes.billerName = defaultBillerName;
    sortBy('#billerfilterpop');
}

//Will create dynamic service location dropdown if the value in the service
//drop down has a service funding value of 'Y'
function createServiceLocationDropdown(res) {
    var optionsHtml = [];
    var optionsHtml2 = [];
    var tempServiceLocation = '';
    var tempServiceLocationCode = '';
    var serviceLocations = $('#cnservicelocationfilterpop');
    var defaultServiceLocation = '';
    var defaultServiceCode = '';
    var editingServiceName = "";
    //if ($.session.noteEdit == true) {
    //    $.session.noteEdit = false;
    //} else {
    editingServiceName = $('#cnservicelocationdropdownfilterbox').html();
    if ($.session.showDynamic == true) {
        $('.dynamic').css('display', 'block');
    }
    //Get the default service location and code for consumer
    $('default', res).each(function () {
        defaultServiceLocation = $('defaultcountyname', this).text();
        defaultServiceCode = $('defaultcountycode', this).text();
    });

    //Get the rest of the service locations for drop down
    $('county', res).each(function () {
        tempServiceLocation = $('countyname', this).text();
        tempServiceLocationCode = $('countycode', this).text();
        if (tempServiceLocationCode.length == 1) {
            tempServiceLocationCode = "0" + tempServiceLocationCode;
        }
        var classadd = "block";

        //this is needed because quotes have symbolic meaning in javascript
        var nameWithRemovedQuote = tempServiceLocation.replace(/\\['\\]|'/g, function (s) {
            if (s == "'") return "";
            else return s;
        });

        if ((tempServiceLocation == defaultServiceLocation) && ((editingServiceName == "") || (editingServiceName == "NA"))) {
            $('#cnservicelocationdropdownfilterbox').html(nameWithRemovedQuote);
            $('#cnservicelocationdropdownfilterbox').attr('servicelocationcode', tempServiceLocationCode);
        }

        optionsHtml.push("<a href='#' class='billerlink " + classadd +
                "' servicelocationcode='" + tempServiceLocationCode + "' servicelocationname='" + nameWithRemovedQuote +
                "' onClick='changeCNServiceLocation(" + tempServiceLocationCode + ",\"" + nameWithRemovedQuote + "\")' >" + nameWithRemovedQuote +
                "</a>");
    });
    optionsHtml = optionsHtml.join('');
    serviceLocations.html(optionsHtml);

    $.session.noteEdit = false;
    //}    
}

function assignCaseNoteEditData(res) {
    var noteid = '';
    var startTime = '';
    var endTime = '';
    var locationCode = ''
    var locationName = '';
    var serviceCode = '';
    var serviceName = ''
    var serviceincludeinfundinglimit = '';
    var serviceRequired = '';
    var locationRequired = '';
    var needRequired = '';
    var contactRequired = '';
    var serviceNeedCode = '';
    var needName = '';
    var contactCode = '';
    var contactName = '';
    var caseNote = '';
    var confidential = '';
    var userId = '';
    var consumerId = '';
    var consumerName = '';
    var vendorId = '';
    var vendorName = '';
    var mainServiceOrBillingCodeId = '';
    var mainBillingOrServiceCodeName = '';
    var serviceDate = '';
    var serviceLocationId = '';
    var serviceLocationName = '';
    var reviewRequired = '';
    var groupId = '';
    var originalUserId = '';
    var batched = '';
    var isBatched = false;
    var caseManagerId = '';
    var caseManagerName = '';
    var rejectionReason = '';
    var reviewResults = '';
    var allowGroupNotes = undefined;
    var mileage = 0;
    var mileageRequired = '';
    var travelTimeRequired = '';
    var docTimeRequired = '';
    var travelTime = 0;
    var totalDocTime = 0;
    $.caseNotes.documentTimeSeconds = 0;
    //loadEditCaseNote();
    $('results', res).each(function () {
        noteid = $('noteid', this).text(); //note id
        $.session.editingNoteId = noteid;
        startTime = $('starttime', this).text(); //start time
        endTime = $('endtime', this).text(); //end time
        locationCode = $('locationcode', this).text(); //location drop down
        locationName = $('locationname', this).text(); //location drop down
        serviceCode = $('servicecode', this).text(); //service drop down
        serviceName = $('servicename', this).text(); //service drop down
        serviceincludeinfundinglimit = $('serviceincludeinfundinglimit', this).text(); //service drop down, tells whether to show dynamic service location drop down
        serviceRequired = $('servicerequired', this).text();
        locationRequired = $('locationrequired', this).text();
        needRequired = $('needrequired', this).text();
        contactRequired = $('contactrequired', this).text();
        serviceNeedCode = $('serviceneedcode', this).text(); //need drop down
        needName = $('needname', this).text(); //need drop down
        contactCode = $('contactcode', this).text(); //contact drop down
        contactName = $('contactname', this).text(); //contact drop down
        caseNote = $('casenote', this).text(); //actual note
        //caseNote = caseNote.replace(/\r?\n/g, '<br />');
        //if (caseNote.indexOf("\\r\\n") != -1) {
        //    caseNote = caseNote.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
        //} 
        //if (caseNote.indexOf("\\") != -1) {
        //    caseNote = caseNote.replace(/\\/g, " ");
        //}
        if (caseNote.indexOf("\\n") != -1) {
            caseNote = caseNote.replace(/\\n/g, "\n");
        }
        if (caseNote.indexOf("\\r") != -1) {
            caseNote = caseNote.replace(/\\r/g, ' ');
        }
        confidential = $('confidential', this).text(); //Y or N
        userId = $('userid', this).text(); //most recent user who submitted
        $.caseNotes.reporterName = userId;
        consumerId = $('consumerid', this).text(); //consumer id who note is for
        $.session.consumerEditId = consumerId;
        $.session.editingConsumerId = consumerId;
        consumerName = $('consumername', this).text(); //consumer name who note is for
        vendorId = $('vendorid', this).text(); //vendor drop down
        vendorName = $('vendorname', this).text(); //vendor drop down
        mainServiceOrBillingCodeId = $('mainbillingorservicecodeid', this).text(); //service or billing code drop down id - main drop down others are rendered from
        mainBillingOrServiceCodeName = $('mainbillingorservicecodename', this).text(); //service or billing code drop down name - main drop down others are rendered from
        mileage = $('totalmiles', this).text();
        travelTime = $('traveltime', this).text();
        mileageRequired = $('mileagerequired', this).text();
        travelTimeRequired = $('traveltimerequired', this).text();
        docTimeRequired = $('doctimerequired', this).text();
        for (i = 0; i < $.dropdownData.length; i++) {
            if ((serviceId = $.dropdownData[i].serviceId) == mainServiceOrBillingCodeId) {
                allowGroupNotes = $.dropdownData[i].allowGroupNotes;
            }
        }
        serviceDate = $('servicedate', this).text(); //service date field
        //$.caseNotes.reportedDate = serviceDate;
        //$.caseNotes.reportedDate = $('originalupdate', this).text();
        $.caseNotes.reportedDate = $('lastupdate', this).text();
        $.session.editOnLoad = true;
        var length = $.caseNotes.reportedDate.length;
        var start = length - 6;
        var end = start + 3;
        $.caseNotes.reportedDate = $.caseNotes.reportedDate.substr(0, start) + $.caseNotes.reportedDate.substr(end);
        serviceLocationId = $('servicelocationid', this).text(); //dynamic drop down service location id
        if (serviceLocationId.length == 1) {
            serviceLocationId = "0" + serviceLocationId;
        }
        serviceLocationName = $('servicelocationname', this).text(); //dynamic drop down service location name
        if (serviceLocationId != '') {
            //$('.dynamic').css('display', 'block');
            $.session.noteEdit = true;
        }
        reviewRequired = $('reviewrequired', this).text(); //Y or N
        groupId = $('groupid', this).text(); //group id is present if a group case note
        if (groupId == "") {
            $.session.isSingleEdit = true;
        } else {
            $.session.isSingleEdit = false;
        }
        //$.session.groupCaseNoteId = groupId;
        originalUserId = $('originaluserid', this).text(); //user id of who originally entered the note
        batched = $('batched', this).text(); // is actually biiling_id from database, if has a value note is batched
        if (batched != '') { //work to set variable if case note has been batched
            isBatched = true; //this isBatched variable will be used when deciding what text to display for note in regards to batching
        }
        caseManagerId = $('casemanagerid', this).text(); //id from drop down at top of page
        caseManagerName = $('casemanagername', this).text(); //name from drop down at top of page
        if ($.session.applicationName == 'Gatekeeper') {
            rejectionReason = $('rejectionreason', this).text();
        } else {
            rejectionReason = '';
        }
        reviewResults = $('reviewresults', this).text();
        if (reviewResults == 'N') {
            reviewResults = 'Not Reviewed';
        } else if (reviewResults == 'R') {
            reviewResults = 'Rejected';
        } else if (reviewResults == 'P') {
            reviewResults = 'Passed';
        }
        totalDocTime = $('totaldoctime', this).text();
        if (totalDocTime == "") {
            totalDocTime = 0;
        }
        $.caseNotes.documentTimeSeconds = totalDocTime;
        docTimeSecondsToMinutesAndDisplay(totalDocTime);
        //startCaseNoteTimer("editNote", totalDocTime);
    });
    $.session.serviceOrBillingCodeForGroupNoteUpdateCompare = mainServiceOrBillingCodeId;
    $('#endreqerror').removeClass("cnresultserrorbox");
    $.session.editNoteMileageOnLoadFlag = true;
    serviceDate = $.format.date(new Date(serviceDate), 'MM/dd/yyyy');
    $.session.serviceDateForGroupNoteUpdateCompare = serviceDate;
    $.session.startTimeForGroupNoteUpdateCompare = startTime;
    startTime = convertTimeFromMilitary(startTime);
    $.session.endTimeForGroupNoteUpdateCompare = endTime;
    endTime = convertTimeFromMilitary(endTime);

    if (groupId != "") {
        $('.casenotenamedetails').html("Note For:" + " " + consumerName);
        getGroupNoteNames(groupId);
        $.session.groupNamesExist = true;
        $.session.existingGroupNoteIdForUpdate = groupId;
        if ($.session.applicationName == 'Gatekeeper') {
            $.session.gkGroupEdit = true;
        }
        if ($.session.applicationName == 'Advisor') {
            $.session.advGroupEdit = true;
        }
        $('.casenotedoctime').hide();
        $('#groupcncheckbox').css('display', 'block');
        $('#groupcasenotecb').attr('disabled', true).attr('readonly', true);
    } else {
        $('.casenotenamedetails').html("Note For:" + " " + consumerName);
        $.session.groupNamesExist = false;
        $.session.existingGroupNoteIdForUpdate = "";
        $.session.gkGroupEdit = false;
        $.session.advGroupEdit = false;
        $('.casenotedoctime').hide();
        $('#groupcncheckbox').css('display', 'block');
    }
    $.caseNotes.noTimerEdit = true;
    $('#casenotetext').html(caseNote);
    $('#newcasenoteservicedatebox').val(serviceDate);
    $('#newcasenoteservicestarttimebox').val(startTime);
    $('#newcasenoteserviceendtimebox').val(endTime);
    $('#cnmileagetextarea').val(mileage);
    (function () {
        var ids = [consumerId];
        var matchedIDs = $.grep(ids, function (id) {
            return $.caseNotes.mileageConsumerIds.indexOf(id + "") !== -1;
        });
        if ($.session.applicationName != 'Gatekeeper') {
            if (matchedIDs.length) {
                $('#cnmileage').show();
                if (parseFloat($('#cnmileagetextarea').val(), 10) == 0) $('#cnmileagetextarea').val($.session.maxGroupMiles);
            }
            else $('#cnmileage').hide();
        }
    })();
    $('#cntraveltimetextarea').val(travelTime);
    if (isBatched == true) {
        $('#batchedcb').attr('checked', true);
        batchedNoteUneditable();
        $.session.batchedNoteEdit = true;
    } else {
        $.session.batchedNoteEdit = false;
    }
    changeBillerForFilter(caseManagerId, caseManagerName);
    //changeCNBillingCode(mainServiceOrBillingCodeId, serviceincludeinfundinglimit, mainBillingOrServiceCodeName);
    changeCNBillingCode(mainServiceOrBillingCodeId, serviceincludeinfundinglimit, mainBillingOrServiceCodeName, serviceRequired, locationRequired, needRequired, contactRequired, allowGroupNotes, mileageRequired, docTimeRequired, travelTimeRequired);
    changeCNLocation(locationCode, locationName);
    changeCNVendor(vendorId, vendorName);
    changeCNContact(contactCode, contactName);
    changeCNServiceLocation(serviceLocationId, serviceLocationName);
    //changeCNService(serviceCode, serviceName, serviceRequired, locationRequired, needRequired, contactRequired);
    changeCNService(serviceCode, serviceName);
    changeCNNeed(serviceNeedCode, needName);
    //$("#newCaseNote").append("<div class='casenotestamp'>" + " Review Results: " + reviewResults + "&nbsp;&nbsp;&nbsp;&nbsp; " + rejectionReason + "</div>");
    $("#newCaseNote").append("<div class='casenotestamp'>" + " Last Edited On: " + $.caseNotes.reportedDate + "&nbsp;&nbsp;&nbsp;&nbsp; Entered By: " + $.caseNotes.reporterName + "</div>")
    if (confidential == 'Y') {
        $('#confidentialcb').attr('checked', true);
    }
    if (reviewRequired == 'Y') {
        $('#reviewrequiredcb').attr('checked', true);
        $.session.reviewRequired = 'Y';
        if (reviewResults == 'Rejected') {
            $("#newCaseNote").append("<div class='casenotestamp'>" + " Review Results: " + reviewResults + "&nbsp;&nbsp;&nbsp;&nbsp; " + rejectionReason + "</div>");
        } else {
            $("#newCaseNote").append("<div class='casenotestamp'>" + " Review Results: " + reviewResults);
        }

    } else {
        $.session.reviewRequired = 'N';
    }
    //Moved here because it was overwritting batched
    //Disable save and delete or any changes if logged in user is different than biller
    //Had to change below for ticket #22211. 
    var userName = $('#casenotesbillerfiltertext').html();
    userName = userName.replace(/\s+/g, '');
    var sessionName = ($.session.Name + $.session.LName);
    sessionName = sessionName.replace(/\s+/g, '');
    $.caseNotes.differentUserNoEdit = false;
    if (((userName != sessionName) || $.session.CaseNotesUpdate == false) && sessionName != '') {
        differentUserUneditable();
        $.caseNotes.differentUserNoEdit = true;
        if (confidential == 'Y') {
            $('#casenotetext').html("This is a confidential note.");
        }
    } else {
        if ($.session.batchedNoteEdit == false) {
            sameUserEditable();
        }

    }
    //if (isBatched == true) {
    //    $('#batchedcb').attr('checked', true);
    //    batchedNoteUneditable();
    //    $.session.batchedNoteEdit = true;
    //} else {
    //    $.session.batchedNoteEdit = false;
    //}
    if (groupId != '') {
        $('#groupcasenotecb').attr('checked', true);
        groupNoteUneditableFields();
    }
    $('#endreqerror').removeClass("cnresultserrorbox");
    if ($.caseNotes.popupclick == false) {
        $('#casenotesavebutton').css('display', 'none');
    }
    $.caseNotes.popupclick = false;
    //if ($('#casenotesbillerfiltertext').html() != $.session.Name + ' ' + $.session.LName) {

}

function setConsumerNamesToScreen(res) {
    $('.groupcasenotenamedetails').css("display", "block");
    var nameString = "";
    var name = "";
    $('consumernames', res).each(function () {
        name = $('consumername', this).text();
        name = name + ', ';
        nameString = nameString + name;
    });
    nameString = nameString.substr(0, nameString.length - 2);
    $('.groupcasenotenamedetails').html("Group:" + " " + nameString);
}

//now.setSeconds(now.getSeconds + 60)
//Start and end time pop clock function
function popCaseNotesTime(inputField) {
    var allowFuture = false;
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var serviceDate = $('#newcasenoteservicedatebox').val();
    var newDate = new Date(serviceDate);
    var updatedTimeDate = new Date(serviceDate);
    //
    var newNow = new Date();
    newNow = newNow.setSeconds(newNow.getSeconds() + 60)
    newNow = new Date(newNow);
    var startTime = $('#newcasenoteservicestarttimebox').val();
    startTime = convertTimeToMilitary(startTime);
    var test = new Date(startTime);
    updatedTimeDate.setHours(startTime.substring(0, 2), startTime.substring(3, 5), startTime.substring(6, 8), 0);
    updatedTimeDate = updatedTimeDate.setSeconds(updatedTimeDate.getSeconds() + 60);
    updatedTimeDate = new Date(updatedTimeDate);
    if (newDate < now) {
        allowFuture = true;
    }
    setupTimeInputBox([{ id: inputField }], {
        x: 80, y: 80,
    }, {
        callback: function (valueText) {
            //$('#' + inputField).text(timeDigitsEntered);
            if (inputField == "endtimeclock") {
                validateCaseNoteEndTime(valueText);
            }
            else {
                validateCaseNoteStartTime(valueText);
            }
            toggleSaveButton();
           // validateConsumerDSLineTimeAndUpdate(tagname);
        },
    })
    /*
    if (inputField == "endtimeclock") {
        if (allowFuture == false) {
            $('#' + inputField).mobiscroll().time({
                minDate: new Date(updatedTimeDate.getFullYear(), updatedTimeDate.getMonth(), updatedTimeDate.getDate(), updatedTimeDate.getHours(), updatedTimeDate.getMinutes()),
                maxDate: new Date(newNow.getFullYear(), newNow.getMonth(), newNow.getDate(), newNow.getHours(), newNow.getMinutes()),
                dateFormat: 'M dd',
                theme: 'wp',
                accent: 'steel',
                display: 'bubble',
                mode: 'scroller',
                onSelect: function (valueText, inst) {
                    if (inputField == "starttimeclock") {
                        //$('#notestarttime').html(valueText);
                        validateCaseNoteStartTime(valueText);
                        //$('#newcasenoteservicestarttimebox').val(valueText);
                        toggleSaveButton();
                    }
                    if (inputField == "endtimeclock") {
                        //$('#noteendtime').html(valueText);
                        validateCaseNoteEndTime(valueText);
                        //$('#newcasenoteserviceendtimebox').val(valueText);
                        toggleSaveButton();
                    }
                }
            });
            var endTime = $('#newcasenoteserviceendtimebox').val();
        } else {
            $('#' + inputField).mobiscroll().time({
                minDate: new Date(updatedTimeDate.getFullYear(), updatedTimeDate.getMonth(), updatedTimeDate.getDate(), updatedTimeDate.getHours(), updatedTimeDate.getMinutes()),
                dateFormat: 'M dd',
                theme: 'wp',
                accent: 'steel',
                display: 'bubble',
                mode: 'scroller',
                onSelect: function (valueText, inst) {
                    if (inputField == "starttimeclock") {
                        //$('#notestarttime').html(valueText);
                        validateCaseNoteStartTime(valueText);
                        //$('#newcasenoteservicestarttimebox').val(valueText);
                        toggleSaveButton();
                    }
                    if (inputField == "endtimeclock") {
                        //$('#noteendtime').html(valueText);
                        validateCaseNoteEndTime(valueText);
                        //$('#newcasenoteserviceendtimebox').val(valueText);
                        toggleSaveButton();
                    }
                }
            });
        }
        //end of if
    } else {
        if (allowFuture == false) {
            $('#' + inputField).mobiscroll().time({
                minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                maxDate: new Date(),
                dateFormat: 'M dd',
                theme: 'wp',
                accent: 'steel',
                display: 'bubble',
                mode: 'scroller',
                onSelect: function (valueText, inst) {
                    if (inputField == "starttimeclock") {
                        //$('#notestarttime').html(valueText);
                        validateCaseNoteStartTime(valueText);
                        //$('#newcasenoteservicestarttimebox').val(valueText);
                        toggleSaveButton();
                    }
                    if (inputField == "endtimeclock") {
                        //$('#noteendtime').html(valueText);
                        validateCaseNoteEndTime(valueText);
                        //$('#newcasenoteserviceendtimebox').val(valueText);
                        toggleSaveButton();
                    }
                }
            });
        } else {
            $('#' + inputField).mobiscroll().time({
                minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                dateFormat: 'M dd',
                theme: 'wp',
                accent: 'steel',
                display: 'bubble',
                mode: 'scroller',
                onSelect: function (valueText, inst) {
                    if (inputField == "starttimeclock") {
                        //$('#notestarttime').html(valueText);
                        validateCaseNoteStartTime(valueText);
                        //$('#newcasenoteservicestarttimebox').val(valueText);
                        toggleSaveButton();
                    }
                    if (inputField == "endtimeclock") {
                        //$('#noteendtime').html(valueText);
                        validateCaseNoteEndTime(valueText);
                        //$('#newcasenoteserviceendtimebox').val(valueText);
                        toggleSaveButton();
                    }
                }
            });
        }
        //end of else
    }
    $('#' + inputField).mobiscroll('show');
    return false;
    */
}

function validateCaseNoteStartTime(valueText) {
    var startTime = convertTimeToMilitary(valueText);
    var endTime = convertTimeToMilitary($('#newcasenoteserviceendtimebox').val());
    if (startTime == "00:00:00") {
        startTime == "23:59:00";
    }
    if (endTime == "00:00:00") {
        endTime == "23:59:00";
    }
    if (startTime >= endTime) {
        $("#casenoteerrormessage").text("Start time cannot be after end time.");
    } else {
        $('#newcasenoteservicestarttimebox').val(valueText);
    }
}

function validateCaseNoteEndTime(valueText) {
    var startTime = convertTimeToMilitary($('#newcasenoteservicestarttimebox').val());
    var endTime = convertTimeToMilitary(valueText);
    if (startTime == "00:00:00") {
        startTime == "23:59:00";
    }
    if (endTime == "00:00:00") {
        endTime == "23:59:00";
    }
    if (startTime >= endTime) {
        $("#casenoteerrormessage").text("End time cannot be before start time");
    } else {
        $('#newcasenoteserviceendtimebox').val(valueText);
        $('#endreqerror').removeClass("cnresultserrorbox");
    }
    toggleSaveButton();
}

function setGroupIdForSaving(res) {
    $('results', res).each(function () {
        $.session.groupNoteId = $('groupNoteId', this).text();
    });
    //if ($.session.gkGroupEdit != true && $.session.advGroupEdit != true) {
    //beginOverlapCheck();
    // }

    saveNewGroupNote();
}

function beginOverlapCheck() {
    if ($.session.consumerEditId != "") {
        $.session.groupConsumerCount = 1;
        consumerId = $.session.consumerEditId
        var startTime = $('#newcasenoteservicestarttimebox').val();
        startTime = convertTimeToMilitary(startTime);
        var endTime = $('#newcasenoteserviceendtimebox').val();
        endTime = convertTimeToMilitary(endTime);
        var serviceDate = $('#newcasenoteservicedatebox').val();
        var newDate = new Date(serviceDate);
        serviceDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
        var caseManagerId = $('#casenotesbillerfiltertext').attr('billerid');
        caseNoteOverlapCheck(consumerId, startTime, endTime, serviceDate, caseManagerId, $.session.editCaseNoteId, $.session.existingGroupNoteIdForUpdate);
        //$.session.consumerEditId = "";
    } else {
        $.session.groupOverlapCheckCounter = 1;
        $.session.groupConsumerCount = $('.highlightselected').length;
        $('.highlightselected').each(function (index) {
            consumerId = $(this).attr('id');
            var startTime = $('#newcasenoteservicestarttimebox').val();
            startTime = convertTimeToMilitary(startTime);
            var endTime = $('#newcasenoteserviceendtimebox').val();
            endTime = convertTimeToMilitary(endTime);
            var serviceDate = $('#newcasenoteservicedatebox').val();
            var newDate = new Date(serviceDate);
            serviceDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
            var caseManagerId = $('#casenotesbillerfiltertext').attr('billerid');
            caseNoteOverlapCheck(consumerId, startTime, endTime, serviceDate, caseManagerId);
        });
    }
}

function saveNewGroupNote() {
    clearInterval(textCheck);
    var consumerId = '';
    var count = 0;
    var countForSingToGroup = 0;
    $.session.groupSaveCounter = 1;
    var endTime = $('#newcasenoteserviceendtimebox').val();
    $('.highlightselected').each(function (index) {
        consumerId = $(this).attr('id');
        var caseManagerId = $('#casenotesbillerfiltertext').attr('billerid');
        if (caseManagerId == '000' || caseManagerId == '0') {
            $("#casenoteerrormessage").text("Biller cannot be set to 'All' for save or edit.");
        } else if (endTime == '') {
            $("#casenoteerrormessage").text("You must have an end time.");
        } else {
            var noteId = '0';
            //var groupNoteId = '0';
            var consumerGroupCount = $('.highlightselected').length;
            $.session.consumerGroupCount = consumerGroupCount;
            var groupNoteId = $.session.groupNoteId;
            var reviewRequired = 'N';
            var confidential = 'N';
            var serviceOrBillingCodeId = $('#cnbillingcodedropdownfilterbox').attr('billingcodeid');
            var locationCode = $('#cnlocationdropdownfilterbox').attr('loccode');
            var serviceCode = $('#cnservicedropdownfilterbox').attr('servicecode');
            var needCode = $('#cnneeddropdownfilterbox').attr('needcode');
            if (needCode == undefined) {
                needCode = "";
            }
            var serviceDate = $('#newcasenoteservicedatebox').val();
            var newDate = new Date(serviceDate);
            serviceDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
            var startTime = $('#newcasenoteservicestarttimebox').val();
            startTime = convertTimeToMilitary(startTime);
            //var endTime = $('#newcasenoteserviceendtimebox').val();
            endTime = convertTimeToMilitary(endTime);
            var vendorId = $('#cnvendordropdownfilterbox').attr('vendorId');
            var contactCode = $('#cncontactdropdownfilterbox').attr('contactcode');
            var serviceLocationCode = $('#cnservicelocationdropdownfilterbox').attr('servicelocationcode');
            if (serviceLocationCode == undefined) {
                serviceLocationCode = '';
            }
            if (serviceLocationCode.length == 1) {
                serviceLocationCode = "0" + serviceLocationCode;
            }
            var caseNote = $('#casenotetext').val();
            caseNote = removeUnsavableNoteText(caseNote);
            //if ($('#reviewrequiredcb').is(':checked')) {
            //    reviewRequired = 'Y';
            //}
            if ($.session.reviewRequired == 'Y') {
                reviewRequired = 'Y';
            }
            if ($('#confidentialcb').is(':checked')) {
                confidential = 'Y';
            }
            var test = $("#casenoteerrormessage").text();
            //New additions to case notes. Mileage, travel time and doc time
            var casenotemileage = $("#cnmileagetextarea").val();
            var casenotebackup = $("#cnmileagetextarea").val();
            var casenotetraveltime = $("#cntraveltimetextarea").val();//MAT needs to be seconds. Putting in generically just to get database functionality working
            //casenotetraveltime = convertMinutesToSeconds(casenotetraveltime);
            //var documentationTime = $.caseNotes.documentTimeSeconds;
            var documentationTime = formatDocTimeForSave();
            clearTimerOnSave();
            //Check if a note has been entered
            if (caseNote == "") {
                //Do nothing. Need to throw an error message
                $("#casenoteerrormessage").text("You must have case note text.");
            } else if (consumerId == '' || consumerId == undefined) {
                $("#casenoteerrormessage").text("You must have a consumer selected.");
            } else {
                if (count == 0) {
                    //set personal preferences
                    if ($.session.usePersonalPrefernces == 'Y') {
                        saveCaseNotesPersonalPreferences();
                    }
                    count++;
                }
                if ($.session.changeFromSingleToGroupNote == true) {
                    consumerGroupCount = consumerGroupCount + 1;
                }
                var matchedIDs = $.grep([consumerId], function (id) {
                    return $.caseNotes.mileageConsumerIds.indexOf(id + "") !== -1;
                });

                if ($.session.applicationName != 'Gatekeeper') {
                    //console.log($.caseNotes.mileageConsumerIds, matchedIDs, casenotemileage);
                    if (matchedIDs.length) {
                        //$('#cnmileage').show();
                    }
                    else casenotemileage = "0";
                }


                //console.log(casenotemileage);
                saveGroupCaseNote(noteId, groupNoteId, caseManagerId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, reviewRequired, confidential, caseNote, consumerGroupCount, casenotemileage, casenotetraveltime, documentationTime);
                //startOverlapCheck();
                //First time after call is made, need to do a call to the database to get group note id
                if ($.session.changeFromSingleToGroupNote == true && countForSingToGroup == 0) {

                    if ($.session.applicationName != 'Gatekeeper') {
                        //console.log($.caseNotes.mileageConsumerIds, matchedIDs, casenotemileage);
                        matchedIDs = $.grep([$.session.editingConsumerId], function (id) {
                            return $.caseNotes.mileageConsumerIds.indexOf(id + "") !== -1;
                        });
                        if (matchedIDs.length) {
                            casenotemileage = casenotebackup;
                        }
                        else casenotemileage = "0";
                    }
                    saveGroupCaseNote(noteId, groupNoteId, caseManagerId, $.session.editingConsumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, reviewRequired, confidential, caseNote, consumerGroupCount, casenotemileage, casenotetraveltime, documentationTime);
                    countForSingToGroup++;
                    $.session.consumerGroupCount++;
                }
                //startCaseNoteTimer('clear'); //clears the timer
                $.caseNotes.documentTimeSeconds = 0; //resets the save value
            }
        }
    });
}

function saveCaseNote() {
    //Will switch to save group note if more than 1 consumer selected  
    clearInterval(textCheck);
    $.caseNotes.dontResetInactTimerFlag = true;
    var consumerSaveCount = $('.highlightselected').length;
    var endTime = $('#newcasenoteserviceendtimebox').val();
    var updateGroupNoteFlag = false;
    var userName = $('#casenotesbillerfiltertext').html();
    userName = userName.replace(/\s+/g, '');
    var sessionName = ($.session.Name + $.session.LName);
    sessionName = sessionName.replace(/\s+/g, '');
    if ((consumerSaveCount > 1 && !($('#groupcasenotecb').is(':checked'))) || (($('.groupcasenoteadditionalnamedetails').html() != '' && $('.groupcasenoteadditionalnamedetails').html() != undefined) && !($('#groupcasenotecb').is(':checked')))) {
        $("#casenoteerrormessage").text("You can only select one consumer, unless you are saving a group note.");
    } else if (userName != sessionName && $.session.isPSI == false) {
        $("#casenoteerrormessage").text("You cannot enter notes for another biller.");
    } else if (consumerSaveCount <= 1 && $('#groupcasenotecb').is(':checked') && $.session.caseNoteEditSecond == false) {
        $("#casenoteerrormessage").text("You must have more than one consumer selected for a group note.");
        //} else if (($('.groupcasenoteadditionalnamedetails').html() != '') && !($('#groupcasenotecb').is(':visible')) && $.session.caseNoteEdit == true) {
    } else if (($('.groupcasenoteadditionalnamedetails').html() != '') && ($('.groupcasenoteadditionalnamedetails').html() != undefined) && !($('#groupcasenotecb').is(':visible'))) {
        $("#casenoteerrormessage").text("Billing code does not accept group notes.");
    } else if ((consumerSaveCount > 1 && $('#groupcasenotecb').is(':checked') && $.session.caseNoteEditSecond == false) || $.session.changeFromSingleToGroupNote == true) {
        //saveNewGroupNote();        
        //if (userName != sessionName) {
        //    $("#casenoteerrormessage").text("You cannot enter notes for another biller.");
        //} else {
        if ($.session.changeFromSingleToGroupNote == true) {
            deleteExistingCaseNoteTwo($.session.editingNoteId);
        }
        getGroupNoteId();
        //}
    } else if (endTime == '') {
        $("#casenoteerrormessage").text("You must have an end time.");
    } else if ($.session.caseNoteTimeCheck == 'fail') {
        $("#casenoteerrormessage").text("Start or End time cannot be in the future for current date.");
    } else {
        //Need code in here that reads whether or not the group check box is checked. Need to run different code if it is.
        var caseManagerId = $('#casenotesbillerfiltertext').attr('billerid');
        if ($.session.isPSI == true) {
            $.session.PeopleId = caseManagerId;
        }
        if ((caseManagerId == '000' || caseManagerId == '0')) {
            $("#casenoteerrormessage").text("Biller cannot be set to 'All' for save or edit.");
        } else {
            var noteId = '0';
            if ($.session.editCaseNoteId != '') {
                noteId = $.session.editCaseNoteId;
            }
            if ($.session.consumerIdToEdit != '') {
                consumerId = $.session.consumerIdToEdit;
            } else {
                var consumerId = $('.highlightselected').attr('id');
            }

            //beginOverlapCheck();


            var reviewRequired = 'N';
            var confidential = 'N';
            var serviceOrBillingCodeId = $('#cnbillingcodedropdownfilterbox').attr('billingcodeid');
            var locationCode = $('#cnlocationdropdownfilterbox').attr('loccode');
            var serviceCode = $('#cnservicedropdownfilterbox').attr('servicecode');
            var needCode = $('#cnneeddropdownfilterbox').attr('needcode');
            if (needCode == undefined) {
                needCode = "";
            }
            var serviceDate = $('#newcasenoteservicedatebox').val();
            var newDate = new Date(serviceDate);
            serviceDate = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());
            var compareServiceDate = $.format.date(new Date(serviceDate), 'MM/dd/yyyy');
            var startTime = $('#newcasenoteservicestarttimebox').val();
            startTime = convertTimeToMilitary(startTime);
            //var endTime = $('#newcasenoteserviceendtimebox').val();
            endTime = convertTimeToMilitary(endTime);
            var vendorId = $('#cnvendordropdownfilterbox').attr('vendorId');
            var contactCode = $('#cncontactdropdownfilterbox').attr('contactcode');
            var serviceLocationCode = $('#cnservicelocationdropdownfilterbox').attr('servicelocationcode');
            if (serviceLocationCode == undefined) {
                serviceLocationCode = '';
            }
            if (serviceLocationCode.length == 1) {
                serviceLocationCode = "0" + serviceLocationCode;
            }
            var caseNote = $('#casenotetext').val();
            caseNote = removeUnsavableNoteText(caseNote);
            if ($.session.reviewRequired == 'Y') {
                reviewRequired = 'Y';
            }
            if ($('#confidentialcb').is(':checked')) {
                confidential = 'Y';
            }
            var test = $("#casenoteerrormessage").text();
            //New mileage and transportation and timer data
            var casenotemileage = $("#cnmileagetextarea").val();
            var casenotetraveltime = $("#cntraveltimetextarea").val();//MAT needs to be seconds. Putting in generically just to get database functionality working
            //casenotetraveltime = convertMinutesToSeconds(casenotetraveltime);
            //var documentationTime = $.caseNotes.documentTimeSeconds;
            var documentationTime = formatDocTimeForSave();
            clearTimerOnSave();
            //Check if a note has been entered
            if (caseNote == "") {
                //Do nothing. Need to throw an error message
                $("#casenoteerrormessage").text("You must have case note text.");
            } else if (consumerId == '' || consumerId == undefined) {
                $("#casenoteerrormessage").text("You must have a consumer selected.");
            } else if (($.session.locationRequiredCheck == true && locationCode == '') || ($.session.serviceRequiredCheck == true && serviceCode == '') || ($.session.needRequiredCheck == true && needCode == '')
                        || ($.session.contactRequiredCheck == true && contactCode == '') || ($.session.vendorRequiredCheck == true && vendorId == '')) {
                $("#casenoteerrormessage").text("You must complete all required fields before saving.");
            } else {
                //set personal preferences
                if ($.session.usePersonalPrefernces == 'Y') {
                    saveCaseNotesPersonalPreferences();
                }
                if ($.session.existingGroupNoteIdForUpdate != "") {
                    if ($.session.applicationName == 'Gatekeeper') {
                        updateGroupNoteFlag = updateGroupNoteCheckGatekeeper(serviceOrBillingCodeId, compareServiceDate, startTime, endTime);
                    } else {
                        updateGroupNoteFlag = updateGroupNoteCheckAdvisor(serviceOrBillingCodeId, compareServiceDate, startTime, endTime);
                    }
                }
                var num = $('.groupcasenoteadditionalnamedetails').html();
                if ($('.groupcasenoteadditionalnamedetails').html() != "" && $('.groupcasenoteadditionalnamedetails').html() != undefined) {
                    $('.highlightselected').each(function (index) {
                        //selectedUserName = this.innerText;
                        var temp = $(this);
                        var firstName = temp.find("#namebox").clone().children().remove().end().text();
                        var lastName = temp.find(".lastnametextselected").text();
                        selectedUserName = [firstName, lastName].join(" ");
                        if ($.session.groupAddOnNames.indexOf(selectedUserName) != -1) {
                            consumerId = $(this).attr('id');
                            saveAdditionalGroupCaseNote(noteId, $.session.existingGroupNoteIdForUpdate, caseManagerId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, reviewRequired, confidential, caseNote, casenotemileage, casenotetraveltime, documentationTime);
                        }
                    });
                }
                var matchedIDs = $.grep([consumerId], function (id) {
                    return $.caseNotes.mileageConsumerIds.indexOf(id + "") !== -1;
                });

                if ($.session.applicationName != 'Gatekeeper') {
                    //console.log($.caseNotes.mileageConsumerIds, matchedIDs, casenotemileage);
                    if (matchedIDs.length) {
                        //$('#cnmileage').show();
                    }
                    else casenotemileage = "0";
                }
                saveSingleCaseNote(noteId, $.session.PeopleId, consumerId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, serviceDate, startTime, endTime, vendorId, contactCode, serviceLocationCode, reviewRequired, confidential, caseNote, casenotemileage, casenotetraveltime, documentationTime);

                //startOverlapCheck();
                if (updateGroupNoteFlag == true && $.session.updateAllGroupDropDowns == false) {
                    //call update function
                    updateGroupNoteValues($.session.existingGroupNoteIdForUpdate, noteId, serviceOrBillingCodeId, serviceDate, startTime, endTime);
                    updateGroupNoteFlag == false;
                } else if (updateGroupNoteFlag == true && $.session.updateAllGroupDropDowns == true) {
                    //call update function
                    updateGroupNoteValuesAndDropDowns($.session.existingGroupNoteIdForUpdate, noteId, serviceOrBillingCodeId, locationCode, serviceCode, needCode, contactCode, serviceDate, startTime, endTime);
                    updateGroupNoteFlag == false;
                }
                $.session.caseNoteEditSecond = false;
                $.session.groupAddOnNames = [];
                //startCaseNoteTimer('clear'); //clears the timer
                $.caseNotes.documentTimeSeconds = 0; //resets the save value
            }
        }
    }
}

function updateGroupNoteCheckAdvisor(serviceOrBillingCodeId, compareServiceDate, startTime, endTime) {
    if ((serviceOrBillingCodeId != $.session.serviceOrBillingCodeForGroupNoteUpdateCompare) || (compareServiceDate != $.session.serviceDateForGroupNoteUpdateCompare) || (startTime != $.session.startTimeForGroupNoteUpdateCompare) || (endTime != $.session.endTimeForGroupNoteUpdateCompare)) {
        if (serviceOrBillingCodeId != $.session.serviceOrBillingCodeForGroupNoteUpdateCompare) {
            $.session.updateAllGroupDropDowns = true;
        } else {
            $.session.updateAllGroupDropDowns = false;
        }
        return true;
    }
    else {
        return false;
    }
}

function updateGroupNoteCheckGatekeeper(serviceOrBillingCodeId, compareServiceDate, startTime, endTime) {
    if ((compareServiceDate != $.session.serviceDateForGroupNoteUpdateCompare) || (startTime != $.session.startTimeForGroupNoteUpdateCompare) || (endTime != $.session.endTimeForGroupNoteUpdateCompare)) {
        if (serviceOrBillingCodeId != $.session.serviceOrBillingCodeForGroupNoteUpdateCompare) {
            $.session.updateAllGroupDropDowns = true;
        } else {
            $.session.updateAllGroupDropDowns = false;
        }
        return true;
    }
    else {
        return false;
    }
}

//update case_notes 
//set notes = 'This is a test note \x0a new line here'
//where id = 212

function deleteCaseNote() {
    return Anywhere.promptYesNo("Are you sure you wish to delete this record?", function () {
        var noteId = '0';
        clearInterval(textCheck);
        if ($.session.editCaseNoteId != '') {
            noteId = $.session.editCaseNoteId;
            deleteExistingCaseNote(noteId);
        }
    });
    
}

function getReviewRequiredAndDefaultBillingCode() {
    var caseManagerId = $('#casenotesbillerfiltertext').attr('billerid');
    if ((caseManagerId == '000' || caseManagerId == '0') && $.session.isPSI == false) {
        $("#casenoteerrormessage").text("Biller cannot be set to 'All' for save or edit.");
    } else {
        if ($.session.isPSI == true) {
            populateDropdownData();
        } else {
            getReviewRequiredForCaseManager(caseManagerId);
        }        
    }
}

function setReviewRequired(res) {
    var isReviewRequired = 'N';
    $.session.defaultSeviceId = '';
    $.session.defaultSeviceName = '';
    $('results', res).each(function () {
        isReviewRequired = $('reviewrequired', this).text();
        $.session.defaultSeviceId = $('serviceid', this).text();
        $.session.defaultSeviceName = $('servicecode', this).text();
    });
    if (isReviewRequired == 'Y') {
        //$('#reviewrequiredcb').attr('checked', true);
        $.session.reviewRequired = 'Y';
    } else {
        $.session.reviewRequired = 'N';
    }
    //populateDefaultServiceCode(defaultSeviceId, defaultServiceName);
    populateDropdownData();
}

function populateDefaultServiceCode(id, name) {

}

function setPersonalPreferencesVariable() {
    if ($('#cnpersonalprefs').is(':checked')) {
        $.session.usePersonalPrefernces = 'Y';
    } else {
        $.session.usePersonalPrefernces = 'N';
        $.session.caseNotePreferencesSet = false;
    }
}

function changeBillerForFilter(id, name) {
    if ($.session.applicationName == 'Gatekeeper') {
        getDocTimeEditPermissionAjax(id);
    }
    $("*").addClass("waitingCursor");
    if ($.session.vendorFlag == false) {
        getConsumerSpecificVendors(id);
    }
    $.session.vendorFlag = true;
    $('#casenotesbillerfiltertext').html(name).attr('billerid', id);
    $("#billerfilterpop").css("display", "none");
    //getFilteredCaseNotesListDataSetter();
    if ($.session.caseNoteEdit == false) {
        // getReviewRequiredAndDefaultBillingCode();
    }
    var userName = name;
    userName = userName.replace(/\s+/g, '');
    var sessionName = ($.session.Name + $.session.LName);
    sessionName = sessionName.replace(/\s+/g, '');
    if ((userName != sessionName) || $.session.CaseNotesUpdate == false) {
        $.caseNotes.differentUserNoEdit = true;
    } else {
        $.caseNotes.differentUserNoEdit = false;
    }
    $.session.caseNoteEdit = false;
    $.caseNotes.billerName = name;
    $("*").removeClass("waitingCursor");

}

function popFilterBiller() {
    if ($.session.CaseNotesViewEntered == true) {
        return;
    }

    $("#billerfilterpop").css("display", "block");
}

function clearCaseNoteDropdownValues() {
    $('#cnlocationdropdownfilterbox').html('').attr('loccode', '');
    $('#cncontactdropdownfilterbox').html('').attr('contactcode', '');
    $('#cnservicedropdownfilterbox').html('').attr('servicecode', '');
    $('#cnneeddropdownfilterbox').html('').attr('needcode', '');
}

//Changes whether or not save button is displayed on screen
function toggleSaveButton() {
    if (($('.cnresultserrorbox').length > 0) || ($('.neednote').length > 0)) {
        //Show Save Button
        $("#casenotesavebutton").css("display", "none");
    } else {
        //Hide Save Buton
        $("#casenotesavebutton").css("display", "block");
    }
}

//Drop down jquery code
//Billing code drop down jquery functionality
function changeCNBillingCode(id, funding, name, tmpServiceRequired, tmpLocationRequired, tmpNeedRequired, tmpContactRequired, tmpAllowGroupNotes, tmpMileageRequired, tmpDocTimeRequired, tmpTravelTimeRequired) {
    var groupPass = 'Y';
    $.caseNotes.popupclick = false;
    var gkLoop = false;
    $.session.billingCodeDropDownChange = true;
    if ($.session.applicationName == 'Gatekeeper' && $.session.gkGroupEdit == true && (tmpAllowGroupNotes == 'N' || tmpAllowGroupNotes == '') && $.session.editOnLoad == false) {
        $("#casenoteerrormessage").css("display", "block").text("The billing code you selected cannot be used on a group note.");
        groupPass = 'N';
        gkLoop = true;
    } else {
        $("#casenoteerrormessage").text("").html("");
        //$("#casenoteerrormessage").css("display", "none");
    }
    if ($.session.applicationName == 'Advisor' && $.session.advGroupEdit == true && funding == 'Y') {
        $("#casenoteerrormessage").css("display", "block").text("The billing code you selected cannot be used on a group note.");
        groupPass = 'N';
    } else {
        if (gkLoop == false) {
            $("#casenoteerrormessage").text("").html("");
            //$("#casenoteerrormessage").css("display", "none");
        }
    }
    if (groupPass == 'Y') {
        //if (tmpAllowGroupNotes == 'Y') {
        //    $("#cnbillingcodefilterpop").css("display", "none");
        //    $("#casenoteerrormessage").text("Group notes are not allowed for billing codes that allow documentation time.");
        //    //alert("Group notes are not allowed for billing codes that allow documentation time.");
        //} else {
        if ($.session.applicationName == 'Gatekeeper') {
            $("#casenoteerrormessage").text("");
            if (id != "" && name != "") {// && $.caseNotes.noTimerEdit == false) {
                setRequiredMileageAndTimeData(tmpMileageRequired, tmpDocTimeRequired, tmpTravelTimeRequired, tmpAllowGroupNotes);
            } else {
                $.session.groupNoteAttemptWithDocTime == false
            }
            if ($.session.groupNoteAttemptWithDocTime == false) {
                $('#cnbillingcodedropdownfilterbox').html(name).attr('billingcodeid', id).attr('servicefunding', funding);
                populateCaseNoteDropdowns(id, name);
                if ($.session.caseNoteEdit == false) {
                    setRequiredDropDowns(tmpServiceRequired, tmpLocationRequired, tmpNeedRequired, tmpContactRequired);
                }

                if (tmpMileageRequired == 'Y' && $.session.applicationName == 'Gatekeeper') {
                    $('#cnmileage').show();
                }
                if (tmpTravelTimeRequired == 'Y' && $.session.applicationName == 'Gatekeeper') {
                    $('#cntraveltime').show();
                }
                if ($('#newcasenoteserviceendtimebox').val() != "") {
                    $("#endreqerror").removeClass("cnresultserrorbox");
                }
                $.session.caseNoteEdit = false;
                $("#cnbillingcodefilterpop").css("display", "none");
                if (funding == 'Y' && $.session.applicationName == 'Advisor') {
                    $.session.showDynamic = true;
                    $("#groupcncheckbox").css("display", "none");
                    getServiceLocationsForCaseNoteDropDown();
                    //$("#groupcncheckbox").css("display", "block");
                } else if ((tmpAllowGroupNotes == 'Y' || tmpAllowGroupNotes == '') && $.session.applicationName == 'Gatekeeper' && tmpDocTimeRequired == 'N') {//New stuff
                    $('.casenotedoctime').hide();
                    $("#groupcncheckbox").css("display", "block");
                } else if (tmpAllowGroupNotes == 'N' && $.session.applicationName == 'Gatekeeper') {//New stuff
                    $('#groupcasenotecb').attr('checked', false);
                    $("#groupcncheckbox").css("display", "none");
                } else if (funding == 'N' && $.session.applicationName == 'Advisor') {
                    $('.casenotedoctime').hide();
                    $("#groupcncheckbox").css("display", "block");
                    $("#cnservicelocationdropdownfilterbox").css("display", "none");
                    $(".dynamic").css("display", "none");
                    changeCNServiceLocation("", "");
                    $.session.showDynamic = false;
                } else {
                    $("#cnservicelocationdropdownfilterbox").css("display", "none");
                    $(".dynamic").css("display", "none");
                    $.session.showDynamic = false;
                }
                //This is what fixed #22396
                if ($.caseNotes.popupclick == false) {
                    toggleSaveButton();
                }

            }

        } else {
            $('#cnbillingcodedropdownfilterbox').html(name).attr('billingcodeid', id).attr('servicefunding', funding);
            populateCaseNoteDropdowns(id, name);
            if ($.session.caseNoteEdit == false) {
                setRequiredDropDowns(tmpServiceRequired, tmpLocationRequired, tmpNeedRequired, tmpContactRequired);
            }

            if (tmpMileageRequired == 'Y' && $.session.applicationName == 'Gatekeeper') {
                $('#cnmileage').show();
            }
            if (tmpTravelTimeRequired == 'Y' && $.session.applicationName == 'Gatekeeper') {
                $('#cntraveltime').show();
            }
            if ($('#newcasenoteserviceendtimebox').val() != "") {
                $("#endreqerror").removeClass("cnresultserrorbox");
            }
            $.session.caseNoteEdit = false;
            $("#cnbillingcodefilterpop").css("display", "none");
            if (funding == 'Y' && $.session.applicationName == 'Advisor') {
                $.session.showDynamic = true;
                $("#groupcncheckbox").css("display", "none");
                getServiceLocationsForCaseNoteDropDown();
                //$("#groupcncheckbox").css("display", "block");
            } else if ((tmpAllowGroupNotes == 'Y' || tmpAllowGroupNotes == '') && $.session.applicationName == 'Gatekeeper' && tmpDocTimeRequired == 'N') {//New stuff
                $('.casenotedoctime').hide();
                $("#groupcncheckbox").css("display", "block");
            } else if (tmpAllowGroupNotes == 'N' && $.session.applicationName == 'Gatekeeper') {//New stuff
                $('#groupcasenotecb').attr('checked', false);
                $("#groupcncheckbox").css("display", "none");
            } else if (funding == 'N' && $.session.applicationName == 'Advisor') {
                $('.casenotedoctime').hide();
                $("#groupcncheckbox").css("display", "block");
                $("#cnservicelocationdropdownfilterbox").css("display", "none");
                $(".dynamic").css("display", "none");
                changeCNServiceLocation("", "");
                $.session.showDynamic = false;
            } else {
                $("#cnservicelocationdropdownfilterbox").css("display", "none");
                $(".dynamic").css("display", "none");
                $.session.showDynamic = false;
            }
            //This is what fixed #22396
            toggleSaveButton();
        }

    }

    else {
        //Do nothing
    }
    //if (tmpMileageRequired == 'Y' && $.session.applicationName == 'Gatekeeper') {
    //    $('#cnmileage').show();
    //}
    //if (tmpTravelTimeRequired == 'Y' && $.session.applicationName == 'Gatekeeper') {
    //    $('#cntraveltime').show();
    //}
    $.session.editOnLoad = false;
}

function popFilterCNBillingCode() {
    if ($("#cnbillingcodefilterpop").has("a").length) {
        $("#cnbillingcodefilterpop").css("display", "block");
    }

}

//Location drop down jquery functionality
function changeCNLocation(code, name) {
    $('#cnlocationdropdownfilterbox').html(name);
    $('#cnlocationdropdownfilterbox').attr('loccode', code);
    $("#cnlocationfilterpop").css("display", "none");
    if (name != '' && $.session.locationRequiredCheck == true) {
        $('#locationreqerror').removeClass("cnresultserrorbox");
    } else if (name == '' && $.session.locationRequiredCheck == true) {
        $('#locationreqerror').addClass("cnresultserrorbox");
    }
    toggleSaveButton();
}
function popFilterCNLocation() {
    if ($("#cnlocationfilterpop").has("a").length) {
        $("#cnlocationfilterpop").css("display", "block");
    }
}
//Vendor drop down jqueyr functionality
function changeCNVendor(id, name) {
    $('#cnvendordropdownfilterbox').html(name);
    $('#cnvendordropdownfilterbox').attr('vendorid', id);
    $("#cnvendorfilterpop").css("display", "none");
}
function popFilterCNVendor() {
    //if ($("#cnvendorfilterpop").has("a").length) {
    $("#cnvendorfilterpop").css("display", "block");
    //}
}
//Contact drop down jquery functionality
function changeCNContact(code, name) {
    $('#cncontactdropdownfilterbox').html(name);
    $('#cncontactdropdownfilterbox').attr('contactcode', code);
    $("#cncontactfilterpop").css("display", "none");
    if (name != '' && $.session.contactRequiredCheck == true) {
        $('#contactreqerror').removeClass("cnresultserrorbox");
    } else if (name == '' && $.session.contactRequiredCheck == true) {
        $('#contactreqerror').addClass("cnresultserrorbox");
    }
    toggleSaveButton();
}
function popFilterCNContact() {
    if ($("#cncontactfilterpop").has("a").length) {
        $("#cncontactfilterpop").css("display", "block");
    }
}

//Service drop down 
//function changeCNService(code, name, serviceRequired, locationRequired, needRequired, contactRequired) {
function changeCNService(code, name) {
    $('#cnservicedropdownfilterbox').html(name);
    $('#cnservicedropdownfilterbox').attr('servicecode', code);
    $("#cnservicefilterpop").css("display", "none");
    if (name != '' && $.session.serviceRequiredCheck == true) {
        $('#servicereqerror').removeClass("cnresultserrorbox");
    } else if (name == '' && $.session.serviceRequiredCheck == true) {
        $('#servicereqerror').addClass("cnresultserrorbox");
    }
    toggleSaveButton();
}
function popFilterCNService() {
    if ($("#cnservicefilterpop").has("a").length) {
        $("#cnservicefilterpop").css("display", "block");
    }

}

//Service Location drop down jquery functionality
function changeCNServiceLocation(code, name) {
    $('#cnservicelocationdropdownfilterbox').html(name);
    $('#cnservicelocationdropdownfilterbox').attr('servicelocationcode', code);
    $("#cnservicelocationfilterpop").css("display", "none");
}
function popFilterCNServiceLocation() {
    if ($("#cnservicelocationfilterpop").has("a").length) {
        $("#cnservicelocationfilterpop").css("display", "block");
    }
}

//Need drop down jquery functionality
function changeCNNeed(code, name) {
    $('#cnneeddropdownfilterbox').html(name);
    $('#cnneeddropdownfilterbox').attr('needcode', code);
    $("#cnneedfilterpop").css("display", "none");
    if (name != '' && $.session.needRequiredCheck == true) {
        $('#needreqerror').removeClass("cnresultserrorbox");
    } else if (name == '' && $.session.needRequiredCheck == true) {
        $('#needreqerror').addClass("cnresultserrorbox");
    }
    toggleSaveButton();
}
function popFilterCNNeed() {
    if ($("#cnneedfilterpop").has("a").length) {
        $("#cnneedfilterpop").css("display", "block");
    }
}

function addZero(n) {
    return n < 10 ? '0' + n : n
}

function setRequiredDropDowns(serviceRequired, locationRequired, needRequired, contactRequired) {
    if (serviceRequired == 'Y') {
        $.session.serviceRequiredCheck = true;
        $('#servicereqerror').addClass("cnresultserrorbox");
    } else {
        $.session.serviceRequiredCheck = false;
        $('#servicereqerror').removeClass("cnresultserrorbox");
    }
    if (locationRequired == 'Y') {
        $.session.locationRequiredCheck = true;
        $('#locationreqerror').addClass("cnresultserrorbox");
    } else {
        $.session.locationRequiredCheck = false;
        $('#locationreqerror').removeClass("cnresultserrorbox");
    }
    if (needRequired == 'Y') {
        $.session.needRequiredCheck = true;
        $('#needreqerror').addClass("cnresultserrorbox");
    } else {
        $.session.needRequiredCheck = false;
        $('#needreqerror').removeClass("cnresultserrorbox");
    }
    if (contactRequired == 'Y') {
        $.session.contactRequiredCheck = true;
        $('#contactreqerror').addClass("cnresultserrorbox");
    } else {
        $.session.contactRequiredCheck = false;
        $('#contactreqerror').removeClass("cnresultserrorbox");
    }
    //if ($.session.applicationName == 'Gatekeeper') {
    //    $.session.vendorRequiredCheck = true;
    //    $('#vendorreqerror').addClass("cnresultserrorbox");
    //} else {
    //    $.session.vendorRequiredCheck = false;
    //    $('#vendorreqerror').removeClass("cnresultserrorbox");
    //}
    $('#endreqerror').addClass("cnresultserrorbox");
    if ($('#casenotetext').val() == '') {
        $('.casenotetextimage').css('background-color', 'red');
        $('.casenotetextimage').addClass("neednote");
    } else {
        $('.casenotetextimage').css('background-color', '#70b1d8');
        $('.casenotetextimage').removeClass("neednote");
    }
}
//Test
function setRequiredMileageAndTimeData(mileageRequired, docTimeRequired, travelTimeRequired, tmpAllowGroupNotes) {
    //$.session.gkGroupEdit = false
    //setTimeout(function () {
    $.session.groupNoteAttemptWithDocTime = false;
    var flag = 0;
    if (docTimeRequired == 'Y' && $('#groupcasenotecb').is(':checked')) {// && $.session.gkGroupEdit == false && $.session.isSingleEdit == false) {
        $.session.groupNoteAttemptWithDocTime = true;
        $("#cnbillingcodefilterpop").css("display", "none");
        $("#casenoteerrormessage").text("Group notes are not allowed for billing codes that allow documentation time.");
        return;
    }
    if (docTimeRequired == 'Y' && tmpAllowGroupNotes == 'Y' && $.session.gkGroupEdit == false) {
        $('#groupcncheckbox').hide();
        flag = 1;
    }
    if (docTimeRequired == 'N' && tmpAllowGroupNotes == 'Y' && $('.casenotedoctime').is(":visible")) {//&& $.session.isSingleEdit == true) {
        //$.session.groupNoteAttemptWithDocTime = true;
        //$("#cnbillingcodefilterpop").css("display", "none");
        //$("#casenoteerrormessage").text("Group notes are not allowed for billing codes that allow documentation time.");
        //return;
        $('#seconds').html("0");
        $('#minutes').html("0");
        clearTimerOnSave();
    }

    var selectedConsumerCount = $(".highlightselected").length;
    if (((($('#groupcasenotecb').is(':checked') || (selectedConsumerCount > 1)) && docTimeRequired == 'Y') && $.session.editNoteMileageOnLoadFlag == false) && flag == 0) {// || $('.casenotedoctime').is(":visible")           || tmpAllowGroupNotes == 'Y')
        //alert("Group notes are not allowed for billing codes that allow documentation time.");
        if (selectedConsumerCount > 1 && tmpAllowGroupNotes == 'N' && $.session.isSingleEdit == false) {
            //alert("Group notes are not allowed for billing codes that allow documentation time.");
            $("#casenoteerrormessage").text("Group notes are not allowed for billing codes that allow documentation time.");
            changeCNBillingCode("", "", "");
            $('.cnresultserrorbox').hide();
            $('.casenotetextimage').css("background-color", "#70b1d8");
            $.session.groupNoteAttemptWithDocTime = true;
        } else {
            $.session.groupNoteAttemptWithDocTime = true;
            $("#cnbillingcodefilterpop").css("display", "none");
            $("#casenoteerrormessage").text("Group notes are not allowed for billing codes that allow documentation time.");
        }

    } else {
        $.session.editNoteMileageOnLoadFlag = false;
        if ($.session.applicationName == 'Gatekeeper') {
            if (mileageRequired == 'Y') {
                $('#cnmileage').show();
            } else {
                $('#cnmileage').hide();
            }
        }
        if (travelTimeRequired == 'Y') {
            $('#cntraveltime').show();
        } else {
            $('#cntraveltime').hide();
            $('#cntraveltimetextarea').val("");
            clearTravelTimeOnChangeAjax($.session.editingNoteId);
        }
        $("#casenoteerrormessage").text("");
        if (docTimeRequired == 'Y' && $.session.gkGroupEdit == false) {
            $('.casenotedoctime').show();
            if ($.session.batchedNoteEdit == true) {
                $(".casenotedoctime").addClass("unclickableElement").prop("disabled", true);
                $("#editcasenotestimer").css('background-color', '#eee');
            }
            //if ($.session.cnEdit == false) {
            if ($.session.batchedNoteEdit == false && $.caseNotes.differentUserNoEdit == false) {
                var answer = confirm("This service code allows doc time. Would you like to start the timer?")
                if (answer) {
                    startCaseNoteTimer();
                    if ($.session.cnEdit == true) {
                        toggleSaveButton();
                        $.caseNotes.popupclick = true;
                    }
                }
                else {
                    //Do Nothing
                }
            }
            $('#groupcncheckbox').hide();
        } else {
            $('.casenotedoctime').hide();
            $('#cnTimerStart').css('background', '#eee');
        }
    }
    //}, 1000);
}

function saveCaseNotesPersonalPreferences() {
    $.session.caseNoteBillingCodeCodePreference = $('#cnbillingcodedropdownfilterbox').attr('billingcodeid'); //billing/Service code drop down
    $.session.caseNoteBillingCodeServiceFundingPreference = $('#cnbillingcodedropdownfilterbox').attr('servicefunding'); //billing/Service code drop down
    $.session.caseNoteBillingCodeNamePreference = $('#cnbillingcodedropdownfilterbox').text(); //billing/Service code drop down
    $.session.caseNoteLocationCodePreference = $('#cnlocationdropdownfilterbox').attr('loccode'); //location drop down
    $.session.caseNoteLocationNamePreference = $('#cnlocationdropdownfilterbox').text(); //location drop down
    $.session.caseNoteNeedCodePreference = $('#cnneeddropdownfilterbox').attr('needcode'); //need drop down
    $.session.caseNoteNeedNamePreference = $('#cnneeddropdownfilterbox').text(); //need drop down
    $.session.caseNoteServiceCodePreference = $('#cnservicedropdownfilterbox').attr('servicecode'); //service drop down
    $.session.caseNoteServiceNamePreference = $('#cnservicedropdownfilterbox').text(); //service drop down 
    $.session.caseNoteContactCodePreference = $('#cncontactdropdownfilterbox').attr('contactcode');//contact drop down
    $.session.caseNoteContactNamePreference = $('#cncontactdropdownfilterbox').text();//contact drop down
    if ($.session.tempServiceFunding == 'Y') {
        $.session.caseNoteServiceFundingPreference = 'Y'
    } else {
        $.session.caseNoteServiceFundingPreference = 'N'
    }
    if ($('#groupcncheckbox').css('display') == 'none') {
        $.session.caseNoteDisplayGroupNoteDivPreference = false;
    } else {
        $.session.caseNoteDisplayGroupNoteDivPreference = true;
    }
    //if ($('#groupcasenotecb').is(':checked')) {
    //    $.session.caseNoteDisplayGroupNoteCheckedPreference = true;
    //} else {
    //    $.session.caseNoteDisplayGroupNoteCheckedPreference = false;
    //}        
    $.session.caseNotePreferencesSet = true;
}

function groupNoteUneditableFields() {
    $('#cnvendordropdownfilterbox').addClass('unclickableElement');
    $('#groupcasenotecb').attr('disabled', true).attr('readonly', true);// has to be unclickable unless they delete all other notes in group
}


function batchedNoteUneditable() {
    if ($.session.applicationName == 'Gatekeeper') {
        $([
            "#cnbillingcodedropdownfilterbox",
            "#cnlocationdropdownfilterbox",
            "#cnservicedropdownfilterbox",
            "#cnservicelocationdropdownfilterbox",
            "#cnneeddropdownfilterbox",
            "#cncontactdropdownfilterbox",
            "#newcasenoteservicedatebox",
            "#newcasenoteservicestarttimebox",
            "#newcasenoteserviceendtimebox",
            "#cnvendordropdownfilterbox",
            "#calendaricon",
            "#starttimeicon",
            "#endtimeicon",
            "#casenotetext",
            "#casenotedate",
            "#notestarttime",
            "#noteendtime",
            "#groupcasenotecb",
            ".consumerselected",
            "#cnmileagetextarea",
            "#cntraveltimetextarea",
            "#casenotedoctime"
        ].join(", ")).addClass("unclickableElement").prop("disabled", true);
        $('#confidentialcb, #groupcasenotecb').attr('disabled', '');

        $('#casenotesavebutton, #casenotedeletebutton').css('display', 'none');

        $('#cnTimerStart').hide();
        $('#cnTimerStop').hide();
    } else {
        $([
            ".consumerselected",
            "#cnlocationdropdownfilterbox",
            ".casenotedoctime",
            "#cnbillingcodedropdownfilterbox",
            "#cncontactdropdownfilterbox",
            "#cnservicedropdownfilterbox",
            "#cnneeddropdownfilterbox",
            "#cnservicelocationdropdownfilterbox",
            "#newcasenoteservicedatebox",
            "#casenotetext",
            "#casenotedate",
            "#newcasenoteservicestarttimebox",
            "#cnvendordropdownfilterbox",
            "#notestarttime",
            "#newcasenoteserviceendtimebox",
            "#noteendtime",
            "#cnservicelocationdropdownfilterbox",
            "#groupcasenotecb",
            "#cnmileagetextarea"
        ].join(", ")).addClass("unclickableElement").prop("disabled", true);
        $('#confidentialcb, #groupcasenotecb').attr('disabled', '');

        $('#casenotesavebutton, #casenotedeletebutton').css('display', 'none');
        $('#cnTimerStart').hide();
        $('#cnTimerStop').hide();
    }
}

function differentUserUneditable() {
    $([
        "#cnbillingcodedropdownfilterbox",
        "#cnlocationdropdownfilterbox",
        "#cnservicedropdownfilterbox",
        "#cnservicelocationdropdownfilterbox",
        "#cnneeddropdownfilterbox",
        "#cncontactdropdownfilterbox",
        "#newcasenoteservicedatebox",
        "#newcasenoteservicestarttimebox",
        "#newcasenoteserviceendtimebox",
        "#cnvendordropdownfilterbox",
        "#calendaricon",
        "#starttimeicon",
        "#endtimeicon",
        "#confidentialcb",
        "#groupcasenotecb",
        "#casenotetext",
        "#casenotedate",
        "#notestarttime",
        "#noteendtime",
        "#cntraveltime",
        "#cnmileagetextarea",
        "#cnmileage",
        "#cntraveltimetextarea",
        ".casenotedoctime",
        "#cnmileagetextarea"
    ].join(", ")).addClass("unclickableElement").prop("disabled", true);
    $('.casenotedoctime').addClass("unclickableElement").prop("disabled", true);
    $('#editcasenotestimer').addClass("unclickableElement").prop("disabled", true).css("background-color", "#eee");
    $('#minutes').addClass("unclickableElement").prop("disabled", true).prop("contenteditable", false);
    $('#confidentialcb').attr('onclick', 'return false');
    $('#casenotesavebutton, #casenotedeletebutton').css('display', 'none');
    $('#groupcasenotecb').attr('onclick', 'return false');
    $('#cnTimerStart, #cnTimerStop').hide();
}

function sameUserEditable() {
    $([
        ".consumerselected",
        "#cnbillingcodedropdownfilterbox",
        "#cnlocationdropdownfilterbox",
        "#cnservicedropdownfilterbox",
        "#cnservicelocationdropdownfilterbox",
        "#cnneeddropdownfilterbox",
        "#cncontactdropdownfilterbox",
        "#newcasenoteservicedatebox",
        "#newcasenoteservicestarttimebox",
        "#newcasenoteserviceendtimebox",
        "#cnvendordropdownfilterbox",
        "#calendaricon",
        "#starttimeicon",
        "#endtimeicon",
        "#confidentialcb",
        "#groupcasenotecb",
        "#casenotetext",
        "#casenotedate",
        "#notestarttime",
        "#noteendtime"
    ].join(", ")).removeClass('unclickableElement').prop("disabled", false);

    $('#confidentialcb').attr('onclick', '');
    $('#groupcasenotecb').attr('onclick', '');

    $('#casenotesavebutton, #casenotedeletebutton').css('display', 'block');
    $('#casenotedeletebutton').css('display', 'block');
}

function blowUpTempNote(noteId) {
    var blowUpWindow = "<div id='cnblowupwindow' class='cnblowupwindow'>" +
                        "<textarea readonly id='cnblowuptextarea'></textarea>" +
                    "</div>";

    $("#actioncenter").append(blowUpWindow);

    var test = $('#' + noteId)[0];

    var cellText = $('#' + noteId).find($(".cnnotesummary")).text();

    $("#cnblowuptextarea").append(cellText);
}

function caseNoteErrorBox(errorMessage) {

}
var textCheck = function textCheckFuction() {
    setInterval(checkForText, 1);
}

function checkForText() {
    if ($('#casenotetext').val() == '') {
        $('.casenotetextimage').css('background-color', 'red');
        $('.casenotetextimage').addClass("neednote");
        toggleSaveButton();
    } else {
        $('.casenotetextimage').css('background-color', '#70b1d8');
        $('.casenotetextimage').removeClass("neednote");
        toggleSaveButton();
    }
}

function noCaseLoadUnclickable() {
    //Have to do class or else it only does first id
    $('.calendaricon').addClass("unclickableElement");
    $('.clearcasecalanders').addClass("unclickableElement");
    $('#casenotesbillerfiltertext').addClass("unclickableElement");
    //$('#newnote').addClass("unclickableElement");
    $('#editnote').addClass("unclickableElement");
}

function pauseTimer(fromInactive) {
    clearInterval($.caseNotes.interval);
    clearTimeout($.caseNotes.inactTime);
    clearTimeout($.caseNotes.inactiveTimeForClear);
    clearInterval(inactivityTime);
    clearTimeout(inactivityTime);
    $.caseNotes.inactTime = 0;
    window.onload = null;
    document.onmousemove = null;
    document.onkeypress = null;
    $('#cnTimerStart').css('background', '#eee');
    $("#minutes").attr("contenteditable", 'true');
    $("#minutes").removeClass("unclickableElement");
    $("#editcasenotetimer").removeClass("unclickableElement");
    if (fromInactive) {

    } else {
        displayDocTime();//
    }

}

function clearTimerOnSave() {
    clearInterval($.caseNotes.interval);
    clearTimeout($.caseNotes.inactTime);
    clearTimeout($.caseNotes.inactiveTimeForClear);
    clearInterval(inactivityTime);
    clearTimeout(inactivityTime);
    //$.caseNotes.inactTime = 0;
    $.caseNotes.documentTimeSeconds = 0;
    window.onload = null;
    document.onmousemove = null;
    document.onkeypress = null;
}

function formatDocTimeForSave() {
    var minutesLabel = document.getElementById("minutes");
    //var secondsLabel = document.getElementById("seconds");
    var totalSeconds = 0;
    ////
    var tests = minutesLabel.innerHTML;
    if (tests == "" || tests == "<br>") {
        $.caseNotes.documentTimeSeconds = 0;
    }
    if (tests != "" && tests != "<br>") {
        totalSeconds = (parseInt(minutesLabel.innerHTML) * 60);
    }

    //return totalSeconds;
    if ($.caseNotes.documentTimeSeconds != 0) {
        return $.caseNotes.documentTimeSeconds;
    } else {
        return totalSeconds;
    }

}

function displayDocTime() {
    var minutesLabel = document.getElementById("minutes");
    seconds = pad($.caseNotes.documentTimeSeconds % 60);
    minutes = parseInt($.caseNotes.documentTimeSeconds / 60);
    if (seconds >= 30) {
        minutes = parseInt(minutes) + parseInt(1);
    }
    if (minutesLabel != null) {
        minutesLabel.innerHTML = "";
        minutesLabel.innerHTML = minutes;
    }

}

function startCaseNoteTimer(state, timeInSeconds) {
    $("#minutes").attr("contenteditable", 'false');
    $("#editcasenotetimer").addClass("unclickableElement");
    $("#minutes").addClass("unclickableElement");
    inactivityTime();
    var minutesLabel = document.getElementById("minutes");
    //var secondsLabel = document.getElementById("seconds");
    var totalSeconds = 0;
    //
    //totalSeconds = (parseInt(minutesLabel.innerHTML) * 60);
    totalSeconds = $.caseNotes.documentTimeSeconds;
    $.caseNotes.interval = setInterval(setTime, 1000);
    $('#cnTimerStart').css('background', 'green');
    function setTime() {
        ++totalSeconds;
        $.caseNotes.documentTimeSeconds = totalSeconds;
        //secondsLabel.innerHTML = pad(totalSeconds % 60);
        //minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
        //seconds = pad(totalSeconds % 60);
        //minutes = pad(parseInt(totalSeconds / 60));
        //if (seconds >= 30) {
        //    minutes = minutes + 1;
        //}
        //minutesLabel.innerHTML = "";
        //minutesLabel.innerHTML = minutes;

    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        }
        else {
            return valString;
        }
    }
}

var inactivityTime = function () {
    $.caseNotes.inactTime = setTimeout(logout, 120000);
    $.caseNotes.inactiveTimeForClear = $.caseNotes.inactTime;
    var t;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    function logout() {
        //alert("Your documentation time has been paused.");
        clearInterval(inactivityTime);
        clearTimeout(inactivityTime);
        var answer = confirm("Your documentation time has been paused. Continue timing")
        if (answer) {
            resetTimer();
        }
        else {
            pauseTimer(true);
        }
    }

    function resetTimer() {
        if ($.caseNotes.dontResetInactTimerFlag == false) {
            clearTimeout($.caseNotes.inactTime);
            clearTimeout($.caseNotes.inactiveTimeForClear);
            clearTimeout(inactivityTime);
            $.caseNotes.inactTime = setTimeout(logout, 120000);
        }

        // 1000 milisec = 1 sec
    }

};

function convertMinutesToSeconds(minutes) {
    var seconds = 0;
    minutes = "2.02";
    if (minutes.indexOf('.') != -1) {
        var substr = minutes.split('.');
        secondsOne = (substr[0] * 60);
        sec = '.' + substr[1];
        secondsTwo = (sec * 60);
        secondsTwo = parseInt(secondsTwo);
        seconds = secondsOne + secondsTwo;
    } else {
        seconds = minutes * 60;
    }
    return seconds;
}

function docTimeSecondsToMinutesAndDisplay(secondsIn) {
    //var minutes = 00;
    //var seconds = 00;
    var minutesLabel = document.getElementById("minutes");
    minutes = Math.floor(secondsIn / 60);
    seconds = secondsIn - minutes * 60;
    //$('#minutes').text(pad(minutes, 2));
    ////$('#seconds').text(pad(seconds, 2));
    //seconds = pad($.caseNotes.documentTimeSeconds % 60);
    //minutes = pad(parseInt($.caseNotes.documentTimeSeconds / 60));
    if (seconds >= 30) {
        minutes = parseInt(minutes) + parseInt(1);
    }
    minutesLabel.innerHTML = "";
    minutesLabel.innerHTML = minutes;
    docTimeSetPadding(minutes);
    //$('#minutes').text(minutes);
}

function checkInput(ob) {
    var invalidChars = /[^0-9]/gi;
    if (invalidChars.test(ob.value)) {
        ob.value = ob.value.replace(invalidChars, "");
    }
}

function parseIdsThatCanHaveMilage(res) {
    $.caseNotes.mileageConsumerIds = [];
    $("result", res).each(function () {
        $.caseNotes.mileageConsumerIds.push($(this).text());
    });
}

function setMaxMileage(res) {
    $('result', res).each(function () {
        $.session.maxGroupMiles = $('highestmiles', this).text();
    });
}

function docTimeSetPadding(minutes) {
    if (minutes.toString().length == 1) {
        $('#minutes').css('padding-left', '22px')
    } else if (minutes.toString().length == 2) {
        $('#minutes').css('padding-left', '18px')
    } else if (minutes.toString().length == 3) {
        $('#minutes').css('padding-left', '14px')
    } else if (minutes.toString().length == 4) {
        $('#minutes').css('padding-left', '10px')
    } else if (minutes.toString().length == 5) {
        $('#minutes').css('padding-left', '6px')
    } else if (minutes.toString().length == 6) {
        $('#minutes').css('padding-left', '2px')
    } else {
        $('#minutes').css('padding-left', '2px')
    }
}