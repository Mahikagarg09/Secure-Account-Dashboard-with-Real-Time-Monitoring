import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app: Application = express();

app.use(express.json());

const PORT: number | string = process.env.PORT || 5500;

const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const corsConfigs: CorsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by Cors"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsConfigs));

const server = http.createServer(app);
const io = new Server(server, {
  transports: ["websocket","polling"],
  maxHttpBufferSize: 1e8, 
  pingTimeout: 60000, 
  cors: { origin: allowedOrigins },
});
require("./routes/socketio")(io);

mongoose
  .connect(process.env.DB_CONNECT as string)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
