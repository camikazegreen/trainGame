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
 function getBaseLog(x, y) {
 	return Math.log(y) / Math.log(x);
 }
//If you run getBaseLog(10, 1000) it returns 2.9999999999999996 due to floating-point rounding, which is very close to the actual answer of 3.

function getTargetGamePop(currentPop){
	targetGamePop = 10000*(Math.pow(5,getBaseLog(10,(currentPop/10000))))
	targetGamePop = Math.round(targetGamePop)
	if(targetGamePop<25000){
		targetGamePop = 25000;
	}
	if(targetGamePop>25000 && targetGamePop<50000){
		targetGamePop = 50000;
	}

	return targetGamePop
}
						function getRingUnits(city){
						var totalCityUnits = city.properties.city3s + city.properties.city4s + city.properties.city5s
						var citySprawl = city.properties.citySprawl
						//3 is the easiest, you just fill everything in.
						var ringUnits = {};
						 ringUnits.inner = 0;
						 ringUnits.middle = 0;
						 ringUnits.outer = 0;
						//the first three units always go in the inner ring
						for (var i = 3; i > 0; i--) {
							ringUnits.inner++;
							totalCityUnits--;
							if(totalCityUnits==0){return ringUnits}
						}

						while (totalCityUnits > 0) {
							while(ringUnits.inner < 9){
								if(citySprawl == 1){
									ringUnits.inner++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									ringUnits.middle++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									ringUnits.outer++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
								}
								if(citySprawl == 2){
									ringUnits.inner++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									if(ringUnits.inner==9){break}
									ringUnits.inner++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									ringUnits.middle++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
								}
								if(citySprawl == 3){
									ringUnits.inner++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									if(ringUnits.inner==9){break}
									ringUnits.inner++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									if(ringUnits.inner==9){break}
									ringUnits.inner++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
								}
							}
							while(ringUnits.middle < 16){

								if(citySprawl == 1){
									ringUnits.middle++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									if(ringUnits.middle==16){break}
									ringUnits.outer++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									ringUnits.outer++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
								}
								if(citySprawl == 2){
									ringUnits.middle++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									if(ringUnits.middle==16){break}
									ringUnits.middle++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									if(ringUnits.middle==16){break}
									ringUnits.outer++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
								}
								if(citySprawl == 3){
									ringUnits.middle++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									if(ringUnits.middle==16){break}
									ringUnits.middle++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
									if(ringUnits.middle==16){break}
									ringUnits.middle++;
									totalCityUnits--;
									if(totalCityUnits==0){return ringUnits}
								}
							}
							ringUnits.outer++;
							totalCityUnits--;
							} //while (totalCityUnits > 0)
							return ringUnits;
						} //get ringUnits

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
		fs.readFile('GeoJson/cities.geojson', "utf-8",function(err,data){
			var data = JSON.parse(data);
			var cities = data.features
			var cityNames = [];
			var count = 0;
			for (var i = cities.length - 1; i >= 0; i--) {
				if(cities[i].properties.population == undefined){continue}
				var lat = cities[i].geometry.coordinates[1];
				var lng = cities[i].geometry.coordinates[0];
				if(lat >= bounds._southWest.lat && lat <= bounds._northEast.lat){
					if(lng >= bounds._southWest.lng && lng <= bounds._northEast.lng){
						var city = {};
						
						var roundedLat = Math.round(((2*Math.round(cities[i].geometry.coordinates[0]*50)/100)+0.01)*100)/100;

						var roundedLng = Math.round(((25*Math.round(cities[i].geometry.coordinates[1]*40)/1000)+0.0125)*1000)/1000;
						city.geometry = {"type":"Point","coordinates":[roundedLng,roundedLat]}

						city.type = "Feature";
						city.id = cities[i].id;
						city.properties = {};
						city.properties.name = cities[i].properties.name;
						if (cities[i].properties["name:en"]){
							city.properties.name = cities[i].properties["name:en"]
						}
						city.properties.is_in = cities[i].properties.is_in;
						if (cities[i].properties["is_in:country"]){
							city.properties.is_in = cities[i].properties["is_in:country"]
						}
						if(cities[i].properties.ele){city.properties.ele = cities[i].properties.ele};
						var isIn = "";
						if(city.properties.is_in){isIn = city.properties.is_in;}
						if(isIn.includes("Czech")){
							city.properties.country = "Czech Republic";
							city.properties.region = "Central Europe";
							city.properties.wealth = 2;
						}
						else if(isIn.includes("Slovakia")){
							city.properties.country = "Slovakia";
							city.properties.region = "Central Europe";
							city.properties.wealth = 2;
						}
						else if(isIn.includes("Hungary")){
							city.properties.country = "Hungary";
							city.properties.region = "Central Europe";
							city.properties.wealth = 2;
						}
						else if(isIn.includes("Poland")){
							city.properties.country = "Poland";
							city.properties.region = "Central Europe";
							city.properties.wealth = 2;
						}
						else if(isIn.includes("Russia")){
							city.properties.country = "Russia";
							city.properties.region = "Eastern Europe";
							city.properties.wealth = 2;
						}
						else if(isIn.includes("Belarus")){
							city.properties.country = "Belarus";
							city.properties.region = "Eastern Europe";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Ukraine") || isIn.includes("Украина")){
							city.properties.country = "Ukraine";
							city.properties.region = "Eastern Europe";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Moldova")){
							city.properties.country = "Moldova";
							city.properties.region = "Eastern Europe";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("France")){
							city.properties.country = "France";
							city.properties.region = "France";
							city.properties.wealth = 4;
						}
						else if(isIn.includes("Germany") || isIn.includes("Deutschland")){
							city.properties.country = "Germany";
							city.properties.region = "Germany";
							city.properties.wealth = 4;
						}
						else if(isIn.includes("Spain")){
							city.properties.country = "Spain";
							city.properties.region = "Iberian Peninsula";
							city.properties.wealth = 3;
						}
						else if(isIn.includes("Portugal")){
							city.properties.country = "Portugal";
							city.properties.region = "Iberian Peninsula";
							city.properties.wealth = 3;
						}
						else if(isIn.includes("Italy")){
							city.properties.country = "Italy";
							city.properties.region = "Italy";
							city.properties.wealth = 4;
						}
						else if(isIn.includes("Malta")){
							city.properties.country = "Malta";
							city.properties.region = "Italy";
							city.properties.wealth = 3;
						}
						else if(isIn.includes("Luxem")){
							city.properties.country = "Luxembourg";
							city.properties.region = "Low Countries";
							city.properties.wealth = 5;
						}
						else if(isIn.includes("Nether")){
							city.properties.country = "The Netherlands";
							city.properties.region = "Low Countries";
							city.properties.wealth = 4;
						}
						else if(isIn.includes("Belgium")){
							city.properties.country = "Belgium";
							city.properties.region = "Low Countries";
							city.properties.wealth = 4;
						}
						else if(isIn.includes("Algeria")){
							city.properties.country = "Algeria";
							city.properties.region = "North Africa";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Tunisia")){
							city.properties.country = "Tunisia";
							city.properties.region = "North Africa";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Morocco")){
							city.properties.country = "Morocco";
							city.properties.region = "North Africa";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Switzerland")){
							city.properties.country = "Switzerland";
							city.properties.region = "The Alps";
							city.properties.wealth = 5;
						}
						else if(isIn.includes("Austria") || isIn.includes("Österreich")){
							city.properties.country = "Austria";
							city.properties.region = "The Alps";
							city.properties.wealth = 4;
						}
						else if(isIn.includes("Greece")){
							city.properties.country = "Greece";
							city.properties.region = "The Balkans";
							city.properties.wealth = 3;
						}
						else if(isIn.includes("Slovenia")){
							city.properties.country = "Slovenia";
							city.properties.region = "The Balkans";
							city.properties.wealth = 3;
						}
						else if(isIn.includes("Croatia")){
							city.properties.country = "Croatia";
							city.properties.region = "The Balkans";
							city.properties.wealth = 2;
						}
						else if(isIn.includes("Romania") || isIn.includes("România")){
							city.properties.country = "Romania";
							city.properties.region = "The Balkans";
							city.properties.wealth = 2;
						}
						else if(isIn.includes("Kosovo") || isIn.includes("Kosovës") || isIn.includes("Kosova")){
							city.properties.country = "Kosovo";
							city.properties.region = "The Balkans";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Bulgaria") || isIn.includes("България")){
							city.properties.country = "Bulgaria";
							city.properties.region = "The Balkans";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Serbia")){
							city.properties.country = "Serbia";
							city.properties.region = "The Balkans";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Macedonia")){
							city.properties.country = "Macedonia";
							city.properties.region = "The Balkans";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Montenegro")){
							city.properties.country = "Montenegro";
							city.properties.region = "The Balkans";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Bosnia")){
							city.properties.country = "Bosnia";
							city.properties.region = "The Balkans";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Albania")){
							city.properties.country = "Albania";
							city.properties.region = "The Balkans";
							city.properties.wealth = 1;
						}
						else if(isIn.includes("Cyprus")){
							city.properties.country = "Cyprus";
							city.properties.region = "Turkey";
							city.properties.wealth = 3;
						}
						else if(isIn.includes("Turkey")){
							city.properties.country = "Turkey";
							city.properties.region = "Turkey";
							city.properties.wealth = 2;
						}
						else if(isIn.includes("Ireland")){
							city.properties.country = "Ireland";
							city.properties.region = "United Kingdom";
							city.properties.wealth = 5;
						}
						else if(isIn.includes("United Kingdom") || isIn.includes("UK")){
							city.properties.country = "United Kingdom";
							city.properties.region = "United Kingdom";
							city.properties.wealth = 4;
						}
						else {
							city.properties.wealth = getRandom(1,5)
							// console.log(count+" "+city.properties.name+" has wealth "+city.properties.wealth);
							// count++;
						}

						// city.properties.population = cities[i].properties.population;
						var currentPop = cities[i].properties.population;
						var targetGamePop = getTargetGamePop(currentPop);
						city.properties.population = targetGamePop;

						var neighborhoodDensity = getRandom(1,3);

						city.properties.neighborhoodDensity = neighborhoodDensity;
						city.properties.city3s = Math.floor(targetGamePop/(neighborhoodDensity * 100000))
						city.properties.city4s = Math.floor((targetGamePop-city.properties.city3s*100000)/(neighborhoodDensity * 50000))
						city.properties.city5s = Math.floor((targetGamePop-city.properties.city3s*100000-city.properties.city4s*50000)/25000)
						city.properties.citySprawl = getRandom(1,3);
						city.properties.ringUnits = getRingUnits(city);
					cityNames.push(city);
						}
					}
				if(i==0){
					var europeCities = {"type":"FeatureCollection"};europeCities.features = cityNames;
					// var europeCities = JSON.stringify(europeCities);
					fs.writeFile('europeCities.json',JSON.stringify(europeCities),function(err,data){
					console.log("success writing file.")
					return res.ok(europeCities)
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
			cities = cities.features;
			// return res.ok(cities);
			var gameCities = [];
		// Take all of the European cities
		//For each:
			var city3s = [];
			var city4s = [];
			var city5s = [];
		for (var k = cities.length - 1; k >= 0; k--) {
		// for (var k = 2 - 1; k >= 0; k--) {
			var city = {};
			city.name = cities[k].properties.name;
			// Round the latLng to the center of a square.
			var roundedLat = (2*Math.round(cities[k].geometry.coordinates[0]*50)/100)+0.01;
			var roundedLng = (25*Math.round(cities[k].geometry.coordinates[1]*40)/1000)+0.0125;
		// };
			city.latLng = [roundedLng, roundedLat]
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
					pointLine[j]={gridCoords:[i,j],latLng:[currentLng, currentLat]}
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
					function chooseCity(location){
						var whichType = getRandom(1, cities[k].properties.city3s+cities[k].properties.city4s+cities[k].properties.city5s);
                		if(whichType <= cities[k].properties.city3s){
                    		//add the city to the city3s object, which will be added to the geoJSON file at the end
                    		city3s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].properties.name+i+j})
                    		//add the city to the city object
                    		city.cityParts.push({type:"city3",location:location,latLng:pointGrid[i][j].latLng,neighborhoodPop:100000});
                    		population+=100000
                    	}
                    	else if(whichType > cities[k].properties.city3s && whichType <= (cities[k].properties.city3s+cities[k].properties.city4s)){
                    		//add the city to the city4s object, which will be added to the geoJSON file at the end
                    		city4s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].properties.name+i+j})
                    		//add the city to the city object
                    		city.cityParts.push({type:"city4",location:location,latLng:pointGrid[i][j].latLng,neighborhoodPop:50000});
                    		population += 50000
                    	}
                    	else if(whichType > (cities[k].properties.city3s+cities[k].properties.city4s) && whichType <= (cities[k].properties.city3s+cities[k].properties.city4s+cities[k].properties.city5s)){
                    		//add the cityto the city5s object, which will be added to the geoJSON file at the end
                    		city5s.push({"geometry":{"type":"Point","coordinates":pointGrid[i][j].latLng},"type":"Feature","id":cities[k].properties.name+i+j})
                    		//add the city to the city object
                    		city.cityParts.push({type:"city5",location:location,latLng:pointGrid[i][j].latLng,neighborhoodPop:25000});
                    		population += 25000
                    	}
					}
                var within1 = (4 >= i && i >= 2 && 4 >= j && j >= 2);
                var within2 = (5 >= i && i >= 1 && 5 >= j && j >= 1);
                if (within1){
                	var yesNo = getRandom(1,9); 
                	if(yesNo <= cities[k].properties.ringUnits.inner){
                		chooseCity("inner");
                	}
                } else if (within2){
                	//Of the 15 spaces within2 spaces, 2 should be city3's, 1 should be city4's and 3 should be a city4
                    var yesNo = getRandom(1,15);
                    if(yesNo <= cities[k].properties.ringUnits.middle){
                    	chooseCity("middle");
                    }
                } else {
                	//Of the 24 spaces within3 spaces, 2 should be city3's, 3 should be city4's and 3 should be a city4
                    var yesNo = getRandom(1,24);
                    if(yesNo <= cities[k].properties.ringUnits.outer){
                    	chooseCity("outer");
                    }
                }
                }//close j of point grid
				}//close i of point grid
				city.cityPop = population;
				gameCities.push(city);
				gameCities.sort(function(b,a) {
    				return parseFloat(a.cityPop) - parseFloat(b.cityPop);
				});
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
				return res.ok(gameCities)})
		})//close readFile
	},//close makeCities
	listCities: function(req,res){
		console.log("Listing Cities")
		fs.readFile('gameCities.json', "utf-8",function(err,data){
					var Balkans = [];
			// console.log(data);
			var cities = JSON.parse(data);
			// cities = cities.features;
			var population=1;
			var biggest = {};
			biggest.name = "cameron";
			biggest.size = 50;
			var smallest = {};
			smallest.name = "escher";
			smallest.size = 555555555;
			for (var i = cities.length - 1; i >= 0; i--) {
				// console.log(cities[i].name)
				if(cities[i].cityPop*1>biggest.size){
					biggest.name = cities[i].name;
					biggest.size = cities[i].cityPop*1;
				}
				if(cities[i].cityPop*1<smallest.size){
					smallest.name = cities[i].name;
					smallest.size = cities[i].cityPop*1
				}
				population = population + cities[i].cityPop*1;
				// console.log(cities[i].properties.population+" "+population);
				// console.log(population)
				if(i==0){
					var average= population/cities.length;
					return res.ok({"Average":average,"Total":population,"City Count":cities.length,biggest,smallest})
				}

				}
		})
	}
};//close module.exports

