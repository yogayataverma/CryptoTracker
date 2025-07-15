const express = require('express');
const axios = require('axios');
const CurrentData = require('../models/CurrentData');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
        },
      }
    );

    await CurrentData.deleteMany({});
    const docs = await CurrentData.insertMany(
      data.map((coin) => ({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        marketCap: coin.market_cap,
        change24h: coin.price_change_percentage_24h,
        lastUpdated: coin.last_updated,
      }))
    );

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

module.exports = router; 