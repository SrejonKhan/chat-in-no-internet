const connections = {};
const colorMaps = {};
const usernames = {};
const userRoomMap = {};
const chats = [];

/* ------------WS CONNECTION------------ */
/* 
  the heart of this application.

  each room can have multiple connections, so we store connections under room name (as key)
*/

const addConnectionToRoom = (connection, roomName) => {
  if (connections[roomName]) connections[roomName].push(connection);
  else connections[roomName] = [connection];
};

const removeConnectionFromRoom = (connection, roomName) => {
  if (!connections[roomName]) return;
  const index = connections[roomName]?.findIndex((c) => c == connection);
  if (index == -1) return;
  connections[roomName].splice(index, 1);
};

const getAllConnectionsOfRoom = (roomName) => {
  return connections[roomName] ?? [];
};

/* ------------USERNAME------------ */
/* 
  [remoteAddr+remotePort] = username
  the username here is the display name you see in the client side.

  to generate an unique (has chance of confliction) username, we combine - 
  username + remoteAddr + remotePort

  if remoteAddr = 8.8.8.8, remotePort = 12345, username = john
  then the key for username map is = [8.8.8.812345]
  and, the unique username is john8.8.8.812345
*/
const getUniqueUsername = (connection, username) => {
  return `${username}${connection.socket.remoteAddress}${connection.socket.remotePort}`;
};
const getUsername = (connection) => {
  return usernames[connection.socket.remoteAddress + connection.socket.remotePort] ?? `User${connection.socket.remotePort}`;
};

const setUsername = (connection, username) => {
  usernames[connection.socket.remoteAddress + connection.socket.remotePort] = username;
};

/* ------------COLOR------------ */
/* 
  [username+remotePort] = any_color
  if username = john, remotePort = 12345
  then the key is = [john12345]
*/
const getColor = (connection, username) => {
  const uniqueUsername = getUniqueUsername(connection, username);
  return colorMaps[`${uniqueUsername}${connection.socket.remotePort}`];
};

const getOrSetColor = (connection, username, color) => {
  const existingColor = getColor(connection, username);
  if (existingColor) return existingColor;

  setColor(connection, username, color);
  return color;
};

const setColor = (connection, username, color) => {
  const uniqueUsername = getUniqueUsername(connection, username);
  colorMaps[`${uniqueUsername}${connection.socket.remotePort}`] = color;
};

const deleteColor = (connection, username) => {
  const uniqueUsername = getUniqueUsername(connection, username);
  delete colorMaps[`${uniqueUsername}${connection.socket.remotePort}`];
};

/* ------------USER ROOM------------ */
/* 
  A user can be joined to many room, with different uniqueUsername.
  The username you see on the screen is simply a Display Name.
  To know how uniqueUsername is generated, please refer to USERNAME section for more info. 

  [uniqueUsername] = roomName
  if username  = john, remoteAddr = 8.8.8.8, remotePort = 12345
  then the key is = [john8.8.8.812345]
*/
const getUserRoom = (connection, username) => {
  const uniqueUsername = getUniqueUsername(connection, username);
  return userRoomMap[uniqueUsername];
};

const setUserRoom = (connection, username, roomName) => {
  const uniqueUsername = getUniqueUsername(connection, username);
  userRoomMap[uniqueUsername] = roomName;
};

const deleteUserRoom = (connection, username) => {
  const uniqueUsername = getUniqueUsername(connection, username);
  delete userRoomMap[uniqueUsername];
};

module.exports = {
  connections,
  colorMaps,
  usernames,
  userRoomMap,
  chats,
  addConnectionToRoom,
  removeConnectionFromRoom,
  getAllConnectionsOfRoom,
  getUniqueUsername,
  getUsername,
  setUsername,
  getColor,
  getOrSetColor,
  setColor,
  deleteColor,
  getUserRoom,
  setUserRoom,
  deleteUserRoom,
};
