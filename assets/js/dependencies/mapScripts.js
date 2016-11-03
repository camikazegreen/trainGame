// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var map;
var currentBounds;
var currentZoom;
var currentSquare = {}
    currentSquare.data = {'type': 'Feature','properties': {'name': 'keyboardsquare'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}
    currentSquare.center = [12,45]

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FtaWthemVncmVlbiIsImEiOiJINE9RRFhvIn0.K7qZW250wpNclZ0Ii-EG6Q';
$(document).ready(function(){
  // var url = "https://api.mapbox.com/styles/v1/camikazegreen/cirhvvqh00015hhmcwbgi25vl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FtaWthemVncmVlbiIsImEiOiJINE9RRFhvIn0.K7qZW250wpNclZ0Ii-EG6Q"
  var url = 'mapbox://styles/camikazegreen/cirhvvqh00015hhmcwbgi25vl'

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
    var keyMap = {}; // You could also use an array
onkeydown = onkeyup = function(e){
    var getCurrentPos = map.getSource("keyboardsquare")._data.geometry.coordinates[0];
    function keyboardMove(x,y){
      currentSquare.data = {
            'type': 'Feature',
            'properties': {
                'name': 'keyboardsquare'
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates':[[
                    [getCurrentPos[0][0]+x, getCurrentPos[0][1]+y],
                    [getCurrentPos[1][0]+x, getCurrentPos[1][1]+y],
                    [getCurrentPos[2][0]+x, getCurrentPos[2][1]+y],
                    [getCurrentPos[3][0]+x, getCurrentPos[3][1]+y],
                    [getCurrentPos[4][0]+x, getCurrentPos[4][1]+y]
                    ]]
            }
        }
      map.getSource("keyboardsquare").setData(currentSquare.data)
    getCurrentPos = map.getSource("keyboardsquare")._data.geometry.coordinates[0];
    currentSquare.center = [(getCurrentPos[2][0]-getCurrentPos[0][0])/2+getCurrentPos[0][0], (getCurrentPos[2][1]-getCurrentPos[0][1])/2+getCurrentPos[0][1]]
    updateDataBox();
    if(currentSquare.center[1]<currentBounds._sw.lat || currentSquare.center[1]>currentBounds._ne.lat || currentSquare.center[0]<currentBounds._sw.lng || currentSquare.center[0]>currentBounds._ne.lng){
      map.panTo(currentSquare.center);
    }
    }
    e = e || event; // to deal with IE
    keyMap[e.keyCode] = e.type == 'keydown';
    if(keyMap[16] && keyMap[32]){
      console.log("Shift and Space")
      $("#station-creator").removeClass("hidden");
    }
}
  function updateDataBox(){
      currentBounds = map.getBounds();
      document.getElementById("bounds-info").innerHTML = "<p>Bottom Left = ["+Math.round(currentBounds._sw.lat)+","+Math.round(currentBounds._sw.lng)+"]</p><p>Top Right = ["+Math.round(currentBounds._ne.lat)+","+Math.round(currentBounds._ne.lng)+"]</p>";
      currentZoom = map.getZoom();
      document.getElementById("zoom-info").innerHTML = "Zoom = "+Math.round(currentZoom*100)/100;
  document.getElementById("currentsquare").innerHTML = "<p>Current Square = ["+Math.round(currentSquare.center[1]*1000)/1000+","+Math.round(currentSquare.center[0]*1000)/1000+"]</p>"

    var features = map.queryRenderedFeatures(map.project(currentSquare.center));
    if(features[0]){
    console.log(features)
    document.getElementById("square-info").innerHTML = JSON.stringify(features[0].layer.id, null, 2);
    }
}
  // var styleLayer = L.tileLayer(url)
  //   .addTo(map);

    map.on('click',function(e){
      //zoom to the next level, 4 -> 6 -> 7 -> 9
      console.log(e.lngLat)
      moveKeyboardSquare(e);
      var updateZoom;
      if(currentZoom >= 4 && currentZoom < 6){updateZoom = 6}
      if(currentZoom >= 6 && currentZoom < 7){updateZoom = 7}
      if(currentZoom >= 7 && currentZoom < 9){updateZoom = 9}
      if(currentZoom >= 9){updateZoom = 10}
      // map.flyTo({center: e.lngLat, zoom: updateZoom});
    
    // console.log(sourceFeatures);
    // var elevation = $.ajax({
    //   url:"https://api.mapbox.com/v4/surface/mapbox.mapbox-terrain-v2.json?layer=contour&fields=ele&points="+currentSquare.center+"&access_token="+mapboxgl.accessToken
    // });
    // console.log(elevation)
    // document.getElementById("elevation").innerHTML = elevation
    })

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
    minimap.on('load',function(e){
      minimap.addSource('redsquare',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'redsquare'},'geometry': {'type': 'Polygon','coordinates':[[42, 53],[-17, 53],[-17, 34],[42, 34],[42, 53]]}}});
      minimap.addLayer({'id': 'zoombox','type': 'line','source': 'redsquare','layout': {},'paint': {'line-color': '#f00','line-opacity': 0.8}});
    }); 
    map.on('load',function(e){
      updateDataBox();
      currentBounds = map.getBounds();
      currentZoom = map.getZoom();
      map.addSource('keyboardsquare',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'keyboardsquare'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}});
      map.addSource('shortrange',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'shortrange'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}});
      map.addSource('midrange',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'midrange'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}});
      map.addSource('longrange',{'type': 'geojson','data': {'type': 'Feature','properties': {'name': 'longrange'},'geometry': {'type': 'Polygon','coordinates':[[[12,45],[12.025, 45],[12.025, 45.02],[12, 45.02],[12, 45]]]}}});
      map.addLayer({'id': 'keyboardnav','type': 'line','source': 'keyboardsquare','layout': {},'paint': {'line-color': '#fff','line-opacity': 1}});
        window.addEventListener("keydown", dealWithKeydown, false);
        window.addEventListener("keyup", dealWithKeyup, false);
      })
    function moveRedSquare(e){
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

    }
    function moveKeyboardSquare(e){
      //check the center of the current square, and only move if it is outside of the bounds
      //get the center of the square
      //make sure the lat is not in between the bounds
      if(currentSquare.center[1]<currentBounds._sw.lat || currentSquare.center[1]>currentBounds._ne.lat || currentSquare.center[0]<currentBounds._sw.lng || currentSquare.center[0]>currentBounds._ne.lng){
          var b = map.getCenter();
        }
          else if(e.lngLat){b = e.lngLat};
      // console.log("bounds = ",b.lat)
      //Adjust to nearest latlng on the grid
      if(!b){return}
      console.log("e.point "+e.lngLat)
      var blng = b.lng;
          blng = 25*Math.round(blng*40)/1000;
      var blat = b.lat;
          blat = 2*Math.round(blat*50)/100;
          currentSquare.center = [blng+0.0125,blat+0.01]
          updateDataBox();
          currentSquare.data = {
            'type': 'Feature',
            'properties': {
                'name': 'keyboardsquare'
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates':[[
                [blng, blat],
                    [blng+0.025, blat],
                    [blng+0.025, blat+0.02],
                    [blng, blat+0.02],
                    [blng, blat]
                    ]]
            }
        }
      map.getSource("keyboardsquare").setData(currentSquare.data)
      
      // console.log(map.getSource('keyboardsquare'))
