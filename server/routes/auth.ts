import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { TransportOptions } from "nodemailer";
import User from "../models/User";
import UserOTPVerification from "../models/UserOtpVerification";
import crypto from "crypto";
import Device from "../models/Device";
dotenv.config();
const router = express.Router();

// Function to generate a unique ID for the device
function generateDeviceUniqueId(userAgent: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(userAgent);
  return hash.digest("hex");
}

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    // const newUser = new User({ username, email, password: hashedPassword });
    const userAgent: string = req.get("User-Agent") || "";
    const uniqueId: string = generateDeviceUniqueId(userAgent);
    const parser = require("ua-parser-js");
    const userAgentData = parser(userAgent);
    const browserType = userAgentData.browser.name || "Unknown Browser";
    const deviceType = userAgentData.device.type || "Unknown Device";
    const deviceInfo = `${browserType},${deviceType}`;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      loginActivities: [
        {
          uniqueId: uniqueId,
          device: deviceInfo,
          status: "logged in",
          timestamp: new Date(),
        },
      ],
    });
    await newUser.save();
    const newDevice = new Device({
      userId: newUser._id.toString(), // Assuming newUser is the newly registered user
      uniqueId,
    });
    await newDevice.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Login a user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendOTPVerificationEmail(user, res);
    const userData = {
      id: user._id,
      name: user.username,
      email: user.email,
    };
    res.status(200).json(userData);
    // Generate JWT token
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Logout a user
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // Assuming you have middleware to extract user ID from the request
    const deviceId = req.body.deviceId; // Assuming you're sending device ID in the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the device in user's login activities
    const deviceIndex = user.loginActivities.findIndex(
      (activity) => activity.uniqueId === deviceId
    );

    if (deviceIndex === -1) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Remove the device from user's login activities
    user.loginActivities.splice(deviceIndex, 1);
    
    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string,
  },
});

const sendOTPVerificationEmail = async (
  { _id, email }: { _id: string; email: string },
  res: Response
): Promise<void> => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    // mail options
    console.log(_id);
    console.log(email);
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<div>
          <h5>Welcome to Oruphones
          <p>Enter the given <b>${otp}</b> in the app to verify your email adress and complete registration process
          <p>This code <b>expires in 1 hour</b></p>
          </div>`,
    };
    // hash the otp
    console.log("before hashing", otp);
    const hashedOTP = await bcrypt.hash(otp, 10);
    const currentTimestamp = Date.now();
    const oneHourLaterTimestamp = currentTimestamp + 3600000; // Adding one hour (3600000 milliseconds) to the current time

    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: currentTimestamp,
      expiresAt: oneHourLaterTimestamp,
    });
    // save the otp record
    await newOTPVerification.save();
    console.log("its saved");
    await transporter.sendMail(mailOptions);
    console.log("sent");
    console.log("Verification OTP Email sent");
  } catch (error) {
    console.error("Failed to send verification email:", error);
    // Don't send response here, just log the error
  }
};

// verify otp email
router.post("/verifyOTP", async (req: Request, res: Response) => {
  try {
    let { userId, otp }: { userId: string; otp: string } = req.body;
    if (!userId || !otp) {
      throw Error("OTP Details are not found");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        // no records found
        throw new Error(
          "Account record does not found or has been verified already. Please signup or login"
        );
      } else {
        // user otp record exist
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;
        if (expiresAt.getTime() < Date.now()) {
          // user otp has been expired
          await UserOTPVerification.deleteMany({ userId });
          throw new Error("Code has expired, please request again ");
        } else {
          console.log("Received OTP:", otp);
          console.log("Hashed OTP from DB:", hashedOTP);
          otp = otp.trim();
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          console.log("Valid OTP:", validOTP);
          if (!validOTP) {
            // OTP is wrong
            throw new Error("Invalid code. Please check your inbox");
          } else {
            // success
            await User.updateOne({ _id: userId }, { verified: true });
            await UserOTPVerification.deleteMany({ userId });
            const user = await User.findById(userId);

            const userAgent: string = req.get("User-Agent") || "";
            const uniqueId: string = generateDeviceUniqueId(userAgent);
            const parser = require("ua-parser-js");
            const userAgentData = parser(userAgent);
            const browserType = userAgentData.browser.name || "Unknown Browser";
            const deviceType = userAgentData.device.type || "Unknown Device";
            const deviceInfo = `${browserType},${deviceType}`;

            if (user) {
              // Check if the device already exists in login activities
              const existingDevice = user.loginActivities.find(
                (activity) => activity.uniqueId === deviceInfo
              );

              if (existingDevice) {
                // Update the existing device's status and timestamp
                existingDevice.status = "Logged in";
                existingDevice.timestamp = new Date();
              } else {
                // Add a new login activity for the device
                user.loginActivities.push({
                  uniqueId: uniqueId,
                  device: deviceInfo, // You can store additional device information if needed
                  status: "Logged in",
                  timestamp: new Date(),
                });
              }
              // Save the updated user
              await user.save();
              const newDevice = new Device({
                userId: userId, 
                uniqueId,
              });
              await newDevice.save();
            }
            res.json({
              status: "VERIFIED",
              message: "User Email verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    const err = error as Error;
    res.json({
      status: "FAILED",
      message: err.message,
    });
  }
});

export default router;
