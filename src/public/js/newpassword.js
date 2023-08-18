const form = document.getElementById("restoreForm");
const loadingDiv = document.getElementsByTagName("div")[0];
const mainDiv = document.getElementsByTagName("div")[1];
const restorePasswordBtn = form.lastElementChild;
const restoreStatus = document.getElementById("restoreStatus");
const url = window.location.href;
const segments = url.split("/");
const tokenSegment = segments[segments.length - 1];
const token = tokenSegment;
mainDiv.style.display = "none";

async function verifyToken(token) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8080/api/users/verifytoken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );
    const parsedResponse = await response.json();
    console.log(parsedResponse);
    if (response.status == 200) {
      setTimeout(() => {
        mainDiv.style.display = "block";
        loadingDiv.style.display = "none";
      }, 3000);
    } else {
      loadingDiv.innerHTML = `${parsedResponse.message} redirecting to home...`;
      setTimeout(() => {
        window.location.href = "http://127.0.0.1:8080/";
      }, 3000); // 5000 milliseconds = 5 seconds
    }
  } catch (error) {
    console.log(error);
  }
}
verifyToken(token);
/* logica de envio de contraseña */
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const passwords = {};
  for (const eachKey of data.keys()) {
    passwords[eachKey] = data.get(eachKey);
  }
  const reqBody = JSON.stringify({ token, passwords });
  if (passwords.password !== passwords.repeatPassword) {
    restoreStatus.innerHTML = "Las constraseñas no coinciden";
  } else {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/users/createpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: reqBody,
        }
      );
      const parsedResponse = await response.json();
      if (parsedResponse.status == 200) {
        mainDiv.innerHTML = "Cambio exitoso, redirigiendo al home...";
        setTimeout(() => {
          window.location.href = "http://127.0.0.1:8080/";
        }, 3000); // 5000 milliseconds = 5 seconds
      } else {
        restoreStatus.innerHTML = parsedResponse.message;
      }
    } catch (error) {
      console.log(error);
    }
  }
});
