import FamilyElderly from '../models/FamilyElderly.js';
import ElderlyMember from '../models/ElderlyMember.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getMyElderly = async (req, res) => {
  try {
    const links = await FamilyElderly.find({ family_user: req.user._id })
      .populate('elderly')
      .sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const linkElderly = async (req, res) => {
  try {
    const { elderly, relationship } = req.body;
    const link = await FamilyElderly.create({
      family_user: req.user._id,
      elderly,
      relationship: relationship || '',
      verified: 'Pending',
    });
    const admins = await User.find({ role: 'admin' }).select('_id');
    const notificationPayload = {
      title: 'Family–Elderly verification requested',
      message: `A family member has linked an elderly person. Please review and approve in Verification Requests.`,
      type: 'warning',
    };
    await Promise.all(admins.map((a) => Notification.create({ user: a._id, ...notificationPayload })));
    const populated = await FamilyElderly.findById(link._id).populate('elderly');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addElderlyAsFamily = async (req, res) => {
  try {
    const elderly = await ElderlyMember.create(req.body);
    const link = await FamilyElderly.create({
      family_user: req.user._id,
      elderly: elderly._id,
      relationship: req.body.relationship || '',
      verified: 'Pending',
    });
    const admins = await User.find({ role: 'admin' }).select('_id');
    const notificationPayload = {
      title: 'New elderly added – verification requested',
      message: `Family member added elderly "${elderly.name}". Relationship: ${req.body.relationship || 'N/A'}. Please approve in Verification Requests.`,
      type: 'warning',
    };
    await Promise.all(admins.map((a) => Notification.create({ user: a._id, ...notificationPayload })));
    const populated = await FamilyElderly.findById(link._id).populate('elderly');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLink = async (req, res) => {
  try {
    const link = await FamilyElderly.findOne({ _id: req.params.id, family_user: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    if (req.body.relationship !== undefined) link.relationship = req.body.relationship;
    await link.save();
    const populated = await FamilyElderly.findById(link._id).populate('elderly');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const link = await FamilyElderly.findOneAndDelete({ _id: req.params.id, family_user: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json({ message: 'Link removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
