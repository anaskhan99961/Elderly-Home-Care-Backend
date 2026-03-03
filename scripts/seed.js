import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import ElderlyMember from '../models/ElderlyMember.js';
import Staff from '../models/Staff.js';
import Donor from '../models/Donor.js';
import FamilyMember from '../models/FamilyMember.js';
import FamilyElderly from '../models/FamilyElderly.js';
import Activity from '../models/Activity.js';
import Appointment from '../models/Appointment.js';
import Donation from '../models/Donation.js';
import MedicalRecord from '../models/MedicalRecord.js';
import EmergencyNotification from '../models/EmergencyNotification.js';
import Notification from '../models/Notification.js';
import StaffAssignment from '../models/StaffAssignment.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elderlyhomecare';

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: 'elderlyhomecare' });
  await Promise.all([
    User.deleteMany({}),
    ElderlyMember.deleteMany({}),
    Staff.deleteMany({}),
    Donor.deleteMany({}),
    FamilyMember.deleteMany({}),
    FamilyElderly.deleteMany({}),
    Activity.deleteMany({}),
    Appointment.deleteMany({}),
    Donation.deleteMany({}),
    MedicalRecord.deleteMany({}),
    EmergencyNotification.deleteMany({}),
    Notification.deleteMany({}),
    StaffAssignment.deleteMany({}),
  ]);

  const admin = await User.create({ name: 'Admin User', email: 'admin@gmail.com', password: 'admin', role: 'admin', phone: '03001234567' });
  const staff1 = await User.create({ name: 'Dr Nimra', email: 'nimra@gmail.com', password: 'Nimra12', role: 'staff', phone: '03124532891', address: 'Gulberg Town' });
  const staff2 = await User.create({ name: 'Dr Ali', email: 'ali@gmail.com', password: 'Ali123', role: 'staff', phone: '03114532891', address: 'Bahria Town' });
  const staff3 = await User.create({ name: 'Anees', email: 'anees@gmail.com', password: 'anees123', role: 'staff', phone: '03124532814', address: 'Bilal Homes Garden West Lahore' });
  const donor1 = await User.create({ name: 'Abdul Rehman', email: 'abdul@gmail.com', password: 'abdul12', role: 'donor', phone: '03124532891', address: 'Saima Town City' });
  const donor2 = await User.create({ name: 'Muhammad Hamza', email: 'hamza@gmail.com', password: 'hamza', role: 'donor', phone: '0315456781', address: 'RJ Mall Center' });
  const family1 = await User.create({ name: 'Saleem Iqbal', email: 'saleem12@gmail.com', password: 'Saleem12', role: 'family', phone: '03154561890', address: 'Bahria Town, Karachi' });

  const s1 = await Staff.create({ user: staff1._id, designation: 'Medical staff', shift: 'Evening', salary: 50000 });
  const s2 = await Staff.create({ user: staff2._id, designation: 'Medical staff', shift: 'Morning', salary: 60000 });
  const s3 = await Staff.create({ user: staff3._id, designation: 'Manager', shift: 'Evening', salary: 65000 });
  const d1 = await Donor.create({ user: donor1._id, total_donations: 500 });
  await Donor.create({ user: donor2._id, total_donations: 0 });
  const fm1 = await FamilyMember.create({ user: family1._id, emergency_contact: '03154561890' });

  const e1 = await ElderlyMember.create({ name: 'Faiz Saleem', age: 52, gender: 'Male', room_number: 'Room 101', medical_conditions: 'High Blood Pressure', date_admitted: new Date('2025-12-22'), family_contact: 'Son: Bilal\nPhone: 03312420131', status: 'Active' });
  const e2 = await ElderlyMember.create({ name: 'Mrs Hafsa', age: 51, gender: 'Female', room_number: 'Room 201', medical_conditions: 'Please Take Care', date_admitted: new Date('2026-01-07'), family_contact: '03413209212', status: 'Active' });
  const e3 = await ElderlyMember.create({ name: 'Mr Ahmad', age: 50, gender: 'Male', room_number: 'Room 201', medical_conditions: 'Serious', date_admitted: new Date('2026-01-06'), family_contact: 'haris@gmail.com', status: 'Active' });
  const e4 = await ElderlyMember.create({ name: 'Omar Bin Bilal', age: 60, gender: 'Male', room_number: 'Room 401', medical_conditions: 'Please take care', date_admitted: new Date('2026-01-07'), family_contact: 'Bilal@gmail.com', status: 'Active' });

  await FamilyElderly.create([{ family_user: family1._id, elderly: e2._id, relationship: 'Grandmother', verified: 'Pending' }, { family_user: family1._id, elderly: e3._id, relationship: 'Uncle', verified: 'Pending' }, { family_user: family1._id, elderly: e4._id, relationship: 'Grandfather', verified: 'Approved' }]);

  await Activity.create([
    { elderly: e1._id, activity_type: 'Medication', schedule_time: '08:00', schedule_date: new Date(), staff: s2._id, status: 'Completed' },
    { elderly: e4._id, activity_type: 'Exercise', schedule_time: '08:00', schedule_date: new Date(), staff: s1._id, status: 'Pending' },
  ]);
  await Appointment.create({ family_user: family1._id, elderly: e4._id, appointment_date: new Date(), appointment_time: '15:00', purpose: 'Medical Consultation', status: 'Pending' });
  await Donation.create([{ donor_name: 'Abdul Rehman', donor: d1._id, amount: 1000, donation_date: new Date('2025-12-24'), payment_method: 'cash', purpose: 'Medication' }, { donor_name: 'Muhammad Hamza', amount: 500, payment_method: 'cash', purpose: 'Meals for elders' }]);
  await MedicalRecord.create([{ elderly: e4._id, checkup_date: new Date(), doctor_name: 'Anees', diagnosis: 'Need Medical Treatment', medication: 'Blood Test Required', notes: 'Urgent' }]);
  await EmergencyNotification.create({ elderly: e1._id, staff: s2._id, emergency_type: 'Medical Emergency', description: 'Urgent Medical Emergency Needed', action_taken: 'Admit in Hospital', status: 'Reported' });
  await StaffAssignment.create([{ staff: s2._id, elderly: e1._id, assignment_date: new Date(), status: 'Active' }, { staff: s3._id, elderly: e4._id, assignment_date: new Date(), status: 'Active' }]);
  await Notification.create({ user: admin._id, title: 'Welcome', message: 'Elderly Home Care system is ready.', type: 'success', is_read: false });

  console.log('Seed completed.');
  process.exit(0);
}
seed().catch((e) => { console.error(e); process.exit(1); });
