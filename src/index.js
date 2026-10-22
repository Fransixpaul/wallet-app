const express = require('express');
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
