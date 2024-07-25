const http = require("http");
const { argv } = require("process");
const WebSocketServer = require("websocket").server;
const { messageHandler, closeHandler } = require("./handlers");

const port = Number(argv[2]);

const httpserver = http.createServer();
const websocket = new WebSocketServer({ httpServer: httpserver });

httpserver.listen(port, () => console.log(`Chat WS Server is listening on port ${port}`));

websocket.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  connection.on("message", (msg) => messageHandler(connection, msg));
  connection.on("close", (msg) => closeHandler(connection));
});
