import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { TrendingUp, Activity, TrendingDown, Brain, Eye, Hand, AlertTriangle } from "lucide-react";
import "./Status_css.css";

ChartJS.register(ArcElement, Tooltip);

const Status = () => {
    const { data } = useOutletContext();

    if (!data) return <div className="ds-loading">Analyzing behavioral data...</div>;

    const statusConfig = {
        Improving: { color: "#10b981", icon: <TrendingUp size={18} />, bg: "#ecfdf5", label: "Positive Adaptation" },
        Stable: { color: "#f59e0b", icon: <Activity size={18} />, bg: "#fffbeb", label: "Behavior Stable" },
        Declining: { color: "#ef4444", icon: <TrendingDown size={18} />, bg: "#fef2f2", label: "Needs Intervention" }
    };

    const current = statusConfig[data.status] || statusConfig.Stable;

    const gaugeData = useMemo(() => ({
        datasets: [{
            data: [data.overall_focus, 100 - data.overall_focus],
            backgroundColor: [current.color, "#e2e8f0"],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: "85%",
        }]
    }), [data.overall_focus, current.color]);

    const insights = useMemo(() => {
        const dominant = data.dominant;
        const focus = data.overall_focus;
        const change = parseFloat(data.week_change);

        if (data.status === "Improving") {
            return [
                {
                    icon: <Brain size={20} />,
                    title: "Improved Cognitive Engagement",
                    desc: `Student shows increased engagement with ${dominant} modality.`,
                },
                {
                    icon: dominant === "Visual" ? <Eye size={20} /> : <Hand size={20} />,
                    title: "Effective Learning Channel",
                    desc: `${dominant} learning strategy is yielding better comprehension.`,
                },
                {
                    icon: <TrendingUp size={20} />,
                    title: "Positive Behaviour Shift",
                    desc: `Behavior improved by ${change}%. Continue current strategy.`,
                }
            ];
        }

        if (data.status === "Stable") {
            return [
                {
                    icon: <Activity size={20} />,
                    title: "Stable Engagement Pattern",
                    desc: `Student engagement is consistent but not improving.`,
                },
                {
                    icon: <Brain size={20} />,
                    title: "Need Modality Variation",
                    desc: `Combine ${dominant} with other modalities for better stimulation.`,
                },
                {
                    icon: <TrendingDown size={20} />,
                    title: "Behaviour Plateau",
                    desc: `Minimal change detected. Requires adaptive intervention.`,
                }
            ];
        }

        return [
            {
                icon: <AlertTriangle size={20} />,
                title: "Reduced Engagement",
                desc: `Focus dropped to ${focus}%. Immediate intervention needed.`,
            },
            {
                icon: <Brain size={20} />,
                title: "Learning Mismatch",
                desc: `${dominant} modality may not be effective currently.`,
            },
            {
                icon: <TrendingDown size={20} />,
                title: "Negative Behaviour Trend",
                desc: `Performance decreased by ${change}%. Adjust teaching method.`,
            }
        ];
    }, [data]);

    return (
        <div className="status-container">
            <header className="status-header">
                <div className="status-badge-large" style={{ backgroundColor: current.bg, color: current.color }}>
                    {current.icon}
                    {current.label}
                </div>
                <h1 className="status-title">Behavioral Analytics Status</h1>
                <p className="status-subtitle">
                    Multimodal learning-based behavioral prediction insights
                </p>
            </header>

            <div className="status-grid">
                <div className="status-card gauge-card">
                    <h3>Engagement Intensity</h3>

                    <div className="gauge-wrapper">
                        <Doughnut
                            data={gaugeData}
                            options={{
                                plugins: { legend: { display: false } },
                                maintainAspectRatio: false
                            }}
                        />

                        <div className="gauge-center">
                            <span className="gauge-value">{data.overall_focus}%</span>
                            <span className="gauge-label">Engagement</span>
                        </div>
                    </div>

                    <div className="gauge-footer">
                        <p>
                            Behavioral change: <strong>{data.week_change}%</strong>
                        </p>
                    </div>
                </div>

                <div className="status-card detail-card">
                    <h3>Current Behaviour State</h3>

                    <div className="metric-row">
                        <div className="metric-item">
                            <span className="m-label">Dominant Modality</span>
                            <span className="m-value">{data.dominant}</span>
                        </div>

                        <div className="metric-item">
                            <span className="m-label">Trend Change</span>
                            <span className="m-value" style={{ color: current.color }}>
                                {data.week_change}%
                            </span>
                        </div>
                    </div>

                    <hr className="status-divider" />

                    <div className="status-summary">
                        <p>
                            The system predicts a <strong>{data.status.toLowerCase()}</strong> behavioral trend.
                            The student responds primarily to <strong>{data.dominant}</strong> learning inputs.
                            This indicates a need for <strong>adaptive multimodal reinforcement</strong> to optimize engagement.
                        </p>
                    </div>
                </div>
            </div>

            <section className="insights-section">
                <h3 className="section-heading">Intervention Insights</h3>

                <div className="insights-grid">
                    {insights.map((item, idx) => (
                        <div key={idx} className="insight-item-card">
                            <div className="insight-icon">{item.icon}</div>
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Status;