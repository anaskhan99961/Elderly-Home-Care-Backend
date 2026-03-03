import mongoose from 'mongoose';

const staffAssignmentSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'ElderlyMember', required: true },
    assignment_date: Date,
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.model('StaffAssignment', staffAssignmentSchema);
