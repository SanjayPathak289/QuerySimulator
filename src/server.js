const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const queryRoutes = require('./routes/queryRoutes');
const authRoutes = require('./routes/authRoutes');
const { verifyApiKey } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', verifyApiKey, queryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        error: true,
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`
====================================
Query Simulation Engine
====================================
API Endpoints:
- POST /api/query - Process natural language query
- POST /api/explain - Explain query execution
- POST /api/validate - Validate query feasibility
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /health - Health check

All API endpoints require an API key (x-api-key header)
except for auth endpoints and health check.
  `);
});

module.exports = app;