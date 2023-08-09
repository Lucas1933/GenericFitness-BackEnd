import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const generateToken = (user) => {
  const payload = user;
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "24h" /* "10s" */,
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
    console.log("Error decoding JWT token:" /* , error.message, error */);
    return null;
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
