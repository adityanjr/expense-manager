const dimension = { height: 300, width: 300, radius: 150 };
const center = { x: dimension.height / 2 + 5, y: dimension.width / 2 + 5 };

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("height", dimension.height + 150)
  .attr("width", dimension.width + 150);

const graph = svg
  .append("g")
  .attr("transform", `translate(${center.x},${center.y})`);

const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.cost);

const arcPath = d3
  .arc()
  .outerRadius(dimension.radius)
  .innerRadius(dimension.radius / 2);

const color = d3.scaleOrdinal(d3["schemeSet2"]);

const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${dimension.width + 50}, 20)`);

const legend = d3.legendColor().shapePadding(10).shape("circle").scale(color);

const update = (data) => {
  color.domain(data.map((d) => d.name));

  legendGroup.call(legend);
  legendGroup.selectAll("text").attr("fill", "black");

  const paths = graph.selectAll("path").data(pie(data));

  //handle exit selection
  paths.exit().transition().duration(750).attrTween("d", arcTweenExit).remove();

  //handle DOM path updates
  paths
    .attr("d", arcPath)
    .transition()
    .duration(750)
    .attrTween("d", arcTweenUpdate);

  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", (d) => color(d.data.name))
    .each(function (d) {
      this._current = d;
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTweenEnter);
};

var data = [];

db.collection("expenses").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = datafindIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });
  update(data);
});

const arcTweenEnter = (d) => {
  var i = d3.interpolate(d.endAngle, d.startAngle);
  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

const arcTweenExit = (d) => {
  var i = d3.interpolate(d.startAngle, d.endAngle);
  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

function arcTweenUpdate(d) {
  var i = d3.interpolate(this._current, d);
  this._current = d;
  return function (t) {
    return arcPath(i(t));
  };
}
