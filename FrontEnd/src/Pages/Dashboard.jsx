import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { DataContext } from "../context/DataContext";
import { Outlet, NavLink } from "react-router-dom";
import "./Dashboard_CSS.css";

ChartJS.register(
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler
);

const COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6"];

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const data = location.state?.data;

    const [data, setData] = useState(() => {
        const saved = localStorage.getItem("dashboardData");
        return location.state?.data || (saved ? JSON.parse(saved) : null);
    });

    useEffect(() => {
        if (location.state?.data) {
            setData(location.state.data);
            localStorage.setItem("dashboardData", JSON.stringify(location.state.data));
        } else {
            const saved = localStorage.getItem("dashboardData");
            if (saved) setData(JSON.parse(saved));
        }
    }, [location.state]);

    if (!data) {
        navigate("/");
        return null;
    }

    /* ─── Chart configs ─── */
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
            legend: { position: "bottom", labels: { usePointStyle: true, padding: 20, font: { size: 12 } } },
            tooltip: { backgroundColor: "#1e1b4b", titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8 },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { grid: { color: "#e2e8f0" }, ticks: { font: { size: 11 } }, beginAtZero: true },
        },
    };

    const barData = {
        labels: ["Verbal", "Visual", "Physical", "Written"],
        datasets: Object.keys(data.modality_data).map((w, i) => ({
            label: w,
            data: data.modality_data[w],
            backgroundColor: COLORS[i % COLORS.length],
            borderRadius: 6,
            barPercentage: 0.7,
        })),
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

    const statusColor = data.status === "Improving" ? "#10b981" : data.status === "Declining" ? "#f43f5e" : "#f59e0b";
    const changeValue = parseFloat(data.week_change);
    const changePositive = changeValue >= 0;

    /* ─── Dashboard ─── */
    return (
        <DataContext.Provider value={{ data }}>
            <div className="dashboard">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar__brand">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                        </svg>
                        <span>Analytics</span>
                    </div>
                    <nav className="sidebar__nav">

                        <NavLink
                            to="/dashboard"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__link sidebar__link--active"
                                    : "sidebar__link"
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/dashboard/overall-focus"
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__link sidebar__link--active"
                                    : "sidebar__link"
                            }
                        >
                            Overall Focus
                        </NavLink>

                        <NavLink
                            to="/dashboard/week-change"
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__link sidebar__link--active"
                                    : "sidebar__link"
                            }
                        >
                            Week Change
                        </NavLink>

                        <NavLink
                            to="/dashboard/dominant-style"
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__link sidebar__link--active"
                                    : "sidebar__link"
                            }
                        >
                            Dominant Style
                        </NavLink>

                        <NavLink
                            to="/dashboard/status"
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__link sidebar__link--active"
                                    : "sidebar__link"
                            }
                        >
                            Status
                        </NavLink>

                    </nav>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <header className="topbar">
                        <div>
                            <h1 className="topbar__title">Dashboard</h1>
                            <p className="topbar__sub">Learning performance overview</p>
                        </div>
                        <div className="topbar__actions">
                            <button className="topbar__btn" onClick={() => navigate("/")}>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                                New Upload
                            </button>
                        </div>
                    </header>

                    <main className="main-content">
                        <Outlet context={{ data }} />
                    </main>
                </main>
            </div>
        </DataContext.Provider>
    );
};

export default Dashboard;