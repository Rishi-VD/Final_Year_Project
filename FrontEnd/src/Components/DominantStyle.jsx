import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { useOutletContext } from "react-router-dom";
import "./DominantStyle_css.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

const WEEK_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e"];

function DominantStyle() {
    const { data } = useOutletContext();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    if (!data) return <div className="loading">Loading Analytics...</div>;

    const chartData = useMemo(() => {
        const weeks = Object.keys(data.weekly_data);
        return {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: weeks.map((weekKey, idx) => ({
                label: weekKey,
                data: data.weekly_data[weekKey],
                borderColor: WEEK_COLORS[idx % WEEK_COLORS.length],
                backgroundColor: WEEK_COLORS[idx % WEEK_COLORS.length] + "10",
                fill: false,
                tension: 0.35,
                pointRadius: 3,
                borderWidth: 2,
                spanGaps: true 
            })),
        };
    }, [data.weekly_data]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 400,
            easing: 'easeOutQuart'
        },
        elements: {
            line: { borderCapStyle: 'round' }
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
                align: "end",
                labels: { boxWidth: 8, usePointStyle: true, font: { size: 12, weight: "600" } },
            },
            tooltip: {
                enabled: true,
                backgroundColor: "#1e1b4b",
                usePointStyle: true,
                padding: 10,
            },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: "#f1f5f9" }, border: { display: false } },
            x: { grid: { display: false }, border: { display: false } },
        },
    }), []);

    const performanceScores = useMemo(() =>
        Object.values(data.weekly_data).map(arr =>
            Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
        ),
        [data.weekly_data]);

    const dominantValue = data.overall_focus;

    return (
        <div
            className={`ds-container ${mounted ? "fade-in" : ""}`}
            style={{ willChange: 'opacity, transform' }}
        >
            <div className="ds-grid-top">
                <div className="ds-card ds-main-style">
                    <div className="ds-card-info">
                        <span className="ds-label">Primary Modality</span>
                        <h2 className="ds-title">{data.dominant}</h2>
                        <p className="ds-description">
                            You process information <b>{data.week_change}%</b> more effectively through{" "}
                            {data.dominant.toLowerCase()} channels.
                        </p>
                    </div>

                    <div className="ds-progress-circle">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path
                                className="circle"
                                style={{
                                    stroke: WEEK_COLORS[0],
                                    transition: 'stroke-dasharray 0.8s ease-out'
                                }}
                                strokeDasharray={`${dominantValue}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">{dominantValue}%</text>
                        </svg>
                    </div>
                </div>

                <div className="ds-card ds-insight">
                    <div className="ds-insight-icon">💡</div>
                    <div className="ds-insight-content">
                        <h3>AI Improvement Insight</h3>
                        <p>
                            Based on your <b>{data.status}</b> trend, we recommend focusing on{" "}
                            {data.dominant === "Visual" ? "mind mapping and flowcharts" : "interactive drills"}
                            to maintain your current <b>{data.week_change}%</b> growth momentum.
                        </p>
                        <div className="ds-tag">Actionable Goal: 45m focused study</div>
                    </div>
                </div>
            </div>

            <div className="ds-card ds-chart-card">
                <div className="ds-card-header">
                    <div>
                        <h3>Learning Trend</h3>
                        <p className="ds-sub">Comparative analysis across active weeks</p>
                    </div>
                    <div className="ds-status-badge" data-status={data.status}>{data.status}</div>
                </div>

                <div className="ds-chart-wrapper" style={{ minHeight: '300px' }}> 
                    <Line data={chartData} options={chartOptions} redraw={false} />
                </div>
            </div>

            <div className="ds-card ds-perf-card">
                <h3>Weekly Performance Breakdown</h3>
                <div className="ds-perf-grid">
                    {Object.keys(data.weekly_data).map((week, idx) => (
                        <div key={week} className="ds-perf-item">
                            <div className="ds-perf-info">
                                <span>{week}</span>
                                <strong>{performanceScores[idx]}%</strong>
                            </div>
                            <div className="ds-bar-track">
                                <div
                                    className="ds-bar-fill"
                                    style={{
                                        width: `${performanceScores[idx]}%`,
                                        backgroundColor: WEEK_COLORS[idx % WEEK_COLORS.length],
                                        transition: `width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(DominantStyle);