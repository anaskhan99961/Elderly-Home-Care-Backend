import mongoose from 'mongoose';

const emergencyNotificationSchema = new mongoose.Schema(
  {
    elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'ElderlyMember' },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    emergency_type: String,
    description: String,
    action_taken: String,
    status: { type: String, default: 'Reported' },
  },
  { timestamps: true }
);

export default mongoose.model('EmergencyNotification', emergencyNotificationSchema);
