import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const CoinChart = ({ coinId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`https://cryptotracker-976z.onrender.com/api/history/${coinId}`);
        setData(res.data.map(item => ({
          ...item,
          time: item.lastUpdated,
        })));
      } catch (err) {
        setError('Failed to fetch history');
      }
      setLoading(false);
    };
    fetchHistory();
  }, [coinId]);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!data.length) return <div>No historical data available.</div>;

  const formatTimestamp = (isoString) => format(new Date(isoString), 'MMM d, HH:mm');

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" minTickGap={40} tickFormatter={formatTimestamp} />
        <YAxis dataKey="price" domain={['auto', 'auto']} />
        <Tooltip labelFormatter={formatTimestamp} />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CoinChart; 