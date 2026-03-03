import mongoose from 'mongoose';

const elderlyMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    room_number: String,
    medical_conditions: String,
    date_admitted: Date,
    family_contact: String,
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.model('ElderlyMember', elderlyMemberSchema);
