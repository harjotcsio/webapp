/*const state = {
    data: [],
    passengerClass: "",
    selectedWater: null,
    selectedCountry: null
  };
  
  function createHistogram(svgSelector) {
    const margin = {
      top: 40,
      bottom: 10,
      left: 120,
      right: 20
    };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // Creates sources <svg> element
    const svg = d3
      .select(svgSelector)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  
    // Group used to enforce margin
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Scales setup
    const xscale = d3.scaleLinear().range([0, width]);
    const yscale = d3.scaleLinear().range([0, height]);
  
    // Axis setup
    const xaxis = d3.axisTop().scale(xscale);
    const g_xaxis = g.append("g").attr("class", "x axis");
    const yaxis = d3.axisLeft().scale(yscale);
    const g_yaxis = g.append("g").attr("class", "y axis");
  
    function update(new_data) {
      //: (IPerson[] & {x0: number, x1: number})[]
      //update the scales
      xscale.domain([0, d3.max(new_data, (d) => d.length)]);
      yscale.domain([new_data[0].x0, new_data[new_data.length - 1].x1]);
      //render the axis
      g_xaxis.transition().call(xaxis);
      g_yaxis.transition().call(yaxis);
  
      // Render the chart with new data
  
      // DATA JOIN
      const rect = g
        .selectAll("rect")
        .data(new_data)
        .join(
          (enter) => {
            // ENTER
            // new elements
            const rect_enter = enter
              .append("rect")
              .attr("x", 0) //set intelligent default values for animation
              .attr("y", 0)
              .attr("width", 0)
              .attr("height", 0);
            rect_enter.append("title");
            return rect_enter;
          },
          // UPDATE
          // update existing elements
          (update) => update,
          // EXIT
          // elements that aren't associated with data
          (exit) => exit.remove()
        );
  
      // ENTER + UPDATE
      // both old and new elements
      rect
        .transition()
        .attr("height", (d) => yscale(d.x1) - yscale(d.x0) - 2)
        .attr("width", (d) => xscale(d.length))
        .attr("y", (d) => yscale(d.x0) + 1);
  
      rect.select("title").text((d) => `${d.x0}: ${d.length}`);
    }
  
    return update;
  }
  
  function createPieChart(svgSelector, stateAttr, colorScheme) {
    const margin = 10;
    const radius = 100;
  
    // Creates sources <svg> element
    const svg = d3
      .select(svgSelector)
      .attr("width", radius * 2 + margin * 2)
      .attr("height", radius * 2 + margin * 2);
  
    // Group used to enforce margin
    const g = svg
      .append("g")
      .attr("transform", `translate(${radius + margin},${radius + margin})`);
  
    const pie = d3
      .pie()
      .value((d) => d.values.length)
      .sortValues(null)
      .sort(null);
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);
        
    
    const cscale = d3.scaleOrdinal(colorScheme);


  
    function update(new_data) {
      //{key: string, values: IPerson[]}[]
      const pied = pie(new_data);
      // Render the chart with new data
  
      cscale.domain(new_data.map((d) => d.key));
  
      // DATA JOIN
      const path = g
        .selectAll("path")
        .data(pied, (d) => d.data.key)
        .join(
          // ENTER
          // new elements
          (enter) => {
            const path_enter = enter.append("path");
            // TODO register click handler to change selected Water in state and call updateApp()
            path_enter.append("title");
            
            path_enter.on("click", (e, d) => {
              if (state.selectedWater === d.data.key) {
                state.selectedWater = null;
              } else {
                state.selectedWater = d.data.key;
              }
              updateApp();
            });
            return path_enter;
          }
        );


  
      // ENTER + UPDATE
      // both old and new elements
      path
        .classed("selected", (d) => d.data.key === state.selectedWater)
        .attr("d", arc) // TODO set the CSS class `selected` if the current data item is the selected Water in the state
        .style("fill", (d) => cscale(d.data.key));
  
      path.select("title").text((d) => `${d.data.key}: ${d.data.values.length}`);
    }
  
    return update;
  }
  
  /////////////////////////
  
  const ageHistogram = createHistogram("#age");
  const WaterPieChart = createPieChart("#Water", "selectedWater", d3.schemeSet3);
  const fareHistogram = createHistogram("#fare");
  const CountryPieChart = createPieChart(
    "#Country",
    "selectedCountry",
    d3
        .schemeSet3
        .slice(2)
  );
  
  function filterData() {
    return state.data.filter((d) => {
      if (state.passengerClass && d.pclass !== state.passengerClass) {
        return false;
      }
      if (state.selectedWater && d.Water !== state.selectedWater) {
        return false;
      }
      if (state.selectedCountry && d.Country !== state.selectedCountry) {
        return false;
      }
      return true;
    });
  }
  
  function wrangleData(filtered) {
    const ageHistogram = d3
      .bin()
      .domain([0, 100])
      .thresholds(10)
      .value((d) => d.age);
  
    const ageHistogramData = ageHistogram(filtered);
  
    // always the two categories
    const WaterPieData = ["G", "S", "SE", "NA"].map((key) => ({
      key,
      values: filtered.filter((d) => d.Water === key)
    }));
  
    const fareHistogram = d3
      .bin()
      .domain([0, d3.max(filtered, (d) => d.fare)])
      .value((d) => d.fare);
  
    const fareHistogramData = fareHistogram(filtered);
  
    // always the two categories
    const CountryPieData = ["Algeria", "Brazil", "Bangladesh", "Cape Town", "China", "Country", "Cyprus", "Different", "India", "Indonesia", "Iran", "Italy", "Kenya", "Malaysia", "Pakistan", "Saudi Aarabia", "Spain", "Taiwan", "Three Countries: Greece, Albania, Macedonia", "Turkey", "Ukraine", "United Kingdom", "USA"].map((key) => ({
      key,
      values: filtered.filter((d) => d.Country === key)
    }));
  
    return {
      ageHistogramData,
      WaterPieData,
      fareHistogramData,
      CountryPieData
    };
  }
  
  function updateApp() {
    const filtered = filterData();
  
    const {
        
      ageHistogramData,
      WaterPieData,
      fareHistogramData,
      CountryPieData
    } = wrangleData(filtered);
    ageHistogram(ageHistogramData);
    WaterPieChart(WaterPieData);
    fareHistogram(fareHistogramData);
    CountryPieChart(CountryPieData);
  
    d3.select("#selectedWater").text(state.selectedWater || "None");
    d3.select("#selectedCountry").text(state.selectedCountry || "None");
  }
  
  d3.csv(
    "file.csv"
  ).then((parsed) => {
    state.data = parsed.map((row) => {
      row.age = parseInt(row.age, 10);
      row.fare = parseFloat(row.fare);
      return row;
    });
  
    updateApp();
  });
  
  //interactivity
  d3.select("#passenger-class").on("change", function () {
    const selected = d3.select(this).property("value");
    state.passengerClass = selected;
    updateApp();
  });
*/





