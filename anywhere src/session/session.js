$.session = {};
$.session.DayServiceView = false;
$.session.DayServiceInsert = false;
$.session.DayServiceUpdate = false;
$.session.DayServiceDelete = false;
$.session.DayServiceNonBillable = false;
$.session.DayServiceOverRide = false;
$.session.DenyStaffClockUpdate = false;
$.session.DenyClockUpdate = false;
$.session.DemographicsView = false;
$.session.DemographicsBasicDataView = false;
$.session.DemographicsRelationshipsView = false;
$.session.DemographicsPictureUpdate = false;
$.session.DemographicsNotesView = false;
$.session.DemographicsViewAttachments = false;
$.session.GoalsView = false;
$.session.GoalsUpdate = false;
$.session.CaseNotesView = false;
$.session.CaseNotesTablePermissionView = false;
$.session.CaseNotesViewEntered = false;
$.session.CaseNotesUpdate = false;
$.session.CaseNotesCaseloadRestriction = false;
$.session.SingleEntryView = false;
$.session.SingleEntryUpdate = false;
$.session.WorkshopView = false;
$.session.isCurrentlySingleEntry = false;
$.session.groupNoteId = '';
$.session.caseNoteEditSecond = false;
$.session.caseNoteLocationCodePreference = '';
$.session.caseNoteLocationNamePreference = '';
$.session.caseNoteNeedCodePreference = '';
$.session.caseNoteNeedNamePreference = '';
$.session.caseNoteServiceCodePreference = '';
$.session.caseNoteServiceNeedPreference = '';
$.session.caseNoteBillingCodeCodePreference = '';
$.session.caseNoteBillingCodeNamePreference = '';
$.session.caseNoteBillingCodeServiceFundingPreference = '';
$.session.caseNoteDisplayGroupNoteDivPreference = false;
$.session.caseNoteDisplayGroupNoteCheckedPreference = false;
$.session.locationRequiredCheck = false;
$.session.serviceRequiredCheck = false;
$.session.needRequiredCheck = false;
$.session.contactRequiredCheck = false;
$.session.vendorRequiredCheck = false;
$.session.caseNoteListResponse = '';
$.session.vendorFlag = false;
$.session.groupConsumerCount = 0;
$.session.consumersForGroupCounter = 0;
$.session.timeOverlapConsumers = [];
$.session.overlapNoteIds = [];
$.session.consumerIdArray = [];
$.session.absentLocationsArray = [];
$.session.caseNoteConsumerId = '';
$.session.caseNoteTimeCheck = 'pass';
$.session.groupNamesExist = false;
$.session.existingGroupNoteIdForUpdate = "";
$.session.startTimeForGroupNoteUpdateCompare = "";
$.session.endTimeForGroupNoteUpdateCompare = "";
$.session.serviceDateForGroupNoteUpdateCompare = "";
$.session.serviceOrBillingCodeForGroupNoteUpdateCompare = "";
$.session.caseNotePreferencesSet = false;
$.session.consumerEditId = "";
$.session.updateAllGroupDropDowns = false
$.session.isSingleEdit = false;
$.session.changeFromSingleToGroupNote = false;
$.session.editingConsumerId = "";
$.session.dontLoadAppAfterDelete = false;
$.session.consumerGroupCount = 0;
$.session.groupSaveCounter = 0;
$.session.editOnLoad = false;
$.session.groupOverlapCheckCounter = 1;
$.session.overlapScreenLock = false;
$.session.UpdateCaseNotesDocTime = false;
$.session.batchedNoteEdit = false;
$.session.groupNoteAttemptWithDocTime = false;
//remove section when ready for testing.  Forcing all features on.
//$.session.CaseNotesView = true;
//$.session.CaseNotesTablePermissionView = true;
//$.session.CaseNotesUpdate = true;
//$.session.CaseNotesCaseloadRestriction = true;
$.session.editNoteMileageOnLoadFlag = false;
$.session.SEViewAdminWidget = false;
$.session.ciBShow = false;
$.session.singleEntry15minDoc = 'N'
$.session.Roster = false;
$.session.Name = "";
$.session.LName = "";
$.session.isAdmin = false;
$.session.PeopleId = "";
$.session.StaffLocId = "";
$.session.UserId = "";
$.session.Token = "";
$.session.Error = "";
$.session.ver = "";
$.session.browser = "";
$.session.browserVer = "";
$.session.OS = "";
$.session.locations = [];
$.session.locationids = [];
$.session.lastMenuSelection = new Date(); //keeps menu's from double popping for people that are jackrabbits on the touchscreen.
$.session.defaultDayServiceLocation = 0; //8 saturday
$.session.defaultDayServiceLocationFlag = true;
$.session.defaultRosterLocation = 0;
$.session.defaultRosterLocationFlag = false;
$.session.defaultStaffLocation = 0;
$.session.defaultDayServiceLocationName = "";
$.session.defaultWorkshopLocation = "";
$.session.defaultWorkshopLocationId = "";
$.session.defaultRosterLocationName = "";
$.session.RosterDeleteAbsent = false;
$.session.defaultStaffLocationName = 0;
$.session.selectedLocation = ["0", "defaultlocation"];
$.session.height = 0;
$.session.width = 0;
//variable that tells whether or not a strong password is required.Default is Y to keep expired password rules the same.
$.session.strongPassword = "Y";
$.session.errorMessage = "";
$.session.selectedGroupId = 0;
$.session.deletedGroupId = 0; //Added to handle the delete group issue when deleting from the page where you are in the group to be deleted
$.session.changePasswordLinkSelected = "";
$.session.advancedPasswordLength = "8";
$.session.dsLocationHistoryFlag = false;
$.session.dsLocationHistoryValue = 0;
$.session.initialTimeOut = "";
$.session.initialTimeIn = "";
$.session.singleLoadedConsumerId = "";
$.session.passwordSpecialCharacters = "";
$.session.daysBackGoalsEdit = "";
$.session.singleLoadedConsumerName = "";
$.session.serviceStartDate = "";
$.session.serviceEndDate = "";
$.session.defaultCaseNoteReviewDays = "";
$.session.defaultProgressNoteReviewDays = "";
$.session.defaultProgressNoteChecklistReviewDays = "";
$.session.countCheck = 0;
$.session.applicationName = '';
$.session.viewableGoalTypeIds = [];
$.session.outcomesPermission = '';
$.session.dayServicesPermission = '';
$.session.caseNotesPermission = '';
$.session.singleEntryPermission = '';
$.session.workshopPermission = '';
$.session.workshopPermission = '';
$.session.intellivuePermission = '';
$.session.selectedConsumerIdForGoalsDateBack = '';
$.session.caseNoteEdit = false;
$.session.consumerIdToEdit = '';
$.session.showDynamic = true;
$.session.singleEntryUseServiceLocations = false;
$.session.editCaseNoteId = '';
//$.session.groupCaseNoteId = '';
$.session.tempServiceFunding = 'N';
$.session.usePersonalPrefernces = 'N';
$.session.defaultSeviceId = '';
$.session.defaultSeviceName = '';
//Added to save session filters
$.session.useSessionFilterVariables = false;
$.session.filterServiceStart = "";
$.session.filterServiceEnd = "";
$.session.filterDateEnteredStart = "";
$.session.filterDateEnteredEnd = "";
$.session.filterBillerId = "";
$.session.filterBillerName = "";
$.session.groupAddOnNames = [];
$.session.intellivueSessionID = "";
$.session.singleEntryApproveEnabled = '';
$.session.anAdmin = false;
$.session.ViewAdminSingleEntry = false;
$.session.communityIntegrityRequired = 'n/a';
$.session.singleEntryAddConsumersOnBillable = 'N'
$.session.workshopBatchId = "";
$.session.infiniteLoopFlag == false
$.session.singleEntryReportCurrentlyProcessing = false;
$.session.viewLocationSchedulesKey = false;

