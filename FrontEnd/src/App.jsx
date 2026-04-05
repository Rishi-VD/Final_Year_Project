import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import OverallFocus from "./Components/OverAllFocus";
import WeekChange from "./Components/WeekChange";
import DominantStyle from "./Components/DominantStyle";
import Status from "./Components/Status";
import { Routes, Route } from "react-router-dom";
import DashboardView from "./Components/DashboardView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />}>

        <Route index element={<DashboardView />} />

        <Route path="overall-focus" element={<OverallFocus />} />
        <Route path="week-change" element={<WeekChange />} />
        <Route path="dominant-style" element={<DominantStyle />} />
        <Route path="status" element={<Status />} />

      </Route>
    </Routes>
  );
}

export default App;