//*************************************************************
    }
function dealWithKeydown(e){
    var getCurrentPos = map.getSource("keyboardsquare")._data.geometry.coordinates[0];
    function keyboardMove(x,y){
      currentSquare.data = {
            'type': 'Feature',
            'properties': {
                'name': 'keyboardsquare'
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates':[[
                    [getCurrentPos[0][0]+x, getCurrentPos[0][1]+y],
                    [getCurrentPos[1][0]+x, getCurrentPos[1][1]+y],
                    [getCurrentPos[2][0]+x, getCurrentPos[2][1]+y],
                    [getCurrentPos[3][0]+x, getCurrentPos[3][1]+y],
                    [getCurrentPos[4][0]+x, getCurrentPos[4][1]+y]
                    ]]
            }
        }
      map.getSource("keyboardsquare").setData(currentSquare.data)
    getCurrentPos = map.getSource("keyboardsquare")._data.geometry.coordinates[0];
    currentSquare.center = [(getCurrentPos[2][0]-getCurrentPos[0][0])/2+getCurrentPos[0][0], (getCurrentPos[2][1]-getCurrentPos[0][1])/2+getCurrentPos[0][1]]
    updateDataBox();
    if(currentSquare.center[1]<currentBounds._sw.lat || currentSquare.center[1]>currentBounds._ne.lat || currentSquare.center[0]<currentBounds._sw.lng || currentSquare.center[0]>currentBounds._ne.lng){
      map.panTo(currentSquare.center);
    }
    }
  if(e.keyCode == "73" || e.keyCode == "38"){ //i or up arrow
    keyboardMove(0,0.02);
  }
  if(e.keyCode == "79"){ //o
    keyboardMove(0.025,0.02)
  }
  if(e.keyCode == "76" || e.keyCode == "39"){ //l + right
    keyboardMove(0.025,0)
  }
  if(e.keyCode == "190"){ //.
    keyboardMove(0.025,-0.02)
  }
  if(e.keyCode == "188" || e.keyCode == "40" || e.keyCode == "75"){ //, + down + k
    keyboardMove(0,-0.02)
  }
  if(e.keyCode == "77" || e.keyCode == "78"){ //m + n
    keyboardMove(-0.025,-0.02)
  }
  if(e.keyCode == "74" || e.keyCode == "37"){ //j + left || "37"
    keyboardMove(-0.025,0)
  }
  if(e.keyCode == "85"){ //u
    keyboardMove(-0.025,0.02)
  }
  if(e.keyCode == "16"){ //shift
    console.log("shift")
      map.getSource("shortrange").setData({
            'type': 'Feature',
            'properties': {
                'name': 'shortrange'
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates':[[
                    [getCurrentPos[0][0]-0.025, getCurrentPos[0][1]-0.02],
                    [getCurrentPos[1][0]+0.025, getCurrentPos[1][1]-0.02],
                    [getCurrentPos[2][0]+0.025, getCurrentPos[2][1]+0.02],
                    [getCurrentPos[3][0]-0.025, getCurrentPos[3][1]+0.02],
                    [getCurrentPos[4][0]-0.025, getCurrentPos[4][1]-0.02]
                    ]]
            }
        })
      map.addLayer({'id': 'shortrange','type': 'line','source': 'shortrange','layout': {},'paint': {'line-color': '#fff','line-opacity': 0.8}});
      map.getSource("midrange").setData({
            'type': 'Feature',
            'properties': {
                'name': 'midrange'
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates':[[
                    [getCurrentPos[0][0]-0.05, getCurrentPos[0][1]-0.04],
                    [getCurrentPos[1][0]+0.05, getCurrentPos[1][1]-0.04],
                    [getCurrentPos[2][0]+0.05, getCurrentPos[2][1]+0.04],
                    [getCurrentPos[3][0]-0.05, getCurrentPos[3][1]+0.04],
                    [getCurrentPos[4][0]-0.05, getCurrentPos[4][1]-0.04]
                    ]]
            }
        })
      map.addLayer({'id': 'midrange','type': 'line','source': 'midrange','layout': {},'paint': {'line-color': '#fff','line-opacity': 0.5}});
      map.getSource("longrange").setData({
            'type': 'Feature',
            'properties': {
                'name': 'longrange'
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates':[[
                    [getCurrentPos[0][0]-0.075, getCurrentPos[0][1]-0.06],
                    [getCurrentPos[1][0]+0.075, getCurrentPos[1][1]-0.06],
                    [getCurrentPos[2][0]+0.075, getCurrentPos[2][1]+0.06],
                    [getCurrentPos[3][0]-0.075, getCurrentPos[3][1]+0.06],
                    [getCurrentPos[4][0]-0.075, getCurrentPos[4][1]-0.06]
                    ]]
            }
        })
      map.addLayer({'id': 'longrange','type': 'line','source': 'longrange','layout': {},'paint': {'line-color': '#fff','line-opacity': 0.3}});
  }
}

function dealWithKeyup(e){
  if(e.keyCode == "16"){
    map.removeLayer('shortrange');
    map.removeLayer('midrange');
    map.removeLayer('longrange');
  }
}
//*************************************
    minimap.on('click',function(e){
      map.flyTo({center: e.lngLat, zoom: 6});
    })
    map.on('zoom',function(e){
      updateDataBox();
      moveRedSquare();
      moveKeyboardSquare(e);
      })
    map.on('move',function(e){
      updateDataBox();
      moveRedSquare(e);
      moveKeyboardSquare(e);
    })

})
