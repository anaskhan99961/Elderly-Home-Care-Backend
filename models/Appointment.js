import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    family_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'ElderlyMember', required: true },
    appointment_date: Date,
    appointment_time: String,
    purpose: String,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
