import mongoose, { Schema, Document } from 'mongoose';

// Destination interface
export interface IDestination {
  place: string;
  activity: string;
  time: string;
  duration: string;
}

// Stay interface
export interface IStay {
  hotelName: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

// Trip interface
export interface ITrip extends Document {
  user: mongoose.Types.ObjectId;
  startLocation: string;
  startDate: string; // keeping as string to match frontend
  endDate: string;
  monitoringStart: string;
  monitoringEnd: string;
  destinations: IDestination[];
  stays: IStay[];
  emergencyContact: string;
}

// Destination schema
const DestinationSchema = new Schema<IDestination>({
  place: { type: String, required: true },
  activity: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
});

// Stay schema
const StaySchema = new Schema<IStay>({
  hotelName: { type: String, required: true },
  address: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
});

// Trip schema
const TripSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startLocation: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    monitoringStart: { type: String, required: true },
    monitoringEnd: { type: String, required: true },
    destinations: { type: [DestinationSchema], default: [] },
    stays: { type: [StaySchema], default: [] },
    emergencyContact: { type: String, required: true },
  },
  { timestamps: true }
);

export const Trip = mongoose.model<ITrip>('Trip', TripSchema);
