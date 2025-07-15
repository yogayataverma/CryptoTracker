require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const coinsRoutes = require('./routes/coins');
const historyRoutes = require('./routes/history');
require('./cron');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/coins', coinsRoutes);
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));
