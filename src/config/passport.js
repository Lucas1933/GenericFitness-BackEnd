import passport from "passport";
import local from "passport-local";
import gitHub from "passport-github2";
import { ExtractJwt, Strategy } from "passport-jwt";
import { cookieExtractor } from "../utils.js";
import bcrypt from "bcrypt";
import SessionService from "../service/sessionService.js";
import UserRepository from "../service/repositories/userRepository.js";
const sessionService = new SessionService(new UserRepository());
const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHub.Strategy;
const jwtStrategy = Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor]);
jwtOptions.secretOrKey = "jwtKey";
const passportInit = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName } = req.body;
          const existingUser = await sessionService.getUser(email);
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
            const result = await sessionService.createUser(user);
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

          const existingUser = await sessionService.getUser(email);
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
        const existingUser = await sessionService.getUser(email);
        if (!existingUser) {
          const firstName = profile._json.name;
          const user = {
            firstName,
            lastName: "",
            email: userEmail,
            password: "",
          };
          const insertedUser = await sessionService.createUser(user);
          return done(null, insertedUser);
        } else {
          return done(null, existingUser);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new jwtStrategy(jwtOptions, async (jwtPayload, done) => {
      const user = jwtPayload;
      if (!user) {
        done(null, false, {
          message: "token is not longer valid",
        });
      } else {
        done(null, user);
      }
    })
  );
};

export default passportInit;
