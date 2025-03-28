const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'query-simulation-secret';

// Verify API key middleware
exports.verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            error: true,
            message: 'API key is required'
        });
    }

    // Validate API key
    const isValid = authService.validateApiKey(apiKey);

    if (!isValid) {
        return res.status(401).json({
            error: true,
            message: 'Invalid API key'
        });
    }

    // Add user to request
    req.user = authService.getUserByApiKey(apiKey);

    next();
};

// Verify JWT token middleware
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: true,
            message: 'Authentication token is required'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId, email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({
            error: true,
            message: 'Invalid token'
        });
    }
};