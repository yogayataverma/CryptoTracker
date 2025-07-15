# CryptoTracker

## Tech Stack Used
- **Frontend:** React, Axios
- **Backend:** Node.js, Express.js, Mongoose, Node-Cron, Axios
- **Database:** MongoDB (Atlas)
- **Deployment:** Netlify (frontend), Render (backend)

---

## Setup and Installation Steps

### 1. **Clone the Repository**
```bash
git clone https://github.com/yogayataverma/CryptoTracker.git
cd vr_automations ## take client folder clone from frontend branch and server folder clone from backend branch
```

### 2. **Backend Setup**
```bash
cd server
npm install
```
- Create a `.env` file in the `server` folder or copy from `.env.example`:
  ```
  MONGO_DB=mongodb link
  ```
- Start the backend:
  ```
npm start
  ```

### 3. **Frontend Setup**
```bash
cd client/vr-automations
npm install
```
- Start the frontend:
  ```
npm start
  ```

---

## How the Cron Job Works
- The backend uses `node-cron` to schedule a job that runs **every hour**.
- The cron job fetches the top 10 cryptocurrencies from CoinGecko and appends a snapshot of their data to the `HistoryData` collection in MongoDB.
- You can see the cron logic in `server/cron.js`.
- For testing, you can change the schedule to run every minute by setting the cron pattern to `* * * * *`.
- On starting of server cron job automatically starts.
---

## Deployed Links
- **Frontend:** [https://vr-auto.netlify.app](https://vr-auto.netlify.app)
- **Backend:** [https://cryptotracker-976z.onrender.com](https://cryptotracker-976z.onrender.com)

---

## Features
- Live crypto data from CoinGecko
- Historical price charts
- Automated hourly data snapshots
- Responsive, modern UI

---