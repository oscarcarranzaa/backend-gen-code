import Express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import route from "./routes/data.js";
import routerAuth from "./routes/V1/router.auth.js";
import dbConnect from "./utils/mongoose.js";
dbConnect();

const app = Express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(Express.static("public"));
app.use(Express.json());
app.use(cookieParser());
app.use(Express.urlencoded({ extended: true }));
app.use(route);
app.use(routerAuth);
app.listen("4000", () => {
  console.log("http://localhost:4000");
});
