const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const reportRoutes = require('./src/routes/reportRoutes');
app.use('/api/reports', reportRoutes); 

const routeRoutes = require('./src/routes/routeRoutes');
app.use('/api/routes', routeRoutes);

const notificationRoutes = require('./src/routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

const feedbackRoutes = require('./src/routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

const contactRoutes = require('./src/routes/contactRoutes');
app.use('/api/contact', contactRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
