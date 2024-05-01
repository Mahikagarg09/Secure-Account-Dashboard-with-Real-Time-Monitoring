import mongoose, { Document, Schema } from "mongoose";

interface IUserOTPVerification extends Document {
  userId: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const UserOTPVerificationSchema: Schema<IUserOTPVerification> = new Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const UserOTPVerification = mongoose.model<IUserOTPVerification>(
  "UserOTPVerification",
  UserOTPVerificationSchema
);

export default UserOTPVerification;
