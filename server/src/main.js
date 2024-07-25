const express = require("express");
const { argv } = require("process");
const WebSocketServer = require("websocket").server;
const { messageHandler, closeHandler } = require("./handlers");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = Number(argv[2]);

const httpServer = app.listen(port, () => {
  console.log(`Chat WS Server is listening on port ${port}`);
});

const websocket = new WebSocketServer({ httpServer: httpServer });

websocket.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  connection.on("message", (msg) => messageHandler(connection, msg));
  connection.on("close", (msg) => closeHandler(connection));
});
