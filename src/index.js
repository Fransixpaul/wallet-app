const express = require('express');
const pool = require('./db');
const app = express();
app.use(express.json());
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

app.post('/clients', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO clients (name, email) VALUES (?, ?)',
      [name, email],
    );
    res.status(201).json({
      id: result.insertId,
      name,
      email,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res
        .status(409)
        .json({ error: 'A client with this email already exists' });
    }
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

app.put('/clients/:id', async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  if (!name || !email || !id) {
    return res
      .status(400)
      .json({ error: 'Id, Name and email adress are required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE clients SET name = ?, email = ? WHERE id = ?',
      [name, email, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.status(200).json({
      id: Number(id),
      name,
      email,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res
        .status(409)
        .json({ error: 'A client with this email already exists' });
    }
    return res.status(500).json({ error: 'something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
