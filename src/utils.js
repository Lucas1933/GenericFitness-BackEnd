import { fileURLToPath } from "url";
import { dirname } from "path";
import jwt from "jsonwebtoken";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateToken = (user) => {
  const payload = user;
  const token = jwt.sign(payload, "jwtKey", {
    expiresIn: /* "24h" */ "10s",
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
    console.error("Error decoding JWT token:", error.message);
    return null;
  }
};
export const generateCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    maxAge: /* 24 * 60 * 60 * 1000 */ 10 * 1000,
  };
  res.cookie("token", token, cookieOptions);
};

export const urlPrivilige = (url) => {
  const urls = {
    "/": "public",
    "/register": "public",
    "/products": "private",
  };
  return urls[url];
};
export default __dirname;
