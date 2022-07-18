var map = L.map('map').setView([0,1], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var paperMarkers = new L.FeatureGroup();

dataCount = dc.dataCount('#data-count');
dataTable = dc.dataTable('#data-table');

var CountryChart= new dc.PieChart('#Country');
var ResTypeChart = new dc.PieChart("#WaterType");
var yearChart = new dc.BarChart("#Year");



d3.csv("review.csv").then(function(data) {

  var ndx =crossfilter(data);
  var all= ndx.groupAll();
  var yearDim= ndx.dimension(function(d){ return d["Year"]});
  var CountryDim= ndx.dimension(function(d){ return d["Country"]});
  var JournalDim= ndx.dimension(function(d){ return d["Journal"]});
  var ResTypeDim= ndx.dimension(function(d){ return d["Focus of Work"]});
  var allDim = ndx.dimension(function(d){ return d});

  var CountryGroup = CountryDim.group().reduceCount();
  //var WaterTypeGroup = WaterTypeDim.group().reduceCount();
  var yearGroup= yearDim.group().reduceCount();
  
  CountryChart
    .width(220)
    .height(200)
    .slicesCap(20)
    .innerRadius(20)
    .dimension(CountryDim)
    .group(CountryGroup)
    .transitionDuration(500);

   
  
  ResTypeChart
    .width(220)
    .height(200)
    .ordinalColors(['#0096FF', '#40E0D0', '#228B22'])
    .slicesCap(4)
    .innerRadius(10)
    .dimension(WaterTypeDim)
    .group(WaterTypeGroup);

  yearChart
    .width(550)
    .height(350)
    .dimension(yearDim)
    .group(yearGroup)
    .x(d3.scaleBand()) //d3.scale.ordinal().domain(genusDim) //d3.scaleBand() for d3 v4
    .xUnits(dc.units.ordinal)
    .elasticX(true)
    .elasticY(true)
    .brushOn(false)
    .centerBar(true)
      // .xAxisLabel('Injury Cause')
    .yAxisLabel('Count');

  dataCount
    .crossfilter(ndx)
    .groupAll(all);
  
  dataTable
    .dimension(allDim)
    .size(100)
    .columns([
      function(d){
        return d["Title"];
      },
      function(d){
        return d["Journal / Conference Publication"];
      },
      function(d){
        return d["Year of Publication"];
      },
      function(d){
        return d["Authors"];
      },
      function(d){
        return d["Country"];
      },
      function(d){
        return d["Focus of Work"];
      },
    ])
    .sortBy(dc.pluck('year'))
    .order(d3.descending)
    .on('renderlet', function(table){
      table.select('tr.dc-table-group').remove();

      paperMarkers.clearLayers();
      _.each(allDim.top(Infinity), function(d)
        {
          var longitude = d["lon"];
          var latitude = d["lat"];

          var fillColor_Var = "";
         // var paperFocus = d["WaterType"];

         /* if (paperFocus == "S") {
              fillColor_Var = "#228B22";
          } else if (paperFocus == "G") {
              fillColor_Var = "#0096FF";
          } else if (paperFocus == "SE") {
              fillColor_Var = "#40E0D0";
          } else {
              fillColor_Var = "#B9C0C3";
          }
*/
          var marker = L.circleMarker([latitude, longitude], {
            radius: 7,
            fillColor: fillColor_Var,
            color: "gray",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
        paperMarkers.addLayer(marker);
      });
      map.addLayer(paperMarkers);
      map.fitBounds(paperMarkers.getBounds());
    });


    d3.selectAll('a#all').on('click', function() {
        dc.filterAll();
        dc.renderAll();
  
    });

   /* d3.selectAll('a#Year').on('click', function() {
        yearChart.filterAll();
        dc.redrawAll();
        d3.event.stopPropagation();
    });

    d3.selectAll('a#Country').on('click', function() {
        CountryChart.filterAll();
        dc.redrawAll();
        d3.event.stopPropagation();
    });

    d3.selectAll('a#WaterType').on('click', function() {
        WaterTypeChart.filterAll();
        dc.redrawAll();
        d3.event.stopPropagation();
    });

*/ 

  dc.renderAll();

});