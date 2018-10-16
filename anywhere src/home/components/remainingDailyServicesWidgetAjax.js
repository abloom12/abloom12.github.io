var remainingDailyServicesWidgetAjax = (function () {

    function makeAjaxCall(url, successFunction, outcomeType, locationId, group) {
        var data = {};
        data.token = $.session.Token;
        data.outcomeType = outcomeType ? outcomeType : '%';
        data.locationId = locationId ? locationId : '%';
        data.group = group ? group : '%';
        $.ajax({
            type: "POST",
            url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/" + url + "/",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunction,
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }
    // Gets data for outcome types filter
    function populateOutcomeTypesFilter() {
        makeAjaxCall('populateOutcomeTypesRemainingServicesWidgetFilter', function hey(response, status, xhr) {
            var res = response.populateOutcomeTypesRemainingServicesWidgetFilterResult;
            remainingDailyServicesWidget.populateOutcomeTypesFilter(res);
        }, null, null, null);
        
    }
    // Gets data for locations filter
    function populateLocationsFilter(populateOutcomeTypesRemainingServicesWidgetFilter, cb, cb) {
        makeAjaxCall('populateLocationsRemainingServicesWidgetFilter', function (response, status, xhr) {
            var res = response.populateLocationsRemainingServicesWidgetFilterResult;
            remainingDailyServicesWidget.populateLocationsFilter(res);
        }, null, null, null);
    }
    // Gets data for groups filter homeajax 310
    function populateGroupsFilter(locationId) {
        makeAjaxCall('populateGroupsRemainingServicesWidgetFilter', function (response, status, xhr) {
            var res = response.populateGroupsRemainingServicesWidgetFilterResult;
            remainingDailyServicesWidget.populateGroupsFilter(res);
        }, null, locationId, null);
    }
    // Gets List of Consumers based off filtering
    function populateFilteredList(outcomeType, locationId, group) {
        populateGroupsFilter(locationId); // Temporary Fix 9-13-18
        makeAjaxCall('remainingServicesWidgetFilter', function (response, status, xhr) {
            var res = response.remainingServicesWidgetFilterResult;
            remainingDailyServicesWidget.populateFilteredList(res);
        }, outcomeType, locationId, group);        
    }
    
    return {
        populateOutcomeTypesFilter: populateOutcomeTypesFilter,
        populateLocationsFilter: populateLocationsFilter,
        populateGroupsFilter: populateGroupsFilter,
        populateFilteredList: populateFilteredList
    };

}());