function initializeAdminSingleEntryMap() {
    return new Promise(function (fulfill, reject) {
        var mapHolder = $("<div>").css("width", "100%").css("height", "554px"),
            promises = [];

        promises.push(createAdminSingleEntryMap());

        Promise.all(promises).then(function success(data) {
            var obj = { mapHolder: mapHolder };
            data.forEach(function (datum) {
                for (var key in datum) {
                    obj[key] = datum[key];
                }
            });
            mapHolder.append(obj.map);
            fulfill(obj);
        }, function error(err) {
            console.log(err);
            reject(err);
        });
    });
}

function createAdminSingleEntryMap() {
    return new Promise(function (fulfill, reject) {
        var map = $("<div>").attr("id", "map").css("height", "100%");
        fulfill({ map: map });
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        //center: new google.maps.LatLng(40.099770, -82.994043),
        zoom: 14,
        draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    //getUserSingleEntryLocationsForPayPeriod
}

//function initiateMap(mapDOM, userName, startDate, endDate, locationID, status) {
function initiateMap(obj) {
    var mapDOM = obj.map,
        userName = obj.userName,
        startDate = obj.startDate,
        endDate = obj.endDate,
        locationID = obj.id,
        status = obj.status,
        table = obj.table;

    //Care of http://stackoverflow.com/questions/8766218/detect-if-marker-is-within-circle-overlay-on-google-maps-javascript-api-v3
    google.maps.Circle.prototype.contains = function (myLatLng) {
        return this.getBounds().contains(myLatLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), myLatLng) <= this.getRadius();
    }
    var map = new google.maps.Map(mapDOM[0], {
        center: new google.maps.LatLng(37.0902, -95.7129),
        zoom: 4,
        draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    getUserSingleEntryLocationsForPayPeriod({
        token: $.session.Token,
        userId: userName,
        startDate: startDate,
        endDate: endDate,
        locationID: locationID,
        status: status
    }, function (res) {
        var locations = setUpMapData(res);

        if (Object.keys(locations).length) {
            var infowindow = new google.maps.InfoWindow({
                content: ""
            });
            var bound = new google.maps.LatLngBounds();
            markers = [];
            for (var latlng in locations) {
                var lat = parseFloat(latlng.split(",")[0], 10);
                var lng = parseFloat(latlng.split(",")[1], 10);
                var ids = locations[latlng];
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: map
                });
                marker.AnywhereCustomObject = {};
                (function (ids) {
                    marker.AnywhereCustomObject.ids = ids;
                })(ids);
                markers.push(marker);
                google.maps.event.addListener(marker, "click", (function (marker, lat, lng, ids) {
                    return function (event) {
                        getAddressByLatLong(lat, lng, function (addr) {
                            infowindow.setContent("<p>Total: " + ids.length + "<hr style='width:50%;text-align:left;margin-left:0' />" + addr + "</p>");
                            infowindow.open(map, marker);
                            table.find("tr").removeClass("highlightedAdminRow");

                            ids.forEach(function (SEid) {
                                table.find("tr[SEID=" + SEid + "]").addClass("highlightedAdminRow");
                            });
                        });
                    }
                })(marker, lat, lng, ids));
                bound.extend(new google.maps.LatLng(lat, lng));
            }
            map.setCenter(bound.getCenter());
            map.setZoom(getBoundsZoomLevel(bound, { height: mapDOM.height(), width: mapDOM.width() }) - 1);
        }
    });
    return map;
}

var markers = [];
function buildMap(userName, startDate, endDate) {
    window.initMap = (function (userName, startDate, endDate) {
        return function () {
            //Care of http://stackoverflow.com/questions/8766218/detect-if-marker-is-within-circle-overlay-on-google-maps-javascript-api-v3
            google.maps.Circle.prototype.contains = function (myLatLng) {
                return this.getBounds().contains(myLatLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), myLatLng) <= this.getRadius();
            }
            map = new google.maps.Map(document.getElementById('map'), {
                center: new google.maps.LatLng(37.0902, -95.7129),
                zoom: 4,
                draggable: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            getUserSingleEntryLocationsForPayPeriod(userName, startDate, endDate, function (res) {
                var locations = setUpMapData(res);
                
                if (Object.keys(locations).length) {
                    var infowindow = new google.maps.InfoWindow({
                        content: ""
                    });
                    var bound = new google.maps.LatLngBounds();
                    markers = [];
                    for (var latlng in locations) {
                        var lat = parseFloat(latlng.split(",")[0], 10);
                        var lng = parseFloat(latlng.split(",")[1], 10);
                        var ids = locations[latlng];
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(lat, lng),
                            map: map
                        });
                        marker.AnywhereCustomObject = {};
                        (function (ids) {
                            marker.AnywhereCustomObject.ids = ids;
                        })(ids);
                        markers.push(marker);
                        google.maps.event.addListener(marker, "click", (function (marker, lat, lng, ids) {
                            return function (event) {
                                getAddressByLatLong(lat, lng, function (addr) {
                                    infowindow.setContent("<p>Total: " + ids.length + "<hr style='width:50%;text-align:left;margin-left:0' />" + addr + "</p>");
                                    infowindow.open(map, marker);
                                    $("#singleEntryTableHolder").find("tr").removeClass("highlightedAdminRow");
                                    ids.forEach(function (SEid) {
                                        $("#singleEntryTableHolder").find("tr[SEID=" + SEid + "]").addClass("highlightedAdminRow");
                                    });
                                });
                            }
                        })(marker, lat, lng, ids));
                        bound.extend(new google.maps.LatLng(lat, lng));
                    }
                    map.setCenter(bound.getCenter());
                    map.setZoom(getBoundsZoomLevel(bound, { height: $("#map").height(), width: $("#map").width() }) - 1);
                }
            });
        }
    })(userName, startDate, endDate);
    if (!$("#mapScript").length) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "mapScript";
        script.src = "https:" + "//maps.googleapis.com/maps/api/js?libraries=geometry&key=" + $.googleMapAPI + "&callback=initMap";
        script.async = true;
        script.defer = true;
        var target = document.getElementsByTagName('script')[0];
        target.parentNode.insertBefore(script, target);
    }
    else {
        window.initMap();
    }
}

var map;
function setUpMapData(res) {
    var locations = {};
    $('locations', res).each(function () {
        var latitude = $('latitude', this).text();
        var longitude = $('longitude', this).text();
        var singleEntryId = $('singleentryid', this).text();
        var success = false;
        for (var latlng in locations) {
            var lat = parseFloat(latlng.split(",")[0], 10);
            var lng = parseFloat(latlng.split(",")[1], 10);
            var center = new google.maps.LatLng(lat, lng);
            var circ = new google.maps.Circle({ center: center, radius: 50 });
            var myPoint = new google.maps.LatLng(parseFloat(latitude, 10), parseFloat(longitude, 10))
            if (circ.contains(myPoint)) {
                locations[latlng].push(singleEntryId);
                success = true;
            }
        }
        if (!success) {
            locations[[latitude, longitude].join(",")] = [singleEntryId];
        }
    });
    return locations;
}

//Care of http://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds
function getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}