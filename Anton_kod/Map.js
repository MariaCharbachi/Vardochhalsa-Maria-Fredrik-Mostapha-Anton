 // Themes begin
 am4core.useTheme(am4themes_animated);
 // Themes end
 
 window.onload = function() {
 
 geo = {"country_code":"SE","country_name":"Sweden"};
   var defaultMap = "swedenLow";
   var countryMaps = {
     "US": [ "usaAlbersLow" ],
     "SE": [ "swedenLow" ]
   };
   
   // calculate which map to be used
   var currentMap = defaultMap;
   var title = "";
   if ( countryMaps[ geo.country_code ] !== undefined ) {
     currentMap = countryMaps[ geo.country_code ][ 0 ];
 
     // add country title
     if ( geo.country_name ) {
       title = geo.country_name;
     }
 
   }
   
   // Create map instance
   var chart = am4core.create("chartdiv", am4maps.MapChart);
   
   chart.titles.create().text = title;

   // Set map definition
   chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";
   chart.geodataSource.events.on("parseended", function(ev) {
     
     var data = [];
     //Hämtar värden för vilken område som skall visas
     var input = document.getElementById("name").value;

     //Går igenom alla landskap och hämtar datan för rätt position
     for(var i = 0; i < ev.target.data.features.length; i++) {
       data_replace = ev.target.data.features[i].properties.name;

       data_replace = data_replace.replace(/ä/gi,'a');
       data_replace = data_replace.replace(/å/gi,'a');
       data_replace = data_replace.replace(/ö/gi,'o');

       //Hämtar värde för standard kartan. Endast ett värde kan visas per landskap
       data_map = alasql("SELECT value_amount from healthcare where geo_cat = '" + data_replace + "' and nr_rapp = 1 and sex = 'Totalt' and year = 2017");
       
       data.push({
         id: ev.target.data.features[i].id,
         value: data_map[0]["value_amount"]
       })
     }
     //polygonSeries innehåller punktpositioner för varje landskap kopplat till ett id för de område som sedan används för att rita kartan med de insatta datat.
     polygonSeries.data = data;
   })

   
   // Set projection
   chart.projection = new am4maps.projections.Mercator();
 
   // Create map polygon series
   var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
 
   //Set min/max fill color for each area
   polygonSeries.heatRules.push({
     property: "fill",
     target: polygonSeries.mapPolygons.template,
     min: chart.colors.getIndex(1).brighten(1),
     max: chart.colors.getIndex(1).brighten(-0.3)
   });
 
   // Make map load polygon data (state shapes and names) from GeoJSON
   polygonSeries.useGeodata = true;
 
   // Set up heat legend
   let heatLegend = chart.createChild(am4maps.HeatLegend);
   heatLegend.series = polygonSeries;
   heatLegend.align = "right";
   heatLegend.width = am4core.percent(25);
   heatLegend.marginRight = am4core.percent(4);
   heatLegend.minValue = 0;
   heatLegend.maxValue = 40000000;
   heatLegend.valign = "bottom";
 
   // Set up custom heat map legend labels using axis ranges
   var minRange = heatLegend.valueAxis.axisRanges.create();
   minRange.value = heatLegend.minValue;
   minRange.label.text = "Little";
   var maxRange = heatLegend.valueAxis.axisRanges.create();
   maxRange.value = heatLegend.maxValue;
   maxRange.label.text = "A lot!";
 
   // Blank out internal heat legend value axis labels
   heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
     return "";
   });
 
   // Configure series tooltip
   var polygonTemplate = polygonSeries.mapPolygons.template;
   polygonTemplate.tooltipText = "{name}: {value}";
   polygonTemplate.nonScalingStroke = true;
   polygonTemplate.strokeWidth = 0.5;
 
   // Create hover state and set alternative fill color
   var hs = polygonTemplate.states.create("hover");
   hs.properties.fill = chart.colors.getIndex(0).brighten(-0.8);


   //Skapar en funkton som trigger vid click på kartan
   var polygonTemplate = polygonSeries.mapPolygons.template;
   polygonTemplate.events.on("hit", function(ev) {
     // zoom to an object
     ev.target.series.chart.zoomToMapObject(ev.target);
     ev.target.series.chart.colors.getIndex(10).brighten(0);

     //Ändra värdet på vilket område som visas baserat på vilken landskap som har klickats
     document.getElementById("name").value = ev.target.dataItem.dataContext.name;
     
     //Kör funktion som ändra bargraphen till det ny området
     displayData();

     data = [];
     //Hämtar värden för vilken rapport som skall visas
     var input_rapp =  document.getElementById("mySelect").value;

     //Kartan kan ej visa upp flera värden för samma område, så därav ändra "alla rapporter" till standardvärde "rapport nr 1"
     if (input_rapp == 0) {
          input_rapp = 1
     }
     
     //Går igenom alla landskap och hämtar datan för rätt position
     for(var i = 0; i < sweden.features.length; i++) {
          data_replace = sweden.features[i].properties.name;

          data_replace = data_replace.replace(/ä/gi,'a');
          data_replace = data_replace.replace(/å/gi,'a');
          data_replace = data_replace.replace(/ö/gi,'o');

          //Query:ar data baserat på använders parametrar
          data_map = alasql("SELECT value_amount from healthcare where geo_cat = '" + data_replace + "' and nr_rapp = " + input_rapp + " and sex = '" + document.getElementById("mySex").value + "' and year >= " + document.getElementById("year_min").value + " and year <= " + document.getElementById("year_max").value);

          data.push({
          id: sweden.features[i].id,
          value: data_map[0]["value_amount"]
          })
     }
      
     //Ersätter det gamla data med den nya query:ade
     ev.target.series.data = data;
    });
 };



 