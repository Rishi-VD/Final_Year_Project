import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const WeekChange = () => {
  // Context nunchi data teeskuntunnam
  const { data } = useOutletContext();

  const changeValue = parseFloat(data?.week_change || 0);
  const isPositive = changeValue >= 0;
  const themeColor = isPositive ? "#10b981" : "#f43f5e";

  const { chartData, prediction } = useMemo(() => {
    // Weekly data values ni extract chestunnam
    // Multiple datasets unte (e.g. Focus, Intensity), vatini average chesi common trend teestundi
    const keys = Object.keys(data?.weekly_data || {});
    if (keys.length === 0) return { chartData: null, prediction: 0 };

    const rawData = data.weekly_data[keys[0]]; // Primary dataset (usually Focus)
    const labels = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "1d ago", "Today"];

    // --- SIMPLE LINEAR PREDICTION LOGIC ---
    // Last 3 days trend ni batti next 2 days ela untayo calculate chestundi
    const last3 = rawData.slice(-3);
    const avgGrowth = (last3[2] - last3[0]) / 2;
    const nextDay = Math.max(0, Math.min(100, Math.round(last3[2] + avgGrowth)));
    const dayAfter = Math.max(0, Math.min(100, Math.round(nextDay + avgGrowth)));

    const finalLabels = [...labels, "Tomorrow*", "Next Day*"];
    const finalValues = [...rawData];
    const predictionValues = [...Array(rawData.length - 1).fill(null), rawData[rawData.length - 1], nextDay, dayAfter];

    return {
      prediction: nextDay,
      chartData: {
        labels: finalLabels,
        datasets: [
          {
            label: "Historical Data",
            data: finalValues,
            borderColor: themeColor,
            backgroundColor: themeColor + "22",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
          },
          {
            label: "AI Prediction",
            data: predictionValues,
            borderColor: themeColor,
            borderDash: [5, 5], // Dotted line for prediction
            backgroundColor: "transparent",
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#fff",
          }
        ],
      }
    };
  }, [data, themeColor]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` Score: ${context.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#94a3b8", font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 11 } }
      }
    }
  };

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* --- TOP STAT CARD --- */}
      <div className="stats" style={{ display: "grid", gridTemplateColumns: "1fr", margin: 0 }}>
        <div className={`stat-card stat-card--change`} style={{ width: "100%", boxSizing: "border-box" }}>
          <div className="stat-card__icon" style={{ background: themeColor + "18", color: themeColor }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={isPositive ? "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" : "M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"} />
            </svg>
          </div>
          <div className="stat-card__body">
            <span className="stat-card__label">Velocity Analysis</span>
            <span className="stat-card__value" style={{ color: themeColor }}>
              {isPositive ? "+" : ""}{changeValue}% This Week
            </span>
          </div>
          <span className={`stat-card__badge ${isPositive ? "stat-card__badge--up" : "stat-card__badge--down"}`}>
            {isPositive ? "Improving" : "Declining"}
          </span>
        </div>
      </div>

      {/* --- MAIN PREDICTION GRAPH --- */}
      <div className="chart-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "20px" }}>
        <div className="chart-card__header" style={{ marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Week Change & Forecast</h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
              {isPositive ? "Positive momentum detected in recent sessions." : "Recent trend shows slight attention fatigue."}
            </p>
          </div>
          <span className="chart-card__badge" style={{ background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
            AI Predicted: {prediction}%
          </span>
        </div>

        <div style={{ height: "300px", width: "100%" }}>
          {chartData && <Line data={chartData} options={options} />}
        </div>
      </div>

      {/* --- INSIGHT FOOTER --- */}
      <div style={{
        background: themeColor + "08",
        border: `1px solid ${themeColor}20`,
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <div style={{ minWidth: "40px", height: "40px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "18px" }}>{isPositive ? "🚀" : "⚠️"}</span>
        </div>
        <p style={{ margin: 0, fontSize: "14px", color: "#334155", lineHeight: "1.5" }}>
          Based on your <strong>{changeValue}%</strong> {isPositive ? "increase" : "dip"}, we expect your focus to stabilize around <strong>{prediction}%</strong> tomorrow if the current workload remains constant.
        </p>
      </div>
    </div>
  );
};

export default WeekChange;