import StaffAssignment from '../models/StaffAssignment.js';

export const getAssignments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.staff_id) filter.staff = req.query.staff_id;
    if (req.query.elderly_id) filter.elderly = req.query.elderly_id;
    const list = await StaffAssignment.find(filter)
      .populate('staff').populate('elderly', 'name room_number')
      .sort({ assignment_date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const assignment = await StaffAssignment.create(req.body);
    const populated = await StaffAssignment.findById(assignment._id).populate('staff').populate('elderly');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await StaffAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('staff').populate('elderly');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await StaffAssignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
