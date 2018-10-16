function buildTransportationModal(obj) {
    var response = obj.html,
        readonly = obj.readonly,
        transportationIndicator = obj.transportationIndicator,
        transportationType = obj.transportationType,
        transportationOdometerStart = obj.transportationOdometerStart,
        transportationOdometerEnd = obj.transportationOdometerEnd,
        transportationTotalMiles = obj.transportationTotalMiles,
        transportationDestination = obj.transportationDestination,
        transportationReason = obj.transportationReason,
        destinationRequired = obj.destinationRequired,
        noteRequired = obj.noteRequired,
        odometerRequired = obj.odometerRequired,
        reasonRequired = obj.reasonRequired,
        status = obj.status,
        transportationInputs = obj.transportationInputs;

    var template = $(response).clone().css({
        "opacity": "1.0 !important"
    }).show();

    var overlay = $("<div>").css({
        "backgroundColor": "rgba(0, 0, 0, 0.15)"
    });
    overlay.addClass("singleentryoverlay").append(template);

    $("body").append(overlay);

    function contentEditable() {
        if ($(this).attr("disabled") != undefined) {
            $(this).attr("contenteditable", false).addClass('unclickableElement');
        }
        else {
            $(this).attr("contenteditable", true).removeClass('unclickableElement');
        }
    }

    var transportationTypeBox = $("#transportationType", template).attr("disabled", readonly).on("editablechange", contentEditable).trigger("editablechange"),
        odometerstart = $("#odometerstart", template).val(transportationOdometerStart.val()).attr("disabled", readonly).on("editablechange", contentEditable).trigger("editablechange"),
        odometerend = $("#odometerend", template).val(transportationOdometerEnd.val()).attr("disabled", readonly).on("editablechange", contentEditable).trigger("editablechange"),
        totalmiles = $("#totalmiles", template).val(transportationTotalMiles.val()).attr("disabled", readonly).on("editablechange", contentEditable).trigger("editablechange"),
        destination = $("#transportationdestination", template).val(transportationDestination.val()).attr("disabled", readonly).on("editablechange", contentEditable).trigger("editablechange"),
        reason = $("#transportationreason", template).val(transportationReason.val()).attr("disabled", readonly).on("editablechange", contentEditable).trigger("editablechange"),
        transportationsave = $("#transportationsave", template).attr("disabled", readonly),
        transportationdelete = $("#transportationdelete", template).hide(),
        transportationreset = $("#transportationreset", template).attr("disabled", readonly),
        transportationcancel = $("#transportationcancel", template);

    if (status == "P" || status == "R") {
        if (obj.readonly == false) {
            transportationdelete.show();
        }        
    }
    if (status == "S") {
        transportationsave.hide();
        transportationreset.hide();
    }
    if (obj.readonly == true) {
        transportationreset.hide();
    }
    if (totalmiles.text() != "") {
        totalmiles.text(parseInt(totalmiles.text(), 10));
    }

    $(".SEtransportationerror", template).hide();

    if (transportationType.val() == "" && $("#locationbox").attr("singleentrytransportationreimburse") == "Y") {
        transportationType.val("Y").trigger("change");
    }
    if (transportationType.val() == "Y") {
        transportationTypeBox.text("Personal");
    }
    else {
        transportationTypeBox.text("Company");
    }

    transportationTypeBox.click(function (e) {
        var types = ["Personal", "Company"].sort();
        var overlay2 = $("<div>").addClass("singleentryoverlay").css("zIndex", "10000").click(function () {
            $(this).remove();
        });
        $("body").append(overlay2);
        var popupbox = $("<popupbox>");
        $("popupbox").remove();
        overlay2.append(popupbox);

        popupbox.css({
            top: transportationTypeBox.offset().top,
            left: transportationTypeBox.offset().left,
            position: "fixed",
            zIndex: "10001"
        }).show();

        types.forEach(function (type) {
            var a = $("<a>").text(type).click(function (e) {
                e.preventDefault();
                transportationTypeBox.text(type);
                var obja = null;

                obja = transportationErrorCheck();

                if (obja.errors.length && !obja.everythingNull) {
                    console.log(obja.errors);
                }
            });
            popupbox.append(a);
        });
    });

    $([destination, reason]).each(function () {
        $(this).on("blur", function () {
            var obja = null;

            obja = transportationErrorCheck();

            if (obja.errors.length && !obja.everythingNull) {
                console.log(obja.errors);
            }
        }).on("keyup", function () {
            transportationErrorCheck();
        });
    });
    $([odometerstart, odometerend, totalmiles]).each(function () {
        $(this).on('change keyup', function () {
            // Remove invalid characters
            var sanitized = $(this).val().replace(/[^0-9]/g, '');
            // Update value
            $(this).val(sanitized);
        }).on("keypress", function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        });
    });
    
    $([odometerstart, odometerend]).each(function () {
        $(this).blur(function () {
            if ($(this).val() == "") {
                totalmiles.attr("disabled", false).trigger("editablechange");
            }
            else {
                if (odometerstart.val() != "" && odometerend.val() != "") {
                    var num = (parseFloat(odometerend.val()) - parseFloat(odometerstart.val())).toFixed();
                    if(!isNaN(num)) {
                        totalmiles.val(num).attr("disabled", true).trigger("editablechange");
                    }
                }
                else {
                    if (totalmiles.val() == "") {
                        totalmiles.attr("disabled", false).trigger("editablechange");
                    }
                }
            }
            var obja = null;

            obja = transportationErrorCheck();

            if (obja.errors.length && !obja.everythingNull) {
                console.log(obja.errors);
            }
        });
    });

    totalmiles.blur(function () {
        if ($(this).val() != "") {
            if (odometerstart.val() == "") {
                odometerstart.html("&nbsp;").attr("disabled", true).trigger("editablechange");
            }

            if (odometerend.val() == "") {
                odometerend.html("&nbsp;").attr("disabled", true).trigger("editablechange");
            }
        }
        else {
            odometerstart.attr("disabled", false).trigger("editablechange");
            odometerend.attr("disabled", false).trigger("editablechange");
        }

        var obja = null;

        obja = transportationErrorCheck();

        if (obja.errors.length && !obja.everythingNull) {
            console.log(obja.errors);
        }
    });

    transportationsave.click(function () {
        var obja = null;

        obja = transportationErrorCheck();

        if (obja.errors.length && !obja.everythingNull) {
            console.log(obja.errors);
            return;
        }

        var transportationVehicleType = transportationTypeBox.text().trim(),
                odometerStart = odometerstart.val().trim(),
                odometerEnd = odometerend.val().trim(),
                totalMiles = totalmiles.val().trim(),
                finalDestination = destination.val().trim(),
                finalReason = reason.val().trim();

        if (transportationVehicleType.toLowerCase() == "personal") {
            transportationType.val("Y");
        }
        else if (transportationVehicleType.toLowerCase() == "company") {
            transportationType.val("N");
        }
        else {
            transportationType.val("");
        }

        transportationOdometerStart.val(odometerStart);
        transportationOdometerEnd.val(odometerEnd);
        transportationTotalMiles.val(totalMiles);
        transportationDestination.val(finalDestination);
        transportationReason.val(finalReason);

        updateTransportationIndicator(transportationTotalMiles, transportationIndicator);
        overlay.remove();
    });

    transportationdelete.click(function () {
        transportationTypeBox.html("&nbsp;");
        $([odometerstart, odometerend, totalmiles]).each(function () {
            $(this).html("").trigger("blur");
        });
        $("#transportationdestination", template).val("");
        $("#transportationreason", template).val("");

        var transportationVehicleType = transportationTypeBox.text().trim(),
                odometerStart = odometerstart.val().trim(),
                odometerEnd = odometerend.val().trim(),
                totalMiles = totalmiles.val().trim(),
                finalDestination = destination.val().trim(),
                finalReason = reason.val().trim();

        if (transportationVehicleType.toLowerCase() == "personal") {
            transportationType.val("Y");
        }
        else if (transportationVehicleType.toLowerCase() == "company") {
            transportationType.val("N");
        }
        else {
            transportationType.val("");
        }

        transportationOdometerStart.val(odometerStart);
        transportationOdometerEnd.val(odometerEnd);
        transportationTotalMiles.val(totalMiles);
        transportationDestination.val(finalDestination);
        transportationReason.val(finalReason);

        updateTransportationIndicator(transportationTotalMiles, transportationIndicator);
        overlay.remove();
    });

    transportationreset.click(function () {
        transportationTypeBox.html("&nbsp;");
        $([odometerstart, odometerend, totalmiles]).each(function () {
            $(this).val("").trigger("blur");
        });
        $("#transportationdestination", template).val("");
        $("#transportationreason", template).val("");
        transportationErrorCheck();
    });

    transportationcancel.click(function () {
        overlay.remove();
    });

    function transportationErrorCheck() {
        transportationsave.hide();
        var obja = {
            errors: [],
            everythingNull: true
        };

        resetTransportationErrors();

        var transportationVehicleType = transportationTypeBox.text().trim(),
                odometerStart = odometerstart.val().trim(),
                odometerEnd = odometerend.val().trim(),
                totalMiles = totalmiles.val().trim(),
                finalDestination = destination.val().trim(),
                finalReason = reason.val().trim();

        var allInputs = [transportationVehicleType, odometerStart, odometerEnd, totalMiles, finalDestination, finalReason];

        if (transportationVehicleType == "") {
            obja.errors.push("Please select a Transportation Type.");
            $("#transportationtypeerror").show();
        }
        if (totalMiles == "") {
            obja.errors.push("Total Miles not entered.");
            $("#totalmileserror").show();
        }

        if (parseInt(totalMiles, 10) < 0) {
            obja.errors.push("Invalid Total Miles entered.");
            $("#totalmileserror").show();
        }

        if (destinationRequired == "Y" && finalDestination == "") {
            obja.errors.push("Destination is a required field.");
            $("#destinationerror").show();
        }

        if (reasonRequired == "Y" && finalReason == "") {
            obja.errors.push("Reasons is a required field.");
            $("#reasonerror").show();
        }

        if (odometerRequired == "Y") {
            if (odometerStart == "") {
                $("#odometerstarterror").show();
                obja.errors.push("Odometer data is required.");
            }
            if (odometerEnd == "") {
                $("#odometerenderror").show();
                obja.errors.push("Odometer data is required.");
            }
        }

        for (var i = 0; i < allInputs.length; i++) {
            if (allInputs[i] != "" && allInputs[i] != undefined) {
                obja.everythingNull = false;
            }
        }

        if (obja.errors.length && !obja.everythingNull) {
            transportationsave.hide();
        }
        else {
            if(status != "S") transportationsave.show();
        }
        return obja;
    }

    transportationErrorCheck();
}

function resetTransportationErrors() {
    $("#transportationtypeerror, #totalmileserror, #destinationerror, #reasonerror, #odometerstarterror, #odometerenderror").hide();
}