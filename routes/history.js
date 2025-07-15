const express = require('express');
const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const currentCoins = await CurrentData.find({});
    const historyDocs = await HistoryData.insertMany(
      currentCoins.map((coin) => ({
        coinId: coin.coinId,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.price,
        marketCap: coin.marketCap,
        change24h: coin.change24h,
        lastUpdated: coin.lastUpdated,
      }))
    );
    res.json(historyDocs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to store history' });
  }
});


router.get('/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const history = await HistoryData.find({ coinId }).sort({ lastUpdated: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router; 