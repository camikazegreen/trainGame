function initializeMouseNav(map,minimap){
map.on('click',function(e){
//zoom to the next level, 4 -> 6 -> 7 -> 9
console.log(e.lngLat)
moveKeyboardSquare(e);
})
function moveKeyboardSquare(e){
  currentBounds = map.getBounds();
  // console.log(currentBounds);
//check the center of the current square, and only move if it is outside of the bounds
//get the center of the square
//make sure the lat is not in between the bounds
if(map.currentSquare.center[1]<currentBounds._sw.lat || map.currentSquare.center[1]>currentBounds._ne.lat || map.currentSquare.center[0]<currentBounds._sw.lng || map.currentSquare.center[0]>currentBounds._ne.lng){
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
map.currentSquare.center = [blng+0.0125,blat+0.01]
map.updateDataBox();
map.currentSquare.data = {
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
map.getSource("keyboardsquare").setData(map.currentSquare.data)

// console.log(map.getSource('keyboardsquare'))
//*************************************************************
}
minimap.on('click',function(e){
  map.flyTo({center: e.lngLat, zoom: 6});
})
map.on('zoom',function(e){
  map.updateDataBox();
  map.moveRedSquare();
  moveKeyboardSquare(e);
})
map.on('move',function(e){
  map.updateDataBox();
  map.moveRedSquare(e);
  moveKeyboardSquare(e);
})
}