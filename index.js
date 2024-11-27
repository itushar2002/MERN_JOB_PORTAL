import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
dotenv.config({});

const app = express();

// Testing Route
/* app.get("/", (req, res) => {
  return res.status(202).json({
    message: "I am coming from backend ",
    sucess: true,
  });
}); */

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server listening on ${PORT}`);
});
