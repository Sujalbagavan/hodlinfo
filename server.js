// server.js
const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Set up the PostgreSQL connection pool
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "habiba20004",
  database: "cryptodb"
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Fetch top cryptocurrencies
async function fetchTopCryptos() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = response.data;

    // Get the top 10 cryptocurrencies
    const top10 = Object.keys(tickers)
      .slice(0, 10) // Limit to the first 10 entries
      .reduce((acc, key) => {
        acc[key] = tickers[key];
        return acc;
      }, {});

    return top10;
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error.message);
    return {};
  }
}

// Route to render the main page
app.get('/', async (req, res) => {
  const tickers = await fetchTopCryptos();
  res.render('index', { tickers });
});

// Route to fetch cryptocurrency data as JSON
app.get('/api/tickers', async (req, res) => {
  const tickers = await fetchTopCryptos();
  res.json({ tickers });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/dashboard', async (req, res) => {
  const tickers = await fetchTopCryptos();
  res.render('dashboard', { tickers });
});