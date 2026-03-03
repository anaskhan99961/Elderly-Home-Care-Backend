import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    relationship: { type: String, default: '' },
    emergency_contact: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('FamilyMember', familyMemberSchema);
