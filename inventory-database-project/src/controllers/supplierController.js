const { dbAsync } = require('../db/connection');

exports.createSupplier = async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!name || !city) {
      return res.status(400).json({ message: 'Name and city are required' });
    }

    const result = await dbAsync.run(
      'INSERT INTO suppliers (name, city) VALUES (?, ?)',
      [name, city]
    );

    res.status(201).json({
      message: 'Supplier created successfully',
      supplier_id: result.lastID
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
