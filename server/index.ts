import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth'

dotenv.config();

const app: Application = express();

app.use(express.json());

const PORT: number | string = process.env.PORT || 5500;

app.use(cors());

app.use("/api/auth", authRoute);

mongoose.connect(process.env.DB_CONNECT as string)
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log("server connected"));
