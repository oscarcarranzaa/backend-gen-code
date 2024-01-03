import Express from "express";
import cors from "cors";
import route from "./routes/data.js";

const app = Express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(Express.static("public"));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(route);
app.listen("4000", () => {
  console.log("http://localhost:4000");
});
