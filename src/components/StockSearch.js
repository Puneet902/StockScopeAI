import React, { useState } from "react";

export default function StockSearch({ onAnalyze, loading }) {
  const [symbol, setSymbol] = useState("");
  const [tf, setTf] = useState("15m");

  function submit() {
    if (!symbol) return alert("Enter a symbol (e.g., AAPL or TCS.NS)");
    onAnalyze(symbol, tf);
  }

  return (
    <div className="flex gap-3 mb-4 items-center">
      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol (e.g., AAPL or TCS.NS)"
        className="p-2 rounded text-black"
      />
      <select value={tf} onChange={(e) => setTf(e.target.value)} className="p-2 rounded text-black">
        <option value="1m">1m</option>
        <option value="5m">5m</option>
        <option value="15m">15m</option>
        <option value="60m">1h</option>
        <option value="240m">4h</option>
        <option value="1d">1d</option>
      </select>
      <button onClick={submit} className="bg-blue-500 p-2 rounded" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
}
