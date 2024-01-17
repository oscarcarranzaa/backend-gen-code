import jwt from "jsonwebtoken";
import { tokenErrors } from "../helpers/handleErrors.js";

export const tokenAuth = (req, res, next) => {
  try {
    const header = req.headers?.authorization;
    if (!header) throw new Error("no header");

    const clientToken = header.split(" ")[1];
    const { uid } = jwt.verify(clientToken, process.env.JWT_SECRET_KEY);
    req.uid = uid;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ error: tokenErrors[error.message] });
  }
};
