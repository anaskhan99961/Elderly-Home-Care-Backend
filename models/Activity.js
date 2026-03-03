import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'ElderlyMember' },
    activity_type: { type: String, enum: ['Meal', 'Medication', 'Exercise', 'Social', 'Therapy'] },
    description: String,
    schedule_time: String,
    schedule_date: Date,
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    status: { type: String, enum: ['Pending', 'Completed', 'Missed'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
