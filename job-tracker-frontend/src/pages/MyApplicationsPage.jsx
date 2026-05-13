import { useState, useEffect } from "react";
import { getMyApplications } from "../services/api";

function MyApplicationsPage() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username = localStorage.getItem("username");

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const response = await getMyApplications();
            setApplications(response.data);
        } catch (err) {
            setError("Failed to load applications!!");
        } finally {
            setLoading(false);
        }
    };

    // Color based on status!!
    const getStatusColor = (status) => {
        switch (status) {
            case "APPLIED":    return "#4361ee";
            case "INTERVIEW":  return "#f77f00";
            case "OFFER":      return "#2dc653";
            case "REJECTED":   return "#ef233c";
            default:           return "#666";
        }
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
                            window.location.href = "/jobs"}>
                        Browse Jobs
                    </button>
                    <button
                        style={styles.logoutButton}
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={styles.content}>

                <h3 style={styles.pageTitle}>
                    My Applications
                </h3>

                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                {loading && (
                    <p style={styles.loading}>
                        Loading applications...
                    </p>
                )}

                {!loading && applications.length === 0 && (
                    <div style={styles.emptyState}>
                        <p>You haven't applied to any jobs yet!!</p>
                        <button
                            style={styles.browseButton}
                            onClick={() =>
                                window.location.href = "/jobs"}>
                            Browse Jobs
                        </button>
                    </div>
                )}

                <div style={styles.applicationsList}>
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            style={styles.appCard}>

                            {/* Job Title and Status */}
                            <div style={styles.appHeader}>
                                <h3 style={styles.jobTitle}>
                                    {app.jobTitle}
                                </h3>
                                <span style={{
                                    ...styles.statusBadge,
                                    backgroundColor:
                                        getStatusColor(
                                            app.status)
                                }}>
                                    {app.status}
                                </span>
                            </div>

                            <p style={styles.company}>
                                {app.company}
                            </p>

                            <p style={styles.appliedAt}>
                                Applied:{" "}
                                {new Date(app.appliedAt)
                                    .toLocaleDateString()}
                            </p>

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
        cursor: "pointer"
    },
    logoutButton: {
        padding: "8px 16px",
        backgroundColor: "#ef233c",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
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
    applicationsList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    appCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    appHeader: {
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
    statusBadge: {
        color: "white",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },
    company: {
        color: "#4361ee",
        fontWeight: "bold",
        margin: "0 0 5px 0"
    },
    appliedAt: {
        color: "#999",
        fontSize: "13px",
        margin: "0"
    },
    emptyState: {
        textAlign: "center",
        padding: "50px",
        color: "#666"
    },
    browseButton: {
        padding: "12px 24px",
        backgroundColor: "#4361ee",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "15px",
        fontSize: "16px"
    },
    error: {
        color: "red",
        textAlign: "center"
    },
    loading: {
        textAlign: "center",
        color: "#666"
    }
};

export default MyApplicationsPage;