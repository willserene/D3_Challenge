// @TODO: YOUR CODE HERE!
/********************************************************/
function renderPlot() {

  var svg = d3
    .select("body")
    .select("svg");

  if (!svg.empty()) {
    svg.remove();
  }

  var svgWidth = 800;
  var svgHeight = 660;

  var margin = {
    top: 50,
    right: 10,
    bottom: 30,
    left: 40
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
 
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`) 

  d3.csv("./assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    // Parse data
    data.forEach(function(data) {
      data.obesity = +data.obesity;
      data.poverty = +data.poverty;

    });

    // var barSpacing = 10; // desired space between each bar
    // var scaleY = 10; // 10x scale on rect height

    // // Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
    // var barWidth = (chartWidth - (barSpacing * (tvData.length - 1))) / tvData.length;


// (d3.min(data, d => d.obesity)
    var xAxis = d3.scaleLinear()
      .domain([0, (d3.max(data, d => d.obesity)+2)])
      .range([margin.left, width - margin.right]);

    var yAxis = d3.scaleLinear()
      .domain([0, (d3.max(data, d => d.poverty)+2)])
      .range([height - margin.bottom, margin.top]);
 
    var bottomAxis = d3.axisBottom(xAxis);
    var leftAxis = d3.axisLeft(yAxis);

    chartGroup.append("g")
 
      .call(bottomAxis)
      .attr("transform", `translate(0, ${height - margin.bottom})`);

    chartGroup.append("g")
      .call(leftAxis)
      .attr("transform", `translate(${margin.left}, 0)`);

    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xAxis(d.obesity))
      .attr("cy", d => yAxis(d.poverty))
      .attr("r", 10)
      .attr("fill", "blue")
      .attr("opacity", ".9")

    chartGroup.selectAll(".statetext")
      .data(data)
      .enter()
      .append("text")
      .classed("text", true)
      .attr("x", d => xAxis(d.obesity))
      .attr("y", d => yAxis(d.poverty))
      // .attr("x", (d, i) => i * (barWidth + barSpacing))
      .attr("font-size", "8px")
      .text(d => d.abbr)
      .attr("text-anchor", "middle")
      .attr("fill", "white");
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -40])
      .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
      });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })

      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
  
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left-55)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Poverty %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height+15})`)
      .attr("class", "axisText")
      .text("Obesity %");

  }).catch(function(error) {
    console.log(error);
  });

}

renderPlot();

d3.select(window).on("resize", renderPlot);