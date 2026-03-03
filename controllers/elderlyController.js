import ElderlyMember from '../models/ElderlyMember.js';
import Staff from '../models/Staff.js';
import StaffAssignment from '../models/StaffAssignment.js';

export const getElderly = async (req, res) => {
  try {
    const list = await ElderlyMember.find({}).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Returns array of elderly IDs assigned to the logged-in staff, or null if not staff.
 * Used by activities and medical controllers to restrict data to assigned elderly only.
 */
export const getStaffAssignedElderlyIds = async (req) => {
  if (req.user?.role !== 'staff') return null;
  const staffDoc = await Staff.findOne({ user: req.user._id });
  if (!staffDoc) return [];
  const assignments = await StaffAssignment.find({
    staff: staffDoc._id,
    status: 'Active',
  }).select('elderly');
  return assignments.map((a) => a.elderly).filter(Boolean);
};

/** Returns only elderly assigned to the logged-in staff (for staff portal). */
export const getAssignedElderly = async (req, res) => {
  try {
    const staffDoc = await Staff.findOne({ user: req.user._id });
    if (!staffDoc) {
      return res.json([]);
    }
    const assignments = await StaffAssignment.find({
      staff: staffDoc._id,
      status: 'Active',
    }).select('elderly');
    const elderlyIds = assignments.map((a) => a.elderly).filter(Boolean);
    if (elderlyIds.length === 0) {
      return res.json([]);
    }
    const list = await ElderlyMember.find({ _id: { $in: elderlyIds } }).sort({
      createdAt: -1,
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOneElderly = async (req, res) => {
  try {
    const elderly = await ElderlyMember.findById(req.params.id);
    if (!elderly) return res.status(404).json({ message: 'Elderly not found' });
    res.json(elderly);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createElderly = async (req, res) => {
  try {
    const elderly = await ElderlyMember.create(req.body);
    res.status(201).json(elderly);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateElderly = async (req, res) => {
  try {
    const elderly = await ElderlyMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!elderly) return res.status(404).json({ message: 'Elderly not found' });
    res.json(elderly);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteElderly = async (req, res) => {
  try {
    const elderly = await ElderlyMember.findByIdAndDelete(req.params.id);
    if (!elderly) return res.status(404).json({ message: 'Elderly not found' });
    res.json({ message: 'Elderly deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
