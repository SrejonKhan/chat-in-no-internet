require("dotenv").config();
const chokidar = require("chokidar");
const liveServer = require("live-server");
const { build } = require("./builder");
const path = require("path");
const { cyanBright, yellowBright } = require("console-log-colors");

/*--------------------WATCH FOR SRC FILE CHANGE & BUILD--------------------*/
const clientDir = path.join(__dirname, "..");
const distDir = path.join(clientDir, "dist");
const watchDirs = [path.join(clientDir, "src"), path.join(clientDir, "./.env")];

chokidar
  .watch(watchDirs, {
    ignoreInitial: true,
    ignorePermissionErrors: true,
  })
  .on("all", (event, filePath) => {
    console.log(yellowBright(`File ${event} event:`) + ` ${path.basename(filePath)}. Rebuilding...`);
    build();
  });

/*--------------------LIVE SERVER--------------------*/
console.log(cyanBright(`Dev Server running at:`) + `${yellowBright(`http://localhost:${process.env.PORT}`)}`);
liveServer.start({
  port: process.env.PORT,
  host: "0.0.0.0",
  root: distDir,
  open: false,
  file: "index.html",
  logLevel: 0,
});
