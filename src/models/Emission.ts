import mongoose, { Schema, Document } from 'mongoose';

export interface IEmission extends Document {
  zone: string;
  lat: number;
  lng: number;
  trafficLevel: number; // 0-100 CO2 equivalent
  energyUsage: number;  // 0-100 CO2 equivalent
  infrastructure: number; // 0-100 CO2 equivalent
  totalEmissions: number; // Sum
  timestamp: Date;
}

const EmissionSchema: Schema = new Schema({
  zone: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  trafficLevel: { type: Number, required: true },
  energyUsage: { type: Number, required: true },
  infrastructure: { type: Number, required: true },
  totalEmissions: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Emission || mongoose.model<IEmission>('Emission', EmissionSchema);
