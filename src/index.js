const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/wallet/balance', (req, res) => {
  res.status(200).json({
    clientId: 1,
    balance: 40000,
    currency: 'NGN',
  });
});

app.get('/clients', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM clients');
  res.status(200).json(rows);
});

app.get('/clients/:id', async (req, res) => {
  const id = req.params.id;

  const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Client not found' });
  }
  res.status(200).json(rows[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