$.session.singleEntryLocationRequired = "";

$.session.infalHasConnectionString = false;
$.session.isPSI = false;
$.session.singleEntryEditLocationHack = "";
var firstLoad = true;
$.session.portraitPath = "";
//Needs updated for every release
$.session.version = "2018.3";

$(window).resize(function () {
    //resizeActionCenter();
});


function setDefaultLoc(type, value) {
    //alert("setDefaultLoc " + type + " " + value + " " + $.session.defaultStaffLocation);

    if (type == 1) {
        $.session.defaultStaffLocation = value;
        //alert("setDefaultLoc " + type + " " + value + " " + $.session.StaffLocId);
        createCookie('defaultStaffLocation', value, 7);
    }

    if (type == 2) {
        //createCookie('defaultRosterLocation', value, 7);
        saveDefaultLocationValueAjax('2', value);
        if (value == 0) {
            createCookie('defaultRosterLocationFlag', true, 7);
        } else {
            createCookie('defaultRosterLocationFlag', false, 7);
        }
        
    }

    if (type == 3) {
        if (($.session.defaultDayServiceLocationFlag == "true") || ($.session.defaultDayServiceLocationFlag == null)) {
            //createCookie('defaultDayServiceLocationNameValue', value, 7);
            saveDefaultLocationValueAjax('3', value);
        }
        if ($.session.dsLocationHistoryFlag == true) {
            $.session.defaultDayServiceLocation = value;
        }       
    }

}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    var test = escape(value);
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function setSessionVariables() {
    var cookieInnards = $.session.permissionString;
    //checkForErrors();

    $('result', cookieInnards).each(function () {
        tmpWindow = $('window_name', this).text();
        tmpPerm = $('permission', this).text();
        tmpSpec = $('special_data', this).text();
        
        if (tmpWindow == 'IsAnAdmin') {
            if (tmpPerm == 'Y')
            $.session.isAdmin = true;
        }

        if (tmpWindow == 'SEShowServiceLocations') {
            if (tmpPerm == 'Y') {//Require a consumer to be picked
                $.session.singleEntryUseServiceLocations = true;
            } 
        }


        if (tmpWindow == 'SEAddConsumerOnBillable') {
            if (tmpPerm == 'P') {//Require a consumer to be picked
                $.session.singleEntryAddConsumersOnBillable = 'P';
            } else if (tmpPerm == 'Y') {//Do not require a consumer to be picked, but give a warning
                $.session.singleEntryAddConsumersOnBillable = 'Y';
            } else {//Do not require a consumerto be picked, and give no warning
                $.session.singleEntryAddConsumersOnBillable = 'N';
            }
        }

        if (tmpWindow == 'SEDocumentTime') {
            if (tmpPerm == 'Y') {//Enable 15 minutes intervals
                $.session.singleEntry15minDoc = 'Y'
            } else {//Do not enable/disable 15 minute document intervals
                $.session.singleEntry15minDoc = 'N'
            }
        }

        if (tmpWindow == 'Anywhere Day Services') {
            if (tmpPerm == 'View') {
                $.session.DayServiceView = true;
                $.session.Roster = true;
                $("#dayservicesettingsbutton").removeClass("disabledModule");
            }

            if (tmpPerm == 'Override location requirement') {
                $.session.DayServiceOverRide = true;
            }
            
            if (tmpPerm == 'Update') {
                $.session.DayServiceUpdate = true;
            }

            if (tmpPerm == 'Delete') {
                $.session.DayServiceDelete = true;
            }

            if (tmpPerm == 'Insert') {
                $.session.DayServiceInsert = true;
            }

            if (tmpPerm == 'Deny TimeClock Change') {
                $.session.DenyClockUpdate = true;
            }
        }
        
        //Goals Permissions
        if (tmpWindow == 'Anywhere Service Activity') {
            if (tmpPerm == 'View') {
                $.session.GoalsView = true;
                $("#goalssettingsbutton").removeClass("disabledModule");
            }
            if (tmpPerm == 'Update') {
                $.session.GoalsUpdate = true;
            }
        }

        //Single Entry Permissions
        if (tmpWindow == 'Anywhere Single Entry') {
            if (tmpPerm == 'View') {
                $.session.SingleEntryView = true;
                $("#singleentrybutton").removeClass("disabledModule");
            }
            if (tmpPerm == 'Update') {
                $.session.SingleEntryUpdate = true;
            }
        }

        //Workshop Module
        if (tmpWindow == 'Anywhere Workshop') {
            $.session.WorkshopView = true;
            $("#workshopbutton").removeClass("disabledModule");
        }

        if (tmpWindow == 'Anywhere Case Notes') {
            if (tmpPerm == 'View') {
                $("#casenotessettingsdiv").removeClass("disabledModule");
                $.session.CaseNotesView = true;
            }
            if (tmpPerm == 'View Entered') {
                $.session.CaseNotesViewEntered = true;
            }
            if (tmpPerm == 'Update') {
                $.session.CaseNotesUpdate = true;
            }
            if (tmpPerm == 'Caseload Only') {
                $.session.CaseNotesCaseloadRestriction = true;
            }
        }

        //Absent
        if (tmpWindow == 'Anywhere Roster') {
            if (tmpPerm == 'Delete Absent') {
                $.session.RosterDeleteAbsent = true;
            }
        }
        //Demographics
        if (tmpWindow == 'Anywhere Demographics') {
            if (tmpPerm == 'View') {
                $.session.DemographicsView = true;
            }

            if (tmpPerm == 'View Relationships') {
                $.session.DemographicsRelationshipsView = true;
            }

            if (tmpPerm == 'View General') {
                $.session.DemographicsBasicDataView = true;
            }

            if (tmpPerm == 'Update Picture') {
                $.session.DemographicsPictureUpdate = true;
            }

            if (tmpPerm == 'View Notes') {
                $.session.DemographicsNotesView = true;
            }

            if (tmpPerm == 'View Attachments') {
                $.session.DemographicsViewAttachments = true;
            }

            if (tmpPerm == 'View Location Schedule') {
                $.session.viewLocationSchedulesKey = true;
            }
            //$.session.DemographicsNotesView = true; //remove before committing
        }


        if (tmpWindow == 'Anywhere User Home') {
            if (tmpPerm == 'Deny Staff TimeClock Change') {
                $.session.DenyStaffClockUpdate = true;
            }
        }

        if (tmpWindow == 'admin') {
            $.session.DayServiceView = true;
            $.session.DayServiceInsert = true;
            $.session.DayServiceUpdate = true;
            $.session.DayServiceDelete = true;
            $.session.DayServiceNonBillable = true;
            $.session.DayServiceOverRide = true;
            $.session.Roster = true;
            $.session.DenyClockUpdate = false;
            $.session.DenyClockUpdate = false;
        }


        if (tmpWindow == 'Name') {
            $.session.Name = tmpPerm;
            $.session.UserId = tmpSpec;
        }

        if (tmpWindow == 'LName') {
            $.session.LName = tmpPerm;
            $.session.PeopleId = tmpSpec;
        }

        if (tmpWindow == 'Token') {
            $.session.Token = tmpSpec;
        }

        if (tmpWindow == 'ProductName') {
            $.session.ProductName = tmpPerm.toUpperCase();
        }

        if (tmpWindow == 'stafflocation') {
            $.session.locations.push(tmpPerm);
            $.session.locationids.push(tmpSpec);
        }

        if (tmpWindow == 'Default Staff Location' ) {
            $.session.defaultStaffLocation = tmpPerm;
        }

        if (tmpWindow == 'Default Roster Location') {
            //not sure what this was intended for.  Was breaking roster location save
            // $.session.defaultRosterLocation = tmpPerm;
        }

        if (tmpWindow == 'Default Day Service Location') {
            $.session.defaultDayServiceLocation = tmpPerm;
        }
    });
 }

