import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor_name: String,
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
    amount: { type: Number, required: true },
    donation_date: { type: Date, default: Date.now },
    payment_method: String,
    purpose: String,
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
