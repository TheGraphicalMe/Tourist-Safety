import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  role: 'tourist' | 'admin';
  idProof?: {
    type: 'Aadhaar' | 'Passport' | 'License';
    number: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    role: { type: String, enum: ['tourist', 'admin'], default: 'tourist' },
    idProof: {
      type: {
        type: String,
        enum: ['Aadhaar', 'Passport', 'License'],
      },
      number: { type: String },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
