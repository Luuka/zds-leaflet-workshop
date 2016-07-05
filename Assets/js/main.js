document.addEventListener('DOMContentLoaded', function(){
    var mapManager = new MapManager();

    mapManager.map.addEventListener('click', function(e){
        mapManager.addWaypoint(e);
    });

    document.getElementById('exportToGPX').addEventListener('click', function() {
        new GpxFactory(mapManager.waypoints, mapManager.map.getBounds());
    });

    document.getElementById('clear').addEventListener('click', function() {
        mapManager.clearAll();
        document.getElementById('gpxOutput').style.display = "none";
        document.getElementById('gpxOutput').innerHTML = "";
    });
});
