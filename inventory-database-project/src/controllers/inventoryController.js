const { dbAsync } = require('../db/connection');

exports.createInventory = async (req, res) => {
  try {
    const { supplier_id, product_name, quantity, price } = req.body;

    if (!supplier_id || !product_name || quantity === undefined || price === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be 0 or more' });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    // Check if supplier exists
    const supplier = await dbAsync.get('SELECT * FROM suppliers WHERE id = ?', [supplier_id]);
    
    if (!supplier) {
      return res.status(400).json({ message: 'Invalid supplier_id. Supplier does not exist.' });
    }

    const result = await dbAsync.run(
      'INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
      [supplier_id, product_name, quantity, price]
    );

    res.status(201).json({
      message: 'Inventory created successfully',
      inventory_id: result.lastID
    });
  } catch (error) {
    console.error('Error creating inventory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getInventory = async (req, res) => {
  try {
    // The requirement states: 
    // "Return all inventory grouped by supplier, sorted by total inventory value (quantity * price)"
    
    const query = `
      SELECT 
        s.id AS supplier_id, 
        s.name AS supplier_name,
        SUM(i.quantity * i.price) AS total_inventory_value
      FROM suppliers s
      JOIN inventory i ON s.id = i.supplier_id
      GROUP BY s.id, s.name
      ORDER BY total_inventory_value DESC;
    `;

    const results = await dbAsync.all(query);
    res.json(results);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
