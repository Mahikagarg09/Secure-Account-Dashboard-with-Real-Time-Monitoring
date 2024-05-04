import mongoose, { Document, Schema } from 'mongoose';

// Define interface for user document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  loginActivities: Array<{
    uniqueId:string,
    status:string,
    device: string;
    timestamp: Date;
  }>;
}

// Define schema for user document
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  loginActivities: [{
    uniqueId:String,
    device: String,
    status:String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Compile model from schema
const User = mongoose.model<IUser>('User', userSchema);

export default User;
