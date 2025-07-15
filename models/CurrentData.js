const mongoose = require('mongoose');

const CurrentDataSchema = new mongoose.Schema({
  coinId: String,
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  lastUpdated: Date,
});

module.exports = mongoose.model('CurrentData', CurrentDataSchema); 