// src/controllers/reportController.js

// Dummy in-memory storage at first:
let reports = [];

// GET /api/reports (list all)
exports.getAllReports = (req, res) => {
  res.json(reports); // Will show all reports submitted
};

// POST /api/reports (submit a new report)
exports.createReport = (req, res) => {
  const {
    issueType,       // 'illegal-dumping', 'missed-pickup', etc.
    location,        // "12 Main St, Colombo" or lat-lng (from frontend)
    description,     // Detailed freeform text
    priority,        // 'critical', 'high', 'medium', 'low'
    contactName,
    contactPhone,
    photos           // Array of image URLs (handle uploading via another API/file service later)
  } = req.body;

  // Basic validation
  if (!issueType || !location || !description || !priority || !contactName || !contactPhone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Generate report object
  const newReport = {
    id: 'EMR_' + Date.now(),        // unique ID
    issueType,
    location,
    description,
    priority,
    contactName,
    contactPhone,
    photos: photos || [],
    status: 'under-review',         // initial status
    timestamp: new Date().toISOString()
  };

  reports.push(newReport);

  res.status(201).json({
    message: 'Report submitted successfully',
    report: newReport
  });
};
