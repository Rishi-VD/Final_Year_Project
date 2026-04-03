import React, { useState, useMemo } from "react";
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

const OverAllFocus = () => {
    const { data } = useOutletContext();
    const focus = data?.overall_focus || 0;
    const [range, setRange] = useState("7");

    const color = focus > 70 ? "#10b981" : focus > 40 ? "#f59e0b" : "#ef4444";

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (focus / 100) * circumference;

    const chartDataValues = useMemo(() => {
        const days = parseInt(range);
        const labels = [];
        const values = [];
        for (let i = days; i >= 0; i--) {
            labels.push(i === 0 ? "Now" : `${i}d ago`);
            const variance = Math.sin(i * 0.8) * 7;
            const trend = focus - (i * 0.3) + variance;
            values.push(Math.max(0, Math.min(100, Math.round(trend))));
        }
        return { labels, values };
    }, [range, focus]);

    const chartData = {
        labels: chartDataValues.labels,
        datasets: [
            {
                label: "Focus Score",
                data: chartDataValues.values,
                borderColor: color,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, color + "33");
                    gradient.addColorStop(1, color + "00");
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: range === "30" ? 0 : 3,
                pointBackgroundColor: "#fff",
                pointBorderColor: color,
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: "#1e293b", padding: 8, cornerRadius: 6 }
        },
        scales: {
            y: { beginAtZero: true, max: 100, grid: { color: "#f1f5f9" }, ticks: { color: "#94a3b8", stepSize: 25, font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { color: "#94a3b8", autoSkip: true, maxTicksLimit: 7, font: { size: 10 } } },
        },
    };

    return (
        <div style={{
            padding: "16px",
            width: "100%",
            maxWidth: "1300px",
            margin: "0 auto",
            fontFamily: "'Inter', sans-serif",
            color: "#1e293b",
            boxSizing: "border-box"
        }}>

            {/* TOP SECTION: CIRCLE & INSIGHT */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "16px" }}>

                <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                    <div style={{ position: "relative", width: "100px", height: "100px" }}>
                        <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                            <circle cx="50" cy="50" r={radius} stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                            <circle cx="50" cy="50" r={radius} stroke={color} strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                        </svg>
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                            <span style={{ fontSize: "18px", fontWeight: "800" }}>{focus}%</span>
                        </div>
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Global Focus</h2>
                        <p style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: "600", color: color }}>
                            {focus > 70 ? "Peak State" : focus > 40 ? "Steady Flow" : "Attention Fatigue"}
                        </p>
                    </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#334155" }}>
                        Your focus has {focus > 50 ? "improved" : "fluctuated"} by <strong>12%</strong>. Peak productivity: <strong>2 hours after waking up</strong>.
                    </p>
                </div>
            </div>

            {/* CHART SECTION */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Attention Velocity</h3>
                    <div style={{ display: "flex", background: "#f1f5f9", padding: "3px", borderRadius: "8px" }}>
                        {["7", "30"].map((t) => (
                            <button key={t} onClick={() => setRange(t)} style={{ padding: "6px 14px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", background: range === t ? "#fff" : "transparent", color: range === t ? "#1e293b" : "#64748b" }}>
                                {t}D
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ height: "350px" }}> {/* Fixed Height to fit viewport */}
                    <Line data={chartData} options={options} />
                </div>
            </div>

            {/* ANALYTICS GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {[
                    { label: "CONSISTENCY", val: "High", sub: "+5% Stability", desc: "Focus dips are less frequent." },
                    { label: "OPTIMAL WINDOW", val: "9:30 AM", sub: "Peak Focus", desc: "Recurring surge in performance." },
                    { label: "AVG SESSION", val: "52m", sub: "Deep Work", desc: "Correlates with higher scores." }
                ].map((item, idx) => (
                    <div key={idx} style={{ background: "#fff", padding: "26px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                        <p style={{ margin: 0, fontSize: "11px", fontWeight: "600", color: "#94a3b8" }}>{item.label}</p>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "4px 0" }}>
                            <span style={{ fontSize: "20px", fontWeight: "800" }}>{item.val}</span>
                            <span style={{ fontSize: "11px", color: idx === 1 ? "#6366f1" : "#10b981", fontWeight: "600" }}>{item.sub}</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverAllFocus;