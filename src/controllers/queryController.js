const queryService = require('../services/queryService');

// Process a natural language query
exports.processQuery = (req, res, next) => {
    try {
        const { query, dataSource } = req.body;

        if (!query) {
            return res.status(400).json({
                error: true,
                message: 'Query text is required'
            });
        }

        const result = queryService.processNaturalLanguageQuery(query, dataSource);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Explain a query
exports.explainQuery = (req, res, next) => {
    try {
        const { query, dataSource } = req.body;

        if (!query) {
            return res.status(400).json({
                error: true,
                message: 'Query text is required'
            });
        }

        const explanation = queryService.explainQuery(query, dataSource);

        res.status(200).json({
            success: true,
            explanation
        });
    } catch (error) {
        next(error);
    }
};

// Validate if a query is feasible
exports.validateQuery = (req, res, next) => {
    try {
        const { query, dataSource } = req.body;

        if (!query) {
            return res.status(400).json({
                error: true,
                message: 'Query text is required'
            });
        }

        const validation = queryService.validateQuery(query, dataSource);

        res.status(200).json({
            success: true,
            isValid: validation.isValid,
            message: validation.message,
            details: validation.details
        });
    } catch (error) {
        next(error);
    }
};