const http = require("http");

let waitingResolves = [];
let Chat_history = [];

function waitForData() {
  return new Promise((resolve) => waitingResolves.push(resolve));
}

function resolve_push(data){
  waitingResolves.forEach((resolve) => {resolve(data);});
  waitingResolves = [];
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log(req.url);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/send") {
    let base = ""
    req.on('data', chunk => {
      base += chunk.toString();
    });
    req.on('end', () => {
       try {
        const data = JSON.parse(base); // parse JSON
        const now = new Date();
        data.time = now.toLocaleString('ru-RU', { timeZone: "Europe/Kiev" });
        Chat_history.push(data);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));

        resolve_push(Chat_history);
      } catch (err) {
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });
  }

  else if (req.method === "POST" && req.url === "/get_history") {
    console.log("1 client added");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(Chat_history));
  }

  else if (req.method === "POST" && req.url === "/listening") {
    const data = await waitForData();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  else{
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found - lol" }));
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});