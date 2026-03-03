import EmergencyNotification from '../models/EmergencyNotification.js';
import Notification from '../models/Notification.js';
import FamilyElderly from '../models/FamilyElderly.js';
import Staff from '../models/Staff.js';

export const getEmergencies = async (req, res) => {
  try {
    const list = await EmergencyNotification.find({})
      .populate('elderly', 'name room_number')
      .populate('staff')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEmergency = async (req, res) => {
  try {
    let staffId = req.body.staff;
    if (req.user.role === 'staff') {
      const staff = await Staff.findOne({ user: req.user._id });
      staffId = staff?._id;
    }
    const emergency = await EmergencyNotification.create({
      elderly: req.body.elderly,
      emergency_type: req.body.emergency_type,
      description: req.body.description,
      action_taken: req.body.action_taken,
      status: req.body.status || 'Reported',
      staff: staffId,
    });
    const families = await FamilyElderly.find({ elderly: req.body.elderly }).distinct('family_user');
    for (const uid of families) {
      await Notification.create({
        user: uid,
        title: 'Emergency Alert',
        message: 'Emergency reported for your family member. Please check immediately.',
        type: 'danger',
      });
    }
    const populated = await EmergencyNotification.findById(emergency._id).populate('elderly').populate('staff');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmergency = async (req, res) => {
  try {
    const emergency = await EmergencyNotification.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('elderly').populate('staff');
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });
    res.json(emergency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
