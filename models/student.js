import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leetcodeUsername: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // If needed for authentication
  // You can add 'rank' here if you decide to store rank directly in the database
  // rank: { type: String } // Optional if you want to store it in the DB directly
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
