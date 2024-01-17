import express from "express";
import { login, logout, updateToken } from "../../controllers/V1/auth.js";
import {
  bodyValidatorLogin,
  validationLogin,
} from "../../middleware/validationLogin.js";

const routerAuth = express.Router();

routerAuth.post(
  "/api/v1/auth/login",
  bodyValidatorLogin,
  validationLogin,
  login
);
routerAuth.get("/api/v1/auth/update", updateToken);
routerAuth.get("/api/v1/auth/logout", logout);

export default routerAuth;
