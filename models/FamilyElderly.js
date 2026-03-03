import mongoose from 'mongoose';

const familyElderlySchema = new mongoose.Schema(
  {
    family_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'ElderlyMember', required: true },
    relationship: String,
    verified: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('FamilyElderly', familyElderlySchema);
