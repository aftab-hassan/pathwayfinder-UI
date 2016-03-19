function MyFunc()
{
var buffer = JSON.parse(data);
var nodesarray = new Array();
for(var i=0;i<Object.keys(buffer[0].nodes).length;i++)
{
 //alert(buffer[0].nodes[i].name);
 nodesarray.push(buffer[0].nodes[i].name);
}
for(var i=0;i<Object.keys(buffer[0].edges).length;i++)
{
 //alert(buffer[0].edges[i].name);
 //alert(buffer[0].edges[i].source+" to "+ buffer[0].edges[i].destination);
}

// Create the input graph
var g = new dagreD3.Digraph();

// Here we're setting nodeclass, which is used by our custom drawNodes function
// below.
//To give styles to nodes, you can either give the styles here, or give it a class and link it to the css file. Both methods 1 and 2 below
//1.g.addNode(0,  { label: 'Female', labelStyle: 'font-weight: bold;', style: 'stroke: #f66; stroke-width: 10px;', nodeclass: 'type-TOP' });
//2.g.addNode(1,  { label: 'AfricanAmerican',         nodeclass: 'type-S' }); - the style for type-S is defined in the css file
//The code below with comments 'Override drawNodes to add nodeclass as a class to each node in the output graph' regarding adding nodeclass is necessary only if you're using method2 - the folder without-nodeclass shows this

for(i=0;i<nodesarray.length;i++)
{
 g.addNode(nodesarray[i],{label:nodesarray[i]});
}
/*g.addNode(0,  { label: 'Female', labelStyle: 'font-weight: bold;', style: 'stroke: #f66; stroke-width: 10px;', nodeclass: 'type-TOP' });
g.addNode(1,  { label: 'AfricanAmerican',         nodeclass: 'type-S' });
g.addNode(2,  { label: 'DX1',        nodeclass: 'type-NP' });
g.addNode(3,  { label: 'DX2',        nodeclass: 'type-DT' });
g.addNode(4,  { label: 'CM1',      nodeclass: 'type-TK' });
g.addNode(5,  { label: 'PR1',        nodeclass: 'type-VP' });
g.addNode(6, { label: 'PR2',  nodeclass: 'type-TK' });
g.addNode(7,  { label: 'Risk',       nodeclass: 'type-VBZ' });
g.addNode("review", { label: "Review", style: "fill: red" });*/

// Set up edges, no special attributes.
//g.addEdge(null, 5, 7, { style: 'stroke: #f66; stroke-width: 3px;' });
/*for(i=0;i<edgesarray.length;i++)
{
}*/
//g.addEdge(null,"Female","DX1",{ nodeclass: 'type-S' });
//g.addEdge(null,"Female","DX1",{edgeclass : 'type-edgestyle'});
for(var i=0;i<Object.keys(buffer[0].edges).length;i++)
{ 
 var source = buffer[0].edges[i].source; 
 var destination = buffer[0].edges[i].destination;
 var weight = buffer[0].edges[i].weight;
 var strokewidth = weight*10;

 switch(strokewidth)
 {
  case 1:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:1px',label:weight});
   break;
 
  case 2:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:2px',label:weight});
   break;
 
  case 3:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:3px',label:weight});
   break;
 
  case 4:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:4px',label:weight});
   break;
 
  case 5:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:5px',label:weight});
   break;
 
  case 6:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:6px',label:weight});
   break;
 
  case 7:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:7px',label:weight});
   break;
 
  case 8:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:8px',label:weight});
   break;
 
  case 9:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:9px',label:weight});
   break;
 
  case 10:
   g.addEdge(null,source,destination,{style:'stroke:#f66; stroke-width:10px',label:weight});
   break;

   defaut:
    g.addEdge(null,source,destination,{label:weight});
    break;
 }

 //g.addEdge(null,source,destination);
 //g.addEdge(null,source,destination,{style:'stroke: #f66; stroke-width:10px;', label:weight});

 //alert(weight*10);
}
/*g.addEdge(null, 0, 2);
g.addEdge(null, 0, 3);
g.addEdge(null, 1, 2);
g.addEdge(null, 1, 3);
g.addEdge(null, 1, 4);
g.addEdge(null, 2, 5);
g.addEdge(null, 2, 6);
g.addEdge(null, 4, 5);
g.addEdge(null, 4, 6);
g.addEdge(null, 5, 7, { style: 'stroke: #f66; stroke-width: 3px;',label: "Label for the edge" });*/

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

// Override drawEdges to add edgeclass as a class to each node in the output
// graph.
/*var oldDrawEdges = renderer.drawEdges();
renderer.drawEdges(function(graph, root) {
  var svgEdges = oldDrawEdges(graph, root);
  svgEdges.each(function(u) { d3.select(this).classed(graph.edge(u).edgeclass, true); });
  return svgEdges;
});*/

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
