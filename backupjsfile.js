function MyFunc(index,query)
{
//alert('came inside the MyFunc function!');

/* adding an edge by clicking on two nodes related variable */
var userfrom = "";
var userto = "";
var usercount = 0;
var querystring = "nodes:";
var involvednodes = new Array();
var involvednodesstring = "";
var layer = 0;
var layerfirstclickednode = 0;
var layerpossiblesecondclickednode = 0;
var layersecondclickednode = 0;
//alert('just entered the function,query parameter=='+query);

var buffer = JSON.parse(data);
var nodesarray = new Array();
for(var i=0;i<Object.keys(buffer[0].patient[index].scenario[0].nodes).length;i++)
{
 nodesarray.push(buffer[0].patient[index].scenario[0].nodes[i].name);
}

// Create the input graph
var g = new dagreD3.Digraph();

/* This is hardcoded and should be part of every graph */
var invisiblestyle='stroke:#f66; stroke-width:';
invisiblestyle = invisiblestyle + 1 + 'px';
g.addNode("AAStartDemographic",{nodeclass:'type-INVISIBLE',useDef: "def-N0",label:"AAStartDemographic"});
g.addNode("AAStartComorbidities",{nodeclass:'type-INVISIBLE',useDef: "def-N0",label:"AAStartComorbidities"});
g.addNode("AAStartProcedures",{nodeclass:'type-INVISIBLE',useDef: "def-N0",label:"AAStartProcedures"});
g.addEdge("AADemoTOComo","AAStartDemographic","AAStartComorbidities",{style:invisiblestyle});
g.addEdge("AAComoTOProc","AAStartComorbidities","AAStartProcedures",{style:invisiblestyle});

for(i=0;i<nodesarray.length;i++)
{
 layer = 0;
 g.addNode(nodesarray[i],{label:nodesarray[i]});
 //g.node(nodesarray[i],"somelabelvalue");

 //To give styles to nodes
 //g.addNode(0,  { label: 'Female', labelStyle: 'font-weight: bold;', style: 'stroke: #f66; stroke-width: 10px;', nodeclass: 'type-TOP' });
 //g.addNode(nodesarray[i],{label:"label"+nodesarray[i]+"\n" + "(0.2)"});
 /* Assume : layer1 : demographic, layer2 : DX/CM, layer3 : PR */
 /* layer1                layer2                layer3       layer4 
    StartDemographic  StartComorbidities    StartProcedures  
    Age                     DX                    PR          Risk
    Race                    CM
    Gender    
 */

 if( ((nodesarray[i].charAt(0) == 'D') && (nodesarray[i].charAt(1)=='X')) || ((nodesarray[i].charAt(0) == 'C') && (nodesarray[i].charAt(1)=='M')) )
  layer = 2;
 else if( (nodesarray[i].charAt(0) == 'P') && (nodesarray[i].charAt(1)=='R'))
  layer = 3;

 //alert("for "+nodesarray[i] + ",charAt(0)=="+nodesarray[i].charAt(0)+",charAt(1)=="+nodesarray[i].charAt(1)+"layer=="+layer);

 switch(layer)
 {
  case 2:
  {
   g.addEdge("AAStartDemographic"+i,"AAStartDemographic",nodesarray[i],{style:invisiblestyle});
   break;
  }

  case 3:
  {
   g.addEdge("AAStartComorbidities"+i,"AAStartComorbidities",nodesarray[i],{style:invisiblestyle});
   break;
  }

  default:
   break;
 }
}
g.addNode("ZZFinishNodeLayer1",{nodeclass:'type-INVISIBLE',useDef: "def-N0",label:"ZZFinishNodeLayer1"});

var myarray = new Array();
myarray = g.nodes(nodesarray[0]);
//alert("myarray=="+myarray);
for(var e = 0;e<myarray.length;e++)
{
 querystring += myarray[e]+";";
 //alert(myarray[e]);
}
//alert(querystring);

//g.node("DX1","addingnwelabel");//digraph.node(1, "Some node value");

for(var i=0;i<Object.keys(buffer[0].patient[index].scenario[0].edges).length;i++)
{ 
 var source = buffer[0].patient[index].scenario[0].edges[i].source; 
 var destination = buffer[0].patient[index].scenario[0].edges[i].destination;
 var weight = buffer[0].patient[index].scenario[0].edges[i].weight;
 var strokewidth = weight*10;
 var mystyle='stroke:#f66; stroke-width:';
 mystyle = mystyle + strokewidth + 'px';

 //To give styles to edges 
 //g.addEdge(null, 5, 7, { style: 'stroke: #f66; stroke-width: 3px;',label: "Label for the edge" });
 //alert('drawing edge from '+source+' to '+destination);
 g.addEdge(i,source,destination,{style:  mystyle,label:weight});
}

/* This is the place to find out the nodes which are involved in the graph, basically which has atleast an inEdges or outEdges 
   When does a node become 'involved'?
   1.inEdges > 1
     Remember every node except for the demographic nodes have an inEdge of 1
   2.outEdges > 0
   3.Node is not part of the whitenodes.
     But how do I make sure that the whitenodes are not taken into consideration - because I'm only looking at the nodesarray array, which is coming from json.
     So later, if I have to draw all the nodes on the page(basically draw the entire graph even the ones that are not coming from json, I'll have to go and add this to the nodesarray array
*/
for(var j = 0;j<nodesarray.length;j++)
{
 //alert(g.inEdges(nodesarray[j]));
 //alert(g.inEdges(nodesarray[j]).length);
 if( ((g.inEdges(nodesarray[j]).length) > 1) || ((g.outEdges(nodesarray[j]).length) > 0) )
 {
  //alert(nodesarray[j] + " is an involved node, inEdges=="+g.inEdges(nodesarray[j]).length+" outEdges== "+g.outEdges(nodesarray[j]).length);
  involvednodesstring += nodesarray[j]+";";
 }
}
alert(involvednodesstring);
//alert("g.inEdges(\"DXaft\")=="+g.inEdges("DXaft").length);

//alert("pepperboy145.1.normal API,g.nodes : "+g.nodes());
//alert("pepperboy145.2.g.nodes(nodesarray[0]) : "+g.nodes(nodesarray[0]));
//alert("pepperboy145.2a.g.nodes(nodesarray[0]) : "+g.nodes("DX1"));
//alert("passing any junk : pepperboy145.2b.g.nodes(nodesarray[0]) : "+g.nodes("DXdsds1"));

querystring += "edges:"
for(var e = 0; e<myarray.length;e++)
{
 querystring = querystring + myarray[e] + "-" + g.outEdges(myarray[e]) + ";";
}
//alert(querystring);



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
renderer.drawNodes(function(graph, root) 
{
   var svgNodes = oldDrawNodes(graph, root);
   
   /* this is the each loop to add nodeclass */
   svgNodes.each(function(u) 
   {
    //alert('3.pepperbody145.inside this .each loop,g.nodes()=='+g.nodes());
    //alert('4.pepperbody145.inside this .each loop,g.nodes(u)=='+g.nodes(u));
    //alert('5.pepperbody145.inside this .each loop,g.node(u)=='+g.node(u));
    //alert('going to put a debugger here');
    //g.node(u).label = "thisisnewlabel";
    var what = 100;
    //alert(g.nodes(u));
    //alert(g.inEdges(u));
    //alert(g._nodes);
    //alert(u);
    //alert(g.node(u).label);
    d3.select(this).classed(graph.node(u).nodeclass, true); 
   });//end of svgNodes.each


   /* this is the onclick which does different things depending on whether it's a single click or double */
   svgNodes.on('click', function(d) 
   { 
   //alert(d + "=="+d.charAt(0));
   //alert('Clicked on node - ' + d);
   //alert("nodeclass=="+graph.node(d).nodeclass);
   //alert("colour=="+graph.node(d).color);

   //alert("DX1"+g.node("DX1"));
   //alert("edge0"+g.edge(0));
   //g.node("DX1", "Some node value");
   //alert("DX11"+g.edge(0));
   //alert("edge00"+g.node("DX1"));
   //renderer.run(g, d3.select("svg g"));
   //debugger;
   //g.setNode("DX1","newlabelforDX1");
   //d3.select("this").text(function(d,i){alert(d.label);})
   //alert("g.hasNode(\"DX1\"=="+g.hasNode("DX1"));
   //alert('adding the new label');
   //g.node("DX1","addingnwelabel");//digraph.node(1, "Some node value");
   //alert("g.node(\"DX1\"=="+g.node("DX1"));
   //var layout1 = renderer.run(g, d3.select('svg g'));

   //userfrom = "";
   //userto = "";
   usercount++;

   /* When the first node is clicked, all the nodes become GRAY'edOUT and the selected node becomes ORANGE */
   if(usercount == 1)
   {
    /* later, think of creating a 'layer'-store for all the nodes */
    if( (d=="Female") || (d=="Male") || (d=="AfricanAmerican") || (d=="Hispanic") || (d=="White") )
    {
     layerfirstclickednode = 1;
    }
    else if( ((d.charAt(0) == 'D') && (d.charAt(1)=='X')) || ((d.charAt(0) == 'C') && (d.charAt(1)=='M')) )
    {
     layerfirstclickednode = 2;
    }
    else if( (d.charAt(0) == 'P') && (d.charAt(1)=='R'))
    {
     layerfirstclickednode = 3;
    }
    /* I have to ask if selecting the Risk node is allowed, I don't think so, that should be part of every graph, I think only layers1,2,3 should be allowed */
    else if(d=="Risk")
    {
     layerfirstclickednode = 4;
    }

     
    /* this is the each inside the onclick(of first click) which iterates and GRAYsOUT the nodes in the next layer */
    svgNodes.each(function(u) 
    {
     /* later, think of creating a 'layer'-store for all the nodes */
     if( (u=="Female") || (u=="Male") || (u=="AfricanAmerican") || (u=="Hispanic") || (u=="White") )
     {
      layerpossiblesecondclickednode = 1;
     }
     else if( ((u.charAt(0) == 'D') && (u.charAt(1)=='X')) || ((u.charAt(0) == 'C') && (u.charAt(1)=='M')) )
     {
      layerpossiblesecondclickednode = 2;
     }
     else if( (u.charAt(0) == 'P') && (u.charAt(1)=='R'))
     {
      layerpossiblesecondclickednode = 3;
     }
     else if(u=="Risk")
     {
      layerpossiblesecondclickednode = 4;
     }

     if(layerpossiblesecondclickednode == (layerfirstclickednode + 1))
     {
      d3.select(this).classed({'type-ORANGE':false,'type-GRAYOUT':true}); 
     }
    });//end of svgNodes.each
    d3.select(this).classed({'type-GRAYOUT':false,'type-ORANGE':true});//this is added after the previous line, so as to paint on top of GRAY with ORANGE, actually I think it doesn't matter because of the if-condition

    userfrom = d;
    alert('Please select one of the grayed out nodes to draw an edge between the two!');
   }//end of if(usercount == 1) 

   /* When the second node is clicked, the second selected node also becomes ORANGE, but the other nodes have to return to default color, because selection is over */
   else if(usercount == 2)
   {
    userto = d;
    usercount = 0;
    //svgNodes.each(function(u) { d3.select(this).classed({'type-ORANGE':false,'type-GRAYOUT':false}); });
    //d3.select(this).classed({'type-GRAYOUT':false,'type-ORANGE':true});

    /* here check the level and only if it's a valid selection, remove the ORANGE from the previous, otherwise show the 'akquinet' error message and keep asking for selection */
    if( (d=="Female") || (d=="Male") || (d=="AfricanAmerican") || (d=="Hispanic") || (d=="White") )
    {
     layersecondclickednode = 1;
    }
    else if( ((d.charAt(0) == 'D') && (d.charAt(1)=='X')) || ((d.charAt(0) == 'C') && (d.charAt(1)=='M')) )
    {
     layersecondclickednode = 2;
    }
    else if( (d.charAt(0) == 'P') && (d.charAt(1)=='R'))
    {
     layersecondclickednode = 3;
    }
    else if(d=="Risk")
    {
     layersecondclickednode = 4;
    }


    /* Basically, this is the success case, which means that a correct {pair of nodes from two adjacent layers have been chosen to draw a grpah}. So now add it to the involvednodesstring if it is not already a part of it, and then look up in the json to see which what is the scenario index of this new scenario. Then call MyFunc(newindex). //TODO: I think I have to add one more check before deciding it's a success pair, to see if there already exists an edge between those two selected nodes */
    if(layersecondclickednode == (layerfirstclickednode + 1))
    {
     /* Since this is an allowed selection, we are changing the usercount to 0, which means ready for the next selection, if it was a wrong selection(same layer), we would change the usercount to 1, which means, only one selection is correct, make the second selection again */
     usercount = 0;
 
     /* this is the each inside the onclick(of second click) which iterates and returns the color of nodes to default after changing the color because of first click */
     svgNodes.each(function(u)
     {
      d3.select(this).classed({'type-ORANGE':false,'type-GRAYOUT':false});
     });
     /* Basically, userfrom is not an involvednode so far */
     if(involvednodesstring.search(userfrom) == -1)
     {
      alert("userfrom will now be added to involvednodesstring, involvednodesstring before adding "+userfrom + " == [" + involvednodesstring+"]");
      involvednodesstring = involvednodesstring + userfrom + ";";
      alert("involvednodesstring after adding "+userfrom + " == [" + involvednodesstring+"]");
     }
     else
     {
      alert('did not add userfrom to involvednodesstring,found at '+involvednodesstring.search(userfrom));
     }

     /* Basically, userto is not an involvednode so far */
     if(involvednodesstring.search(userto) == -1)
     {
      alert("userto will now be added to involvednodesstring, involvednodesstring before adding "+userto + " == [" + involvednodesstring+"]");
      involvednodesstring = involvednodesstring + userto + ";";
      alert("involvednodesstring after adding "+userto + " == [" + involvednodesstring+"]");
     }
     else
     {
      alert('did not add userto to involvednodesstring,found at '+involvednodesstring.search(userto));
     }

     alert("involvednodesstring after taking userfrom and userto into consideration == "+involvednodesstring);

     /* I think the search function which matches which scenario this condition after adding and removing nodes should go in here, and then call MyFunc(newindex) or MyFuncJSONData(bufferreceivedfromkeyvaluestore) should go in here */

     //alert("1.graph.inEdges(\"DX1\")=="+graph.inEdges("DX1"));
     //alert("2.graph.inEdges(\"DX1\")=="+g.inEdges("DX1"));
     //alert("3.graph.nodeCount()=="+g.nodeCount());
     //alert("4.graph.edgeCount()=="+g.edgeCount());
     //g.setDefaultNodeLabel("DefaultLabel");
     //alert("5.graph.nodes()=="+g.nodes());
     //alert("6.graph.edges()=="+g.edges());
     //alert("7.graph.node(\"DX1\")=="+g.node("DX1"));
     //alert("8.graph.setNode(DX1, [label])=="+g.setNode("DX1", "labelforDX1"));
     //alert("9.graph.predecessors(\"DX1\")=="+g.predecessors("DX1"));
     //alert("10.graph.successors(\"DX1\")=="+g.successors("DX1"));
     //alert("11.graph.neighbors(\"DX1\")=="+g.neighbors("DX1"));
     //alert("12.graph.outEdges(\"DX1\",\"PR1\")=="+graph.outEdges("DX1","PR1"));
     //alert("13.graph.outEdges(\"DX1\",\"PR1\")=="+graph.outEdges("PR1","Risk"));
     //alert("14.graph.outEdges(\"DX1\",\"PR1\")=="+graph.outEdges("PR3","Risk"));
     //alert("15.graph.node(\"DX1\"=="+graph.node("DX1"));  
 
     //var results = {};
     //graph.eachNode(function(u, value) {
     //results[u] = value;
     //alert("16.results[u]=="+results[u]);
     //});
 
     //g.eachEdge(function(e, u, v, label) {
     //results[e] = "U: " + u + " V: " + v + " L: " + label; 
     //alert("17.label=="+label+",results[e]=="+results[e]);
     //});
     //alert(graph.hasEdge(userfrom,userto));
     //alert(graph.hasEdge(0));
     //alert(graph.hasEdge(100));

     //alert('about to call MyFunc(0)');
     //MyFunc(0);
     //alert('came back from calling MyFunc(0)');
     //MyFunc(2,querystring);
    }//end of if(layersecondclickednode == (layerfirstclickednode + 1))
    else
    {
     usercount = 1;
     alert('this node cannot be chosen!');
    }
    //d3.select(this).classed({'type-GRAYOUT':true,'type-RED':false,'type-YELLOW':false}); 
    //alert('An edge will now be drawn between '+userfrom + ' and ' + userto);
   }//end of else if(usercount == 2)
  });//svgNodes.on
  return svgNodes;

});//renderer.drawNodes

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

/* To see the inivisible nodes, these are the changes you need to make
1.demo.css  - g.type-INVISIBLE
2.show.html - style="fill:white;stroke:white"
3.jsfile.js - invisiblestyle + 1 + 'px'

*/
