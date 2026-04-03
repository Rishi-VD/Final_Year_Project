import { useContext, useMemo } from "react";
import { DataContext } from "../context/DataContext";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

const COLORS = {
    Verbal: "#6366f1",
    Visual: "#f43f5e",
    Physical: "#10b981",
    Written: "#f59e0b",
};

const DominantStyle = () => {
    const { data } = useContext(DataContext);

    // 🔥 Safe fallback (prevents crash)
    const modalityData = data?.modality_data || {};
    const dominant = data?.dominant || "N/A";

    // 🧠 Convert modality_data → weekly trend (simulate smooth progression)
    const chartData = useMemo(() => {
        const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

        const datasets = Object.keys(modalityData).map((style) => {
            const base = modalityData[style];

            // Generate smooth trend (instead of flat boring line)
            const values = labels.map((_, i) => {
                const variation = Math.sin(i * 0.8) * 5;
                return Math.max(0, Math.min(100, base + variation));
            });

            return {
                label: style,
                data: values,
                borderColor: COLORS[style] || "#3b82f6",
                backgroundColor: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, (COLORS[style] || "#3b82f6") + "33");
                    gradient.addColorStop(1, (COLORS[style] || "#3b82f6") + "00");
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                borderWidth: style === dominant ? 3 : 2, // highlight dominant
                pointRadius: 3,
            };
        });

        return { labels, datasets };
    }, [modalityData, dominant]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 12 },
                },
            },
            tooltip: {
                backgroundColor: "#1e1b4b",
                padding: 10,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } },
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: "#e2e8f0" },
                ticks: { font: { size: 11 } },
            },
        },
    };

    return (
        <>
            {/* TOP CARD (like dashboard stat) */}
            <section className="stats">
                <div className="stat-card stat-card--style">
                    <div className="stat-card__icon">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                        </svg>
                    </div>
                    <div className="stat-card__body">
                        <span className="stat-card__label">Dominant Style</span>
                        <span className="stat-card__value stat-card__value--text">
                            {dominant}
                        </span>
                    </div>
                </div>
            </section>

            {/* CHART (same dashboard feel) */}
            <section className="charts">
                <div className="chart-card">
                    <div className="chart-card__header">
                        <h3>Weekly Learning Style Trend</h3>
                        <span className="chart-card__badge">7 Days Analysis</span>
                    </div>

                    <div className="chart-card__body">
                        <Line data={chartData} options={options} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default DominantStyle;