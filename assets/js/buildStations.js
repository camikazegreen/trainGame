function initializeBuildStations(map){
	$(document).ready(function() {
    $('input[type=radio][name=station-chooser]').change(function() {
		var i = map.currentSquare;
         var el = document.createElement('div');
        if (this.value == 'depot') {
            console.log("Making a depot");
    		el.className = 'depot';
        }
        else if (this.value == 'station') {
            console.log("Making a station")
    		el.className = 'station';
        }
        else if (this.value == 'terminal'){
        	console.log("Making a terminal")
    		el.className = 'terminal';
        }
        new mapboxgl.Marker(el)
        .setLngLat(i.center)
        .addTo(map);
    });
});
}