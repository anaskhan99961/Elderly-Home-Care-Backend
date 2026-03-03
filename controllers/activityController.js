import Activity from '../models/Activity.js';
import FamilyElderly from '../models/FamilyElderly.js';
import { getStaffAssignedElderlyIds } from './elderlyController.js';

const getFamilyLinkedElderlyIds = async (userId) => {
  const links = await FamilyElderly.find({ family_user: userId }).select('elderly');
  return links.map((l) => l.elderly?.toString()).filter(Boolean);
};

export const getActivities = async (req, res) => {
  try {
    const filter = {};
    if (req.query.elderly_id) filter.elderly = req.query.elderly_id;
    if (req.query.staff_id) filter.staff = req.query.staff_id;
    // Staff only see activities for their assigned elderly
    const staffElderlyIds = await getStaffAssignedElderlyIds(req);
    if (staffElderlyIds !== null) {
      if (staffElderlyIds.length === 0) return res.json([]);
      filter.elderly = { $in: staffElderlyIds };
    }
    const list = await Activity.find(filter)
      .populate('elderly', 'name room_number')
      .populate('staff')
      .sort({ schedule_date: -1, schedule_time: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    if (req.user.role === 'family') {
      const allowedIds = await getFamilyLinkedElderlyIds(req.user._id);
      const elderlyId = req.body.elderly?.toString?.() || req.body.elderly;
      if (!elderlyId || !allowedIds.includes(elderlyId)) {
        return res.status(403).json({ message: 'You can only add activities for your linked elderly' });
      }
    }
    if (req.user.role === 'staff') {
      const allowedIds = await getStaffAssignedElderlyIds(req);
      const elderlyId = (req.body.elderly?.toString?.() || req.body.elderly)?.toString?.();
      if (!elderlyId || !allowedIds?.length || !allowedIds.some((id) => id.toString() === elderlyId)) {
        return res.status(403).json({ message: 'You can only add activities for elderly assigned to you' });
      }
    }
    const activity = await Activity.create(req.body);
    const populated = await Activity.findById(activity._id).populate('elderly').populate('staff');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const existing = await Activity.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Activity not found' });
    if (req.user.role === 'family') {
      const allowedIds = await getFamilyLinkedElderlyIds(req.user._id);
      const elderlyId = (existing.elderly && existing.elderly._id ? existing.elderly._id : existing.elderly).toString();
      if (!allowedIds.includes(elderlyId)) {
        return res.status(403).json({ message: 'You can only edit activities for your linked elderly' });
      }
    }
    if (req.user.role === 'staff') {
      const allowedIds = await getStaffAssignedElderlyIds(req);
      const elderlyId = (existing.elderly && existing.elderly._id ? existing.elderly._id : existing.elderly)?.toString?.();
      if (!elderlyId || !allowedIds?.length || !allowedIds.some((id) => id.toString() === elderlyId)) {
        return res.status(403).json({ message: 'You can only edit activities for elderly assigned to you' });
      }
    }
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('elderly').populate('staff');
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (req.user.role === 'family') {
      const allowedIds = await getFamilyLinkedElderlyIds(req.user._id);
      const elderlyId = (activity.elderly && activity.elderly._id ? activity.elderly._id : activity.elderly).toString();
      if (!allowedIds.includes(elderlyId)) {
        return res.status(403).json({ message: 'You can only delete activities for your linked elderly' });
      }
    }
    if (req.user.role === 'staff') {
      const allowedIds = await getStaffAssignedElderlyIds(req);
      const elderlyId = (activity.elderly && activity.elderly._id ? activity.elderly._id : activity.elderly)?.toString?.();
      if (!elderlyId || !allowedIds?.length || !allowedIds.some((id) => id.toString() === elderlyId)) {
        return res.status(403).json({ message: 'You can only delete activities for elderly assigned to you' });
      }
    }
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
