const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['High','Medium','Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending','Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
