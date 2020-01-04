const margin = ({top: 20, right: 30, bottom: 30, left: 40})
const height = 500
const width = 950

d3.csv("unemployment-2.csv", d3.autoType)
  .then(function (data1) {

const data = Object.assign(data1, {y: "Unemployment"});
const series = d3.stack().keys(data.columns.slice(1))(data)

const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        // .text(data.y)
        );
const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
const color = d3.scaleOrdinal()
    .domain(data.columns.slice(1))
    .range(d3.schemeCategory10);
const y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
    .range([height - margin.bottom, margin.top]);
const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right]);
const area = d3.area()
    .x(d => x(d.data.date))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));


  const svg = d3.select("body").append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "" + width + "px")
      .attr("height", "" + height + "px");

  svg.append("g")
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("fill", ({key}) => color(key))
      .attr("d", area)
    .append("title")
      .text(({key}) => key);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  })

  