function setSession(callback) {
    var cookieInnards = readCookie('psi');

    //sets token from cookie.  This is needed for ajax call getUserPermissions().  Other session variables set in setSessionVariables()
    $('permissions', cookieInnards).each(function () {
        tmpWindow = $('window_name', this).text();
        tmpPerm = $('permission', this).text();
        tmpSpec = $('special_data', this).text();

        if (tmpWindow == 'Token') {
            $.session.Token = tmpSpec;
        }

    });
    getUserPermissions(callback);

    //recheck token every 60 seconds
    var timer = $.timer(function () {
        tokenCheck()
    });
    timer.set({ time: 60000, autostart: true });
}



function checkforErrors(xmlReturn) {
    
    //$("#error").css("display", "block");
    //check for Errors
    var retVal = 0;
    //alert("checkForErrors" + xmlReturn);

    var ErrorText = $('Error', xmlReturn).text();
    //alert('Error text: ' + ErrorText);


    //session didn't exist
    if (ErrorText == "Error:606") {
        //setCookieOnFail("<Errors><Error>Please log in again.</Error></Errors>");
        errorMessage = "Please log in again.";
        retVal = -1;
    }

    //session expired
    if (ErrorText == "Error:607") {
        //setCookieOnFail("<Errors><Error>Session has timed out, please log in again.</Error></Errors>");
        errorMessage = "Session has timed out, please log in again.";
        retVal = -1;
    }

    //session didn't exist
    if (ErrorText == "Error:608") {
        //setCookieOnFail("<Errors><Error>This user name does not exist in demographics.</Error></Errors>");
        errorMessage = "This user name does not exist in demographics.";
        retVal = -1;
    }

    if (ErrorText == "Error:609") {
        //setCookieOnFail("<Errors><Error>Password has expired</Error></Errors>");
        errorMessage = "Password has expired.";
        retVal = -1;
    }

    if (ErrorText == "Error:610") {
        //setCookieOnFail("<Errors><Error>Previous Password is invalid</Error></Errors>");
        errorMessage = "Previous Password is invalid.";
        retVal = -1;
    }

    return retVal;
}

