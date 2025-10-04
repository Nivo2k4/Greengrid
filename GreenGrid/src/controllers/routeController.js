// In-memory mock data (replace with Firebase later!)
let routes = [
  {
    id: "R1",
    truckName: "Green Collector 1",
    region: "Downtown District",
    days: ["Monday", "Thursday"],
    schedule: [
      { date: "2025-10-06", time: "08:00", area: "Main St" },
      { date: "2025-10-06", time: "09:00", area: "Park Ave" }
    ],
    geoJson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [[80.7, 7.3], [80.72, 7.31], [80.74, 7.335]] },
          properties: { name: "Route Downtown" }
        }
      ]
    }
  }
];

// GET /api/routes
exports.getAllRoutes = (req, res) => {
  res.json(routes);
};

// POST /api/routes
exports.addRoute = (req, res) => {
  const { truckName, region, days, schedule, geoJson } = req.body;
  if (!truckName || !region || !days || !schedule || !geoJson) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newRoute = {
    id: "R" + (routes.length + 1),
    truckName,
    region,
    days,
    schedule,
    geoJson
  };

  routes.push(newRoute);
  res.status(201).json({ message: "Route added successfully", route: newRoute });
};
