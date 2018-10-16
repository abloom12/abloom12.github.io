var remainingDailyServicesWidget = (function () {
    var filter = {
        outcomeType: '%',
        location: '%',
        group: '%'
    };

    function populateFilteredList(res) {
        var consumers = {};
        var totalServices = 0;
        var totalConsumers = 0;

        res.forEach(function (consumer) {
            var fullName = consumer.first_name + ' ' + consumer.last_name;
            if (!consumers[fullName]) consumers[fullName] = 0;
            consumers[fullName]++;
            totalServices++;
        });

        var list = document.getElementById('goalsUL');
        list.innerHTML = '';

        var names = Object.keys(consumers);
        names.forEach(function (name) {
            var li = document.createElement('LI');
            li.innerText = name + ' - ' + consumers[name];
            list.appendChild(li);
            totalConsumers++;
        });

        var consumerCount = document.getElementById('goalsConsumerCount');
        var serviceCount = document.getElementById('goalsCount');
        consumerCount.innerText = totalConsumers;
        serviceCount.innerText = totalServices;
    }

    function populateOutcomeTypesFilter(res) {
        var dataArr = res.map(function(data) {
            return {
                id: data.Id,
                text: data.Description
            };
        });
        var defaultOutcome = {
            id: '%',
            text: 'ALL'
        };
        dataArr.unshift(defaultOutcome);
        $('#goalsOutcomeTypes').PSlist(dataArr, {
            callback: function (item) {
                filter.outcomeType = removeDecimals(item.id);
                $('#goalsOutcomeTypes').text(item.text);
                // Temporary Fix 9-13-18
                //if (filter.outcomeType === "%" && filter.location === "%" && filter.group === "%") {
                //    getRemainingGoalsCountForDashboard(function (err, res) {
                //        showRemainingGoals(res, $("#goalsCount"), $("#goalsUL"), $("#goalsConsumerCount"));
                //    });
                //} else {
                    remainingDailyServicesWidgetAjax.populateFilteredList(filter.outcomeType, filter.location, filter.group);
                //}
            }
        });
    }

    function populateLocationsFilter(res) {
        var dataArr = res.map(function (data) {
            return {
                id: data.ID,
                text: data.Name
            };
        });
        var defaultLocation = {
            id: '%',
            text: 'ALL'
        };
        dataArr.unshift(defaultLocation);
        $('#goalsLocations').PSlist(dataArr, {
            callback: function (item) {
                filter.location = removeDecimals(item.id);
                $('#goalsLocations').text(item.text);
                // Temporary Fix 9-13-18
                //if (filter.outcomeType === "%" && filter.location === "%" && filter.group === "%") {
                //    getRemainingGoalsCountForDashboard(function (err, res) {
                //        showRemainingGoals(res, $("#goalsCount"), $("#goalsUL"), $("#goalsConsumerCount"));
                //    });
                //} else {
                    filter.group = '%';
                    $('#goalsGroups').text('EVERYONE');
                    remainingDailyServicesWidgetAjax.populateFilteredList(filter.outcomeType, filter.location, filter.group);
                //}
            }
        });
    }

    function populateGroupsFilter(res) {
        var dataArr = res.map(function (data) {
            return {
                id: data.RetrieveID,
                text: data.GroupName
            };
        });

        findAndSlice(dataArr, "Caseload", "text");
        findAndSlice(dataArr, "Needs Attention", "text");
        findAndSlice(dataArr, "Everyone", "text");

        var defaultGroup = {
            id: '%',
            text: 'EVERYONE'
        };
        dataArr.unshift(defaultGroup);
        $('#goalsGroups').PSlist(dataArr, {
            callback: function (item) {
                filter.group = removeDecimals(item.id);
                $('#goalsGroups').text(item.text);
                // Temporary Fix 9-13-18
                //if (filter.outcomeType === "%" && filter.location === "%" && filter.group === "%") {
                //    getRemainingGoalsCountForDashboard(function (err, res) {
                //        showRemainingGoals(res, $("#goalsCount"), $("#goalsUL"), $("#goalsConsumerCount"));
                //    });
                //} else {
                    remainingDailyServicesWidgetAjax.populateFilteredList(filter.outcomeType, filter.location, filter.group);
                //}
            }
        });
    }

    //Public Initialize Function
    function init() {
        var dropdowns = document.getElementsByClassName('js-goals-dropdown');
        var dropdownsArray = Array.prototype.slice.call(dropdowns);
        dropdownsArray.forEach(function (dropdown) {
            switch (dropdown.id) {
                case 'goalsOutcomeTypes':
                    dropdown.innerText = 'ALL';
                    remainingDailyServicesWidgetAjax.populateOutcomeTypesFilter();
                    break;
                case 'goalsLocations':
                    dropdown.innerText = 'ALL';
                    remainingDailyServicesWidgetAjax.populateLocationsFilter();
                    break;
                case 'goalsGroups':
                    dropdown.innerText = 'EVERYONE';
                    remainingDailyServicesWidgetAjax.populateGroupsFilter()
                    break;
            }
        });
    }

    return {
        filter:filter,
        populateOutcomeTypesFilter: populateOutcomeTypesFilter,
        populateLocationsFilter: populateLocationsFilter,
        populateGroupsFilter: populateGroupsFilter,
        populateFilteredList: populateFilteredList,
        init: init
    };

}());