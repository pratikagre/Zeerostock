# Zeerostock Inventory Search API + UI

This is Part A of the Zeerostock Developer Assignment. It contains a backend API built with Node.js and Express that filters inventory items, and a visually premium, modern frontend built with vanilla HTML/CSS/JS.

## Features
- **Express API Endpoint:** `GET /api/search` supporting `q`, `category`, `minPrice`, and `maxPrice` filters.
- **Frontend UI:** Interactive interface with modern design aesthetics, dark mode vibes, animations, and micro-interactions.
- **Case-Insensitive Search:** Partial match search by product name.
- **Form Validation:** Checks for valid price ranges.

## How to run locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

### 3. Run the Server
```bash
npm start
```
The server will start on `http://localhost:3000`.

### 4. View the Application
Open your browser and navigate to exactly that same address: `http://localhost:3000`
Since the Express server statically serves the frontend files, the API and the UI both work under the same port seamlessly avoiding CORS issues.

## Search Logic Explanation
The `/api/search` endpoint first loads the initial catalog of 15 items. It sequentially applies the filters provided as optional query string parameters:
1. **Query (`q`)**: Performs a partial match. It converts both the product name and the query to lowercase before evaluating `.includes()`.
2. **Category (`category`)**: Performs an exact case-insensitive match against the categorized string.
3. **Price Range (`minPrice` / `maxPrice`)**: Applies a filter checking whether the numeric value of `price` rests within the bounding limits provided. It correctly handles ranges where only the min or max is supplied.
If the price bounds are invalid (`min > max`) the server directly responds with a `400 Bad Request`. When no filters are active, the API gracefully defaults to skipping all evaluation blocks and directly returns the entire inventory.

## Performance Improvement for Large Datasets
For scaling to thousands or millions of inventory items:
**Database with Indexing and Full-Text Search Engine**: Loading the full dataset into in-memory arrays forces a linear `O(n)` complexity sequence filter on every request. I would transition from a static JSON to a Database like PostgreSQL or Elasticsearch. For SQL, I would add a standard Index on `category` and `price`, and a **Trigram Index (GIST / GIN)** on `product_name` to allow incredibly fast partial-string matching without scanning the entire table. In addition, I would implement **Pagination** (e.g. `limit` and `offset` parameters) to limit the payload sent to the client.
