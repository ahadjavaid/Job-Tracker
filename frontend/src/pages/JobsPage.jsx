import { useState, useEffect } from "react";
import { getOpenJobs, searchJobs, applyToJob }
    from "../services/api";

function JobsPage() {

    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Get username and role from localStorage
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // useEffect → runs when page loads!!
    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const response = await getOpenJobs();
            setJobs(response.data);
        } catch (err) {
            setError("Failed to load jobs!!");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!keyword.trim()) {
            loadJobs();
            return;
        }
        try {
            setLoading(true);
            const response = await searchJobs(keyword);
            setJobs(response.data);
        } catch (err) {
            setError("Search failed!!");
        } finally {
            setLoading(false);
        }
    };



    const handleApply = async (jobId) => {
        try {
            await applyToJob(jobId);
            setMessage(
                "Application submitted successfully!!"
            );
            // Clear message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
                setTimeout(() => setError(""), 3000);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        window.location.href = "/login";
    };

    return (
        <div style={styles.container}>

            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.navTitle}>
                    Job Tracker
                </h2>
                <div style={styles.navRight}>
                    <span style={styles.welcomeText}>
                        Welcome, {username}!!
                    </span>
                    <button
                        style={styles.navButton}
                        onClick={() =>
                            window.location.href =
                                "/my-applications"}>
                        My Applications
                    </button>
                    {role === "ROLE_ADMIN" && (
                        <button
                            style={styles.adminButton}
                            onClick={() =>
                                window.location.href =
                                    "/admin"}>
                            Admin Dashboard
                        </button>
                    )}
                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.content}>

                <h3 style={styles.pageTitle}>
                    Available Jobs
                </h3>

                {/* Search Bar */}
                <div style={styles.searchBar}>
                    <input
                        style={styles.searchInput}
                        type="text"
                        placeholder="Search jobs by title..."
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)}
                    />
                    <button
                        style={styles.searchButton}
                        onClick={handleSearch}>
                        Search
                    </button>
                    <button
                        style={styles.clearButton}
                        onClick={() => {
                            setKeyword("");
                            loadJobs();
                        }}>
                        Clear
                    </button>
                </div>

                {/* Success Message */}
                {message && (
                    <p style={styles.success}>{message}</p>
                )}

                {/* Error Message */}
                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                {/* Loading */}
                {loading && (
                    <p style={styles.loading}>
                        Loading jobs...
                    </p>
                )}

                {/* No Jobs Found */}
                {!loading && jobs.length === 0 && (
                    <p style={styles.noJobs}>
                        No jobs found!!
                    </p>
                )}

                {/* Jobs List */}
                <div style={styles.jobsList}>
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            style={styles.jobCard}>

                            {/* Job Header */}
                            <div style={styles.jobHeader}>
                                <h3 style={styles.jobTitle}>
                                    {job.title}
                                </h3>
                                <span style={styles.jobType}>
                                    {job.jobType}
                                </span>
                            </div>

                            {/* Company and Location */}
                            <p style={styles.company}>
                                {job.company}
                            </p>
                            <p style={styles.location}>
                                📍 {job.location}
                            </p>

                            {/* Description */}
                            <p style={styles.description}>
                                {job.description}
                            </p>

                            {/* Posted Date */}
                            <p style={styles.postedAt}>
                                Posted:{" "}
                                {new Date(job.postedAt)
                                    .toLocaleDateString()}
                            </p>

                            {/* Apply Button */}
                            <button
                                style={styles.applyButton}
                                onClick={() =>
                                    handleApply(job.id)}>
                                Apply Now
                            </button>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f0f2f5"
    },
    navbar: {
        backgroundColor: "#1a1a2e",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    navTitle: {
        color: "white",
        margin: "0",
        fontSize: "22px"
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    welcomeText: {
        color: "white",
        fontSize: "14px"
    },
    navButton: {
        padding: "8px 16px",
        backgroundColor: "#4361ee",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px"
    },
    adminButton: {
        padding: "8px 16px",
        backgroundColor: "#f72585",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px"
    },
    logoutButton: {
        padding: "8px 16px",
        backgroundColor: "#ef233c",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px"
    },
    content: {
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto"
    },
    pageTitle: {
        color: "#1a1a2e",
        fontSize: "24px",
        marginBottom: "20px"
    },
    searchBar: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
    },
    searchInput: {
        flex: "1",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "16px"
    },
    searchButton: {
        padding: "10px 20px",
        backgroundColor: "#4361ee",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },
    clearButton: {
        padding: "10px 20px",
        backgroundColor: "#adb5bd",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },
    jobsList: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    jobCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    jobHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px"
    },
    jobTitle: {
        color: "#1a1a2e",
        margin: "0",
        fontSize: "20px"
    },
    jobType: {
        backgroundColor: "#e0fbfc",
        color: "#0077b6",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },
    company: {
        color: "#4361ee",
        fontWeight: "bold",
        margin: "0 0 5px 0"
    },
    location: {
        color: "#666",
        margin: "0 0 10px 0"
    },
    description: {
        color: "#444",
        lineHeight: "1.6",
        margin: "0 0 10px 0"
    },
    postedAt: {
        color: "#999",
        fontSize: "13px",
        margin: "0 0 15px 0"
    },
    applyButton: {
        padding: "10px 24px",
        backgroundColor: "#4cc9f0",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    success: {
        color: "green",
        textAlign: "center",
        marginBottom: "15px"
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: "15px"
    },
    loading: {
        textAlign: "center",
        color: "#666"
    },
    noJobs: {
        textAlign: "center",
        color: "#666",
        fontSize: "18px"
    }
};

export default JobsPage;