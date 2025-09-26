const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    if (!title || !dueDate) return res.status(400).json({ message: 'Title and dueDate required' });

    const a = new Assignment({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority
    });
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    // optional query: sort=dueDate or priority, filter=status
    const { sort, status } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;
    let q = Assignment.find(query);
    if (sort === 'dueDate') q = q.sort({ dueDate: 1 });
    if (sort === 'priority') q = q.sort({ 
      // custom priority order: High, Medium, Low -> use map
    });
    // Use aggregation for custom priority sort:
    if (sort === 'priority') {
      q = Assignment.aggregate([
        { $match: { user: req.user._id } },
        { $addFields: { priorityOrder: { $switch: { branches: [
            { case: { $eq: ['$priority', 'High'] }, then: 1 },
            { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
            { case: { $eq: ['$priority', 'Low'] }, then: 3 }
        ], default: 4 } } } },
        { $sort: { priorityOrder: 1, dueDate: 1 } }
      ]);
      const results = await q.exec();
      return res.json(results);
    }

    const assignments = await q.exec();
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const a = await Assignment.findOne({ _id: req.params.id, user: req.user._id });
    if (!a) return res.status(404).json({ message: 'Not found' });
    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const data = req.body;
    const a = await Assignment.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, data, { new: true });
    if (!a) return res.status(404).json({ message: 'Not found' });
    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const a = await Assignment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!a) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