var map = L.map('map').setView([0,1], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var paperMarkers = new L.FeatureGroup();

dataCount = dc.dataCount('#data-count');
dataTable = dc.dataTable('#data-table');

var CountryChart= new dc.PieChart('#Country');
var WaterTypeChart = new dc.PieChart("#WaterType");
var yearChart = new dc.BarChart("#Year");
var firstInterestChart = dc.rowChart('#first-interest-row-chart');
var secondInterestChart = dc.rowChart('#second-interest-row-chart');
var thirdInterestChart = dc.rowChart('#third-interest-row-chart');
var fourthInterestChart = dc.rowChart('#fourth-interest-row-chart');
var fifthInterestChart = dc.rowChart('#fifth-interest-row-chart');



d3.csv("file_f.csv").then(function(data) {

  var ndx =crossfilter(data);
  var all= ndx.groupAll();
  var yearDim= ndx.dimension(function(d){ return d["Year"]});
  var CountryDim= ndx.dimension(function(d){ return d["Country"]});
  var JournalDim= ndx.dimension(function(d){ return d["Journal"]});
  var WaterTypeDim= ndx.dimension(function(d){ return d["WaterType"]});
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
  var WaterTypeGroup = WaterTypeDim.group().reduceCount();
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

   
  
  WaterTypeChart
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
    .sortBy(dc.pluck('Year'))
    .order(d3.descending)
    .on('renderlet', function(table){
      table.select('tr.dc-table-group').remove();

      paperMarkers.clearLayers();
      _.each(allDim.top(Infinity), function(d)
        {
          var longitude = d["lon"];
          var latitude = d["lat"];

          var fillColor_Var = "";
          var paperFocus = d["WaterType"];

          if (paperFocus == "R,S") {
              fillColor_Var = "#0096FF";
          } else if (paperFocus == "G") {
              fillColor_Var = "#40E0D0";
          } else if (paperFocus == "Sea") {
              fillColor_Var = "#B9C0C3";
          } else {
              fillColor_Var = "#228B22";
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

