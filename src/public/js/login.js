const form = document.getElementById("loginForm");
const loginBtn = form.lastElementChild;
const loginStatus = document.getElementById("loginStatus");

async function checkSession() {
  const result = await fetch(`/sessions/check-session`, {
    method: "GET",
  });
  const parsedResult = await result.json();
  if (!parsedResult.isSessionExpired) {
    window.location.replace("/products");
  }
}
checkSession();
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const user = {};
  for (const eachKey of data.keys()) {
    user[eachKey] = data.get(eachKey);
  }
  const result = await fetch(`/sessions/login/${user.email}/${user.password}`, {
    method: "GET",
  });
  const parsedResult = await result.json();
  if (parsedResult.payload.userIsValid) {
    window.location.replace("/products");
  } else {
    loginStatus.innerHTML = "Correo o contraseña invalidos";
  }
});
