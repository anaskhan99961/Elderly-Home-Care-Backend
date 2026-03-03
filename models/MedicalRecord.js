import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
  {
    elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'ElderlyMember', required: true },
    checkup_date: Date,
    doctor_name: String,
    diagnosis: String,
    medication: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('MedicalRecord', medicalRecordSchema);
