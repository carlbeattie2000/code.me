const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
const path = require("path")

if (cluster.isMaster) {
  let numReqs = 0;
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++){
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', (msg) => {
      messageHandler(msg);
      console.log(`numReqs = ${numReqs}`);
    });
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(new Error(`worker ${worker.process.pid} died`));
  })
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end("<h1>cluster of nodejs services example</h1>");

    const startTime = Date.now();

    while (Date.now() - startTime < 200) {}

    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);

  console.log(`Worker ${process.pid} started`)
}