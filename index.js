import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/config.js";
import AuthRouter from "./Routers/loginUserRoute.js";
import userRouter from "./Routers/userRoute,.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Hi welcome to ForgetPassword API");
});

app.use("/api/auth",AuthRouter)
app.use("/api/user",userRouter)
connectDB();

app.listen(process.env.PORT, () => {
  console.log("App is running on the port");
});
