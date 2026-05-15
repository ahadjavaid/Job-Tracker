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

    const getStatusConfig = (status) => {
        switch (status) {
            case "APPLIED":
                return {
                    color: "#4361ee",
                    bg: "rgba(67,97,238,0.15)",
                    border: "rgba(67,97,238,0.3)",
                    icon: "📩"
                };
            case "INTERVIEW":
                return {
                    color: "#f77f00",
                    bg: "rgba(247,127,0,0.15)",
                    border: "rgba(247,127,0,0.3)",
                    icon: "🎯"
                };
            case "OFFER":
                return {
                    color: "#22c55e",
                    bg: "rgba(34,197,94,0.15)",
                    border: "rgba(34,197,94,0.3)",
                    icon: "🎉"
                };
            case "REJECTED":
                return {
                    color: "#ef4444",
                    bg: "rgba(239,68,68,0.15)",
                    border: "rgba(239,68,68,0.3)",
                    icon: "❌"
                };
            default:
                return {
                    color: "#6b7280",
                    bg: "rgba(107,114,128,0.15)",
                    border: "rgba(107,114,128,0.3)",
                    icon: "📋"
                };
        }
    };

    const getStats = () => {
        return {
            total: applications.length,
            applied: applications.filter(
                a => a.status === "APPLIED").length,
            interview: applications.filter(
                a => a.status === "INTERVIEW").length,
            offer: applications.filter(
                a => a.status === "OFFER").length,
            rejected: applications.filter(
                a => a.status === "REJECTED").length
        };
    };

    const stats = getStats();

    return (
        <div style={styles.page}>

            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <div style={styles.navLogo}>JT</div>
                    <span style={styles.navBrand}>
                        Job Tracker
                    </span>
                </div>
                <div style={styles.navRight}>
                    <span style={styles.welcomeText}>
                        👋 {username}
                    </span>
                    <button
                        style={styles.navBtn}
                        onClick={() =>
                            window.location.href = "/jobs"}>
                        Browse Jobs
                    </button>
                    <button
                        style={styles.logoutBtn}
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div style={styles.content}>

                {/* Page Header */}
                <div style={styles.pageHeader}>
                    <h2 style={styles.pageTitle}>
                        My Applications
                    </h2>
                    <p style={styles.pageSubtitle}>
                        Track your job application journey
                    </p>
                </div>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <span style={styles.statNumber}>
                            {stats.total}
                        </span>
                        <span style={styles.statLabel}>
                            Total Applied
                        </span>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        borderColor: "rgba(67,97,238,0.3)"
                    }}>
                        <span style={{
                            ...styles.statNumber,
                            color: "#4361ee"
                        }}>
                            {stats.applied}
                        </span>
                        <span style={styles.statLabel}>
                            In Review
                        </span>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        borderColor: "rgba(247,127,0,0.3)"
                    }}>
                        <span style={{
                            ...styles.statNumber,
                            color: "#f77f00"
                        }}>
                            {stats.interview}
                        </span>
                        <span style={styles.statLabel}>
                            Interviews
                        </span>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        borderColor: "rgba(34,197,94,0.3)"
                    }}>
                        <span style={{
                            ...styles.statNumber,
                            color: "#22c55e"
                        }}>
                            {stats.offer}
                        </span>
                        <span style={styles.statLabel}>
                            Offers
                        </span>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={styles.errorBox}>
                        ⚠ {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={styles.loadingBox}>
                        Loading your applications...
                    </div>
                )}

                {/* Empty State */}
                {!loading &&
                    applications.length === 0 && (
                    <div style={styles.emptyState}>
                        <p style={styles.emptyIcon}>
                            📭
                        </p>
                        <p style={styles.emptyTitle}>
                            No applications yet!!
                        </p>
                        <p style={styles.emptySubtitle}>
                            Start applying to jobs and
                            track them here!!
                        </p>
                        <button
                            style={styles.browseBtn}
                            onClick={() =>
                                window.location.href =
                                    "/jobs"}>
                            Browse Jobs →
                        </button>
                    </div>
                )}

                {/* Applications List */}
                <div style={styles.applicationsList}>
                    {applications.map((app) => {
                        const config =
                            getStatusConfig(app.status);
                        return (
                            <div
                                key={app.id}
                                style={styles.appCard}>

                                {/* Left — Company Logo */}
                                <div style={styles.appLogo}>
                                    {app.company
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                {/* Middle — Job Info */}
                                <div style={styles.appInfo}>
                                    <h3 style={styles.appJobTitle}>
                                        {app.jobTitle}
                                    </h3>
                                    <p style={styles.appCompany}>
                                        {app.company}
                                    </p>
                                    <p style={styles.appDate}>
                                        Applied:{" "}
                                        {new Date(
                                            app.appliedAt)
                                            .toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Right — Status Badge */}
                                <div style={{
                                    ...styles.statusBadge,
                                    backgroundColor:
                                        config.bg,
                                    border: `1px solid
                                        ${config.border}`,
                                    color: config.color
                                }}>
                                    <span>
                                        {config.icon}
                                    </span>
                                    <span>
                                        {app.status}
                                    </span>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#0f0f1a",
        fontFamily: "'Segoe UI', sans-serif"
    },
    navbar: {
        backgroundColor: "#13131f",
        borderBottom: "1px solid #1e1e3a",
        padding: "0 30px",
        height: "65px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: "0",
        zIndex: "100"
    },
    navLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    navLogo: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px"
    },
    navBrand: {
        color: "white",
        fontWeight: "700",
        fontSize: "18px"
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    welcomeText: {
        color: "#9ca3af",
        fontSize: "14px"
    },
    navBtn: {
        padding: "8px 16px",
        backgroundColor: "#1a1a2e",
        color: "#a8b8ff",
        border: "1px solid #2d2d4e",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px"
    },
    logoutBtn: {
        padding: "8px 16px",
        backgroundColor: "rgba(239,68,68,0.15)",
        color: "#ef4444",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px"
    },
    content: {
        padding: "40px 30px",
        maxWidth: "900px",
        margin: "0 auto"
    },
    pageHeader: {
        marginBottom: "30px"
    },
    pageTitle: {
        color: "white",
        fontSize: "32px",
        fontWeight: "700",
        margin: "0 0 8px 0"
    },
    pageSubtitle: {
        color: "#6b7280",
        margin: "0",
        fontSize: "16px"
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "30px"
    },
    statCard: {
        backgroundColor: "#13131f",
        border: "1px solid #1e1e3a",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },
    statNumber: {
        color: "white",
        fontSize: "32px",
        fontWeight: "800"
    },
    statLabel: {
        color: "#6b7280",
        fontSize: "14px"
    },
    errorBox: {
        backgroundColor: "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "10px",
        padding: "14px",
        color: "#ef4444",
        marginBottom: "20px"
    },
    loadingBox: {
        textAlign: "center",
        padding: "60px",
        color: "#6b7280",
        fontSize: "18px"
    },
    emptyState: {
        textAlign: "center",
        padding: "80px 20px"
    },
    emptyIcon: {
        fontSize: "60px",
        margin: "0 0 20px 0"
    },
    emptyTitle: {
        color: "white",
        fontSize: "24px",
        fontWeight: "600",
        margin: "0 0 10px 0"
    },
    emptySubtitle: {
        color: "#6b7280",
        margin: "0 0 24px 0"
    },
    browseBtn: {
        padding: "12px 28px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600"
    },
    applicationsList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    appCard: {
        backgroundColor: "#13131f",
        border: "1px solid #1e1e3a",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },
    appLogo: {
        width: "52px",
        height: "52px",
        borderRadius: "12px",
        background:
            "linear-gradient(135deg, #4361ee22, #7209b722)",
        border: "1px solid #2d2d4e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#a8b8ff",
        fontWeight: "bold",
        fontSize: "22px",
        flexShrink: "0"
    },
    appInfo: {
        flex: "1"
    },
    appJobTitle: {
        color: "white",
        fontSize: "18px",
        fontWeight: "700",
        margin: "0 0 4px 0"
    },
    appCompany: {
        color: "#a8b8ff",
        fontWeight: "600",
        margin: "0 0 4px 0",
        fontSize: "14px"
    },
    appDate: {
        color: "#4b5563",
        fontSize: "13px",
        margin: "0"
    },
    statusBadge: {
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexShrink: "0"
    }
};

export default MyApplicationsPage;