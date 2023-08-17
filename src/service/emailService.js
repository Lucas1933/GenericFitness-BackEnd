import nodemailer from "nodemailer";
export default class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_AUTH,
      },
    });
  }
  sendPasswordRestorationEmail(email, link) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperar contraseña",
      text: `Haga click aqui --> ${link} <-- para recuperar su contraseña`,
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.send("success");
      }
    });
  }
}
