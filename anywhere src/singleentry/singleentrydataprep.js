function updateSingleEntryDataSetUp(data, saveMessage) {
    var consumerId = data.consumerId,
		locationId = data.location,
		newDate = new Date(data.date),
	    dateOfService = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()),
		startTime = convertTimeToMilitaryNew(data.startTime),
		endTime = convertTimeToMilitaryNew(data.endTime),
		checkHours = timeStringToFloat(data.timeDiff),
		workCodeID = data.workCode,
		inComments = data.notes,
		transportationReimbursable = data.transportationType,
		transportationUnits = data.transportationTotalMiles,
		odometerStart = data.transportationOdometerStart,
		odometerEnd = data.transportationOdometerEnd,
		destination = data.transportationDestination,
		reason = data.transportationReason,
        numberOfConsumersPresent = data.numberOfConsumersPresent,
        singleEntryId = data.singleEntryID,
        userId = $.session.UserId,
        entryData;
    if (startTime.indexOf("::") != -1) startTime = "";
    if (endTime.indexOf("::") != -1) endTime = "";
    if (checkHours == "NaN") checkHours = "";

    entryData = {
        token: $.session.Token,
        userId: userId,
        dateOfService: dateOfService,
        locationId: locationId,
        workCodeID: workCodeID,
        startTime: startTime,
        endTime: endTime,
        checkHours: checkHours,
        consumerId: consumerId,
        transportationUnits: transportationUnits,
        transportationReimbursable: transportationReimbursable,
        numberOfConsumersPresent: numberOfConsumersPresent,
        singleEntryId: singleEntryId,
        inComments: inComments,
        odometerStart: odometerStart,
        odometerEnd: odometerEnd,
        destination: destination,
        reason: reason
    };

    if (entryData.startTime != "" && entryData.endTime != "") {
        entryData.checkHours = "0";
    }

    updateSingleEntry(entryData, saveMessage);
}

function saveSingleEntryDataSetUp(data, saveMessage) {
    var consumerId = data.consumerId,
		locationId = data.location,
		newDate = new Date(data.date),
	    dateOfService = (newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()),
        startTime = "",
        endTime = "",
        userId = $.session.UserId,
        entryData;

    if (data.startTime == "") {
		//Do squat
	} else {
        startTime = convertTimeToMilitaryNew(data.startTime);
	}

    if (data.endTime == "") {
        //Do squat
    } else {
        endTime = convertTimeToMilitaryNew(data.endTime);
    }
    var checkHours = "";
    if (data.timeDiff == "") {
        //Do squat
    } else {
        checkHours = timeStringToFloat(data.timeDiff);
    }

	workCodeID = data.workCode,
	inComments = data.notes,
	transportationReimbursable = data.transportationType,
	transportationUnits = data.transportationTotalMiles,
	odometerStart = data.transportationOdometerStart,
	odometerEnd = data.transportationOdometerEnd,
	destination = data.transportationDestination,
	reason = data.transportationReason,
    numberOfConsumersPresent = data.numberOfConsumersPresent,
    latitude = data.latitude,
    longitude = data.longitude;

    entryData = {
        token: $.session.Token,
        userId: userId,
        dateOfService: dateOfService,
        locationId: locationId,
        workCodeID: workCodeID,
        startTime: startTime,
        endTime: endTime,
        checkHours: checkHours,
        consumerId: consumerId,
        transportationUnits: transportationUnits,
        transportationReimbursable: transportationReimbursable,
        numberOfConsumersPresent: numberOfConsumersPresent,
        inComments: inComments,
        odometerStart: odometerStart,
        odometerEnd: odometerEnd,
        destination: destination,
        reason: reason,
        latitude: latitude,
        longitude: longitude
    };

    if (entryData.startTime != "" && entryData.endTime != "") {
        entryData.checkHours = "0";
    }

    if(entryData.locationId) {
        insertSingleEntryNew(entryData, function () {
            insertSingleEntrySuccess();
            loadApp('singleentry', true);
        });
    }else if(entryData.consumerId == ''){
        insertSingleEntryNew(entryData, function () {
            insertSingleEntrySuccess();
            loadApp('singleentry', true);
        });
    }
    else {
        preInsertSingleEntry(entryData, saveMessage);
    }
}