function setCookieOnFail(xmlReturn) {
    createCookie('psi', xmlReturn, 1);
    $.session.Token = "";
    if (xmlReturn.indexOf('Password has expired') > -1)
    {
        // do nothing
    } else {
        
        document.location.href = 'login.html';
    }
    
}


function checkForErrors() {
    var errorXml = readCookie('psi');
    $("#errortext").text($('Error', errorXml).text());

    if ($("#errortext").text().length > 0) {
        $("#error").css("display", "block");


        if ($("#errortext").text().indexOf("expired") > -1) {
            $("#login").css("display", "none");
            $("#change").css("display", "block");

            $("#error").removeClass("err");
            $("#error").addClass("err2");

            $("#errorarr").removeClass("arr");
            $("#errorarr").addClass("arr2");

            $("#errorarr").removeClass("arrbase");
            $("#errorarr").addClass("arrbase2");
            $("#changePassword").css("display", "none");
        } else {
        }


    } else {
        $("#error").css("display", "none");
        $("#login").css("display", "block");
        $("#change").css("display", "none");

        $("#error").removeClass("err2");
        $("#error").addClass("err");

        $("#errorarr").removeClass("arr2");
        $("#errorarr").addClass("arr");

        $("#errorarr").removeClass("arrbase2");
        $("#errorarr").addClass("arrbase");
        $("#changePassword").css("display", "none");

    }
}

function customPasswordChangeClick() {// Called off of link to change password. Used to set sesson variable for checking against later.
    $.session.changePasswordLinkSelected = "Y";
    customPasswordChange();
    $("#loginInfal").css('opacity', '-1');
}


