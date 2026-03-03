import MedicalRecord from '../models/MedicalRecord.js';
import { getStaffAssignedElderlyIds } from './elderlyController.js';

export const getMedicalRecords = async (req, res) => {
  try {
    const filter = req.query.elderly_id ? { elderly: req.query.elderly_id } : {};
    // Staff only see medical records for their assigned elderly
    const staffElderlyIds = await getStaffAssignedElderlyIds(req);
    if (staffElderlyIds !== null) {
      if (staffElderlyIds.length === 0) return res.json([]);
      if (req.query.elderly_id && staffElderlyIds.some((id) => id.toString() === req.query.elderly_id)) {
        filter.elderly = req.query.elderly_id;
      } else {
        filter.elderly = { $in: staffElderlyIds };
      }
    }
    const list = await MedicalRecord.find(filter).populate('elderly', 'name').sort({ checkup_date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMedicalRecord = async (req, res) => {
  try {
    if (req.user.role === 'staff') {
      const allowedIds = await getStaffAssignedElderlyIds(req);
      const elderlyId = (req.body.elderly?.toString?.() || req.body.elderly)?.toString?.();
      if (!elderlyId || !allowedIds?.length || !allowedIds.some((id) => id.toString() === elderlyId)) {
        return res.status(403).json({ message: 'You can only add medical records for elderly assigned to you' });
      }
    }
    const record = await MedicalRecord.create(req.body);
    const populated = await MedicalRecord.findById(record._id).populate('elderly');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMedicalRecord = async (req, res) => {
  try {
    const existing = await MedicalRecord.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Record not found' });
    if (req.user.role === 'staff') {
      const allowedIds = await getStaffAssignedElderlyIds(req);
      const elderlyId = (existing.elderly && existing.elderly._id ? existing.elderly._id : existing.elderly)?.toString?.();
      if (!elderlyId || !allowedIds?.length || !allowedIds.some((id) => id.toString() === elderlyId)) {
        return res.status(403).json({ message: 'You can only edit medical records for elderly assigned to you' });
      }
    }
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('elderly');
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMedicalRecord = async (req, res) => {
  try {
    const existing = await MedicalRecord.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Record not found' });
    if (req.user.role === 'staff') {
      const allowedIds = await getStaffAssignedElderlyIds(req);
      const elderlyId = (existing.elderly && existing.elderly._id ? existing.elderly._id : existing.elderly)?.toString?.();
      if (!elderlyId || !allowedIds?.length || !allowedIds.some((id) => id.toString() === elderlyId)) {
        return res.status(403).json({ message: 'You can only delete medical records for elderly assigned to you' });
      }
    }
    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
