import passport from "passport";
import local from "passport-local";
import gitHub from "passport-github2";
import { ExtractJwt, Strategy } from "passport-jwt";
import bcrypt from "bcrypt";

import { cartService, userService } from "../service/index.js";
import { cookieExtractor, hashPassword } from "../utils/utils.js";
import { CONFLICT, UNAUTHORIZED } from "../utils/httpReponses.js";

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
          const dbUser = await userService.getUserByEmail(email);
          if (dbUser) {
            return done(null, false, {
              message: "user email already registered",
              status: CONFLICT,
            });
          }
          const { firstName, lastName } = req.body;
          const hashedPassword = await hashPassword(password);
          const user = {
            firstName,
            lastName,
            email,
            role: "user",
            password: hashedPassword,
          };
          return done(null, user);
        } catch (error) {
          return done(error);
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

          const dbUser = await userService.getUserByEmail(email);
          if (!dbUser) {
            return done(null, false, {
              message: "user credentials incorrect",
              status: UNAUTHORIZED,
            });
          }
          const isValidPassword = await bcrypt.compare(
            password,
            dbUser.password
          );
          if (isValidPassword) {
            return done(null, dbUser);
          }

          return done(null, false, {
            message: "user credentials incorrect",
            status: UNAUTHORIZED,
          });
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
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async function (accessToken, refreshToken, profile, done) {
        const userEmail = profile._json.email;
        const existingUser = await userService.getUserByEmail(userEmail);
        if (!existingUser) {
          const cart = await cartService.createCart();
          const firstName = profile._json.name;
          const user = {
            firstName,
            lastName: "",
            email: userEmail,
            role: "user",
            cart: cart._id,
            password: "",
          };
          const insertedUser = await userService.createUser(user);
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
