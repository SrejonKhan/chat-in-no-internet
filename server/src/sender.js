const { getAllConnectionsOfRoom } = require("./memoryDb");

const sendSysMessage = (msg, roomName) => {
  const payload = {
    type: "SYS_MSG",
    room: roomName,
    message: msg,
  };

  const connections = getAllConnectionsOfRoom(roomName);
  if (connections.length == 0) {
    console.log(`Room [${roomName}] not found! The msg is - ${msg}`);
    return;
  }
  connections.forEach((c) => c.send(JSON.stringify(payload)));
};

module.exports = { sendSysMessage };
