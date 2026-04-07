# Zeerostock Inventory Database API

This is Part B of the Zeerostock Developer Assignment. It contains a robust Node.js backend using Express and an SQLite Database.

## Features
- **Database Schema:** Two tables, `suppliers` and `inventory`. One supplier can have many inventory items.
- **Supplier API:** `POST /supplier`
- **Inventory APIs:** `POST /inventory` and `GET /inventory`
- **Validation:** Ensures `quantity >= 0`, `price > 0`, and that the `supplier_id` genuinely exists in the database.
- **Analytics:** The `GET /inventory` endpoint returns a grouped summary: all inventory consolidated by supplier, ordered by total inventory net value (`quantity × price`).

## How to run locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Navigate to the `inventory-database-project` folder and install dependencies:
```bash
npm install
```

### 3. Run the Server
```bash
npm start
```
The server will start on `http://localhost:4000`. The application will automatically create an `database.sqlite` file and provision the necessary schema.

### 4. API Endpoints testing
You can test the endpoints via Postman or Curl:
- `POST /supplier`
  Body (JSON): `{ "name": "Supplier A", "city": "New York" }`
- `POST /inventory`
  Body (JSON): `{ "supplier_id": 1, "product_name": "Test Item", "quantity": 10, "price": 100 }`
- `GET /inventory` - fetches summary list.

## Database Schema Explanation
The schema comprises two tables representing a classic one-to-many relationship:
1. `suppliers` table with `id` (Primary Key), `name`, and `city`.
2. `inventory` table with `id` (Primary Key), `supplier_id` (Foreign Key linked to `suppliers(id)`), `product_name`, `quantity`, and `price`.
Using SQLite enforced relational constraints gracefully directly at the DB level via the foreign key, matching the structured relationship required between Supplier and Inventory. 

## SQL versus NoSQL choice
I specifically chose **SQL (SQLite)** because the supplier-to-inventory relationship is highly structured and incredibly easy to model with foreign keys. The requirement essentially centers around relational dependencies (an item *must* belong to a *supplier*) and requires calculating aggregations referencing multiple collections (`SUM(i.quantity * i.price)` grouped by `supplier`). Executing this sort of aggregated `JOIN` query is naturally native to SQL and requires much heavier aggregation pipelines in NoSQL.

## Indexing & Optimization Suggestion
As the database scales and the number of relationships increases, retrieving and grouping large selections becomes slower because the DB engine must scan the full table continuously.
**Suggestion:**
I would explicitly add a B-Tree index on `instructor_id` in the `inventory` table like so:
```sql
CREATE INDEX idx_inventory_supplier_id ON inventory(supplier_id);
```
Additionally, if aggregate reporting becomes a bottleneck, I would use Materialized Views or cache the computed values (`total_inventory_value`) utilizing a Redis cache layer for the `GET /inventory` endpoint.
