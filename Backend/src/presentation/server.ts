import express, { Application } from "express";
import connectDb from "../infrastructure/database/connection";

const app: Application = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
  connectDb();
});
