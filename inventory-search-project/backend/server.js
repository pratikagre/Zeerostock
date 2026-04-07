const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const inventoryData = require('./data/inventory.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// PART A: SEARCH API (Uses static JSON as per assignment)
// ---------------------------------------------------------
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/search', (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ message: 'Invalid price range: minPrice cannot be greater than maxPrice' });
  }

  let results = inventoryData;

  if (q) {
    const searchString = q.toLowerCase();
    results = results.filter(item => 
      item.productName.toLowerCase().includes(searchString)
    );
  }

  if (category && category.trim() !== '') {
    const searchCategory = category.toLowerCase();
    results = results.filter(item => 
      item.category.toLowerCase() === searchCategory
    );
  }

  if (minPrice && !isNaN(minPrice)) {
    results = results.filter(item => item.price >= Number(minPrice));
  }

  if (maxPrice && !isNaN(maxPrice)) {
    results = results.filter(item => item.price <= Number(maxPrice));
  }

  res.json(results);
});


// ---------------------------------------------------------
// PART B: DATABASE APIs (Uses SQLite as per assignment)
// ---------------------------------------------------------
// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error connecting to database:', err.message);
  else console.log('Connected to the SQLite database.');
});

// Initialize schema (tables)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
  )`);
});

const dbAsync = {
  get: (sql, params = []) => new Promise((res, rej) => db.get(sql, params, (err, row) => err ? rej(err) : res(row))),
  all: (sql, params = []) => new Promise((res, rej) => db.all(sql, params, (err, rows) => err ? rej(err) : res(rows))),
  run: (sql, params = []) => new Promise((res, rej) => db.run(sql, params, function (err) { err ? rej(err) : res(this) }))
};

// Part B Routes
app.post('/supplier', async (req, res) => {
  try {
    const { name, city } = req.body;
    if (!name || !city) return res.status(400).json({ message: 'Name and city are required' });

    const result = await dbAsync.run('INSERT INTO suppliers (name, city) VALUES (?, ?)', [name, city]);
    res.status(201).json({ message: 'Supplier created successfully', supplier_id: result.lastID });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/inventory', async (req, res) => {
  try {
    const { supplier_id, product_name, quantity, price } = req.body;
    if (!supplier_id || !product_name || quantity === undefined || price === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (quantity < 0) return res.status(400).json({ message: 'Quantity must be 0 or more' });
    if (price <= 0) return res.status(400).json({ message: 'Price must be greater than 0' });

    const supplier = await dbAsync.get('SELECT * FROM suppliers WHERE id = ?', [supplier_id]);
    if (!supplier) return res.status(400).json({ message: 'Invalid supplier_id. Supplier does not exist.' });

    const result = await dbAsync.run(
      'INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
      [supplier_id, product_name, quantity, price]
    );
    res.status(201).json({ message: 'Inventory created successfully', inventory_id: result.lastID });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/inventory', async (req, res) => {
  try {
    const query = `
      SELECT s.id AS supplier_id, s.name AS supplier_name, SUM(i.quantity * i.price) AS total_inventory_value
      FROM suppliers s JOIN inventory i ON s.id = i.supplier_id
      GROUP BY s.id, s.name ORDER BY total_inventory_value DESC;
    `;
    const results = await dbAsync.all(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Redirect root to UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Export app for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Unified Server is running on port ${PORT}`);
  });
}
