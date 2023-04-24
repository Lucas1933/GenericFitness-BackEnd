console.log("connected to the router");
const socket = io();
const input = document.getElementById("textBox");
const logs = document.getElementById("logs");
input.addEventListener("keyup", (event) => {
  let { key } = event;
  if (key === "Enter") {
    socket.emit("message", input.value);
    input.value = "";
  }
});

socket.on("logs", (data) => {
  let messagesLogs = "";
  data.forEach((log) => {
    messagesLogs += `${log.id} dice: ${log.message} <br/>`;
  });
  logs.innerHTML = messagesLogs;
});
