import passport from "passport";
import local from "passport-local";
import gitHub from "passport-github2";
import { ExtractJwt, Strategy } from "passport-jwt";

import bcrypt from "bcrypt";
import { cartService, sessionService } from "../service/index.js";
import { cookieExtractor } from "../utils.js";

const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHub.Strategy;
const jwtStrategy = Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor]);
jwtOptions.secretOrKey = process.env.JWT_KEY;
const passportInit = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName } = req.body;
          const dbUser = await sessionService.getUser(email);

          if (dbUser) {
            return done(null, false, { message: "email already registered" });
          } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const cart = await cartService.createCart();

            const user = {
              firstName,
              lastName,
              email,
              role: "user",
              cart: cart._id,
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

          const dbUser = await sessionService.getUser(email);
          if (!dbUser) {
            return done(null, false, { message: "user credentials incorrect" });
          } else {
            const isValidPassword = await bcrypt.compare(
              password,
              dbUser.password
            );
            if (isValidPassword) {
              return done(null, dbUser);
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
