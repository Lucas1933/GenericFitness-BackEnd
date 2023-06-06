import passport from "passport";
import local from "passport-local";
import userModel from "../dao/mongo/models/userModel.js";
import bcrypt from "bcrypt";
const LocalStrategy = local.Strategy;
const passportInit = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName } = req.body;
          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: "el usuario ya existe" });
          } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = {
              firstName,
              lastName,
              email,
              password: hashedPassword,
            };
            const result = await userModel.create(user);

            return done(null, result);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          if (email == "admin@correo.com" && password == "admin") {
            const admin = {
              role: "admin",
              firstName: "admin",
              id: 0,
            };
            return done(null, admin);
          }
          const existingUser = await userModel.findOne({ email });
          if (!existingUser) {
            return done(null, false, { message: "user credentials incorrect" });
          } else {
            const result = await bcrypt.compare(
              password,
              existingUser.password
            );
            if (result) {
              return done(null, existingUser);
            } else {
              return done(null, false, {
                message: "user credentials incorrect",
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });
  passport.deserializeUser(async function (id, done) {
    if (id === 0) {
      return done(null, {
        role: "admin",
        name: "ADMIN",
      });
    }
    const user = await userModel.findOne({ _id: id });
    return done(null, user);
  });
};
export default passportInit;
