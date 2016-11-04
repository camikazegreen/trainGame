function initializeKeyboardNav(map){

function dealWithKeyup(e){
  if(e.keyCode == "16"){
    map.removeLayer('shortrange');
    map.removeLayer('midrange');
    map.removeLayer('longrange');
  }
}
window.addEventListener("keyup", dealWithKeyup, false);
var keyMap = {}; // You could also use an array
onkeydown = onkeyup = function(e){
    var getCurrentPos = map.getSource("keyboardsquare")._data.geometry.coordinates[0];
    function keyboardMove(x,y){
        map.currentSquare.data = {
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
        map.getSource("keyboardsquare").setData(map.currentSquare.data)
        getCurrentPos = map.getSource("keyboardsquare")._data.geometry.coordinates[0];
        
        // calculate the square by taking the average of the corners.
        map.currentSquare.center = [(getCurrentPos[2][0]-getCurrentPos[0][0])/2+getCurrentPos[0][0], (getCurrentPos[2][1]-getCurrentPos[0][1])/2+getCurrentPos[0][1]]
        map.updateDataBox();
//if the square gets moved outside of the bounding box, move the viewport
if(map.currentSquare.center[1]<currentBounds._sw.lat || map.currentSquare.center[1]>currentBounds._ne.lat || map.currentSquare.center[0]<currentBounds._sw.lng || map.currentSquare.center[0]>currentBounds._ne.lng){
    map.panTo(map.currentSquare.center);
}
}
e = e || event; // to deal with IE
keyMap[e.keyCode] = e.type == 'keydown';
if(keyMap[16] && keyMap[32]){ //shift & space
    console.log("Shift and Space")
    $("#station-creator").removeClass("hidden");
}
if(keyMap[16]){ //shift
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
if(keyMap[73] || keyMap[38]){ //i or up arrow
    keyboardMove(0,0.02);
}
if(keyMap[79]){ //o
    keyboardMove(0.025,0.02)
}
if(keyMap[76] || keyMap[39]){ //l + right
    keyboardMove(0.025,0)
}
if(keyMap[190]){ //.
    keyboardMove(0.025,-0.02)
}
if(keyMap[188] || keyMap[40] || keyMap[75]){ //, + down + k
    keyboardMove(0,-0.02)
}
if(keyMap[77] || keyMap[78]){ //m + n
    keyboardMove(-0.025,-0.02)
}
if(keyMap[74] || keyMap[37]){ //j + left || "37"
    keyboardMove(-0.025,0)
}
if(keyMap[85]){ //u
    keyboardMove(-0.025,0.02)
}

} // onkeydown && onkeyup
}