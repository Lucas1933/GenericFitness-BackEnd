import passport from "passport";
import local from "passport-local";
import userModel from "../dao/mongo/models/userModel.js";
import bcrypt from "bcrypt";
import gitHub from "passport-github2";
const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHub.Strategy;
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
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.e52d7d48b0848df1",
        clientSecret: "dbaf5deeca2347443efdb72f1c745cb2fdda33f0",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async function (accessToken, refreshToken, profile, done) {
        const userEmail = profile._json.email;
        const existingUser = await userModel.findOne({ email: userEmail });
        if (!existingUser) {
          const firstName = profile._json.name;
          const user = {
            firstName,
            lastName: "",
            email: userEmail,
            password: "",
          };
          const insertedUser = await userModel.create(user);
          console.log("inserto usuario");
          return done(null, insertedUser);
        }
        console.log("el usuario ya existe");
        return done(null, existingUser);
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
