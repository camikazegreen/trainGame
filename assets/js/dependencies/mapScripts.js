
var map;
var currentBounds;
var currentZoom;

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FtaWthemVncmVlbiIsImEiOiJINE9RRFhvIn0.K7qZW250wpNclZ0Ii-EG6Q';
$(document).ready(function(){
  // var url = "https://api.mapbox.com/styles/v1/camikazegreen/cirhvvqh00015hhmcwbgi25vl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FtaWthemVncmVlbiIsImEiOiJINE9RRFhvIn0.K7qZW250wpNclZ0Ii-EG6Q"
  var url = 'mapbox://styles/camikazegreen/cirhvvqh00015hhmcwbgi25vl';

  //whole map bounds: {"_southWest":{"lat":33.24787594792436,"lng":-17.314453125},"_northEast":{"lat":54.265224078605655,"lng":42.71484375}}
  var bounds = [
    [-17.2,33.2], // Southwest coordinates
    [42.8, 54.2]  // Northeast coordinates
];
  // var map = L.mapbox.map('map-one', url).setView([44.69989765840321,12.7001953125], 5);
  var map = new mapboxgl.Map({
    container: 'map-one',
    style: url,
    center: [12,45],
    zoom: 4,
    maxBounds: bounds, // Sets bounds as max
    maxZoom:10,
    dragRotate:false
});
    var minimap = new mapboxgl.Map({
    container: 'minimap',
    style: url,
    center: [11,45],
    zoom: 1.636586,
    scrollZoom: false,
    dragRotate: false,
    dragPan: false,
    keyboard: false,
    doubleClickZoom: false,
    touchZoomRotate: false,
    attributionControl: false
});
    map.currentSquare = {}
map.currentSquare.data = {'type': 'Feature','properties': {'name': 'keyboardsquare'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}
map.currentSquare.center = [12,45]
  map.updateDataBox = function(){
    currentBounds = map.getBounds();
    document.getElementById("bounds-info").innerHTML = "<p>Bottom Left = ["+Math.round(currentBounds._sw.lat)+","+Math.round(currentBounds._sw.lng)+"]</p><p>Top Right = ["+Math.round(currentBounds._ne.lat)+","+Math.round(currentBounds._ne.lng)+"]</p>";
    currentZoom = map.getZoom();
    document.getElementById("zoom-info").innerHTML = "Zoom = "+Math.round(currentZoom*100)/100;
    document.getElementById("currentsquare").innerHTML = "<p>Current Square = ["+Math.round(map.currentSquare.center[1]*1000)/1000+","+Math.round(map.currentSquare.center[0]*1000)/1000+"]</p>"

    var features = map.queryRenderedFeatures(map.project(map.currentSquare.center));
    if(features[0]){
      console.log(features)
      document.getElementById("square-info").innerHTML = JSON.stringify(features[0].layer.id, null, 2);
    }
  } // updateDataBox




    map.on('load',function(e){
      map.updateDataBox();
      currentBounds = map.getBounds();
      currentZoom = map.getZoom();
      map.addSource('keyboardsquare',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'keyboardsquare'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}});
      map.addSource('shortrange',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'shortrange'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}});
      map.addSource('midrange',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'midrange'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}});
      map.addSource('longrange',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'longrange'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}});
      map.addLayer({'id': 'keyboardnav','type': 'line','source': 'keyboardsquare','layout': {},'paint': {'line-color': '#fff','line-opacity': 1}});

      }) //map.on load
    minimap.on('load',function(e){
      minimap.addSource('redsquare',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'redsquare'},'geometry': {'type': 'Polygon','coordinates':[[42, 53],[-17, 53],[-17, 34],[42, 34],[42, 53]]}}});
      minimap.addLayer({'id': 'zoombox','type': 'line','source': 'redsquare','layout': {},'paint': {'line-color': '#f00','line-opacity': 0.8}});
    }); //minimap.on load
    map.moveRedSquare = function(e){
      var b = map.getBounds();
      // console.log("bounds = ",b)
      minimap.getSource("redsquare").setData({
            'type': 'Feature',
            'properties': {
                'name': 'redsquare'
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates':[[
                [b._sw.lng, b._sw.lat],
                    [b._ne.lng, b._sw.lat],
                    [b._ne.lng, b._ne.lat],
                    [b._sw.lng, b._ne.lat],
                    [b._sw.lng, b._sw.lat]
                    ]]
            }
        })
      // console.log(minimap.getSource('redsquare'))

    }// moveRedSquare

//*************************************
initializeMouseNav(map,minimap);
initializeKeyboardNav(map);
initializeBuildStations(map);
})
