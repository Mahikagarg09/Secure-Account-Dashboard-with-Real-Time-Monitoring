import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth'
import userRoute from './routes/user'
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app: Application = express();

app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

const PORT: number | string = process.env.PORT || 5500;

app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/user",userRoute)

mongoose.connect(process.env.DB_CONNECT as string)
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log("server connected"));
export { io };


