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
  .sort(NULL)
  .value((d) => d.cost);

const arcPath = d3
  .arc()
  .outerRadius(dimension.radius)
  .innerRadius(dimension.radius / 2);