function setUpPasswordResetMessages(res) {
    var error = "";
    var success = "";
    $('results', res).each(function () {
        error = $('Error', this).text();
        success = $('Success', this).text();
    });
    if (error.indexOf('808') != -1) {
        $('#confirmResetMessage').html('User name entered did not match any on file.');
        $('#confirmResetMessage').css('color', '#f13c6e');
    } else if (error.indexOf('888') != -1) {
        $('#confirmResetMessage').html('Forgot password functionality is not offered by your company.');
        $('#confirmResetMessage').css('color', '#f13c6e');
    } else {
        var reset = true;
        customPasswordChange(reset);
    }
}

function resetPasswordClick() {
    $("#resetPassword").remove();
    $("#backToLogin").css("display", "block");
    $("#error").css("display", "none");
    $("#changePassword").css("display", "none");
    $("#reset").css("display", "block");
    $("#errorarr").removeClass("arrbase");
    $("#login").css("display", "none");
    $("#change").css("display", "none");
    $("#loginInfal").css('opacity', '-1');
}

//Custom password change code
function customPasswordChange(reset) {
    //Gets a y or n based on whether or not a strong password is required  -dont believe this is true any longer.  Sets up visual stuff for pass change only
    $("#changePassword").remove();
    $("#backToLogin").css("display", "block");
    $("#reset").css("display", "none");
    $("#resetPassword").css("display", "none");
    
    
    $("#error").css("display", "none");
    //$.session.changePasswordLinkSelected = "Y";
    $("#change").css("display", "block");
    $("#errorarr").removeClass("arrbase");
    $("#login").css("display", "none");

    if ($.session.strongPassword == 'Y' && $.session.changePasswordLinkSelected == "") {
        $("#confirmMessage").text("Your password has expired.  Please enter and confirm a new password.");
    } else if(reset == true){
        $("#confirmMessage").text("Your message has been sent.  Please reset password.");
    }else {
        $("#confirmMessage").text("Please enter and confirm a new password.");
    }
}


var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
		{
		    string: navigator.userAgent,
		    subString: "Chrome",
		    identity: "Chrome"
		},
		{ string: navigator.userAgent,
		    subString: "OmniWeb",
		    versionSearch: "OmniWeb/",
		    identity: "OmniWeb"
		},
		{
		    string: navigator.vendor,
		    subString: "Apple",
		    identity: "Safari",
		    versionSearch: "Version"
		},
		{
		    prop: window.opera,
		    identity: "Opera",
		    versionSearch: "Version"
		},
		{
		    string: navigator.vendor,
		    subString: "iCab",
		    identity: "iCab"
		},
		{
		    string: navigator.vendor,
		    subString: "KDE",
		    identity: "Konqueror"
		},
		{
		    string: navigator.userAgent,
		    subString: "Firefox",
		    identity: "Firefox"
		},
		{
		    string: navigator.vendor,
		    subString: "Camino",
		    identity: "Camino"
		},
		{		// for newer Netscapes (6+)
		    string: navigator.userAgent,
		    subString: "Netscape",
		    identity: "Netscape"
		},
		{
		    string: navigator.userAgent,
		    subString: "MSIE",
		    identity: "Explorer",
		    versionSearch: "MSIE"
		},
		{
		    string: navigator.userAgent,
		    subString: "Gecko",
		    identity: "Mozilla",
		    versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
		    string: navigator.userAgent,
		    subString: "Mozilla",
		    identity: "Netscape",
		    versionSearch: "Mozilla"
		}
	],
    dataOS: [
		{
		    string: navigator.platform,
		    subString: "Win",
		    identity: "Windows"
		},
		{
		    string: navigator.platform,
		    subString: "Mac",
		    identity: "Mac"
		},
		{
		    string: navigator.userAgent,
		    subString: "iPhone",
		    identity: "iPhone/iPod"
		},
		{
		    string: navigator.platform,
		    subString: "Linux",
		    identity: "Linux"
		}
	]

};

//if browser hasn't been filled in for this session fill it in.
if ($.session.browser == "") {
    BrowserDetect.init();
    $.session.browser = BrowserDetect.browser;
    $.session.OS = BrowserDetect.OS;
    $.session.browserVer  = BrowserDetect.version;
}

function convertMilitaryTimeToAMPM(inputTime) {
    var hour = "";
    var minute = "";
    var amPM = "";
    var convertedTime = "";
    if (inputTime.length < 5 && inputTime != "") {
        inputTime = "0" + inputTime;
    }
    // Parse the input time into hours and minutes:
    for (var i = 0; i < inputTime.length; i++) {
        if (isNaN(inputTime.charAt(i)) == false && inputTime.charAt(i) != ' ') {
            if (i < 2) {
                hour = hour + inputTime.charAt(i);
            };

            if (i == 3 || i == 4) {
                minute = minute + inputTime.charAt(i);
            };
        };
    };

    // Default to AM:
    amPM = "AM";

    // If the hour = "00":
    if (hour == "00") {
        hour = "12"
    } else {
        // If the hour = "12":
        if (hour == "12") {
            // Set to PM:
            amPM = "PM";
        };
    };

    // If the time is greater than Noon:
    if (hour > "12") {
        var x = +hour;
        x = x - 12;
        hour = String(x);

        // Set to PM:
        amPM = "PM";
    };

    if (hour.length == 1)
        hour = "0" + hour;

    if (minute.length == 1)
        minute = "0" + minute;

    // Create the converted time:
    convertedTime = hour + ":" + minute + " " + amPM;

    return convertedTime;
};

