const cron = require('node-cron');
const axios = require('axios');
const HistoryData = require('./models/HistoryData');

cron.schedule('0 * * * *', async () => {
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
    await HistoryData.insertMany(
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
    console.log('History snapshot saved');
  } catch (err) {
    console.error('Cron job failed:', err.message);
  }
}); 