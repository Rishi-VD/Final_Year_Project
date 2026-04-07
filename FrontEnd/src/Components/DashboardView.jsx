import { useContext, useMemo } from "react";
import { DataContext } from "../context/DataContext";
import { Line, Bar } from "react-chartjs-2";

const DashboardView = () => {
    const { data } = useContext(DataContext);
    if (!data) return <div style={{ padding: "20px" }}>Upload CSV first!</div>;
    const COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6"];

    const statusColor =
        data.status === "Improving"
            ? "#10b981"
            : data.status === "Declining"
                ? "#f43f5e"
                : "#f59e0b";

    const changeValue = parseFloat(data.week_change);
    const changePositive = changeValue >= 0;

    const performanceScores = useMemo(() =>
        Object.values(data.weekly_data).map(arr =>
            Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
        ),
        [data.weekly_data]
    );

    const lineData = {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        datasets: Object.keys(data.weekly_data).map((w, i) => ({
            label: w,
            data: data.weekly_data[w],
            borderColor: COLORS[i % COLORS.length],
            backgroundColor: COLORS[i % COLORS.length] + "22",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
        })),
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
        },
    };

    const barData = {
        labels: ["Verbal", "Visual", "Physical", "Written"],
        datasets: Object.keys(data.modality_data).map((w, i) => ({
            label: w,
            data: data.modality_data[w],
            backgroundColor: COLORS[i % COLORS.length],
            borderRadius: 6,
        })),
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
        },
    };


    return (
        <>
            <section className="stats">
                <div className="stat-card stat-card--focus">
                    <div className="stat-card__icon">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    </div>
                    <div className="stat-card__body">
                        <span className="stat-card__label">Overall Focus</span>
                        <span className="stat-card__value">{data.overall_focus}%</span>
                    </div>
                    <div className="stat-card__bar">
                        <div className="stat-card__bar-fill" style={{ width: `${data.overall_focus}%` }} />
                    </div>
                </div>

                <div className="stat-card stat-card--change">
                    <div className="stat-card__icon">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={changePositive ? "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" : "M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"} /></svg>
                    </div>
                    <div className="stat-card__body">
                        <span className="stat-card__label">Week Change</span>
                        <span className="stat-card__value" style={{ color: changePositive ? "#10b981" : "#f43f5e" }}>
                            {changePositive ? "+" : ""}{data.week_change}%
                        </span>
                    </div>
                    <span className={`stat-card__badge ${changePositive ? "stat-card__badge--up" : "stat-card__badge--down"}`}>
                        {changePositive ? "Up" : "Down"}
                    </span>
                </div>

                <div className="stat-card stat-card--style">
                    <div className="stat-card__icon">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
                    </div>
                    <div className="stat-card__body">
                        <span className="stat-card__label">Dominant Style</span>
                        <span className="stat-card__value stat-card__value--text">{data.dominant}</span>
                    </div>
                </div>

                <div className="stat-card stat-card--status">
                    <div className="stat-card__icon" style={{ background: statusColor + "18", color: statusColor }}>
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    </div>
                    <div className="stat-card__body">
                        <span className="stat-card__label">Status</span>
                        <span className="stat-card__value" style={{ color: statusColor }}>{data.status}</span>
                    </div>
                    <span className="stat-card__dot" style={{ background: statusColor }} />
                </div>
            </section>

            <section className="charts">
                <div className="chart-card">
                    <div className="chart-card__header">
                        <h3>Weekly Focus Trend</h3>
                        <span className="chart-card__badge">7 days</span>
                    </div>
                    <div className="chart-card__body" style={{ height: "300px" }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-card__header">
                        <h3>Learning Modality Breakdown</h3>
                        <span className="chart-card__badge">By style</span>
                    </div>
                    <div className="chart-card__body" style={{ height: "300px" }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            </section>

            <section className="chart-card" style={{ marginTop: "20px" }}>
                <div className="chart-card__header">
                    <h3 style={{ fontSize: "15px" }}>Weekly Performance Breakdown</h3>
                </div>

                <div style={{
                    display: "grid",
                    gap: "20px",
                    padding: "12px",
                    marginLeft: "12px",
                    paddingBottom: "11px",
                    maxHeight: "180px",
                    overflowY: "auto"
                }}>
                    {Object.keys(data.weekly_data).map((week, idx) => (
                        <div key={week}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "12px",
                                marginBottom: "3px"
                            }}>
                                <span style={{ color: "#64748b" }}>{week}</span>
                                <strong style={{ fontSize: "12px" }}>
                                    {performanceScores[idx]}%
                                </strong>
                            </div>

                            <div style={{
                                height: "6px",
                                background: "#e2e8f0",
                                borderRadius: "6px",
                                overflow: "hidden"
                            }}>
                                <div
                                    style={{
                                        width: `${performanceScores[idx]}%`,
                                        height: "100%",
                                        backgroundColor: COLORS[idx % COLORS.length],
                                        borderRadius: "6px",
                                        transition: "width 0.5s ease"
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default DashboardView;