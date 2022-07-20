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
var firstInterestChart = dc.rowChart('#first-interest-row-chart');
var secondInterestChart = dc.rowChart('#second-interest-row-chart');
var thirdInterestChart = dc.rowChart('#third-interest-row-chart');
var fourthInterestChart = dc.rowChart('#fourth-interest-row-chart');
var fifthInterestChart = dc.rowChart('#fifth-interest-row-chart');




d3.csv("review.csv").then(function(data) {

  var ndx =crossfilter(data);
  var all= ndx.groupAll();
  var yearDim= ndx.dimension(function(d){ return d["Year"]});
  var CountryDim= ndx.dimension(function(d){ return d["Country"]});
  var JournalDim= ndx.dimension(function(d){ return d["Journal"]});
  var ResTypeDim= ndx.dimension(function(d){ return d["Wtype"]});
  var allDim = ndx.dimension(function(d){ return d});
  var firstInterestDim = ndx.dimension(function(d) {
    return d["Keyword 1"];
  });

  var secondInterestDim = ndx.dimension(function(d) {
      return d["Keyword 2"];
  });

  var thirdInterestDim = ndx.dimension(function(d) {
      return d["Keyword 3"];
  });

  var fourthInterestDim = ndx.dimension(function(d) {
      return d["Keyword 4"];
  });

  var fifthInterestDim = ndx.dimension(function(d) {
      return d["Keyword 5"];
  });




  var CountryGroup = CountryDim.group().reduceCount();
  var ResTypeGroup = ResTypeDim.group().reduceCount();
  var yearGroup= yearDim.group().reduceCount();
  var firstInterestGroup = firstInterestDim.group().reduceCount();
  var secondInterestGroup = secondInterestDim.group().reduceCount();
  var thirdInterestGroup = thirdInterestDim.group().reduceCount();
  var fourthInterestGroup = fourthInterestDim.group().reduceCount();
  var fifthInterestGroup = fifthInterestDim.group().reduceCount();
  
  
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
    .ordinalColors(['#0096FF', '#40E0D0', '#228B22','orange'])
    .slicesCap(4)
    .innerRadius(10)
    .dimension(ResTypeDim)
    .group(ResTypeGroup);

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

  firstInterestChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
    .width(300)
    .height(550)
    .margins({
        top: 20,
        left: 10,
        right: 10,
        bottom: 20
    })
    .dimension(firstInterestDim)
    .group(firstInterestGroup)
    .elasticX(true)
    .colors("#1ca3ec")
    .ordering(function(d) {
        return -d.value;
    })
    .xAxis().ticks(8)

  secondInterestChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
      .width(300)
      .height(550)
      .margins({
          top: 20,
          left: 10,
          right: 10,
          bottom: 20
      })
      // .colors(d3.scale.category20())
      .group(secondInterestGroup)
      .dimension(secondInterestDim)
      // .x(d3.scaleLinear().domain([6,20]))
      .elasticX(true)
      .colors("#1ca3ec")
      // check how to let d3 tick marks on integers only: https://jsfiddle.net/PBrockmann/k7qnw3oj/
      .ordering(function(d) {
          return -d.value;
      })
      .xAxis().ticks(8)


  thirdInterestChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
      .width(300)
      .height(550)
      .margins({
          top: 20,
          left: 10,
          right: 10,
          bottom: 20
      })
      .colors("#1ca3ec")
      .group(thirdInterestGroup)
      .dimension(thirdInterestDim)
      //ascending order 
      .ordering(function(d) {
          return -d.value;
      })
      .xAxis().ticks(8)

  fourthInterestChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
      .width(300)
      .height(550)
      .margins({
          top: 20,
          left: 10,
          right: 10,
          bottom: 20
      })
      .colors("#1ca3ec")
      .group(fourthInterestGroup)
      .dimension(fourthInterestDim)
      .ordering(function(d) {
          return -d.value;
      })
      .xAxis().ticks(7)

  fifthInterestChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
      .width(300)
      .height(550)
      .margins({
          top: 20,
          left: 10,
          right: 10,
          bottom: 20
      })
      .colors("#1ca3ec")
      .group(fifthInterestGroup)
      .dimension(fifthInterestDim)
      .ordering(function(d) {
          return -d.value;
      })
      .xAxis().ticks(20)




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
         var paperFocus = d["Wtype"];
         '#0096FF', '#40E0D0', '#228B22','orange'
          if (paperFocus == "WRM") {
              fillColor_Var = '#40E0D0';
          } else if (paperFocus == "WQM") {
              fillColor_Var = "#0096FF";
          } 
         else if (paperFocus == "MLQM") {
          fillColor_Var = "#FFA500";
      }
        else {
              fillColor_Var = '#228B22';
          }

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

    d3.selectAll('a#year').on('click', function() {
      yearChart.filterAll();
      dc.redrawAll();
  });

  d3.selectAll('a#cntry').on('click', function() {
      CountryChart.filterAll();
      dc.redrawAll();
  });

  d3.selectAll('a#wtype').on('click', function() {
      WaterTypeChart.filterAll();
      dc.redrawAll();
  });

  d3.selectAll('a#first-interest').on('click', function() {
    firstInterestChart.filterAll();
    dc.redrawAll();
});
  d3.selectAll('a#second-interest').on('click', function() {
      secondInterestChart.filterAll();
      dc.redrawAll();
  });
  d3.selectAll('a#third-interest').on('click', function() {
      thirdInterestChart.filterAll();
      dc.redrawAll();
  });
  d3.selectAll('a#fourth-interest').on('click', function() {
      fourthInterestChart.filterAll();
      dc.redrawAll();
  });
  d3.selectAll('a#fifth-interest').on('click', function() {
      fifthInterestChart.filterAll();
      dc.redrawAll();
  });

  dc.renderAll();

});