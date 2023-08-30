import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import __dirname from "../path.js";
import { ExpiredTokenError } from "../service/error/token_error.js";
export const generateToken = (incomingPayload, expiration) => {
  const token = jwt.sign(incomingPayload, process.env.JWT_KEY, {
    expiresIn: expiration,
  });
  return token;
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};
export const decodeJwtToken = (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenError("the jwt token has expired");
    } else {
      console.log(error);
      throw error;
    }
  }
};
export const generateCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 /*  10 * 1000 */,
  };
  res.cookie("token", token, cookieOptions);
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
