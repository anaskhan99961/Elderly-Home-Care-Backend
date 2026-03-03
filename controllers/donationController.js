import Donation from '../models/Donation.js';
import Donor from '../models/Donor.js';

export const getDonations = async (req, res) => {
  try {
    const list = await Donation.find({}).populate('donor').sort({ donation_date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDonation = async (req, res) => {
  try {
    const { donor_name, amount, payment_method, purpose, donor } = req.body;
    const donation = await Donation.create({
      donor_name: donor_name || req.user?.name,
      donor,
      amount,
      donation_date: req.body.donation_date || new Date(),
      payment_method,
      purpose,
    });
    if (donor) {
      await Donor.findByIdAndUpdate(donor, { $inc: { total_donations: amount } });
    }
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id });
    if (!donor) return res.json([]);
    const list = await Donation.find({ donor: donor._id }).sort({ donation_date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
