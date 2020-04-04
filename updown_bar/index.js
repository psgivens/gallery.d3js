
var margin = {top: 40, right: 20, bottom: 80, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scaleBand([0, width])
  .paddingInner(0.2)
  .paddingOuter(0.1);

var y0 = d3.scaleLinear()
    .range([height, 0]);

const typeLabels = {
    "first": "Unprocessed",
    "second": "Done",
    "third": "In process"
}


// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
//   })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.call(tip);
const showToolTip = (labelName) => { return function (d) {      
    var xPosition = parseFloat(d3.select(this).attr("x")) + margin.left + x.bandwidth() / 2;
    var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

    //Update the tooltip position and value
    const tt = d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")

    tt.select("#type")
        .text(typeLabels[labelName]);

    tt.select("#value")
        .text(d[labelName]);

    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
} }

const hideToolTip = function(d) {
    //Show the tooltip
    d3.select("#tooltip").classed("hidden", true);
}


d3.tsv("./data.tsv", type, function(d) { return d }).then (function(data) {

  for (var i = 0; i < data.length; i++) {
        data[i].first = parseFloat(data[i].first);
        data[i].second = parseFloat(data[i].second);
        data[i].third = parseFloat(data[i].third);
    }

    // for (var i = 0; i < data.length; i++) {
    //     console.log(data[i].date);
    //     console.log(data[i].first);
    //     console.log(data[i].second);
    //     console.log(data[i].third);
    // }


  const largestFirst =  d3.max(data, d => d.first);

  x.domain(data.map(function(d) { return d.date; }));
  y0.domain([
    0 - d3.max(data, function(d) { return d.first; }),     
    d3.max(data, function(d) { return d.second + d.third; })]);

    var xAxis = d3.axisBottom()
    .scale(x);

  var yAxis = d3.axisLeft()
      .scale(y0)
      // .tickSize(900)//width - margin.left - margin.right)
      // .tickFormat(formatPercent);




  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)" );
        ;

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    //   .call(g => g.select(".domain")
    //     .remove())
    // .call(g => g.selectAll(".tick:not(:first-of-type) line")
    //     .attr("stroke-opacity", 0.5)
    //     .attr("stroke-dasharray", "2,2"))
    // .call(g => g.selectAll(".tick text")
    //     .attr("x", 4)
    //     .attr("dy", -4))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("first");

  svg.selectAll(".bar1")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar1")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y0(0); })
      .attr("height", function(d) { return (y0(0 - d.first) - y0(0)); })
      .on('mouseover', showToolTip("first"))
      .on('mouseout', hideToolTip)

    svg.selectAll(".bar2")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y0(d.second); })
      .attr("height", function(d) { return y0(0) - y0(d.second); })
      .on('mouseover', showToolTip("second"))
      .on('mouseout', hideToolTip)

    svg.selectAll(".bar3")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar3")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y0(d.second + d.third); })
      .attr("height", function(d) { return y0(0) - y0(d.third); })
      .on('mouseover', showToolTip("third"))
      .on('mouseout', hideToolTip)


});

function type(d) {
  d.first = +d.first;
  d.second = +d.second;
  d.third = +d.third;
  return d;
}
