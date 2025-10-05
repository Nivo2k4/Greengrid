// In-memory store (for testing; replace with DB/Firebase later)
let contactMessages = [];

exports.submitContact = (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newMessage = {
    id: "C" + (contactMessages.length + 1),
    name,
    email,
    message,
    submittedAt: new Date().toISOString()
  };
  contactMessages.push(newMessage);
  res.status(201).json({ message: "Contact message received!", contact: newMessage });
};
