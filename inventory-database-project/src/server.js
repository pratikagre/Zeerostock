const express = require('express');
const cors = require('cors');

// Initialize DB connection and schema
require('./db/connection');

const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/supplier', supplierRoutes);
app.use('/inventory', inventoryRoutes);

app.get('/', (req, res) => {
  res.send('Zeerostock Inventory Database API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
