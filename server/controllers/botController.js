const Assignment = require('../models/Assignment');

function daysBetween(a, b) {
  return Math.ceil((new Date(b) - new Date(a)) / (1000*60*60*24));
}

exports.getTip = async (req, res) => {
  try {
    // Analyze upcoming assignments in next n days (default 14)
    const daysWindow = parseInt(req.query.days) || 14;
    const now = new Date();
    const windowEnd = new Date(); windowEnd.setDate(now.getDate() + daysWindow);

    const items = await Assignment.find({
      user: req.user._id,
      dueDate: { $gte: now, $lte: windowEnd },
      status: 'Pending'
    });

    const total = items.length;
    const highCount = items.filter(i => i.priority === 'High').length;
    const soonCount = items.filter(i => daysBetween(now, i.dueDate) <= 3).length;

    // Compose tips using simple rules:
    const tips = [];

    if (total === 0) tips.push('Nice! You have no upcoming assignments in the next ' + daysWindow + ' days. Keep a steady routine!');
    if (total > 0) {
      tips.push(`You have ${total} upcoming assignment(s) in the next ${daysWindow} days.`);
      if (soonCount > 0) tips.push(`🔔 ${soonCount} assignment(s) are due within 3 days — prioritize them.`);
      if (highCount > 0) tips.push(`⚠️ ${highCount} high-priority assignment(s). Tackle hardest/highest-impact ones first.`);
      if (total > 3) tips.push('Break tasks into 25–50 minute focused sessions (Pomodoro). Schedule small milestones for each assignment.');
      if (soonCount === 0 && highCount === 0 && total <= 3) tips.push('Good spacing — schedule specific times across the week and start today.');
      tips.push('Try: set 2–3 micro-goals per assignment and reserve buffer time before the deadline.');
    }

    // return as array or joined string
    res.json({ tips, summary: { total, highCount, soonCount }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
