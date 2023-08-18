const form = document.getElementById("registerForm");
const registerBtn = form.lastElementChild;
const registerFail = document.getElementById("registerFail");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const user = {};
  for (const eachKey of data.keys()) {
    user[eachKey] = data.get(eachKey);
  }
  const parsedUser = JSON.stringify(user);
  try {
    const response = await fetch("api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: parsedUser,
    });
    const parsedResponse = await response.json();

    if (response.status == 201) {
      window.location.replace(parsedResponse.redirection);
    }
    if (response.status == 400) {
      registerFail.innerHTML = parsedResponse.message;
    }
    if (response.status == 409) {
      registerFail.innerHTML = parsedResponse.message;
    }
    if (response.status == 500) {
      document.body.innerHTML = "500 internal server error";
    }
  } catch (error) {
    console.log(error);
  }
});