function overClicky()
{
		/*var now = new Date();
   		var outStr = now.getHours()+now.getMinutes()+now.getSeconds();
   		var last = $.session.lastMenuSelection;
   		var lastStr = last.getHours()+last.getMinutes()+last.getSeconds();
		var compared = outStr - lastStr;

		if (compared < 2) return true; */


        var now = new Date();
        var outStr = now.getHours() + now.getMinutes() + now.getSeconds();
        var last = $.session.lastMenuSelection;
        var lastStr = last.getHours() + last.getMinutes() + last.getSeconds();
        var compared = outStr - lastStr;

        compared = Math.abs(compared);

        if (compared < 2) return true;
		return false;

}

if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}

function IsPasswordStrong(password) {
    if (password.length < $.session.advancedPasswordLength)
        return 0;
    //if (password.match(/\d+/))
    //{ }
    //else
    //    return 0;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/))
    { }
    else
        return 0;

    //if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,£,(,)]/))
    var specCharNoCommas = $.session.passwordSpecialCharacters.split("");
    var withCommas = specCharNoCommas.join(separator = ',');
    var specChar = new RegExp("[" + withCommas + "]", 'g');
    if (password.match(specChar))
    { }
    else
        return 0;

    return 1;
}

function checkPass() {
    var pass1 = document.getElementById('newpassword1');
    var pass2 = document.getElementById('newpassword2');
    var message = document.getElementById('confirmMessage');
    strongPassword = $.session.strongPassword;

    //Extra condition for whether or not a strong password is required
    if (strongPassword == 'N') {
        //passwords match?
        if (pass1.value == pass2.value) {
            message.innerHTML = "<br />"
            pass2.style.backgroundColor = "#EEEEEE";
            message.style.color = "#777777";
            message.innerHTML = "Click Change and your new password will take effect!"
        } else if (pass1.value == "" || pass2.value == "") {
            pass2.style.backgroundColor = "#EEEEEE";
            message.style.color = "#777777";
            message.innerHTML = "Please enter and confirm a new password.";
            return 0;
        } else {
            pass2.style.backgroundColor = "#ffd9e7";
            message.style.color = "#f13c6e";
            message.innerHTML = "Passwords Do Not Match!"
            return 0;
        }
        return 1;

    } else {
        //if both are null
        if ((pass1.value.length == 0) && (pass2.value.length == 0) && ($.session.changePasswordLinkSelected == "")) {
            pass1.style.backgroundColor = "#EEEEEE";
            pass2.style.backgroundColor = "#EEEEEE";
            message.style.color = "#777777";
            message.innerHTML = "Your password has expired, please enter and <br /> confirm a new password."
            return 0;
        } else {
            pass1.style.backgroundColor = "#EEEEEE";
            pass2.style.backgroundColor = "#EEEEEE";
            message.style.color = "#777777";
            message.innerHTML = "Please enter and confirm a new password."
        }


        //is password strong?
        if (IsPasswordStrong(pass1.value) == 1) {
            message.innerHTML = "<br />"
            pass1.style.backgroundColor = "#EEEEEE";
        } else {
            pass1.style.backgroundColor = "#ffd9e7";
            message.style.color = "#f13c6e";
            message.innerHTML = "Passwords must: Be at least " + $.session.advancedPasswordLength + " characters long, have a special character("+$.session.passwordSpecialCharacters+"), upper and lower case letters."
            if (pass1.value == "" && pass2.value == "") {
                pass2.style.backgroundColor = "#EEEEEE";
                message.style.color = "#777777";
                message.innerHTML = "Please enter and confirm a new password.";
            }
            return 0;
        }

        //passwords match?
        if (pass1.value == "" || pass2.value == "") {
            pass2.style.backgroundColor = "#EEEEEE";
            message.style.color = "#777777";
            message.innerHTML = "Please enter and confirm a new password.";
            return 0;
        } else if (pass1.value == pass2.value) {
            message.innerHTML = "<br />"
            pass2.style.backgroundColor = "#EEEEEE";
            message.style.color = "#777777";
            message.innerHTML = "Click Change and your new password will take effect!"
        }
        else {
            pass2.style.backgroundColor = "#ffd9e7";
            message.style.color = "#f13c6e";
            message.innerHTML = "Passwords Do Not Match!"
            return 0;
        }

        return 1;
    }
}  


Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.getMonthName = function () {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};

function loadSettings() {
    $("#helpbox").css("display", "none");
    $("#settingsbox").css("display", "block");
    $("#consumerclockinhelp").remove();
    $(".consumerclockinhelptriangle").remove();
    $("#goalshelp").remove();
    $(".hrtriangleright").remove();
    firstLoad = false;    
}

