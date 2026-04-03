import React from "react";
import { useData } from "../context/DataContext"; // Import the context
import { Bar } from "react-chartjs-2";

const Status = () => {
    const data = useData(); // Access the data from the context

    if (!data) {
        return <div>No data available</div>;
    }

    // Define the bar chart data for status insights
    const barData = {
        labels: ["Improving", "Stable", "Declining"],
        datasets: [
            {
                label: "Status Distribution",
                data: [
                    data.status === "Improving" ? 70 : 0,
                    data.status === "Stable" ? 50 : 0,
                    data.status === "Declining" ? 30 : 0,
                ],
                backgroundColor: ["#10b981", "#f59e0b", "#f43f5e"],
                borderRadius: 6,
                barPercentage: 0.7,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom", labels: { usePointStyle: true, padding: 20, font: { size: 12 } } },
            tooltip: { backgroundColor: "#1e1b4b", titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8 },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { grid: { color: "#e2e8f0" }, ticks: { font: { size: 11 } }, beginAtZero: true },
        },
    };

    // Insights based on the status
    const insights = {
        Improving: [
            "Keep up the good work and maintain consistency.",
            "Focus on areas where performance is slightly lower to ensure balanced growth.",
            "Encourage collaboration and knowledge sharing among team members.",
        ],
        Stable: [
            "Identify areas of stagnation and introduce new strategies to boost performance.",
            "Encourage innovation and experimentation to break through plateaus.",
            "Monitor trends closely to prevent potential declines.",
        ],
        Declining: [
            "Analyze the root causes of the decline and address them immediately.",
            "Provide additional support and resources to struggling areas.",
            "Set short-term achievable goals to regain momentum.",
        ],
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Status Overview</h2>
            <p className="text-gray-600 mb-6">
                The current status of the learning performance is <strong>{data.status}</strong>.
            </p>

            {/* Bar Chart */}
            <div className="chart-card">
                <div className="chart-card__header">
                    <h3>Status Distribution</h3>
                </div>
                <div className="chart-card__body" style={{ height: "300px" }}>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            {/* Insights */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Valuable Insights</h3>
                <ul className="list-disc pl-6 text-gray-600">
                    {insights[data.status]?.map((insight, index) => (
                        <li key={index} className="mb-2">
                            {insight}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Status;