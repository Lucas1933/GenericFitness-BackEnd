const form = document.getElementById("loginForm");
const loginBtn = form.lastElementChild;
const loginStatus = document.getElementById("loginStatus");

async function checkSession() {
  const response = await fetch(`api/sessions/check-session`, {
    method: "GET",
  });
  const parsedResponse = await response.json();
  if (!parsedResponse.isSessionExpired) {
    window.location.replace("/products");
  }
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const user = {};
  for (const eachKey of data.keys()) {
    user[eachKey] = data.get(eachKey);
  }
  const parsedUser = JSON.stringify(user);
  console.log(parsedUser);
  try {
    const response = await fetch(`api/sessions/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: parsedUser,
    });
    const parsedResponse = await response.json();
    console.log(parsedResponse);
    if (response.status == 200) {
      window.location.replace(parsedResponse.redirection);
    } else if (response.status == 401) {
      loginStatus.innerHTML = parsedResponse.error;
    }
  } catch (error) {
    console.log(error);
  }
});
checkSession();
