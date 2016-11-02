# trainGame

a [Sails](http://sailsjs.org) application

### Requirements

[npm](https://docs.npmjs.com/getting-started/installing-node) which requires [nodejs](https://nodejs.org/en/)

clone repository,

`git clone https://github.com/camikazegreen/trainGame.git`

change into the new directory

`cd trainGame`

and run.
`
`npm i && sails lift`


**Seeding the map**

Here are Railroad Tycoon&#39;s 4 zoom levels and the corresponding zoom levels on MapBox:

F1: Regional, Zoom:4

F2: Area, Zoom:6

F3: Local, Zoom:7

F4: Detail, Zoom:9

Six squares cover the north to south distance between Amsterdam and Utrecht, 36km: 6k/sq

Nine squares from Antwerp to Brussels, 45km: 5k/sq

If we do 3k/square, and give each terminal a range of 1,2, or 3 squares, the largest terminals could access 7 squares wide x 7 squares high. 21km x 21km. Midpoint to outer edge would be about 10km

If landcover\_wood or national\_park

Power plants pay twice as much for coal, but produce nothing.

If both a power plant and a steel mill are in the same city, they will pay 1.5x rate, but only half will produce steel.

Grapes are very spread out.

Coal is more common at higher elevations, and often comes in two or three at once.

First, create a base map that has all of the land covers, and terrain info broken down in to 3k x 3k squares.

Use that to style the map, and place all of the cities at the center of whichever tile they fall in.

5 different city squares scaled so that the biggest city attainable would have 15 Million people with all 21 squares filled with people. 25.000, 50.000, 100.000, 500.000, 700.000. The biggest cities at the start of the game have a chance to have around 1,000,000 people. Using 21 squares and only the first three tiles.





**City growth**

All unconnected cities will have a growth rate from -1% to 3% that will increase or decrease each year with pressure applied to move up or down along a bell curve. For example, there are 5 different growth rates, and I would want 1% growth to be the most common situation. 1 2 3 2 1. So, if your city&#39;s current growth rate is -1%, at the end of the year when it is time to update your growth percentage, there is a 10% chance of staying the same, and a 90% chance of increasing (bumping your growth rate up to 0%. If it is currently at 0%, there will be a 10% chance of going down to -1%, a 20% chance of staying the same, and a 70% chance of increasing to 1%. If you&#39;re already at 1%, there is a 33% chance of either going lower, staying the same, or going higher. (on second thought, apply this instead to the cities&#39; wealth score instead, and then use that to calculate the population growth. That way when you run a city report before hooking up to a city, you will be able to see all of these things and it will add some variability in the cities you connect to. Unconnected cities would only have the options of Poor, Normal, or Upper Class)

Once a city is connected, your railroad will have much more impact on city growth, and it can swing from -3% to 6%. If you upset an industry, per capita revenue goes way down, which makes it less wealthy, and the wealth of the city determines it&#39;s population growth.

Normal distribution: 1 2 3 4 5 5 4 3 2 1

Poverty                : 5 5 4 4 3 3 2 2 1 1

Poor                : 3 4 5 5 4 3 2 2 1 1

Normal                : 1 2 3 4 5 5 4 3 2 1

Upper Class        : 1 1 2 2 3 4 5 5 4 3

Wealthy                : 1 1 2 2 3 3 4 4 5 5



**Profiting from industry  **

**       ** In this game, you take ownership of the goods that you transport and it is very valuable to have more highly developed economies. The prices are dynamic, but the general rule of thumb is that there is a 100% markup at every stage.

To use an example from Railroad Tycoon:

- --Coal -&gt; Steel Mill = Steel
- --Steel -&gt; Factory = Manufactured Goods
- --Manufactured Goods -&gt; City = Profit

In this case, you will:

- --Buy the coal for $10/ton, and sell it for $20/ton.
- --Buy the steel for $40/ton, and sell if for $80/ton.
- --Buy the goods for $160/ton, and sell it for $320/ton

You can see that from stringing these together, you are essentially getting $210/ton, but it costs a lot to join the market.

The prices that goods will be bought and sold at will be based on the following:

- --Supply - How many stations are supplying coal?
- --Demand - How many other steel mills are also trying to purchase that coal?
- --Distance - If the only access to coal is far away, it will pay more.
- --Wealth of the city
- --General economic conditions - Boom/Bust cycle

The combination of these factors will determine where along a certain spectrum the price is. Example: the selling price for coal can range from $15 (50% Markup) to $25 (150% Markup). That is a 100% swing, and each of the above factors accounts for 20% of it.





**Station Policy**

Type of station: Depot, Station, Terminal (This is only for purposes of train scheduling. Local trains stop at all three, Through trains stop at Stations and Terminals, Express trains only stop at Terminals. However, they are each different sizes, depots are the smallest, terminals are the largest)

Reach of station: The radius that the train can draw resources from. Three sizes:1,2,3

Number of sidings: The number of trains that can be in the station at one time. Three sizes:2,4,6

Each of these things contributes to the size of the station. The size multiplied by the cost of the real estate determines the price.

You can set whether or not you are going to pay for resources at the station, and if so, how much you are willing to pay. If you buy resources they will be accumulate at your station at a steady rate, and decay at a much slower steady rate. If you upgrade your station to handle storage, it will decay much more slowly.

You can add hotels, post offices,and restaurants. All of which add expenses which are constant, and income which is variable. They all add to the attractiveness of a city.

There will be a report that will show all of the routes of all of the trains coming through your city, divided by freight class, and sorted by next train likely to arrive. The mail and passengers will be set to East or West, and the proportion of East or West passengers will be determined by the total attractiveness score of all of the stations on each side of the station. Whenever a passenger or mail train pulls in to the station, it will pick up all of the passengers or mail that it can carry that is going in the same direction. At that time, the passengers will be split up in to destinations based on what that train has available like this:

- --First a distance score is calculated for each stop, which is distributed along a bell curve.
- --Then an attractiveness score is calculated for each stop
- --The combination of those two scores determine what percentage of passengers are going to each stop.
- --Each car holds 100 people, so it is easy to calculate how many people and add them to the train as a block with a timestamp e.g. 15 people from Tucson to Phoenix at 11:15am.
- --When the train arrives in Phoenix, those 15 people get off, and the fare is calculated.
- --The rate increases every 50 miles, and applies to the whole fare, so if it goes from $5 to $6 to $7, it would cost $5 to go 50 miles, and $12 to go 100 miles, and $21 to go 150 miles, etc. (This is calculated as the crow flies, not along miles of track. People will have an expectation that they can get to a nearby city quickly, if you have them take a big loop to get there, they won't pay more for it.)
- --The fare = rate x speed(where rate and speed both change with the times. Early on 20 miles/hour = 1 rate, but eventually 100 miles/hour = 1 rate. This will be determined by your fastest competitor and how they change your customers expectations. If you have the fastest railroad, you can get a bonus, if you are slower, you get lower fares.)

On your station report, it will list the fare to all available locations from that station. This way you can see the value of adding Limited or Express lines.



**Train Policy**

Railroad Tycoon handles this really well already, so it would be very similar, but would have a little bit more information available on screen, because of higher resolution screens.

The route map would be displayed on the same page, with some basic information about the stations along it&#39;s route. When you switch from Local to Through to Express to Limited, your route map will adjust accordingly.

It will also show which stations can perform maintenance, and how long you will be stopped at each station. If you are changing your Consist at a station, that time will update accordingly. If you hover over the time, it will break down the time. 4 cars off, 4 cars on, no switching yard, loading empty cars, etc.

What is currently waiting and what they will pay for it also listed.

Expected average speed empty/full will be listed between stops as well. If you hover over this, it will explain the calculation. Engine power, average grade, twisty track.

If no scheduled stops can perform maintenance, there will be a notification.

Train age, average maintenance costs, etc. will all be listed as well.



**City Policy**

You can&#39;t change this directly, but you can see it for any city whether or not you have a station there. You can also influence it with lobbying when there are city elections. Every few years, the cities will have elections at the same time so that it doesn&#39;t interfere with the game that much.

The basic policies are the difference between population growth, and industrialization. They both lead to growth, but in different ways.

Cities will constantly be generating revenue, and growing. What percentage of that money is going towards population growth, and what percentage is going to industrialization is the main difference.

Each election will have three candidates: status quo, more population, more industrialization. Each of their poll numbers will be shown, and you can influence the election by contributing to their campaigns. Most of the time the cities will oscillate naturally back and forth, and you can usually sway the elections in your favor pretty easily with lobbying.

Eventually there will be candidates that support or oppose some policies that can have serious impacts on your business, namely highways and airports.

 Each of these changes are more or less inevitable, but you can hold them off with lobbying.

Highways will reduce your overall loads, and reduce the demand for local travel. When neighboring cities have pro-highway officials, they will get connected.

Airports will reduce your overall loads, and reduce the demand for longer trips where both cities have an airport.



**City Growth**

The per capita revenue will determine the city wealth as well as population growth.

Most hexes will have at least some people. From farms and mines which will only have a few, up through cities, which have potentially huge amounts. The per capita revenue for a city will determine the growth rate, as a percentage. This way, small mining outposts could potentially grow in to large cities if they start out early enough and operate consistently.

The per capita revenue also determines how much they are willing to spend on goods. Wealthier cities will pay higher prices for goods, which will also slow down their growth rate. So, if you route your goods to the cities that will pay the most for them, you will make more short term profits, but you could be hurting yourself long term.

Cities will have 5 levels of wealth, and they can change every five years. If they have had consistent per capita profit, they will go up one step. If they spend a lot of money on goods, their wealth level will stay the same, or go down. So typically, the cities that sell the goods will become wealthy cities, and the cities that buy the goods will become poorer cities, but the growth of the city is based on revenues.

It&#39;s a lagging indicator, so at the end of each year, these numbers will be calculated, and that will affect the city (growth and purchasing price) for the next year. You can only see these numbers every ten years when the census comes out as an average looking backwards.

The revenue is calculated as all money that you pay to the city directly to purchase resources + ½ of the mail and passenger revenue that you receive + money that would have gone to you in an industry step that you weren&#39;t a part of (example, they have coal and a steel mill in the same town.)

Wealthy cities are also more expensive to build in, because the real estate is more expensive.

Cities that buy in to your stock when you connect to them will also increase their revenues based on your stock price.



**Stock Market**

It should be a little bit more obvious that you use your stock to raise money without interest. You do this by issuing more shares, so it is kind of the opposite from the way that Railroad Tycoon does it.

I think that it would be cool to model it more on the Venture Capital finance model. The first round is an Angel Round, and you start with 50% ownership. Then Series A, Series B, etc. up to an IPO if you are successful enough. Your terms are more or less favorable based on your valuation, and how much you are asking for.

Each round also causes dilution, payouts to previous investors, etc.

Your competitors can see your financials when you are looking for financing, and can choose to be investors along with Computer VC firms. Your investors will push you towards an IPO, because they want a payout.

After you IPO, they can always see them, and can buy or sell any public shares. After IPO, you can raise money by creating more shares. This is where having a high stock price really helps, your market cap will stay the same, and your stock price will drop.

You can manage your stock price by choosing whether or not to pay dividends. If you are not growing, your stock will fall unless you pay dividends.

I need to figure out how to make this game so that it doesn&#39;t scale without taking investment. It should be fairly easy. Rail networks aren&#39;t cheap, and shouldn&#39;t recoup the cost of their construction for a long time. Plus, the profits of each station will increase with the value of the whole network. I should tune the cost of everything so that on a pretty basic network, it will take about ten years to recoup the cost of any construction.



**Customer Confidence**

Customer confidence is one of the factors that determines how many passengers will come from a station and several things contribute to it.

- --Do you have any night trains? Night trains are unprofitable routes, but they increase customer confidence.
- --How many of which types of bridges. Wooden Trestles = low confidence, Etc.
- --Any train crashes, completely wreck confidence across the whole network. Even trains on other networks can have an impact, but not as big as if it is on your network.
- --Any time spent stuck behind slower trains reduces confidence.

By the way, any tracks built will have two way tracks. You can double track if you want

**Passenger Algorithm**

The maximum amount of passengers/year will equal 100% of the population of the city within the reach of the station. By default, 20% of that will always come to the station. The other 80% must be earned through the value of the network.

This comes in five parts:
-- Local Network (20%) - Percentage and number of nearby towns (within 50 miles) connected (Being connected to 10 or more = 100%. If there is only one town within 50 miles, you can earn a maximum score of 55%)

Example: Amsterdam Station. There are six towns within 50 Miles, so your maximum Local Network Score is 80%. However, if of those six towns, only Utrecht seems worthwhile to connect to, you would only have a Local Network Score of 13.33%

-- Mid-range Network (20%) - Percentage and number of mid-range cities connected (Mid-range is defined as within a ten hour trip, so this distance will increase as faster transit emerges. Cities are defined as having labels of place-city-md-s or larger. Similar to the local network score, except it ranges from 1-5 instead of 1-10.)

Example: Amsterdam Station. Early in the game, only the Hague is within range of Amsterdam. If it is connected, you will get 100% of your max with one city: 50%. As the game progresses, Brussels comes within the range. If you connect to it, you will have 100% of two cities: 62.5%, if you don't connect, your score will go to 50% of two cities: 31.25%. Eventually Frankfurt, Paris and London all come in to play and give you the opportunity to get a 100% score here, but if you don't connect, your score will continue to go down. Also, keep in mind that as you connect to each of these cities, they will be on the fringe of the network, and will likely only be connected to a small number of the cities that they could be connected to, and will get small scores for their network.

-- How far you can travel (20%) - (This expectation changes based on both your railroad and your competitors. The longest line in existence equals 100% here.)

-- Attractiveness of the cities/stations connected (20%)

-- Customer confidence (Ranges from 0 to 1, and is a multiplier on the whole thing.)





