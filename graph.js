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

const update = (data) => {
  color.domain(data.map((d) => d.name));
  const paths = graph.selectAll("path").data(pie(data));

  paths.exit().remove(); //handle exit selection

  paths.attr("d", arcPath); //handle DOM path updates

  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("d", arcPath)
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", (d) => color(d.data.name));
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
