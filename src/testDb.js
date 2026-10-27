const pool = require('./db');

async function test() {
  const [rows] = await pool.query('SELECT * FROM clients');
  console.log(rows);
  await pool.end();
}

test();
