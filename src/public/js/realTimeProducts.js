console.log("connected to the router");
const div = document.getElementById("div");
const button = document.getElementById("button");
const clickLogs = document.getElementById("clickLogs");
let counter = 0;
const socket = io();

button.addEventListener("click", () => {
  socket.emit("anEvent", counter);
});

socket.on("divReciver", (data) => {
  console.log(data);
  div.innerHTML = `Clicks= ${data.clicks}`;
  clickLogs.innerHTML += data.id;
  counter = data.clicks;
});
