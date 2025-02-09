import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import Routes from "./routes/routes.js";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/api", Routes());

const bootstrap = async () => {
  try {
    await connectDB();
    console.log("database connected");
    app.listen(PORT, () => {
      console.log("server is running:", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

bootstrap();
