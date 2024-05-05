import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Server as SocketIOServer, Socket } from "socket.io";
import User from "../models/User";
import UserOTPVerification from "../models/UserOtpVerification";
import crypto from "crypto";
import Device from "../models/Device";

dotenv.config();

// Function to generate a unique ID for the device
function generateDeviceUniqueId(userAgent: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(userAgent);
  return hash.digest("hex");
}

module.exports = function (io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    // console.log("A user connected");

    // Register event listeners
    socket.on("register", async (userData: any) => {
      try {
        const { username, email, password } = userData;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          socket.emit("register:error", "User already exists");
          return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const userAgent: string = socket.request.headers["user-agent"] || "";
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
          userId: newUser._id.toString(),
          uniqueId,
        });
        await newDevice.save();

        socket.emit("register:success", "successful registration");
      } catch (error) {
        console.error(error);
        socket.emit("register:error", "Server Error");
      }
    });

    socket.on("login", async (loginData: any) => {
      try {
        const { email, password } = loginData;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          socket.emit("login:error", "User not found");
          return;
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          socket.emit("login:error", "Invalid credentials");
          return;
        }

        sendOTPVerificationEmail(user, socket);
        const userData = {
          id: user._id,
          name: user.username,
          email: user.email,
        };
        socket.emit("login:success", userData);
      } catch (error) {
        console.error(error);
        socket.emit("login:error", "Server Error");
      }
    });

    socket.on("logout", async (logoutData: any) => {
      try {
        const { userId, deviceId } = logoutData;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
          socket.emit("logout:error", "User not found");
          return;
        }

        // Find the device in user's login activities
        const deviceIndex = user.loginActivities.findIndex(
          (activity) => activity.uniqueId === deviceId
        );

        if (deviceIndex === -1) {
          socket.emit("logout:error", "Device not found");
          return;
        }

        // Remove the device from user's login activities
        user.loginActivities.splice(deviceIndex, 1);

        // Save the updated user
        await user.save();

        socket.emit("logout:success", "Logout successful");
      } catch (error) {
        console.error(error);
        socket.emit("logout:error", "Server Error");
      }
    });

    socket.on("verifyOTP", async (otpData: any) => {
      try {
        let { userId, otp } = otpData;
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
              otp = otp.trim();
              const validOTP = await bcrypt.compare(otp, hashedOTP);
              if (!validOTP) {
                // OTP is wrong
                throw new Error("Invalid code. Please check your inbox");
              } else {
                // success
                await User.updateOne({ _id: userId }, { verified: true });
                await UserOTPVerification.deleteMany({ userId });
                const user = await User.findById(userId);

                const userAgent: string =
                  socket.request.headers["user-agent"] || "";
                const uniqueId: string = generateDeviceUniqueId(userAgent);
                const parser = require("ua-parser-js");
                const userAgentData = parser(userAgent);
                const browserType =
                  userAgentData.browser.name || "Unknown Browser";
                const deviceType =
                  userAgentData.device.type || "Unknown Device";
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
                socket.emit("verifyOTP:success", "otp verified");
              }
            }
          }
        }
      } catch (error) {
        const err = error as Error;
        socket.emit("verifyOTP:error", err.message);
      }
    });

    socket.on("getUsers", async () => {
      try {
        const users = await User.find();

        if (!users) {
          socket.emit("getUsers:error", "No users found");
          return;
        }

        socket.emit("getUsers:success", users);
      } catch (error) {
        console.error("Error fetching users:", error);
        socket.emit("getUsers:error", "Internal server error");
      }
    });

    // Event for getting a specific user by ID
    // Modify your Socket.IO server to handle a new event to fetch login activities
    socket.on("getLoginActivitiesByUserId", async (userId) => {
      try {
        const user = await User.findById(userId);

        if (!user) {
          socket.emit("getLoginActivitiesByUserId:error", "User not found");
          return;
        }

        // Emit login activities for the user
        socket.emit("getLoginActivitiesByUserId:success", user.loginActivities);
      } catch (error) {
        console.error("Error fetching login activities:", error);
        socket.emit(
          "getLoginActivitiesByUserId:error",
          "Internal server error"
        );
      }
    });

    // Event for getting device by unique ID
    socket.on("getDeviceByUniqueId", async (uniqueId: string) => {
      try {
        if (!uniqueId) {
          socket.emit("getDeviceByUniqueId:error", "Unique ID is required");
          return;
        }

        // Check if a device with the provided unique ID exists
        const device = await Device.findOne({ uniqueId });

        if (!device) {
          socket.emit("getDeviceByUniqueId:error", "Device not found");
          return;
        }

        socket.emit("getDeviceByUniqueId:success", device);
      } catch (error) {
        console.error("Error fetching devices:", error);
        socket.emit("getDeviceByUniqueId:error", "Internal server error");
      }
    });
  });
};

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
  socket: Socket
): Promise<void> => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    // mail options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<div>
          <h5>Welcome to Oruphones</h5>
          <p>Enter the given <b>${otp}</b> in the app to verify your email adress and complete registration process</p>
          <p>This code <b>expires in 1 hour</b></p>
          </div>`,
    };
    // hash the otp
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
    await transporter.sendMail(mailOptions);
    console.log("Verification OTP Email sent");
  } catch (error) {
    console.error("Failed to send verification email:", error);
    // Don't send response here, just log the error
  }
};
