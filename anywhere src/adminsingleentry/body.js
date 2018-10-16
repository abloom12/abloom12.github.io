function buildSingleEntryBody() {
    return new Promise(function (fulfillTop, rejectTop) {
        var holder = $("<div class='buildSingleEntryBody'>").css("width", "825px"),
	        promises = [];

	    promises.push(buildAdminSingleEntryFilters());
	    promises.push(buildAdminSingleEntryButtons());
	    promises.push(initializeAdminSingleEntryGrid());
	    promises.push(initializeAdminSingleEntryMap());

	    Promise.all(promises).then(function success(data) {
	        var obj = {};
	        data.forEach(function (datum) {
	            for (var key in datum) {
	                obj[key] = datum[key];
	            }
	        });
	        holder.append(obj.filterHolder).append(obj.buttonHolder).append(obj.tableHolder).append(obj.mapHolder);
	        $("#actioncenter").append(holder);
	        
	        fulfillTop(obj);
	    }, function error(err) {
	        console.log(err);
	        rejectTop(err);
	    });
	});
}