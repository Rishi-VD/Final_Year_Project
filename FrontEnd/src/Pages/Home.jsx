import axios from "axios";
import { useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import "./Dashboard_CSS.css";

const SAMPLE_CSV = `Week,Day,FocusScore,Verbal,Visual,Physical,Written
Week 1,Monday,,,,,
Week 1,Tuesday,,,,,
Week 1,Wednesday,,,,,
Week 1,Thursday,,,,,
Week 1,Friday,,,,,
Week 1,Saturday,,,,,
Week 1,Sunday,,,,,
Week 2,Monday,,,,,
Week 2,Tuesday,,,,,
Week 2,Wednesday,,,,,
Week 2,Thursday,,,,,
Week 2,Friday,,,,,
Week 2,Saturday,,,,,
Week 2,Sunday,,,,,
Week 3,Monday,,,,,
Week 3,Tuesday,,,,,
Week 3,Wednesday,,,,,
Week 3,Thursday,,,,,
Week 3,Friday,,,,,
Week 3,Saturday,,,,,
Week 3,Sunday,,,,,
Week 4,Monday,,,,,
Week 4,Tuesday,,,,,
Week 4,Wednesday,,,,,
Week 4,Thursday,,,,,
Week 4,Friday,,,,,
Week 4,Saturday,,,,,
Week 4,Sunday,,,,,`;

const Home = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { setData } = useContext(DataContext);

    const uploadFile = async () => {
        if (!file) {
            toast.error("Please select a CSV file");
            return;
        }

        setLoading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const getRandomScore = () =>
                    Math.floor(Math.random() * (80 - 40 + 1)) + 40;

                let invalidRowCount = 0;

                const cleanedData = results.data
                    .filter(row => {
                        const isValid = Object.values(row).every(
                            value => value && value.toString().trim() !== ""
                        );
                        if (!isValid) invalidRowCount++;
                        return isValid;
                    })
                    .map(row => {
                        const newRow = {};
                        for (let key in row) {
                            let value = row[key].toString().trim();
                            const lowerValue = value.toLowerCase();
                            if (lowerValue === "ab" || lowerValue === "absent" || lowerValue === "0") {
                                newRow[key] = getRandomScore();
                            } else {
                                newRow[key] = value;
                            }
                        }
                        return newRow;
                    });

                if (invalidRowCount > 0) {
                    toast.warning(`${invalidRowCount} invalid rows removed (empty fields found)`);
                }

                if (cleanedData.length === 0) {
                    toast.error("No valid data found after cleaning!");
                    setLoading(false);
                    return;
                }

                try {
                    const csvContent = Papa.unparse(cleanedData);
                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const formData = new FormData();
                    formData.append("file", blob, file.name);

                    const res = await axios.post(
                        "http://127.0.0.1:5000/upload",
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );

                    setData(res.data);
                    localStorage.setItem("dashboardData", JSON.stringify(res.data));
                    toast.success("Dashboard generated successfully");
                    navigate("/dashboard", { state: { data: res.data } });

                } catch (err) {
                    console.error(err);
                    toast.error("Upload failed. Try again.");
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    const downloadSample = () => {
        const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "Sample.csv";
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);

        if (e.dataTransfer.files?.[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="upload-wrapper">
            <div className="upload-bg-orb upload-bg-orb--1" />
            <div className="upload-bg-orb upload-bg-orb--2" />

            <button className="sample-download-btn" onClick={downloadSample}>
                Download Sample CSV
            </button>

            <div className="upload-card">
                <h1 className="upload-title">Learning Analytics</h1>
                <p className="upload-subtitle">
                    Upload your CSV to generate insights
                </p>

                <div
                    className={`drop-zone ${dragActive ? "drop-zone--active" : ""} ${file ? "drop-zone--has-file" : ""}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv"
                        className="drop-zone__input"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    {file ? (
                        <div className="drop-zone__file-info">
                            <span>{file.name}</span>
                            <span>{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                    ) : (
                        <>
                            <p>Drag & drop your <strong>.csv</strong> file here</p>
                            <p>or click to browse</p>
                        </>
                    )}
                </div>

                <button
                    className={`upload-btn ${!file ? "upload-btn--disabled" : ""}`}
                    onClick={uploadFile}
                    disabled={!file || loading}
                >
                    {loading ? "Processing..." : "Analyze Data"}
                </button>
            </div>
        </div>
    );
};

export default Home;