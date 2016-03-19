function MyFunc()
{
var buffer = JSON.parse(data);
var nodesarray = new Array();
for(var i=0;i<Object.keys(buffer[0].nodes).length;i++)
{
 nodesarray.push(buffer[0].nodes[i].name);
}

// Create the input graph
var g = new dagreD3.Digraph();

for(i=0;i<nodesarray.length;i++)
{
 //To give styles to nodes
 //g.addNode(0,  { label: 'Female', labelStyle: 'font-weight: bold;', style: 'stroke: #f66; stroke-width: 10px;', nodeclass: 'type-TOP' });
 g.addNode(nodesarray[i],{label:nodesarray[i]});
}

for(var i=0;i<Object.keys(buffer[0].edges).length;i++)
{ 
 var source = buffer[0].edges[i].source; 
 var destination = buffer[0].edges[i].destination;
 var weight = buffer[0].edges[i].weight;
 var strokewidth = weight*10;
 var mystyle='stroke:#f66; stroke-width:';
 mystyle = mystyle + strokewidth + 'px';

 //To give styles to edges 
 //g.addEdge(null, 5, 7, { style: 'stroke: #f66; stroke-width: 3px;',label: "Label for the edge" });
 g.addEdge(i,source,destination,{style:  mystyle,label:weight});
}

/* Deleting a node example */
//g.delNode(nodesarray[0]);
//g.delNode(nodesarray[1]);

/* Deleting an edge example - but for this, the first argument of g.addEdge should not be null, it should be some id. */
//g.delEdge(0);

// Create the renderer
var renderer = new dagreD3.Renderer();
var l = dagreD3.layout()
              .nodeSep(100)
              .rankSep(200)
              .edgeSep(80)
              .rankDir("LR");
renderer.layout(l);

// Override drawNodes to add nodeclass as a class to each node in the output
// graph.
var oldDrawNodes = renderer.drawNodes();
renderer.drawNodes(function(graph, root) {
  var svgNodes = oldDrawNodes(graph, root);
  svgNodes.each(function(u) { d3.select(this).classed(graph.node(u).nodeclass, true); });
  return svgNodes;
});

// Disable pan and zoom
renderer.zoom(false);
//renderer.edgeInterpolate('linear');

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select('svg'),
    svgGroup = svg.append('g');

// Run the renderer. This is what draws the final graph.
var layout = renderer.run(g, d3.select('svg g'));

// Center the graph
var xCenterOffset = (svg.attr('width') - layout.graph().width) / 2;
svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 80)');
svg.attr('height', layout.graph().height + 200);
}
