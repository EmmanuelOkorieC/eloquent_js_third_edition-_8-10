function buildGraph(roads) {
    let graph = Object.create(null)
         function addEdge(from, to) {
             if(!graph[from]) {
               graph[from] = [to]
             }
             else {
                 graph[from].push(to)
             }
         }
     for(let [from, to] of roads) {
         addEdge(from, to)
         addEdge(to, from)
     }
     return graph
}

module.exports.buildGraph = buildGraph