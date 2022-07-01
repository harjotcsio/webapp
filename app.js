const width = 225;
const height = 285;

// Creates sources <svg> element
const svg = d3.select('#pi1').append('svg')
.attr('width', width)
.attr('height', height);

const g = svg.append('g')
.attr('transform', `translate(${width/2}, ${height/2})`);

const data = [1, 2, 0.5, 1, 1.5];

const radius = Math.min(width, height) / 2;

const color = d3.scaleOrdinal(d3.schemeCategory10);

const arc = d3.arc()
.outerRadius(radius - 10)
.innerRadius(0);

const pie = d3.pie();

const pied_data = pie(data);

const arcs = g.selectAll('.arc').data(pied_data).join(
  (enter) => enter.append('path')
  .attr('class', 'arc')
  .style('stroke', 'white')
);

arcs.attr('d', arc)
  .style('fill', (d, i) => color(i));

  

  const svg2 = d3.select('#pi2').append('svg')
  .attr('width', width)
  .attr('height', height);
  
  const g2 = svg2.append('g')
  .attr('transform', `translate(${width/2}, ${height/2})`);
  
  const data2 = [1, 2, 0.5, 1, 1.5];
  
  const radius2 = Math.min(width, height) / 2;
  
  const color2 = d3.scaleOrdinal(d3.schemeCategory10);
  
  const arc2 = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);
  
  const pie2 = d3.pie();
  
  const pied_data2 = pie(data2);
  
  const arcs2 = g2.selectAll('.arc').data(pied_data2).join(
    (enter) => enter.append('path')
    .attr('class', 'arc')
    .style('stroke', 'white')
  );
  
  arcs2.attr('d', arc2)
    .style('fill', (d, i) => color(i));




    const state = {
        data: [],
        passengerClass: ''
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
        const svg = d3.select(svgSelector)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
      
        // Group used to enforce margin
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      
      
        // Scales setup
        const xscale = d3.scaleLinear().range([0, width]);
        const yscale = d3.scaleLinear().range([0, height]);
      
        // Axis setup
        const xaxis = d3.axisTop().scale(xscale);
        const g_xaxis = g.append('g').attr('class', 'x axis');
        const yaxis = d3.axisLeft().scale(yscale);
        const g_yaxis = g.append('g').attr('class', 'y axis');
      
      
        function update(new_data) { //: (IPerson[] & {x0: number, x1: number})[]
          //update the scales
          xscale.domain([0, d3.max(new_data, (d) => d.length)]);
          yscale.domain([new_data[0].x0, new_data[new_data.length - 1].x1]);
          //render the axis
          g_xaxis.transition().call(xaxis);
          g_yaxis.transition().call(yaxis);
      
          // Render the chart with new data
      
          // DATA JOIN
          const rect = g.selectAll('rect').data(new_data);
      
          // ENTER
          // new elements
          const rect_enter = rect.enter().append('rect')
          .attr('x', 0) //set intelligent default values for animation
          .attr('y', 0)
          .attr('width', 0)
          .attr('height', 0);
          rect_enter.append('title');
      
          // ENTER + UPDATE
          // both old and new elements
          rect.merge(rect_enter).transition()
            .attr('height', (d) => yscale(d.x1) - yscale(d.x0) - 2)
            .attr('width', (d) => xscale(d.length))
            .attr('y', (d) => yscale(d.x0) + 1);
      
          rect.merge(rect_enter).select('title').text((d) => `${d.x0}: ${d.length}`);
      
          // EXIT
          // elements that aren't associated with data
          rect.exit().remove();
        }
      
        return update;
      }
      
      function createPieChart(svgSelector) {
        const margin = 10;
        const radius = 100;
      
        // Creates sources <svg> element
        const svg = d3.select(svgSelector)
        .attr('width', radius * 2 + margin * 2)
        .attr('height', radius * 2 + margin * 2);
      
        // Group used to enforce margin
        const g = svg.append('g')
        .attr('transform', `translate(${radius + margin},${radius + margin})`);
      
        // 1. TODO
      
        function update(new_data) { //{key: string, values: IPerson[]}[]
          // TODO apply layout and render pie
        }
      
        return update;
      }
      
      /////////////////////////
      
      const ageHistogram = createHistogram('#age');
      const sexPieChart = createPieChart('#sex');
      
      function filterData() {
        return state.data.filter((d) => {
          if (state.passengerClass && d.pclass !== state.passengerClass) {
            return false;
          }
          return true;
        });
      }
      
      function wrangleData(filtered) {
        const ageHistogram = d3.bin()
        .domain([0, 100])
        .thresholds(10)
        .value((d) => d.age);
      
        const ageHistogramData = ageHistogram(filtered);
      
        // always the two categories
        const sexPieData = ['female', 'male'].map((key) => ({
          key,
          values: filtered.filter((d) => d.sex === key)
        }));
      
        return {ageHistogramData, sexPieData};
      }
      
      function updateApp() {
        const filtered = filterData();
      
        const {ageHistogramData, sexPieData} = wrangleData(filtered);
        ageHistogram(ageHistogramData);
        sexPieChart(sexPieData);
      }
      
      d3.csv('https://rawgit.com/sgratzl/d3tutorial/master/examples/titanic3.csv').then((parsed) => {
        state.data = parsed.map((row) => {
          row.age = parseInt(row.age, 10);
          row.fare = parseFloat(row.fare);
          return row;
        });
      
        updateApp();
      });
      
      //interactivity
      d3.select('#passenger-class').on('change', function () {
        const selected = d3.select(this).property('value');
        state.passengerClass = selected;
        updateApp();
      });