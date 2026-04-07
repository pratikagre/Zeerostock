# 📦 Zeerostock Assignment – Inventory Search & Database System

## 🚀 Project Overview

This project is built as part of the Zeerostock assignment. It includes:

* 🔍 Inventory Search System (Frontend + Backend)
* 🗄️ Inventory Management APIs with Database

The application allows users to search and filter surplus inventory across multiple suppliers efficiently.

---

# 🧩 PART A: Inventory Search API + UI

## ✨ Features

* Search products by name (partial & case-insensitive)
* Filter by category
* Filter by price range (min & max)
* Combine multiple filters
* Display results in a clean table format
* “No results found” state handling

---

## ⚙️ Search Logic

1. All inventory data is loaded
2. Filters are applied step-by-step:

   * Product name (`q`)
   * Category
   * Minimum price
   * Maximum price
3. Case-insensitive matching is implemented using:

   ```js
   productName.toLowerCase().includes(q.toLowerCase())
   ```
4. Final filtered results are returned to the frontend

---

## ⚠️ Edge Case Handling

* Empty search → returns all data
* Invalid price range → shows error
* No matching results → displays "No results found"

---

## 🛠️ Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express
* Data: Static JSON / In-memory array

---

## 🚀 Performance Improvement (Future Scope)

For large datasets, performance can be improved by:

* Adding database indexing
* Implementing pagination
* Using debouncing for search input
* Integrating full-text search (like Elasticsearch)

---

# 🗄️ PART B: Inventory Database + APIs

## 📊 Database Schema

### Suppliers Table

* id (Primary Key)
* name
* city

### Inventory Table

* id (Primary Key)
* supplier_id (Foreign Key)
* product_name
* quantity
* price

---

## 🔗 Relationship

* One supplier → Many inventory items

---

## 🔧 APIs

### 1. Create Supplier

POST /supplier

### 2. Create Inventory

POST /inventory

### 3. Get Inventory

GET /inventory

---

## ⚠️ Validation Rules

* Inventory must belong to a valid supplier
* Quantity must be ≥ 0
* Price must be > 0

---

## 📈 Important Query

Fetch inventory grouped by supplier and sorted by total inventory value:

sql
SELECT s.name,
SUM(i.quantity * i.price) AS total_inventory_value
FROM suppliers s
JOIN inventory i ON s.id = i.supplier_id
GROUP BY s.name
ORDER BY total_inventory_value DESC;



## 🧠 Why SQL?

SQL was chosen because:

* It handles structured data effectively
* Supports relationships using foreign keys
* Makes grouping and aggregation queries easy

---



# 🌐 Deployment

* Deploy Link:(https://zeerostock-zeta.vercel.app/)

* GitHub Repository: (https://github.com/pratikagre/Zeerostock.git)

---

# ▶️ How to Run Locally


# Backend

cd backend

npm install

node server.js

# Frontend
Open index.html in browse




# 📸 Screenshots
![Search UI](https://github.com/user-attachments/assets/xxxxx)

![Results](https://github.com/user-attachments/assets/yyyyy)
<img width="1901" height="848" alt="image" src="https://github.com/user-attachments/assets/f22dd768-990f-4708-9227-5fab08f544ba" />

<img width="1902" height="646" alt="image" src="https://github.com/user-attachments/assets/fe7e114d-95c4-4a4c-a461-a60a4b2c295f" />

<img width="1918" height="861" alt="image" src="https://github.com/user-attachments/assets/abb71464-be08-46be-a76d-4146b5b954ff" />





# 👨‍💻 Author

Pratik Agre



# 🎯 Conclusion

This project demonstrates full-stack development skills including API design, filtering logic, database relationships, and user interface implementation.
