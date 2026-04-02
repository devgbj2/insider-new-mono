// MarketShareControl.jsx
import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import ReactDOM from "react-dom/client";
import * as echarts from "echarts";
import data from "./marketShareData.json";

export default function MarketShareControl() {
  const map = useMap();
  const rootRef = useRef(null);

  useEffect(() => {
    // Buat elemen control Leaflet
    const controlDiv = L.DomUtil.create("div", "leaflet-control");
    controlDiv.style.pointerEvents = "auto"; // biar bisa di-klik
    controlDiv.classList.add("leaflet-bar"); // style dasar kayak control leaflet
    controlDiv.style.background = "transparent"; // biar styling dari Tailwind anaknya dipakai

    const chartControl = L.control({ position: "bottomleft" });
    chartControl.onAdd = () => controlDiv;
    chartControl.addTo(map);

    // Mount React root ke dalam control
    const root = ReactDOM.createRoot(controlDiv);
    rootRef.current = root;
    root.render(<MarketShareChart />);

    return () => {
      // Unmount React dan hapus control
      root.unmount();
      chartControl.remove();
      rootRef.current = null;
    };
  }, [map]);

  return null;
}

// ======= Komponen Chart (digabung dalam file yang sama) =======
function MarketShareChart() {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const chartRef = useRef(null); // simpan instance echarts

  // bikin/ambil instance
  const getChart = () => {
    if (!chartRef.current && containerRef.current) {
      chartRef.current = echarts.init(containerRef.current, null, {
        renderer: "svg",
      });
    }
    return chartRef.current;
  };

  // set/update option saat expanded berubah
  useEffect(() => {
    const chart = getChart();
    if (!chart) return;

    const option = {
      tooltip: expanded
        ? { trigger: "item", formatter: "{b}: {c} ({d}%)" }
        : { show: false },
      series: [
        {
          name: "Market Share",
          type: "pie",
          radius: expanded ? "50%" : "70%",
          center: ["50%", "50%"],
          data,
          avoidLabelOverlap: false,
          label: {
            show: expanded,
            position: "outside",
            formatter: "{b}: {d}%",
            fontSize: expanded ? 8 : 5,
            backgroundColor: "transparent",
          },
          labelLine: {
            show: expanded,
            length: 40,
            length2: 20,
            smooth: true,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 9,
              fontWeight: "bold",
              backgroundColor: "transparent",
            },
          },
          itemStyle: {
            borderColor: "#696969",
            borderWidth: 2,
          },
        },
      ],
    };

    chart.setOption(option, { notMerge: true, lazyUpdate: true });
  }, [expanded]);

  // resize observer + cleanup
  useEffect(() => {
    const chart = getChart();
    if (!chart) return;

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => chart.resize())
        : null;

    if (ro && containerRef.current) ro.observe(containerRef.current);

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro && containerRef.current) ro.unobserve(containerRef.current);
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className={`bg-blue-100 rounded-md text-gray-700 border-2 border-blue-100 cursor-pointer shadow-md transition-all duration-300 overflow-hidden flex flex-col items-center ${
        expanded
          ? "w-[450px] h-[400px] justify-center"
          : "w-[160px] h-[160px] pt-2 justify-start"
      }`}
    >
      {!expanded && (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs px-1 font-bold">Market Share FTTH</div>
            <div className="text-[10px] px-1">(Dec '23)</div>
          </div>
          <div className="text-center italic font-light leading-none text-[10px]">
            Click to Expand
          </div>
        </>
      )}

      {expanded && (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm px-1 font-bold mt-3">Market Share FTTH</div>
            <div className="text-xs px-1">(Dec '23)</div>
          </div>
          <div className="text-center italic font-light leading-none text-xs">
            Click to Minimize
          </div>
        </>
      )}

      {/* Container chart */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
        aria-label="Market Share Pie Chart"
        role="img"
      />
    </div>
  );
}
