// import axios from "axios";
// import { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Dashboard_CSS.css";

// const Home = () => {
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [dragActive, setDragActive] = useState(false);
//     const inputRef = useRef(null);
//     const navigate = useNavigate();

//     const uploadFile = async () => {
//         if (!file) return;
//         const formData = new FormData();
//         formData.append("file", file);
//         setLoading(true);
//         try {
//             const res = await axios.post(
//                 "http://127.0.0.1:5000/upload",
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             navigate("/dashboard", { state: { data: res.data } });
//         } catch (err) {
//             console.error(err);
//             alert("Something went wrong. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDrag = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
//         else if (e.type === "dragleave") setDragActive(false);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(false);
//         if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
//     };

//     return (
//         <div className="upload-wrapper">
//             <div className="upload-bg-orb upload-bg-orb--1" />
//             <div className="upload-bg-orb upload-bg-orb--2" />

//             <div className="upload-card">
//                 <div className="upload-icon">
//                     <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
//                     </svg>
//                 </div>

//                 <h1 className="upload-title">Learning Analytics</h1>
//                 <p className="upload-subtitle">Upload your CSV to generate insights</p>

//                 <div
//                     className={`drop-zone ${dragActive ? "drop-zone--active" : ""} ${file ? "drop-zone--has-file" : ""}`}
//                     onDragEnter={handleDrag}
//                     onDragOver={handleDrag}
//                     onDragLeave={handleDrag}
//                     onDrop={handleDrop}
//                     onClick={() => inputRef.current?.click()}
//                 >
//                     <input
//                         ref={inputRef}
//                         type="file"
//                         accept=".csv"
//                         className="drop-zone__input"
//                         onChange={(e) => setFile(e.target.files[0])}
//                     />

//                     {file ? (
//                         <div className="drop-zone__file-info">
//                             <span className="drop-zone__filename">{file.name}</span>
//                             <span className="drop-zone__filesize">
//                                 {(file.size / 1024).toFixed(1)} KB
//                             </span>
//                         </div>
//                     ) : (
//                         <>
//                             <p className="drop-zone__prompt">
//                                 Drag & drop your <strong>.csv</strong> file here
//                             </p>
//                             <p className="drop-zone__or">or click to browse</p>
//                         </>
//                     )}
//                 </div>

//                 <button
//                     className={`upload-btn ${!file ? "upload-btn--disabled" : ""}`}
//                     onClick={uploadFile}
//                     disabled={!file || loading}
//                 >
//                     {loading ? <span className="spinner" /> : "Analyze Data"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Home;





















import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

    const uploadFile = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        try {
            const res = await axios.post(
                "http://127.0.0.1:5000/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            navigate("/dashboard", { state: { data: res.data } });
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
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
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    };

    return (
        <div className="upload-wrapper">
            <div className="upload-bg-orb upload-bg-orb--1" />
            <div className="upload-bg-orb upload-bg-orb--2" />

            {/* Download Sample Button — top right */}
            <button className="sample-download-btn" onClick={downloadSample}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0-4-4m4 4 4-4M4 20h16" />
                </svg>
                Download Sample CSV
            </button>

            <div className="upload-card">
                <div className="upload-icon">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
                    </svg>
                </div>

                <h1 className="upload-title">Learning Analytics</h1>
                <p className="upload-subtitle">Upload your CSV to generate insights</p>

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
                            <span className="drop-zone__filename">{file.name}</span>
                            <span className="drop-zone__filesize">
                                {(file.size / 1024).toFixed(1)} KB
                            </span>
                        </div>
                    ) : (
                        <>
                            <p className="drop-zone__prompt">
                                Drag & drop your <strong>.csv</strong> file here
                            </p>
                            <p className="drop-zone__or">or click to browse</p>
                        </>
                    )}
                </div>

                <button
                    className={`upload-btn ${!file ? "upload-btn--disabled" : ""}`}
                    onClick={uploadFile}
                    disabled={!file || loading}
                >
                    {loading ? <span className="spinner" /> : "Analyze Data"}
                </button>
            </div>
        </div>
    );
};

export default Home;