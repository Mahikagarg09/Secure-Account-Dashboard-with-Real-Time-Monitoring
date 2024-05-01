import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();

app.use(express.json());

const PORT: number | string = process.env.PORT || 5500;

app.use(cors());

mongoose.connect(process.env.DB_CONNECT as string)
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log("server connected"));


// const express= require('express');
// const mongoose=require('mongoose');
// const dotenv= require('dotenv').config();
// const cors=require('cors');
// // const authRoute = require("./routes/auth")
// // const profileRoute = require("./routes/profile")
// // const connectRoute = require("./routes/connect")

// const app=express();

// //use express.json() to gwt data into json format
// app.use(express.json());

// //port
// const PORT=process.env.PORT || 5500;

// //use cors to ensure if port is other than 5500
// app.use(cors());

// //import routes and use routes

// // app.use("/api/auth", authRoute);
// // app.use("/api/profile",profileRoute);
// // app.use("/api/connect",connectRoute);

// //connect to mongodb

// mongoose.connect(process.env.DB_CONNECT)
// .then(()=> console.log("Database connected"))
// .catch(err => console.log(err));

// //add port and connect to server
// app.listen(PORT,() => console.log("server connected"));

