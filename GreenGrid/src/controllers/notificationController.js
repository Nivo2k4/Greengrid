// In-memory notifications (replace with DB for production)
let notifications = [
  {
    id: 'N1',
    message: 'Waste truck will arrive in your area tomorrow at 8am!',
    date: '2025-10-06T07:00:00Z',
    type: 'schedule'
  }
];

// GET all notifications
exports.getAllNotifications = (req, res) => {
  res.json(notifications);
};

// POST a new notification
exports.createNotification = (req, res) => {
  const { message, date, type } = req.body;
  if (!message || !date || !type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newNotification = {
    id: 'N' + (notifications.length + 1),
    message,
    date,
    type
  };
  notifications.push(newNotification);
  res.status(201).json({ message: 'Notification created', notification: newNotification });
};
