const {
  connections,
  usernames,
  colorMaps,
  userRoomMap,
  chats,
  addConnectionToRoom,
  removeConnectionFromRoom,
  getUsername,
  setUsername,
  getColor,
  getOrSetColor,
  setColor,
  deleteColor,
  getUserRoom,
  setUserRoom,
  deleteUserRoom,
} = require("./memoryDb");

const { colors } = require("./constants");
const { randomInt } = require("crypto");
const { sendSysMessage } = require("./sender");

const messageHandler = (connection, message) => {
  const username = getUsername(connection);
  const color = getColor(connection, username);

  let receivedObj;
  try {
    receivedObj = JSON.parse(message.utf8Data);
  } catch {}

  if (!receivedObj) {
    return;
  }

  const roomName = receivedObj.room ?? "base";

  const payload = {
    type: "USER_MSG",
    username: username,
    message: "YET_TO_SET",
    color: color,
    room: roomName,
    attachmentUrl: receivedObj.attachmentUrl,
    mime: receivedObj.mime,
    filename: receivedObj.filename,
  };

  if (receivedObj.type == "USER_ACTION") {
    // user acknowledgement on joining
    if (receivedObj.actionName == "ACK") {
      const ackUsername = receivedObj.username;
      setUsername(connection, ackUsername);
      addConnectionToRoom(connection, roomName);
      setUserRoom(connection, ackUsername, roomName);
      getOrSetColor(connection, ackUsername, colors[randomInt(100) % colors.length]);
      sendSysMessage(`${ackUsername} just joined!`, roomName);
      return;
    }
    // username change action from user
    if (receivedObj.actionName == "CHANGE_USERNAME") {
      const newUsername = receivedObj.value;
      const previousUsername = username;
      if (previousUsername == newUsername) {
        return;
      }
      setUsername(connection, newUsername);
      setColor(connection, newUsername, getColor(connection, previousUsername));
      setUserRoom(connection, newUsername, roomName);
      // cleanup
      deleteColor(connection, previousUsername);
      deleteUserRoom(connection, previousUsername);
      sendSysMessage(`${previousUsername} has changed their username to ${newUsername}!`, roomName);
      return;
    }

    // color change action from user
    if (receivedObj.actionName == "CHANGE_COLOR") {
      const newColor = colors[randomInt(100) % colors.length];
      deleteColor(connection, username);
      setColor(connection, username, newColor);
      payload.type = "SYS_MSG";
      sendSysMessage(`${username} has changed their color to ${newColor}!`, getUserRoom(connection, username));
      return;
    }

    // typing activity
    if (receivedObj.actionName == "TYPING_STATUS") {
      payload.type = "ROOM_ACTIVITY";
      payload.activityType = "TYPING_STATUS";
      payload.value = receivedObj.value;
    }

    // get all previous chats
    if (receivedObj.actionName == "GET_ALL_MSG") {
      payload.type = "ALL_MSG";
      payload.message = JSON.stringify(chats);
    }
  }
  // user message
  else if (receivedObj.type == "USER_MSG") {
    payload.message = receivedObj.message;
  }

  connections[roomName].forEach((c) => c.send(JSON.stringify(payload)));
  chats.push(payload);
  return;
};

const closeHandler = (connection) => {
  const username = getUsername(connection);
  const roomName = getUserRoom(connection, username);
  sendSysMessage(`${username} just disconnected!`, roomName);
  removeConnectionFromRoom(connection, roomName);
  deleteUserRoom(connection, username);
  delete userRoomMap[`${username}${connection.socket.remotePort}`];
};

module.exports = { messageHandler, closeHandler };
