const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { CarfaxAutomator } = require('./main');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Initialize Carfax automator
let automator = null;

// API endpoint to get VIN report
app.post('/api/report', async (req, res) => {
  try {
    const { vin } = req.body;
    
    if (!vin) {
      return res.status(400).json({ error: 'VIN is required' });
    }

    // Initialize automator if not already initialized
    if (!automator) {
      automator = new CarfaxAutomator();
      await automator.initialize();
    }

    const reportPath = await automator.getVinReport(vin);
    const reportHtml = fs.readFileSync(reportPath, 'utf8');

    res.json({ 
      success: true, 
      report: reportHtml,
      reportPath: reportPath
    });
  } catch (error) {
    console.error('Error getting report:', error);
    res.status(500).json({ 
      error: 'Failed to get report',
      details: error.message 
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 