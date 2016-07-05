var MapManager = function() {
    this.map       = L.map('map').setView([48.758872948417604, 1.9461679458618164], 15);
    this.line      = L.polyline([]).addTo(this.map);
    this.waypoints = [];
    this.distance  = 0;

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(this.map);

};

MapManager.prototype.updateData = function() {
    document.getElementById('distance').value     = this.formatDistance(this.distance);
    document.getElementById('markersCount').value = this.waypoints.length;
};

MapManager.prototype.addWaypoint = function(e) {
    var keepThis = this;
    var marker = L.marker([e.latlng.lat, e.latlng.lng], {draggable:'true'}).addTo(this.map);
    marker.on('dragend', function(){
        keepThis.reDrawLine();
    });
    marker.on('dblclick', function(){
        keepThis.removeMarker(this);
    });
    marker.on('click', function(){
        event.stopPropagation();
    });
    this.line.addLatLng(marker.getLatLng());
    this.waypoints.push(marker);
    this.calculDistance();
};

MapManager.prototype.removeMarker = function(marker) {
    var leafletId = marker._leaflet_id;
    var markers   = this.waypoints;
    var marker    = this.findMarkerById(markers, leafletId);

    this.waypoints.splice(marker['targetMarkerId'], 1);
    this.map.removeLayer(marker['targetMarker']);

    this.reDrawLine();
};

MapManager.prototype.findMarkerById = function(markers, leafletId) {
    var data = [];
    for (var marker in markers) {
        if(markers[marker]._leaflet_id == leafletId){
            data['targetMarker']   = markers[marker];
            data['targetMarkerId'] = marker;
        }
    }
    return data;
};

MapManager.prototype.reDrawLine = function() {
    this.line.setLatLngs([]);
    var points = this.waypoints;
    for (var point in points) {
        this.line.addLatLng(points[point].getLatLng());
    }

    this.calculDistance();
};

MapManager.prototype.calculDistance = function() {
    var points = this.line.getLatLngs();
    this.distance = 0;
    if(points.length > 1) {
        for (i=0;i<points.length-1;i++) {

            this.distance += points[i].distanceTo(points[i+1]);
            this.waypoints[i+1].bindPopup(this.formatDistance(this.distance)).openPopup();
        }
    }
    this.updateData();
};

MapManager.prototype.formatDistance = function(distance) {
    return Math.round(10*distance/1000)/10+" Km";
}

MapManager.prototype.clearAll = function() {
    var markers = this.waypoints;
    for(marker in markers) {
        this.map.removeLayer(markers[marker]);
    }

    this.waypoints = [];
    this.distance  = 0;
    this.map.removeLayer(this.line);
    this.line      = L.polyline([]).addTo(this.map);

    this.updateData();
}
