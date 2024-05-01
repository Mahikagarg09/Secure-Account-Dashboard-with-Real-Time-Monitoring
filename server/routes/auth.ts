import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { TransportOptions } from 'nodemailer';
import User from '../models/User';
import UserOTPVerification from '../models/UserOtpVerification';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log("handle register")
    const { username, email, password }: { username: string, email: string, password: string } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login a user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string, password: string } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Logout a user
export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Implement logout logic as per your requirements
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Enable two-factor authentication
let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  logger: true,
  secureConnection: false,
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string,
  },
  tls: {
    rejectUnauthorized: true,
  },
}as TransportOptions);

// send otp verification email
const sendOTPVerificationEmail = async ({ _id, email }: { _id: string, email: string }, res: Response) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    // mail options
    const mailOptions = {
      from: process.env.EMAIL as string,
      to: email,
      subject: "Verify Your Email",
      html: `<div>
            <h5>Welcome to Oruphones
            <p>Enter the given <b>${otp}</b>in the app to verify your email adress and complete registration process
            <p>This code <b>expires in 1 hour</b></p>
            </div>`
    };
    // hash the otp
    const hashedOTP = await bcrypt.hash(otp, 10);
    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    // save the otp record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "PENDING",
      message: "Verification OTP Email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    const err = error as Error; 
    res.json({
      status: "FAILED",
      message: err.message,
    });
  }
};

// verify otp email
router.post("/verifyOTP", async (req: Request, res: Response) => {
  try {
    let { userId, otp }: { userId: string, otp: string } = req.body;
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
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            // OTP is wrong
            throw new Error("Invalid code. Please check your inbox");
          } else {
            // success
            await User.updateOne({ _id: userId }, { verified: true });
            await UserOTPVerification.deleteMany({ userId });
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
