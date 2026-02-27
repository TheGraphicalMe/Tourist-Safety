// import mongoose, { Schema, Document } from 'mongoose';


// export interface IIncident extends Document {
// reportedBy: mongoose.Types.ObjectId;
// type: string;
// description?: string;
// location: {
// lat: number;
// lng: number;
// place?: string;
// };
// status: string;
// }


// const IncidentSchema: Schema = new Schema({
// reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
// type: { type: String, required: true },
// description: { type: String },
// location: {
// lat: { type: Number, required: true },
// lng: { type: Number, required: true },
// place: { type: String }
// },
// status: { type: String, default: 'reported' }
// }, { timestamps: true });


// export const Incident = mongoose.model<IIncident>('Incident', IncidentSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IIncident extends Document {
  reportedBy: mongoose.Types.ObjectId;
  type: string;
  description?: string;
//   location: {
//     lat: number;
//     lng: number;
//     place?: string;
//   };
  status: string;
  details?: Record<string, any>; // For EFIR-specific details
  uploadedFiles?: {
    originalName: string;
    storedName: string;
    path: string;
  }[]; // For uploaded evidence
}

const IncidentSchema: Schema = new Schema(
  {
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    description: { type: String },
    // location: {
    //   lat: { type: Number, required: true },
    //   lng: { type: Number, required: true },
    //   place: { type: String },
    // },
    status: { type: String, default: 'reported' },
    details: { type: Schema.Types.Mixed }, // EFIR-specific details
    uploadedFiles: [
      {
        originalName: { type: String },
        storedName: { type: String },
        path: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Incident = mongoose.model<IIncident>('Incident', IncidentSchema);
