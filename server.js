const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/analyticsdb')
    .then(() => console.log('Analytics DB Connected'))
    .catch(err => console.error(err));

// Schema for Page Views/Clicks analytics
const LogSchema = new mongoose.Schema({
    page: String,
    clicks: Number,
    visitors: Number
});
const AnalyticsLog = mongoose.model('AnalyticsLog', LogSchema);

// REST APIs
// 1. Get dashboard analytics summary
app.get('/api/analytics/dashboard', async (req, res) => {
    const metrics = await AnalyticsLog.find();
    res.json(metrics);
});

// 2. Track new click/interaction event
app.post('/api/analytics/track', async (req, res) => {
    const { page } = req.body;
    await AnalyticsLog.updateOne({ page }, { $inc: { clicks: 1, visitors: 1 } }, { upsert: true });
    res.json({ success: true, message: 'Event logged successfully' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Analytics Server on port ${PORT}`));
