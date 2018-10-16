$.pages = {};
        $.pages.roster = "";
        $.pages.rosterdate = "";
        $.pages.rosterbanner = "";
        $.pages.rosterconsumerpane = "";
        $.pages.rosterconsumerlist = "";
        $.pages.rosterToolBar = "";
        $.pages.dayservices = "";
        $.pages.goals = "";
        $.pages.single = "";
        $.pages.notes = "";
        $.pages.singleentry = "";
        $.pages.documentview = "";
        $.loadedApp = "";
        $.banner = false;
        $.roster = {};
        $.roster.moveable = true;
        $.googleMapAPI = "AIzaSyCNtZfzqGRxULjXzX4HbPfweVI9L3vTDns";
        $.orientation = null;
        var tid;
        checkInfalConnectionAjax();
        //$(document).trigger("moduleLoad");
        $(document).on("moduleLoad", function () {
            $(".leftsidemenu").removeClass("tempDisabledModule");
        });

        $(window).on("orientationchange", function () {
            //alert("The orientation has changed!");
            //We can use this to detect when the device has been rotated, and resize accordingly.
        });

        function loadApp(appName, extraData) {

            if ($.session.Token == "") {
                backToLogin();
            } else {

                // Unload the current app
                unloadApp($.loadedApp);
                //$(".leftsidemenu").removeClass("buttonhighlight").removeClass("rosterstrobe");
                $(".leftsidemenu").removeClass("buttonhighlight").removeClass("rosterstrobe").addClass("tempDisabledModule");
                //display right side roster selection by default, turns off in "home"
                $(".consumerpane").css("display", "block");
                $("#outerconsumerpane").show();
                $(".notInGroup").removeClass("notInGroup");
                $(".idnotlinkedtogoal").removeClass("idnotlinkedtogoal");
                $(".currentConsumerDisplayName").removeClass("currentConsumerDisplayName");
                $("#roostertoolbar").removeClass("caserosterbar");
                $("#consumerlist").removeClass("caseconsumerlist");

                featureLogging(appName);

                $('.SEconsumerunavailable').removeClass('SEconsumerunavailable');
                $("#settings, #help").hide();
                // Load the new app
                switch (appName) {
                    case "roster":
                        $.loadedApp = "roster";
                        $.session.isCurrentlySingleEntry = false;   //This needs to be in every module's load EXCEPT for Single Entry
                        $("#roostertoolbar").show();
                        $("#actioncenter").html("");
                        $(".roostertoolbar").html($.pages.rosterToolBar);
                        rosterServiceLoad();
                        break;
                    case "infaltimeclock":
                        $.loadedApp = "infaltimeclock";
                        $.session.isCurrentlySingleEntry = false;
                        $("#infaltimeclockbutton").addClass("buttonhighlight");
                        $("#roostertoolbar").hide();
                        /*var iframe = $("<iframe style='border:0px;width:100%;' src='./infal.html#logmein'></iframe>");
                        iframe.css("height", parseInt($("#leftmenu").height()) - 100);
                        $("#actioncenter").html("").append(iframe);
                        */
                        $("#actioncenter").html("");
                        buildInfal();
                        $(document).trigger("moduleLoad");
                        break;
                    case "dayservices":
                        $.loadedApp = "dayservices";
                        $.session.isCurrentlySingleEntry = false;
                        $("#actioncenter").html("");
                        dayServicesLoad();
                        break;
                    case "goals":
                        $.loadedApp = "goals";
                        $.session.isCurrentlySingleEntry = false;
                        $("#actioncenter").html("");
                        //$("#actioncenter").addClass("momentum");
                        goalsLoad();
                        break;
                    case "single":
                        $.loadedApp = "single";
                        $("#roostertoolbar").show();
                        $("#actioncenter").html("");
                        singleEntryLoad({});
                        break;
                    case "home":
                        $.loadedApp = "home";
                        $.session.isCurrentlySingleEntry = false;
                        $("#actioncenter").html("");
                        homeServiceLoad();
                        $("#settings, #help").show();
                        break;
                    case "casenotes":
                        $.loadedApp = "casenotes";
                        $.session.isCurrentlySingleEntry = false;
                        $.session.batchedNoteEdit = false;
                        $.caseNotes.dontResetInactTimerFlag = false;
                        $("#roostertoolbar").show();
                        $("#actioncenter").html("");
                        caseNotesLoad();
                        break;
                    case "singleentry":
                        $.loadedApp = "singleentry";
                        $("#roostertoolbar").show();
                        $("#actioncenter").html("");
                        singleEntryLoad({});
                        break;
                    case "adminsingleentry":
                        $.loadedApp = "adminsingleentry";
                        $.session.isCurrentlySingleEntry = false;
                        $("#roostertoolbar").hide();
                        $("#actioncenter").html("");
                        adminSingleEntryLoad(extraData || null);
                        break;
                    case "documentview":
                        $.loadedApp = "documentview";
                        $.session.isCurrentlySingleEntry = false;
                        $("#actioncenter").html("");
                        documentViewLoad();
                        break;
                    default:
                }
            }
        }

        function backToLogin() {
            document.location.href = 'login.html';
        }

        function unloadApp(appName) {
            clearTimeout(tid); //clears effects using this timer
            clearPopsNoEvent();
            var test = $.loadedApp;
            if ($.loadedApp != 'casenotes') {
                $.session.useSessionFilterVariables = false;
            }
            switch (appName) {
                case "home":
                    $.pages.rosterToolBar = $("#roostertoolbar").html();
                    break;
                case "roster":
                    // Cache the roster HTML so we can restore upon reload
                    //$.pages.roster = $("#actioncenter").html();
                    $.pages.rosterbanner = $("#actionbanner").html();
                    $.pages.rosterconsumerpane = $("#consumerpane").html();
                    $.pages.rosterconsumerlist = $("#consumerlist").html();
                    $.pages.rosterdate = $("#datebox").val();
                    break;
                case "dayservices":
                    $.pages.dayservices = $("#actioncenter").html();
                    //location history save for back and forth between modules
                    if ($('#dslocationbox').text() != "Select a Location") {
                        $.session.dsLocationHistoryValue = $('#dslocationbox').attr('locid');
                        $.session.dsLocationHistoryFlag = true;
                    }
                    //$.pages.dayservicesbanner = $("#actionbanner").html();
                    break;
                case "goals":
                    $.pages.goals = $("#actioncenter").html();
                    $.session.singleLoadedConsumerName = "";
                    $.session.singleLoadedConsumerId = "";
                    $(".roostertoolbar").removeClass("currentConsumerDisplayName");
                    $("*").removeClass("resultserrorboxdailygoals");
                    //$("#actioncenter").removeClass("momentum");
                    $(".roostertoolbar").html("");
                    //$.pages.goalsbanner = $("#actionbanner").html();
                    break;
                case "single":
                    $.pages.single = $("#actioncenter").html;
                    //$.pages.goalsbanner = $("#actionbanner").html();
                    break;
                case "casenotes":
                    $.session.caseNoteListResponse = '';
                    clearTimerOnSave();
                    $.caseNotes.dontResetInactTimerFlag = false;
                    break;
                case "singleentry":
                    $.pages.singleentry = $("#actioncenter").html;
                    $("*").removeClass("singleentryselected");
                    break;
                case "documentview":
                    $.pages.documentview = $("actioncenter").html;
                    intellivueLogoutUser();
                    break;
                default:
            }
        }

        function resizeHeaderText(tag, length) {
            if (length <= 9) {
                $(tag).css("font-size", "25px");
            }
            if (length > 9) {
                $(tag).css("font-size", "21px");
            }
            if (length > 13) {
                $(tag).css("font-size", "18px");
            }
            if (length > 17) {
                $(tag).css("font-size", "15px");
            }
            if (length > 20) {
                $(tag).css("font-size", "12px");
            }
            if (length > 30) {
                $(tag).css("font-size", "11px");
            }
        }

        function changeStatus(event) {
            if ($(event.target).parent().parent().find('dayservicesstatus').css("opacity") == 1) {
                closeStatus(event);
            } else {
                popStatus(event);
            }
        }

        function popStatus(event) {

            $(event.target).parent().parent().find('dayservicesstatus').css("opacity", "1").css("display", "block");

            $(event.target).parent().parent().parent().find('hpcstatus').css("opacity", "1");
            $(event.target).parent().parent().find('hpcstatus').css("display", "block");

            $(event.target).parent().parent().find('notes').css("opacity", "1").css("display", "block");
        }

        function closeStatus(event) {
            $(event.target).parent().parent().parent().find('dayservicesstatus').css("opacity", "0").css("display", "none");
            $(event.target).parent().parent().find('hpcstatus').css("opacity", "0").css("display", "none");
            $(event.target).parent().parent().find('notes').css("opacity", "0").css("display", "none");
        }

        function boxAction(event) {
            var tarId = "",
                nodeName = "",
                className = "",
                Consumer,
                consumerInfo;

            if ($.session.browser == "Explorer" || $.session.browser == "Mozilla") {
                tarId = event.srcElement.id;
                nodeName = event.srcElement.nodeName;
                className = event.srcElement.className;
            } else {
                tarId = $(event.target).attr('id');
                nodeName = event.target.nodeName;
                className = event.target.className;
            }

            if ($.session.singleLoadedConsumerId != "") {
                var selectedConsumerId = $.session.singleLoadedConsumerId;
            } else {
                var selectedConsumerId = event.currentTarget.id;
            }

            if ($("div[consumerid=" + selectedConsumerId + "]")[0] != null) {
                $("div[consumerid=" + selectedConsumerId + "]")[0].scrollIntoView(false);
            }

            if (overClicky() == true) return;

            if ($.loadedApp == "roster") {
                if ($.roster.moveable == false) {
                    alert("Please select a location or group with less than 2500 active consumers.")
                    return;
                }
                $(".consumerselected").removeClass("highlightselected");
                if (className == "customFileUpload" || className == "simpledemoicon" || className == "fileSelector") {

                } else {
                    moveConsumerBox(event);
                }

            }

            if ($.loadedApp == "dayservices") {
                $(".consumerselected").removeClass("highlightselected");
                highlightPerson(event);
            }

            if ($.loadedApp == "goals") {
                //don't allow already selected consumer to enter hightlightPersonGoals(), stops double click problems
                var par = $(event.target);
                if ($(par).hasClass("consumerselected")) {
                    //alert("outer"); //not sure if this is still being hit ever -Joe
                } else {
                    par = $(par).closest('consumer');
                }
                var consumerId = par.attr('id');
                if ($("#" + consumerId).hasClass("highlightselected")) {
                    return;
                }

                $(".consumerselected").removeClass("highlightselected");
                $.goals.saveButton = false;
                $.goals.deleteButton = false;
                highlightPersonGoals(event);
                $(goalsfiltertext).html("All Services");
                $(goalsoccurancefiltertext).html("All Occurences");
            }

            if ($.loadedApp == "casenotes" && $.session.batchedNoteEdit == false) {
                highlightPersonCasenotes(event);
                currentlySelectedConsumers();
            }

            if ($.loadedApp == "singleentry") {
                if ($.roster.moveable == false) {
                    alert("Please select a location or group with less than 2500 active consumers.")
                    return;
                }
                $(".consumerselected").removeClass("highlightselected");
                if (className == "customFileUpload" || className == "simpledemoicon" || className == "fileSelector") {

                } else {
                    moveConsumerBox(event);
                }

            }

            if ($.loadedApp == "documentview") {
                if ($(par).hasClass("consumerselected")) {
                    //alert("outer"); //not sure if this is still being hit ever -Joe
                } else {
                    par = $(par).closest('consumer');
                }
                var par = $(event.target);
                var consumerId = par.attr('id');
                if ($("#" + consumerId).hasClass("highlightselected")) {
                    return;
                }
                $(".consumerselected").removeClass("highlightselected");
                retrieveConsumerDocumentList(event, consumerId);
            }

        }

        $(document).ready(function () {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.id = "mapScript";
            script.src = "https:" + "//maps.googleapis.com/maps/api/js?libraries=geometry&key=" + $.googleMapAPI;
            script.async = true;
            script.defer = true;
            var target = document.getElementsByTagName('script')[0];
            target.parentNode.insertBefore(script, target);           


            //May need to use this to disable tab as a whole
            /*$(document).on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    e.preventDefault();
                }
            });*/
            $.session.height = $(window).height();
            $.session.width = $(window).width();

            knob();
            //set up page to run
            setSession(getDefaultAnywhereSettings);
            $("#userName").text($.session.Name);
            $("#firstName").text($.session.Name);
            $("#lastName").text($.session.LName);

            //Get default days back for case notes on log in
            //getDefaultAnywhereSettings();
            //set version number to what is in code
            checkVersions();
            //get starting data for the apge
            //loadApp("roster");
            $.pages.roster = $("#actioncenter").html();
            $.pages.rosterbanner = $("#actionbanner").html();
            $.pages.rostertoolbar = $("#rostertoolbar").html();
            //loadApp("home");
            
            $(document).on('touchstart click', function () {
                switch ($.loadedApp) {
                    case "roster":
                        if ($(event.target).attr('id') == "demonotestextarea") {

                        } else {
                            clearPops(event);
                        }

                        break;
                    case "dayservices":
                        clearPops(event);
                        clearDayServicePops(event);
                        break;
                    case "goals":
                        clearPops(event);
                        clearGoalsPops(event);
                        break;
                    case "casenotes":
                        clearPops(event);
                        clearCasenotesPops(event);
                        break;

                    default:
                        clearPops(event);
                }
            });
            browserSpecificEnabled();
        });


        function refreshConsumerListHeight() {
            $("#consumerlist").height($(window).height() - ($("#consumerlist").offset().top));
        }

        window.onresize = function () {
            if ($.session.browser == "Safari") {
                //hardcoded ipad size.  Poor solution but handles the tablet dynamic search bar add remove confusion with screen height.
                $("#consumerlist").height(519);
            } else {
                refreshConsumerListHeight();
                if ($("#consumerlist").height() < 500) {
                    $("#consumerlist").height(500)
                }
            }

        }

        function saveBanner() {
            $.banner = true;
        }

        function checkModulePermissions() {
            if ($.session.DayServiceView == false) {
                $("#dayservicesettingsbutton").addClass("disabledModule");
            }
            if ($.session.GoalsView == false) {
                $("#goalssettingsbutton").addClass("disabledModule");
            }

            if ($.session.CaseNotesView == false || $.session.CaseNotesTablePermissionView == false) {
                //comment in when db stuff gets added
                $("#casenotesbutton").addClass("disabledModule");
            }

            if ($.session.SingleEntryView == false) {
                //comment in when db stuff and permissions gets added to users
                $("#singleentrybutton").addClass("disabledModule");
            }
            $("#adminsingleentrysettingsdiv").hide();
            if ($.session.ViewAdminSingleEntry === true) {
                if ($.session.SEViewAdminWidget === true) {
                    //comment in when db stuff and permissions gets added to users
                    $("#adminsingleentrysettingsdiv").show();
                }
            }            
        }

        function addOrRemoveHelpScreenImage() {
            var x = window.innerWidth
            if (x < 1340) {
                $(".left-side").addClass("no-image-module");
                $("div").removeClass("left-side right-side right-side-guitar");
            }
        }
        //window.onbeforeunload = function(){
        //    return "are you sure?";
        //};



        //http://stackoverflow.com/questions/1891444/cursor-position-in-a-textarea-character-index-not-x-y-coordinates
        (function ($, undefined) {
            $.fn.getCursorPosition = function () {
                var el = $(this).get(0);
                var pos = 0;
                if ('selectionStart' in el) {
                    pos = el.selectionStart;
                } else if ('selection' in document) {
                    el.focus();
                    var Sel = document.selection.createRange();
                    var SelLength = document.selection.createRange().text.length;
                    Sel.moveStart('character', -el.value.length);
                    pos = Sel.text.length - SelLength;
                }
                return pos;
            }
        })(jQuery);
        
        (function ($) {
            $(function () {
                //The best way to detect if the browser is on mobile. Cross browser compatible, and does not clutter the DOM.
                //$.mobile = window.matchMedia("only screen and (max-width: 760px)").matches;
                //http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
                $.mobile = false; //initiate as false
                // device detection
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                    $.mobile = true;
                }
            })
        })(jQuery);