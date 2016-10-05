        var population = 0;
        var city3 = {};
        	city3.options={}
        	city3.options.stroke = false;
        	city3.options.fill = true
        	city3.options.fillOpacity = 0.6
        	city3.population = 100000;
        var city4 = {};
        	city4.options={}
        	city4.options.stroke = false;
        	city4.options.fill = true
        	city4.fillOpacity = 0.4
        	city4.population = 50000;
        var city5 = {}        	
        	city5.options={};
        	city5.options.stroke = false;
        	city5.options.fill = true
        	city5.options.fillOpacity = 0.2
        	city5.population = 25000;
//to populate a city, I should just pass through the coordinates,
//and only go through those 49 squares instead of the whole map.

//I should define variables for how many of each thing
    var seedCityLgN = function(grid,coords,map){    	
        for (var i = grid.length - 1; i >= 0; i--) {
            for (var j = grid[i].length - 1; j >= 0; j--) {
            	if(j==grid[i].length){
            	}
                var southwest = [grid[i][j][0],grid[i][j][1]];
                var northeast = [grid[i][j][0],grid[i][j][1]];
                var bounds = [southwest, northeast];
                options = {fill:false, weight: 1, opacity:1, stroke:true};
                var within1 = (coords[0] + 1) >= i && i >= (coords[0] - 1) && (coords[1]+1) >= j && j >= (coords[1] -1)
                var within2 = (coords[0] + 2) >= i && i >= (coords[0] - 2) && (coords[1]+2) >= j && j >= (coords[1] -2)
                var within3 = (coords[0] + 3) >= i && i >= (coords[0] - 3) && (coords[1]+3) >= j && j >= (coords[1] -3)
                
                if (within1){
                	//Of the nine spaces within1 space, 3 should be city3's and 1 should be a city4
                	var seed = getRandom(1,9); 
                    if(seed <= 3){options = city3.options; population+=city3.population}
                    else if(seed == 4){options = city4.options; population+=city4.population}
                    else {options.fill = false;}
                } else if (within2){
                	//Of the 15 spaces within2 spaces, 2 should be city3's, 1 should be city4's and 3 should be a city4
                    var seed = getRandom(1,15);
                    if(seed <= 2){options= city3.options; population+=city3.population}
                    else if(seed == 3){options = city4.options; population+=city4.population}
                    else if(seed > 3 && seed <= 5){options = city5.options; population+=city5.population}
                    else {options.fill = false;}
                } else if (within3){
                	//Of the 24 spaces within3 spaces, 2 should be city3's, 3 should be city4's and 3 should be a city4
                    var seed = getRandom(1,24);
                    if(seed <= 2){options= city3.options; population+=city3.population}
                    else if(seed > 2 && seed <= 4){options = city4.options; population+=city4.population}
                    else if(seed > 4 && seed <= 6){options = city5.options; population+=city5.population}
                    else {options.fill = false;}
                } else {
                    options.fill = false;
                    options.stroke = true;
                }
            // L.rectangle(bounds, options).addTo(map);
            };

        console.log(population)
            

        };
}