import User from "../../models/User.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import {
  generateUpdateToken,
  generateUserToken,
} from "../../helpers/JWT_generate.js";
import { tokenErrors } from "../../helpers/handleErrors.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.find({});
  // if there no administrator account created by default, this is added
  if (user.length === 0) {
    const defaultEmail = process.env.email;
    const defaultPass = process.env.pass;
    User.create({
      id: nanoid(7),
      email: defaultEmail,
      password: defaultPass,
      rol_code: 1,
      name: "CDM - Admin",
    });
    return res.status(201).json({ response: "Cuenta por defecto creada" });
  }
  // query if it finds a user with the received data
  const searchEmail = await User.findOne({ email });
  if (!searchEmail) {
    return res.status(404).json({
      response:
        "No se encontró la cuenta, revisa que las credenciales sean correctas.",
    });
  }
  // valid password
  const validPass = await searchEmail.comparePass(password);
  if (!validPass) {
    return res.status(404).json({
      response:
        "No se encontró la cuenta, revisa que las credenciales sean correctas.",
    });
  }
  // Generate token JWT
  const { token, expireToken } = generateUserToken(searchEmail.id);
  generateUpdateToken(searchEmail.id, res);
  return res.json({
    token,
    expireToken,
    secure: !(process.env.Mode === "developer"),
  });
};
export const updateToken = (req, res) => {
  try {
    const UPDATE_TOKEN = req.cookies.updateToken;
    if (!UPDATE_TOKEN) throw new Error("unauthorized");

    const { uid } = jwt.verify(UPDATE_TOKEN, process.env.JWT_REFRESH_KEY);
    const { token, expireToken } = generateUserToken(uid);
    return res.json({ token, expireToken });
  } catch (error) {
    return res.status(401).json({ error: tokenErrors[error.message] });
  }
};
export const logout = (req, res) => {
  res.clearCookie("updateToken");
  res.end();
};
