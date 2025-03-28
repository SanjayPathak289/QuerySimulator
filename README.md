# Query Simulation Engine

## Features

- Natural language to pseudo-SQL conversion
- Query validation and explanation
- Mock database with sample data
- API key authentication
- Simple in-memory storage

## API Url

   `https://querysimulator.onrender.com`
   Render sleeps the Url if there is no activity after 30 minutes. If user hit the api url during inactivity, it takes 30s to run the url by render.
   
## API Endpoints

- `POST /api/query` - Process natural language query
- `POST /api/explain` - Explain query execution
- `POST /api/validate` - Validate query feasibility
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /health` - Health check

## Getting Started

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node src/server.js
   ```

The server will start on port 3000 by default.

## Testing the API

### Using Postman

A Postman collection is included in the root directory. Import `postman_collection.json` into Postman to get started.

### Using cURL

1. Register a new user to get an API key:
   ```bash
   curl -X POST https://querysimulator.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"testuser@example.com","password":"password123"}'
   ```

2. Process a query using your API key:
   ```bash
   curl -X POST https://querysimulator.onrender.com/api/query \
     -H "Content-Type: application/json" \
     -H "x-api-key: YOUR_API_KEY_HERE" \
     -d '{"query":"Show me all customers in the North region","dataSource":"default"}'
   ```
3. Explain a query:
   ```bash
   curl -X POST https://querysimulator.onrender.com/api/explain \
     -H "Content-Type: application/json" \
     -H "x-api-key: YOUR_API_KEY_HERE" \
     -d '{"query":"Show me all customers in the North region","dataSource":"default"}'
   ```
4. Validate a query:
   ```bash
   curl -X POST https://querysimulator.onrender.com/api/validate \
     -H "Content-Type: application/json" \
     -H "x-api-key: YOUR_API_KEY_HERE" \
     -d '{"query":"How many orders were placed in 2024?","dataSource":"default"}'
   ```

## Sample Queries

- "Show me all customers in the North region"
- "How many orders were placed in 2024?"
- "What is the average price of electronics products?"
- "Show me the maximum stock level for furniture products"

## Available Data Sources

- `default` - Contains customers, products, and orders
- `financial` - Contains transactions and budget data

## Authentication

All API endpoints (except auth endpoints and health check) require an API key, which should be included in the `x-api-key` header.
