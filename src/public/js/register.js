const form = document.getElementById("registerForm");
const registerBtn = form.lastElementChild;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const user = {};
  for (const eachKey of data.keys()) {
    user[eachKey] = data.get(eachKey);
  }
  const parsedUser = JSON.stringify(user);
  const result = await fetch("/sessions/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: parsedUser,
  });

  window.location.replace("/");
});