function loadHelp() {
    $("#settingsbox").css("display", "none");
    $("#helpbox").css("display", "block");
    $("#consumerclockinhelp").remove();
    $(".consumerclockinhelptriangle").remove();
    $("#goalshelp").remove();
    $(".hrtriangleright").remove();
}


function popHomeSettingsLoc(event) {
    var eid = event.srcElement.id + "pop";
    var pid = event.srcElement.parentNode.id + "pop";

    $("#" + eid).css("display", "block");
    $("#" + pid).css("display", "block");

    if (eid.indexOf("1") > -1) {

        //if (numDefault1 > 4) {
        //    $("#" + eid).css("height", 200);
        //}

        $("#locationdefault2pop").css("display", "none")
        $("#locationdefault3pop").css("display", "none");
        $("#locationdefault4pop").css("display", "none");
        $("#locationdefault5pop").css("display", "none");
    }

    if (eid.indexOf("2") > -1) {
        //if (numDefault2 > 4) {
        //    $("#" + eid).css("height", 200);
        //}
        $("#locationdefault1pop").css("display", "none")
        $("#locationdefault3pop").css("display", "none");
        $("#locationdefault4pop").css("display", "none");
        $("#locationdefault5pop").css("display", "none");
    }

    if (eid.indexOf("3") > -1) {
        //if (numDefault3 > 4) {
        //    $("#" + eid).css("height", 200);
        //}
        $("#locationdefault1pop").css("display", "none")
        $("#locationdefault2pop").css("display", "none");
        $("#locationdefault4pop").css("display", "none");
        $("#locationdefault5pop").css("display", "none");
    }

    if (eid.indexOf("4") > -1) {
        //if (numDefault3 > 4) {
        //    $("#" + eid).css("height", 200);
        //}
        $("#locationdefault1pop").css("display", "none")
        $("#locationdefault2pop").css("display", "none");
        $("#locationdefault3pop").css("display", "none");
        $("#locationdefault5pop").css("display", "none");
    }

    if (pid.indexOf("1") > -1) {

        //if (numDefault1 > 4) {
        //    $("#" + eid).css("height", 200);
        //}

        $("#locationdefault2pop").css("display", "none")
        $("#locationdefault3pop").css("display", "none");
        $("#locationdefault4pop").css("display", "none");
        $("#locationdefault5pop").css("display", "none");
        $("#locationdefault1pop").css("display", "block")
    }

    if (pid.indexOf("2") > -1) {
        //if (numDefault2 > 4) {
        //    $("#" + eid).css("height", 200);
        //}
        $("#locationdefault1pop").css("display", "none")
        $("#locationdefault3pop").css("display", "none");
        $("#locationdefault4pop").css("display", "none");
        $("#locationdefault5pop").css("display", "none");
        $("#locationdefault2pop").css("display", "block")
    }

    if (pid.indexOf("3") > -1) {
        //if (numDefault3 > 4) {
        //    $("#" + eid).css("height", 200);
        //}
        $("#locationdefault1pop").css("display", "none")
        $("#locationdefault2pop").css("display", "none");
        $("#locationdefault4pop").css("display", "none");
        $("#locationdefault5pop").css("display", "none");
        $("#locationdefault3pop").css("display", "block");
    }

    if (pid.indexOf("4") > -1) {
        //if (numDefault3 > 4) {
        //    $("#" + eid).css("height", 200);
        //}
        $("#locationdefault1pop").css("display", "none")
        $("#locationdefault2pop").css("display", "none");
        $("#locationdefault3pop").css("display", "none");
        $("#locationdefault5pop").css("display", "none");
        $("#locationdefault4pop").css("display", "block");
    }

    if (pid.indexOf("5") > -1) {
        //if (numDefault3 > 4) {
        //    $("#" + eid).css("height", 200);
        //}
        $("#locationdefault1pop").css("display", "none")
        $("#locationdefault2pop").css("display", "none");
        $("#locationdefault3pop").css("display", "none");
        $("#locationdefault4pop").css("display", "none");
        $("#locationdefault5pop").css("display", "block");
    }

    if ($(eid).css("display") == "none") {
        $(eid).css("display", "block");
        //$("#arr").css("display", "block");
    } else {
        clearPops(event);
    }
}

