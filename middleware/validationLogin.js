import { validationResult, body } from "express-validator";

export const validationLogin = (req, res, next) => {
  const { email, password } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ response: err.array() });
  }

  next();
};
export const bodyValidatorLogin = [
  body("email", "Email es invalido").trim().isEmail().normalizeEmail(),
  body("password", "Contraseña muy corta").trim().isLength({ min: 4 }),
];
