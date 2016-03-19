function MyFunc()
{
 var buffer = JSON.parse(data);
 alert(buffer[0].patient[0].scenario[0].nodes[1].name);
 alert(buffer[0].patient[0].scenario[1].nodes[3].probability);
 alert(buffer[0].patient[1].scenario[0].nodes[3].name);
 alert(buffer[0].patient[2].scenario[0].edges[4].source);
 alert(buffer[0].patient[3].scenario[0].edges[5].destination);
 alert(buffer[0].patient[4].scenario[0].edges[6].weight);
}
