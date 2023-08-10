const form = document.getElementById("loginForm");
const loginBtn = form.lastElementChild;
const loginStatus = document.getElementById("loginStatus");
const tokenBtn = document.getElementById("token");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const user = {};
  for (const eachKey of data.keys()) {
    user[eachKey] = data.get(eachKey);
  }
  const parsedUser = JSON.stringify(user);
  try {
    const response = await fetch(`api/sessions/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: parsedUser,
    });
    const parsedResponse = await response.json();
    if (response.status == 200) {
      window.location.replace(parsedResponse.redirect);
    }

    if (response.status == 401) {
      loginStatus.innerHTML = parsedResponse.message;
    }
  } catch (error) {
    console.log(error);
  }
});
