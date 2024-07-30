const express = require("express");
var cors = require("cors");
const WebSocketServer = require("websocket").server;
const { messageHandler, closeHandler } = require("./handlers");
const { uploadMiddleware, uploadController } = require("./upload");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

const httpServer = app.listen(port, () => {
  console.log(`Chat WS Server is listening on port ${port}`);
});

const websocket = new WebSocketServer({ httpServer: httpServer });

websocket.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  connection.on("message", (msg) => messageHandler(connection, msg));
  connection.on("close", (msg) => closeHandler(connection));
});

app.post("/upload", uploadMiddleware.single("file"), uploadController);
