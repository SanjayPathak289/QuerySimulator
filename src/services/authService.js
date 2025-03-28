const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const users = [];
const JWT_SECRET = 'query-simulation-secret';

// Register a new user
exports.registerUser = (username, email, password) => {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        const error = new Error('User with this email already exists');
        error.statusCode = 409;
        throw error;
    }

    // Generate API key
    const apiKey = crypto.randomBytes(16).toString('hex');

    // Hash password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword,
        apiKey,
        createdAt: new Date()
    };

    users.push(newUser);

    return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        apiKey: newUser.apiKey
    };
};

// Login user
exports.loginUser = (email, password) => {
    // Hash password for comparison
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const user = users.find(u => u.email === email && u.password === hashedPassword);

    if (!user) {
        return null;
    }

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return {
        token,
        id: user.id,
        username: user.username,
        apiKey: user.apiKey
    };
};

// Validate API key
exports.validateApiKey = (apiKey) => {
    const user = users.find(u => u.apiKey === apiKey);
    return !!user;
};

// Get user by API key
exports.getUserByApiKey = (apiKey) => {
    return users.find(u => u.apiKey === apiKey);
};
