const form = document.getElementById("restorationForm");
const sendEmailBtn = form.lastElementChild;
const emailFail = document.getElementById("emailFail");
const div = document.getElementsByTagName("div");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const email = data.get("email");
  try {
    const response = await fetch(`api/sessions/restorepassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    console.log(response);
    const parsedResponse = await response.json();
    if (response.status == 200) {
      div[0].innerHTML =
        "El email fue enviado correctamente, revisa tu casilla de correo para continuar con el proceso";
    } else {
      emailFail.innerHTML = parsedResponse.message;
    }
  } catch (error) {
    console.log(error);
  }
});
