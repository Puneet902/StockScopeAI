import React from "react";

export default function BreakoutPanel({ data }) {
  return (
    <div className="bg-gray-800 p-4 rounded mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{data.symbol}</h2>
        <span className="text-sm opacity-70">TF: {data.timeframe}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h3 className="font-semibold">Support Levels</h3>
          <ul>
            {data.support.length ? data.support.map((s, i) => <li key={i}>{s}</li>) : <li>-</li>}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Resistance Levels</h3>
          <ul>
            {data.resistance.length ? data.resistance.map((r, i) => <li key={i}>{r}</li>) : <li>-</li>}
          </ul>
        </div>
      </div>
      <div className="mt-3">
        <strong>Signal:</strong>{" "}
        <span className={data.signal === "bullish_breakout" ? "text-green-400" : data.signal === "bearish_breakdown" ? "text-red-400" : "text-yellow-300"}>
          {data.signal} (conf: {data.confidence})
        </span>
      </div>
    </div>
  );
}
