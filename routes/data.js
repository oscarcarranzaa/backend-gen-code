import express from "express";
import { Codegenerator } from "../controllers/codegenerator.js";
import { uploadXlsx } from "../controllers/uploadXlsx.js";
import multer from "multer";
import { getXlsx, getAllXlsx, getOneXlsx } from "../controllers/getXlsx.js";
import {
  deleteOneObject,
  editOneObject,
  playObject,
} from "../controllers/dbXlsx.js";

const route = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.post("/codepost", Codegenerator);
route.post("/xlsx", upload.single("file"), uploadXlsx);
route.get("/get-xlsx", getXlsx);
route.get("/get-all-xlsx", getAllXlsx);
route.get("/one-object", getOneXlsx);
route.post("/one-object", editOneObject);
route.delete("/one-object", deleteOneObject);
route.post("/play-object", playObject);
export default route;
