import mongoose, { Schema, Document } from 'mongoose';

// Define interface for the Device schema
interface IDevice extends Document {
  userId: string;
  uniqueId: string;
}

// Define the schema for the Device model
const DeviceSchema: Schema = new Schema({
  userId: { type: String, required: true },
  uniqueId: { type: String, required: true },
});

// Create and export the Device model
const Device = mongoose.model<IDevice>('Device', DeviceSchema);
export default Device;
