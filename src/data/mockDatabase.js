// Mock tables and data
const database = {
    default: {
        customers: [
            { id: 1, name: 'John Doe', email: 'john@example.com', age: 35, region: 'North' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28, region: 'South' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 42, region: 'East' },
            { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 39, region: 'West' },
            { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 31, region: 'North' }
        ],
        products: [
            { id: 1, name: 'Laptop', category: 'Electronics', price: 1200, stock: 45 },
            { id: 2, name: 'Smartphone', category: 'Electronics', price: 800, stock: 75 },
            { id: 3, name: 'Desk Chair', category: 'Furniture', price: 250, stock: 30 },
            { id: 4, name: 'Coffee Maker', category: 'Appliances', price: 120, stock: 50 },
            { id: 5, name: 'Headphones', category: 'Electronics', price: 180, stock: 65 }
        ],
        orders: [
            { id: 1, customerId: 1, date: '2023-01-15', total: 1380, status: 'Delivered' },
            { id: 2, customerId: 2, date: '2023-02-03', total: 800, status: 'Shipped' },
            { id: 3, customerId: 3, date: '2023-02-10', total: 370, status: 'Processing' },
            { id: 4, customerId: 1, date: '2023-03-05', total: 920, status: 'Delivered' },
            { id: 5, customerId: 4, date: '2023-03-15', total: 1200, status: 'Shipped' }
        ]
    },
    financial: {
        transactions: [
            { id: 1, type: 'income', amount: 5000, category: 'Salary', date: '2023-01-01' },
            { id: 2, type: 'expense', amount: 1200, category: 'Rent', date: '2023-01-02' },
            { id: 3, type: 'expense', amount: 200, category: 'Groceries', date: '2023-01-05' },
            { id: 4, type: 'income', amount: 1000, category: 'Freelance', date: '2023-01-10' },
            { id: 5, type: 'expense', amount: 80, category: 'Utilities', date: '2023-01-15' }
        ],
        budget: [
            { id: 1, category: 'Rent', limit: 1500, spent: 1200 },
            { id: 2, category: 'Groceries', limit: 500, spent: 350 },
            { id: 3, category: 'Entertainment', limit: 200, spent: 150 },
            { id: 4, category: 'Utilities', limit: 300, spent: 280 },
            { id: 5, category: 'Transportation', limit: 250, spent: 180 }
        ]
    }
};

// Get all tables in a data source
exports.getTablesInDataSource = (dataSource) => {
    if (!database[dataSource]) {
        return [];
    }

    return Object.keys(database[dataSource]);
};

// Get all entities (table names and column names) in a data source
exports.getEntitiesInDataSource = (dataSource) => {
    if (!database[dataSource]) {
        return [];
    }

    const entities = [];

    entities.push(...Object.keys(database[dataSource]));

    Object.values(database[dataSource]).forEach(table => {
        if (table.length > 0) {
            entities.push(...Object.keys(table[0]));
        }
    });

    return [...new Set(entities)];
};

// Execute a query
exports.executeQuery = (sqlQuery, dataSource) => {
    let results = [];

    try {
        const tableNameMatch = sqlQuery.match(/FROM\s+(\w+)/i);
        if (!tableNameMatch) return results;

        const tableName = tableNameMatch[1];

        if (!database[dataSource] || !database[dataSource][tableName]) {
            return results;
        }

        // Get the data from the table
        results = [...database[dataSource][tableName]];

        // COUNT Queries
        if (sqlQuery.toLowerCase().includes('count(*)')) {
            return [{ count: results.length }];
        }

        // AVG Queries
        if (sqlQuery.toLowerCase().includes('avg(')) {
            const columnMatch = sqlQuery.match(/AVG\((\w+)\)/i);
            if (columnMatch) {
                const column = columnMatch[1];
                const sum = results.reduce((total, row) => total + (row[column] || 0), 0);
                return [{ average: sum / results.length }];
            }
        }

        // MAX Queries
        if (sqlQuery.toLowerCase().includes('max(')) {
            const columnMatch = sqlQuery.match(/MAX\((\w+)\)/i);
            if (columnMatch) {
                const column = columnMatch[1];
                const max = Math.max(...results.map(row => row[column] || 0));
                return [{ maximum: max }];
            }
        }

        // WHERE clauses Queries
        if (sqlQuery.toLowerCase().includes('where')) {
            const whereClauseMatch = sqlQuery.match(/WHERE\s+(\w+)\s*([>=<]+)\s*(.+)$/i);
            if (whereClauseMatch) {
                const [, column, operator, valueStr] = whereClauseMatch;
                let value = valueStr.trim();

                if ((value.startsWith("'") && value.endsWith("'")) ||
                    (value.startsWith('"') && value.endsWith('"'))) {
                    value = value.substring(1, value.length - 1);
                }

                if (!isNaN(value)) {
                    value = parseFloat(value);
                }

                results = results.filter(row => {
                    const columnValue = row[column];

                    switch (operator) {
                        case '=':
                            return columnValue === value;
                        case '>':
                            return columnValue > value;
                        case '<':
                            return columnValue < value;
                        case '>=':
                            return columnValue >= value;
                        case '<=':
                            return columnValue <= value;
                        default:
                            return true;
                    }
                });
            }
        }

        return results.slice(0, 100);
    } catch (error) {
        console.error('Error executing query:', error);
        return [];
    }
};
