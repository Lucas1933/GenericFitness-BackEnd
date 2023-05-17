import MessagesManager from "../dao/mongo/managers/messageManager.js";
const mm = new MessagesManager();

const registerChatHandler = (io, socket) => {
  const saveMessage = async (message) => {
    await mm.createMessage(message);
    const messageLogs = await mm.getMessages();
    io.emit("chat:messageLogs", messageLogs);
  };

  const newParticipant = async (user) => {
    socket.broadcast.emit("chat:newConnection", user);
  };

  socket.on("chat:message", saveMessage);
  socket.on("chat:newParticipant", newParticipant);
};

export default registerChatHandler;
