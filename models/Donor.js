import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    occupation: { type: String, default: '' },
    organization: { type: String, default: '' },
    total_donations: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Donor', donorSchema);