function setDefaultValue(type, value, event, name) {
    event.stopPropagation();
    var mySrc = $(event.srcElement);
    mySrc.parents("locationpopupbox").hide();
    var typeName = "";
    var switchCase = 0;
    switch (type) {
        case 1:
            typeName = "Default Staff Location";
            $("#0").text(event.srcElement.text);
            break;
        case 2:
            typeName = "Default Roster Location";
            $("#1").text(event.srcElement.text);
            if (value != 0 && name != null) {
                $.session.defaultRosterLocation = value;
                createCookie('defaultRosterLocationName', name, 7);
                saveDefaultLocationNameAjax('2', name);
            } else {
                createCookie('defaultRosterLocationName', "Remember Last Location", 7);
                saveDefaultLocationNameAjax('2', "Remember Last Location");
            }
            break;
        case 3:
            typeName = "Default Day Service Location";
            $("#2").text(event.srcElement.text);
            if (value != 0 && name != null) {
                createCookie('defaultDayServiceLocationName', name, 7);
                createCookie('defaultDayServiceLocationNameValue', value, 7);
                createCookie('defaultDayServiceLocationFlag', false, 7);
                saveDefaultLocationNameAjax('3', name);
                saveDefaultLocationValueAjax('3', value);
                $.session.defaultDayServiceLocationFlag = "false";
                $.session.dsLocationHistoryFlag = false;
                //createCookie('defaultDayServiceLocation', value, 7);
            } else {
                var test = $(this).text();
                //createCookie('defaultDayServiceLocationName', "Remember Last Location", 7);
                saveDefaultLocationNameAjax('3', "Remember Last Location");
                if (name == null) {
                    createCookie('defaultDayServiceLocationFlag', true, 7);
                    $.session.defaultDayServiceLocationFlag = "true";
                }                
            }
            break;
        case 4:
            typeName = "Default Time Clock Location";
            $("#4").text(event.srcElement.text);
            if (value != 0 && name != null) {
                createCookie('defaultTimeClockLocationName', name, 7);
                createCookie('defaultTimeClockLocationValue', value, 7);
                saveDefaultLocationNameAjax('4', name);
                saveDefaultLocationValueAjax('4', value);
            } else { }
            //New way to save to the database
            switchCase = "4";
            saveDefaultLocationValueAjax(switchCase, value);
        case 5:
            typeName = "Default Workshop Location";
            $("#5").text(event.srcElement.text);
            if (value != 0 && name != null) {
                createCookie('defaultWorkshopLocationName', name, 7);
                createCookie('defaultWorkshopLocationValue', value, 7);
                saveDefaultLocationNameAjax('5', name);
                saveDefaultLocationValueAjax('5', value);
            } else {
                createCookie('defaultWorkshopLocationName', "Remember Last Location", 7);
                saveDefaultLocationNameAjax('5', "Remember Last Location");
            }

    }

    //alert("setDefaultValue" + type + " " + value );
    //setDefaultSettings(typeName, value)
    setDefaultLoc(type, value);
    //settingsServicesLoad();
}


function tabletFocus(event) {
    var inputId;
    if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
        inputId = event.srcElement.id;
    } else {
        inputId = event.target.id;
    }
    $("#" + inputId).focus();
}

function browserSpecificEnabled() {
    //this code is to add css classes for browser specific css
    //not sure why ie11 says its mozilla and not msie??
    if ($.browser.mozilla && $.browser.version == 11) {
        $("html").addClass("ie11");
    }
    if ($.browser.msie && $.browser.version == 10) {
        $("html").addClass("ie10");
    }
}

function customTextVersionWork(res) {
    var customText = "";
    $('results', res).each(function () {
        customText = $("customtext", this).text();
        $.session.ver = $("anywhereversion", this).text();
        //$.session.version = $("anywhereversion", this).text();
    });    
    $(ver).text($.session.ver);
    if (customText != "") {
        $("#customLoginText").text(customText);
    }
    else {
        $("#customLoginText").text("Primary Solutions, in conjunction with amazing people like you, has built a new product from the ground up that " +
        "focuses on ease of use so that you can focus on what's really important.");
    }
}

function checkVersions() {
    if ($.session.ver != $.session.version) {
        updateVersionAjax($.session.version);
    }
}

function getFormattedTime(fullDate) {
    hours = fullDate.getHours();
    if (hours.toString().length == 1) {
        hours = "0" + hours;
    }
    min = fullDate.getMinutes();
    if (min.toString().length == 1) {
        min = "0" + min;
    }
    time = (hours + ':' + min);
    time = convertMilitaryTimeToAMPM(time);
    time = time.replace("AM", "").replace("PM", "").replace(" ", "");
    return time;
}

function getAMPM(fullDate) {
    var ampm = "";
    hours = fullDate.getHours();
    if (hours.toString().length == 1) {
        hours = "0" + hours;
    }
    time = (hours + ':' + fullDate.getMinutes());
    time = convertMilitaryTimeToAMPM(time);
    if (time.indexOf("AM") != -1) {
        ampm = "AM";
    } else {
        ampm = "PM";
    }
    return ampm;
}

//This is the function that was allowing access to the site. Going to probably need changed now.
function allowAccess(res) {
    var testInt = 0;
    $('result', res).each(function () {
        testInt = $('id', this).text();
        //$.session.Name = $('name', this).text(); 
    });
    if (testInt > 0) {
        eraseCookie('id');
        createCookie('id', testInt, 1);
        document.location.href = 'infalAnywhere.html';
    } else {
        //alert("You have supplied incorrect login credentials");
        $("#error").css("opacity", "1");
        $("#error").css("display", "block");
        $("#errortext").text("Login unsuccessful");
    }
}