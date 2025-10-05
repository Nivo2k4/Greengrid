let feedback = [
  {
    id: 'F1',
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Great service!',
    date: '2025-10-05'
  }
];

exports.getAllFeedback = (req, res) => {
  res.json(feedback);
};

exports.createFeedback = (req, res) => {
  const { name, rating, comment, date } = req.body;
  if (!name || !rating || !comment || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newFeedback = { id: 'F' + (feedback.length + 1), name, rating, comment, date };
  feedback.push(newFeedback);
  res.status(201).json({ message: 'Feedback submitted', feedback: newFeedback });
};
