import React, { useEffect, useState } from "react";
import axios from "axios";
import CoinChart from "./CoinChart";

const REFRESH_INTERVAL = 30 * 60 * 1000;

const columns = [
  { key: "name", label: "Name" },
  { key: "symbol", label: "Symbol" },
  { key: "price", label: "Price (USD)" },
  { key: "marketCap", label: "Market Cap" },
  { key: "change24h", label: "24h % Change" },
  { key: "lastUpdated", label: "Last Updated" },
];

const CryptoTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("marketCap");
  const [sortDir, setSortDir] = useState("desc");
  const [nameFilter, setNameFilter] = useState("");
  const [symbolFilter, setSymbolFilter] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [marketCapMin, setMarketCapMin] = useState("");
  const [marketCapMax, setMarketCapMax] = useState("");
  const [changeMin, setChangeMin] = useState("");
  const [changeMax, setChangeMax] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleShowChart = (coin) => {
    setSelectedCoin(coin);
    setShowChart(true);
  };
  const handleCloseChart = () => {
    setShowChart(false);
    setSelectedCoin(null);
  };

  const fetchCoins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/coins");
      setCoins(res.data);
    } catch (err) {
      setError("Failed to fetch coins");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const uniqueNames = Array.from(new Set(coins.map((c) => c.name)));
  const uniqueSymbols = Array.from(
    new Set(coins.map((c) => c.symbol.toUpperCase()))
  );

  const filtered = coins.filter((coin) => {
    const matchesSearch =
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesName = !nameFilter || coin.name === nameFilter;
    const matchesSymbol =
      !symbolFilter || coin.symbol.toUpperCase() === symbolFilter;
    const matchesPrice =
      (priceMin === "" || coin.price >= parseFloat(priceMin)) &&
      (priceMax === "" || coin.price <= parseFloat(priceMax));
    const matchesMarketCap =
      (marketCapMin === "" || coin.marketCap >= parseFloat(marketCapMin)) &&
      (marketCapMax === "" || coin.marketCap <= parseFloat(marketCapMax));
    const matchesChange =
      (changeMin === "" || coin.change24h >= parseFloat(changeMin)) &&
      (changeMax === "" || coin.change24h <= parseFloat(changeMax));
    return (
      matchesSearch &&
      matchesName &&
      matchesSymbol &&
      matchesPrice &&
      matchesMarketCap &&
      matchesChange
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let v1 = a[sortBy];
    let v2 = b[sortBy];
    if (sortBy === "name" || sortBy === "symbol") {
      v1 = v1.toLowerCase();
      v2 = v2.toLowerCase();
      if (v1 < v2) return sortDir === "asc" ? -1 : 1;
      if (v1 > v2) return sortDir === "asc" ? 1 : -1;
      return 0;
    }
    if (sortBy === "lastUpdated") {
      v1 = new Date(v1);
      v2 = new Date(v2);
    }
    return sortDir === "asc" ? v1 - v2 : v2 - v1;
  });

  return (
    <div className="container pt-3 pb-5">
      <div style={{ maxWidth: 370 }}>
        <h2 className="mb-3 fw-bold text-start text-white w-100">
          Top 10 Cryptocurrencies
        </h2>
        <div className="mb-4">
          <div className="input-group w-100">
            <span
              className="input-group-text bg-dark border-secondary text-white py-1 px-2"
              style={{ fontSize: "1.1rem" }}
            >
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control bg-dark text-white border-secondary py-2 px-3"
              style={{ minWidth: 0, fontSize: "1.05rem" }}
            />
          </div>
        </div>
      </div>

      <div className="row mb-3 g-3">
        <div className="col">
          <label className="form-label text-light small mb-1">Name</label>
          <select
            className="form-select bg-dark text-white border-secondary"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          >
            <option value="">All Names</option>
            {uniqueNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="form-label text-light small mb-1">Symbol</label>
          <select
            className="form-select bg-dark text-white border-secondary"
            value={symbolFilter}
            onChange={(e) => setSymbolFilter(e.target.value)}
          >
            <option value="">All Symbols</option>
            {uniqueSymbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="form-label text-light small mb-1">Price</label>
          <div className="d-flex align-items-center gap-1">
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Price Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <span className="text-light">-</span>
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Price Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </div>
        <div className="col">
          <label className="form-label text-light small mb-1">Market Cap</label>
          <div className="d-flex align-items-center gap-1">
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Market Cap Min"
              value={marketCapMin}
              onChange={(e) => setMarketCapMin(e.target.value)}
            />
            <span className="text-light">-</span>
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Market Cap Max"
              value={marketCapMax}
              onChange={(e) => setMarketCapMax(e.target.value)}
            />
          </div>
        </div>
        <div className="col">
          <label className="form-label text-light small mb-1">
            24h % Change
          </label>
          <div className="d-flex align-items-center gap-1">
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              placeholder="24h % Min"
              value={changeMin}
              onChange={(e) => setChangeMin(e.target.value)}
            />
            <span className="text-light">-</span>
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              placeholder="24h % Max"
              value={changeMax}
              onChange={(e) => setChangeMax(e.target.value)}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-light">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <div className="table-responsive rounded shadow-sm bg-black border border-secondary">
          <table className="table table-dark table-hover align-middle table-bordered mb-0">
            <thead className="table-dark">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={
                      "text-nowrap text-center align-middle" +
                      (sortBy === col.key
                        ? " bg-secondary text-white"
                        : " text-light") +
                      " cursor-pointer user-select-none"
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {col.label}
                    {sortBy === col.key
                      ? sortDir === "asc"
                        ? " ▲"
                        : " ▼"
                      : ""}
                  </th>
                ))}
                <th className="text-nowrap text-center align-middle text-light">Chart</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((coin) => (
                <tr key={coin.coinId}>
                  <td className="fw-semibold text-white">{coin.name}</td>
                  <td>
                    <span className="badge bg-light text-dark p-2 fs-6">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </td>
                  <td className="fw-bold text-success">
                    ${coin.price.toLocaleString()}
                  </td>
                  <td className="fw-bold text-secondary">
                    ${coin.marketCap.toLocaleString()}
                  </td>
                  <td
                    className={
                      coin.change24h >= 0
                        ? "fw-bold text-success"
                        : "fw-bold text-danger"
                    }
                  >
                    {coin.change24h?.toFixed(2)}%
                  </td>
                  <td className="text-light small">
                    {new Date(coin.lastUpdated).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleShowChart(coin)}
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showChart && selectedCoin && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCoin.name} Price Chart</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseChart}
                ></button>
              </div>
              <div className="modal-body">
                <CoinChart coinId={selectedCoin.coinId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoTable;
