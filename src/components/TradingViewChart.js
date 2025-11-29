import React, { useEffect, useRef } from "react";

function TradingViewChart({ symbol = "RELIANCE" }) {
  const container = useRef(null);

  useEffect(() => {
    const existingScript = document.getElementById("tradingview-widget-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "tradingview-widget-script";
      script.type = "text/javascript";
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        createWidget();
      };
      document.body.appendChild(script);
    } else {
      createWidget();
    }

    function createWidget() {
      if (container.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `NSE:${symbol}`,
          interval: "15",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          withdateranges: true,
          range: "1D",
          allow_symbol_change: true,
          details: true,
          container_id: "tradingview_chart",
        });
      }
    }

    return () => {
      if (container.current) container.current.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div
      id="tradingview_chart"
      ref={container}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    ></div>
  );
}

export default TradingViewChart;
