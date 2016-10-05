/**
 * MapController
 *
 * @description :: Server-side logic for managing maps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var turf = require('turf');
var squareGrid = require('turf-square-grid');
var fs = require('fs');
function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	getGrid: function(req,res){
		// console.log(req.query.info);
		var bounds = JSON.parse(req.query.info);
		//southwest
		var minX = bounds._sw.lat; 
		var minY = bounds._sw.lng;
		//northeast
		var maxX = bounds._ne.lat;
		var maxY = bounds._ne.lng;
		var extent = [minX,minY,maxX,maxY];
		var cellWidth = 3;
		var units = 'kilometers';
//modified square grid to multiply the cell width by 3/5 to make them appear more square
//I also added a totalX and totalY property for how many squares are returned.
		var squares = squareGrid(extent, cellWidth, units);
		var intvl = setInterval(function() {
    if (squares) { 
        clearInterval(intvl);
		return res.ok(squares)
    }
}, 100);
		// console.log(squareGrid)
	},
	filterCities: function(req,res){
		//whole map bounds: {"_southWest":{"lat":33.24787594792436,"lng":-17.314453125},"_northEast":{"lat":54.265224078605655,"lng":42.71484375}}
		console.log("filtering Cities")
		var bounds = {
            "_southWest":{
            "lat":33.2,"lng":-17.2
            },
            "_northEast":{
                "lat":54.2,"lng":42.8
            }
        }
		fs.readFile('cities.json', "utf-8",function(err,data){
			var cities = JSON.parse(data)
			var cities = cities.features;
			var cityNames = [];
			for (var i = cities.length - 1; i >= 0; i--) {
				var lat = cities[i].geometry.coordinates[1];
				var lng = cities[i].geometry.coordinates[0];
				if(lat >= bounds._southWest.lat && lat <= bounds._northEast.lat){
					if(lng >= bounds._southWest.lng && lng <= bounds._northEast.lng){
					cityNames.push(cities[i]);
					}
				}
				console.log(cities[i].id);
				if(i==0){
					var europeCities = JSON.stringify(cityNames);
					fs.writeFile('europeCities.json',europeCities,function(err,data){
					console.log("success writhing file.")
					return res.ok(cityNames)
				})
			}
			};
		})
		// return res.ok("nothing");

		// fs.writeFile('message.txt', 'Hello Node.js', (err) => {
		// 	if (err) throw err;
		// 	console.log('It\'s saved!');
		// });
	},
	makeCities: function(req,res){
		fs.readFile('europeCities.json','utf-8',function(err,data){
			var cities = JSON.parse(data);
			var gameCities = [];
		// Take all of the European cities
		//For each:
			var city3s = [];
			var city4s = [];
			var city5s = [];
		for (var k = cities.length - 1; k >= 0; k--) {
		// for (var k = 2 - 1; k >= 0; k--) {
			var city = {};
			city.name = cities[k].id;
			// Round the latLng to the center of a square.
			var roundedLat = (2*Math.round(cities[k].geometry.coordinates[0]*50)/100)+0.01;
			var roundedLng = (25*Math.round(cities[k].geometry.coordinates[1]*40)/1000)+0.0125;
		// };
			city.latLng = [roundedLat,roundedLng]
			// Generate a point grid around it where each point is the centerpoint of a square
			var latChange = 0.02
			var lngChange = 0.025
			var pointGrid = [];
			var currentLat = roundedLat + latChange*3;
			var begLng = roundedLng - lngChange*3;
			var currentLng = begLng;
			for (var i = 0; i <= 6; i++) {
					var pointLine = [];
				for (var j = 0; j <= 6; j++) {
					pointLine[j]={gridCoords:[i,j],latLng:[currentLat,currentLng]}
					currentLng+=lngChange;
					currentLng = Math.round(currentLng*1000)/1000
				};
				pointGrid.push(pointLine)
				currentLng = begLng;
				currentLat-=latChange;
				currentLat = Math.round(currentLat*100)/100
			};
			// Generate a city
			city.cityParts = [];
			var population = 0;
			for (var i = pointGrid.length - 1; i >= 0; i--) {
				for (var j = pointGrid[i].length - 1; j >= 0; j--) {
                var within1 = (4 >= i && i >= 2 && 4 >= j && j >= 2);
                var within2 = (5 >= i && i >= 1 && 5 >= j && j >= 1);
                if (within1){
                	//Of the nine spaces within1 space, 3 should be city3's and 1 should be a city4
                	var seed = getRandom(1,9); 
                    if(seed <= 3){
                    	//add the city to the city3s object, which will be added to the geoJSON file at the end
                    	city3s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].id+i+j})
                    	//add the city to the city object
                    	city.cityParts.push({type:"city3",latLng:pointGrid[i][j].latLng,population:100000});
                    	population+=100000
                    }
                    else if(seed == 4){
                    	//add the city to the city3s object, which will be added to the geoJSON file at the end
                    	city4s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].id+i+j})
                    	//add the city to the city object
                    	city.cityParts.push({type:"city4",latLng:pointGrid[i][j].latLng,population:50000});
                    	population += 50000
                    }
                } else if (within2){
                	//Of the 15 spaces within2 spaces, 2 should be city3's, 1 should be city4's and 3 should be a city4
                    var seed = getRandom(1,15);
                    if(seed <= 2){
                    	//add the city to the city3s object, which will be added to the geoJSON file at the end
                    	city3s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].id+i+j})
                    	//add the city to the city object
                    	city.cityParts.push({type:"city3",latLng:pointGrid[i][j].latLng,population:100000});
                    	population+=100000
                    }
                    else if(seed == 3){
                    	//add the city to the city3s object, which will be added to the geoJSON file at the end
                    	city4s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].id+i+j})
                    	//add the city to the city object
                    	city.cityParts.push({type:"city4",latLng:pointGrid[i][j].latLng,population:50000});
                    	population += 50000
                    }
                    else if(seed > 3 && seed <= 5){
                    	//add the city to the city3s object, which will be added to the geoJSON file at the end
                    	city5s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].id+i+j})
                    	//add the city to the city object
                    	city.cityParts.push({type:"city5",latLng:pointGrid[i][j].latLng,population:25000});
                    	population += 25000
                    }
                } else {
                	//Of the 24 spaces within3 spaces, 2 should be city3's, 3 should be city4's and 3 should be a city4
                    var seed = getRandom(1,24);
                    if(seed <= 2){
                    	//add the city to the city3s object, which will be added to the geoJSON file at the end
                    	city3s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].id+i+j})
                    	//add the city to the city object
                    	city.cityParts.push({type:"city3",latLng:pointGrid[i][j].latLng,population:100000});
                    	population+=100000
                    }
                    else if(seed > 2 && seed <= 4){
                    	//add the city to the city3s object, which will be added to the geoJSON file at the end
                    	city4s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].id+i+j})
                    	//add the city to the city object
                    	city.cityParts.push({type:"city4",latLng:pointGrid[i][j].latLng,population:50000});
                    	population += 50000
                    }
                    else if(seed > 4 && seed <= 6){
                    	//add the city to the city3s object, which will be added to the geoJSON file at the end
                    	city5s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].id+i+j})
                    	//add the city to the city object
                    	city.cityParts.push({type:"city5",latLng:pointGrid[i][j].latLng,population:25000});
                    	population += 25000
                    }
                }
                }//close j of point grid
				}//close i of point grid
				city.population = population;
				gameCities.push(city);
			}//close each city
			//write file for city3s,cit4s,city5s and gameCities
			var city3geojson = {"type":"FeatureCollection"};city3geojson.features = city3s;
			var city4geojson = {"type":"FeatureCollection"};city4geojson.features = city4s;
			var city5geojson = {"type":"FeatureCollection"};city5geojson.features = city5s;
			fs.writeFile("gameCities.json",JSON.stringify(gameCities),function(err,data){if(err){console.log(err)}})
			fs.writeFile("city3s.geojson",JSON.stringify(city3geojson),function(err,data){if(err){console.log(err)}})
			fs.writeFile("city4s.geojson",JSON.stringify(city4geojson),function(err,data){if(err){console.log(err)}})
			fs.writeFile("city5s.geojson",JSON.stringify(city5geojson),function(err,data){if(err){console.log(err)}
				console.log("Done writing files")
				return res.ok("all cities created")})
		})//close readFile
	},//close makeCities
	listCities: function(req,res){
		console.log("Listing Cities")
		fs.readFile('gameCities.js', "utf-8",function(err,data){
			var cities = JSON.parse(data);
			var population=0;
			var biggest = {};
			biggest.name = "cameron";
			biggest.size = 50;
			var smallest = {};
			smallest.name = "escher";
			smallest.size = 555555555;
			for (var i = cities.length - 1; i >= 0; i--) {
				console.log(cities[i].name)
				if(cities[i].population>biggest.size){
					biggest.name = cities[i].name;
					biggest.size = cities[i].population;
				}
				if(cities[i].population<smallest.size){
					smallest.name = cities[i].name;
					smallest.size = cities[i].population
				}
				population += cities[i].population;
				if(i==0){
					var average=population/cities.length;
					return res.ok({"Average":average,"Total":population,"City Count":cities.length,biggest,smallest})
				}
			};
		})
	}
};//close module.exports

