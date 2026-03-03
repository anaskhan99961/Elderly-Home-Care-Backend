import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    designation: { type: String, default: 'Staff Member' },
    shift: { type: String, enum: ['Morning', 'Evening', 'Night'], default: 'Morning' },
    salary: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Staff', staffSchema);
