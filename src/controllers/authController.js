const authService = require('../services/authService');

// Register a new user and generate API key
exports.register = (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Username, email and password are required'
            });
        }

        const userData = authService.registerUser(username, email, password);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                userId: userData.id,
                apiKey: userData.apiKey,
                username: userData.username,
                email: userData.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login user and get JWT token
exports.login = (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Email and password are required'
            });
        }

        const authData = authService.loginUser(email, password);

        if (!authData) {
            return res.status(401).json({
                error: true,
                message: 'Invalid credentials'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token: authData.token,
                apiKey: authData.apiKey,
                userId: authData.id,
                username: authData.username
            }
        });
    } catch (error) {
        next(error);
    }
};