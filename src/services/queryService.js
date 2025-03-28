const mockDatabase = require('../data/mockDatabase');

// Process a natural language query
exports.processNaturalLanguageQuery = (query, dataSource = 'default') => {

    // Convert natural language -> pseudo-SQL
    const sqlQuery = this.naturalLanguageToSQL(query);

    // Execute the query
    const results = mockDatabase.executeQuery(sqlQuery, dataSource);

    return {
        originalQuery: query,
        sqlTranslation: sqlQuery,
        results: results,
        executionTime: Math.random() * 1000,
        rowsProcessed: results.length,
    };
};

// Explain Query
exports.explainQuery = (query, dataSource = 'default') => {
    const sqlQuery = this.naturalLanguageToSQL(query);
    const tables = mockDatabase.getTablesInDataSource(dataSource);

    const queryPlan = [
        { step: 1, operation: 'Parse natural language', details: 'Convert user query to semantic representation' },
        { step: 2, operation: 'Entity recognition', details: `Identified entities in: "${query}"` },
        { step: 3, operation: 'SQL generation', details: `Converted to: "${sqlQuery}"` },
        { step: 4, operation: 'Query execution', details: `Executing against tables: ${tables.join(', ')}` },
    ];

    return {
        originalQuery: query,
        sqlTranslation: sqlQuery,
        queryPlan: queryPlan,
        estimatedCost: Math.floor(Math.random() * 100),
        potentialOptimizations: [
            'Add index on frequently queried columns',
            'Consider caching results for similar queries'
        ]
    };
};

// Validate if a query can be executed
exports.validateQuery = (query, dataSource = 'default') => {
    const sqlQuery = this.naturalLanguageToSQL(query);
    const tables = mockDatabase.getTablesInDataSource(dataSource);

    // Simple validation rules
    const containsProhibitedWords = /drop|delete|update|insert|alter/i.test(query.toLowerCase());
    const isTooComplex = query.split(' ').length > 20;
    const hasUnknownEntities = !this.checkEntitiesExist(query, dataSource);

    const isValid = !containsProhibitedWords && !isTooComplex && !hasUnknownEntities;

    return {
        isValid,
        message: isValid ? 'Query is valid and can be executed' : 'Query has validation issues',
        details: {
            containsProhibitedWords,
            isTooComplex,
            hasUnknownEntities,
            availableTables: tables
        }
    };
};

// Helper function to convert natural language to SQL
exports.naturalLanguageToSQL = (query) => {
    let sqlQuery = 'SELECT * FROM ';

    // Check for different query patterns
    if (query.toLowerCase().includes('how many')) {
        sqlQuery = 'SELECT COUNT(*) FROM ';
    } else if (query.toLowerCase().includes('average') || query.toLowerCase().includes('avg')) {
        sqlQuery = 'SELECT AVG(value) FROM ';
    } else if (query.toLowerCase().includes('maximum') || query.toLowerCase().includes('max')) {
        sqlQuery = 'SELECT MAX(value) FROM ';
    }

    // Determine table from query
    if (query.toLowerCase().includes('customer')) {
        sqlQuery += 'customers';
    } else if (query.toLowerCase().includes('order')) {
        sqlQuery += 'orders';
    } else if (query.toLowerCase().includes('product')) {
        sqlQuery += 'products';
    } else {
        sqlQuery += 'data';
    }

    // Add simple WHERE clause if specific filters mentioned
    if (query.toLowerCase().includes('where')) {
        sqlQuery += ' WHERE ';

        // Extract conditions after "where"
        const whereCondition = query.toLowerCase().split('where')[1].trim();

        sqlQuery += whereCondition.replace('is', '=').replace('greater than', '>').replace('less than', '<');
    }

    return sqlQuery;
};

// Check if entities in query exist in our mock database
exports.checkEntitiesExist = (query, dataSource) => {
    const entities = mockDatabase.getEntitiesInDataSource(dataSource);

    return entities.some(entity => query.toLowerCase().includes(entity.toLowerCase()));
};