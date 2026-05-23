import { useState, useEffect } from "react";
import { getOpenJobs, searchJobs, applyToJob }
    from "../services/api";

function JobsPage() {

    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

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
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
                setTimeout(() => setError(""), 3000);
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const getJobTypeColor = (type) => {
        switch (type) {
            case "FULL_TIME": return "#4361ee";
            case "PART_TIME": return "#7209b7";
            case "INTERNSHIP": return "#f77f00";
            default: return "#4361ee";
        }
    };

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
                            window.location.href =
                            "/my-applications"}>
                        My Applications
                    </button>
                    {role === "ROLE_ADMIN" && (
                        <button
                            style={styles.adminBtn}
                            onClick={() =>
                                window.location.href =
                                "/admin"}>
                            Admin Dashboard
                        </button>
                    )}
                    <button
                        style={styles.logoutBtn}
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>
                    Find Your Dream Job
                </h1>
                <p style={styles.heroSubtitle}>
                    Discover {jobs.length}+ opportunities
                    waiting for you
                </p>

                {/* Search Bar */}
                <div style={styles.searchContainer}>
                    <input
                        style={styles.searchInput}
                        type="text"
                        placeholder="Search by job title..."
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleSearch()}
                    />
                    <button
                        style={styles.searchBtn}
                        onClick={handleSearch}>
                        Search
                    </button>
                    {keyword && (
                        <button
                            style={styles.clearBtn}
                            onClick={() => {
                                setKeyword("");
                                loadJobs();
                            }}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div style={styles.content}>

                {/* Messages */}
                {message && (
                    <div style={styles.successToast}>
                        ✓ {message}
                    </div>
                )}
                {error && (
                    <div style={styles.errorToast}>
                        ⚠ {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={styles.loadingContainer}>
                        <div style={styles.loadingText}>
                            Loading jobs...
                        </div>
                    </div>
                )}

                {/* No Jobs */}
                {!loading && jobs.length === 0 && (
                    <div style={styles.emptyState}>
                        <p style={styles.emptyTitle}>
                            No jobs found!!
                        </p>
                        <p style={styles.emptySubtitle}>
                            Try a different search keyword
                        </p>
                    </div>
                )}

                {/* Jobs Grid */}
                <div style={styles.jobsGrid}>
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            style={styles.jobCard}>

                            {/* Card Header */}
                            <div style={styles.cardHeader}>
                                <div style={styles.companyLogo}>
                                    {job.company
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div style={styles.cardHeaderRight}>
                                    <span style={{
                                        ...styles.jobTypeBadge,
                                        backgroundColor:
                                            getJobTypeColor(
                                                job.jobType)
                                            + "22",
                                        color:
                                            getJobTypeColor(
                                                job.jobType)
                                    }}>
                                        {job.jobType
                                            .replace("_", " ")}
                                    </span>
                                </div>
                            </div>

                            {/* Job Info */}
                            <h3 style={styles.jobTitle}>
                                {job.title}
                            </h3>
                            <p style={styles.companyName}>
                                {job.company}
                            </p>
                            <p style={styles.location}>
                                📍 {job.location}
                            </p>

                            {/* Divider */}
                            <div style={styles.cardDivider} />

                            {/* Description */}
                            <p style={styles.description}>
                                {job.description.length > 100
                                    ? job.description
                                        .substring(0, 100)
                                    + "..."
                                    : job.description}
                            </p>

                            {/* Footer */}
                            <div style={styles.cardFooter}>
                                <span style={styles.postedDate}>
                                    🕐{" "}
                                    {new Date(job.postedAt)
                                        .toLocaleDateString()}
                                </span>
                                <button
                                    style={styles.applyBtn}
                                    onClick={() =>
                                        handleApply(job.id)}>
                                    Apply Now →
                                </button>
                            </div>

                        </div>
                    ))}
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

    // Navbar
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
        fontSize: "14px",
        fontWeight: "500"
    },
    adminBtn: {
        padding: "8px 16px",
        background:
            "linear-gradient(135deg, #f72585, #7209b7)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500"
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

    // Hero
    hero: {
        background:
            "linear-gradient(135deg, #1a1a3e 0%, #16213e 100%)",
        padding: "60px 30px",
        textAlign: "center",
        borderBottom: "1px solid #1e1e3a"
    },
    heroTitle: {
        color: "white",
        fontSize: "42px",
        fontWeight: "800",
        margin: "0 0 12px 0",
        background:
            "linear-gradient(135deg, #ffffff, #a8b8ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    heroSubtitle: {
        color: "#6b7280",
        fontSize: "18px",
        margin: "0 0 30px 0"
    },
    searchContainer: {
        display: "flex",
        gap: "10px",
        maxWidth: "600px",
        margin: "0 auto"
    },
    searchInput: {
        flex: "1",
        padding: "14px 20px",
        backgroundColor: "#1a1a2e",
        border: "1px solid #2d2d4e",
        borderRadius: "10px",
        color: "white",
        fontSize: "16px",
        outline: "none"
    },
    searchBtn: {
        padding: "14px 28px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "15px"
    },
    clearBtn: {
        padding: "14px 20px",
        backgroundColor: "#1a1a2e",
        color: "#9ca3af",
        border: "1px solid #2d2d4e",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "15px"
    },

    // Content
    content: {
        padding: "40px 30px",
        maxWidth: "1200px",
        margin: "0 auto"
    },

    // Toasts
    successToast: {
        backgroundColor: "rgba(34,197,94,0.15)",
        border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: "10px",
        padding: "14px 20px",
        color: "#22c55e",
        marginBottom: "20px",
        fontWeight: "500"
    },
    errorToast: {
        backgroundColor: "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "10px",
        padding: "14px 20px",
        color: "#ef4444",
        marginBottom: "20px",
        fontWeight: "500"
    },

    // Loading
    loadingContainer: {
        textAlign: "center",
        padding: "60px"
    },
    loadingText: {
        color: "#6b7280",
        fontSize: "18px"
    },

    // Empty State
    emptyState: {
        textAlign: "center",
        padding: "80px 20px"
    },
    emptyTitle: {
        color: "white",
        fontSize: "24px",
        fontWeight: "600",
        margin: "0 0 10px 0"
    },
    emptySubtitle: {
        color: "#6b7280",
        fontSize: "16px",
        margin: "0"
    },

    // Jobs Grid
    jobsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "24px"
    },

    // Job Card
    jobCard: {
        backgroundColor: "#13131f",
        border: "1px solid #1e1e3a",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "transform 0.2s, border-color 0.2s",
        cursor: "default"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    companyLogo: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background:
            "linear-gradient(135deg, #4361ee22, #7209b722)",
        border: "1px solid #2d2d4e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#a8b8ff",
        fontWeight: "bold",
        fontSize: "20px"
    },
    cardHeaderRight: {
        display: "flex",
        gap: "8px"
    },
    jobTypeBadge: {
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600"
    },
    jobTitle: {
        color: "white",
        fontSize: "18px",
        fontWeight: "700",
        margin: "0"
    },
    companyName: {
        color: "#a8b8ff",
        fontWeight: "600",
        margin: "0",
        fontSize: "15px"
    },
    location: {
        color: "#6b7280",
        margin: "0",
        fontSize: "14px"
    },
    cardDivider: {
        height: "1px",
        backgroundColor: "#1e1e3a"
    },
    description: {
        color: "#9ca3af",
        fontSize: "14px",
        lineHeight: "1.6",
        margin: "0",
        flex: "1"
    },
    cardFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto"
    },
    postedDate: {
        color: "#4b5563",
        fontSize: "13px"
    },
    applyBtn: {
        padding: "10px 20px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow:
            "0 4px 15px rgba(67,97,238,0.3)"
    }
};

export default JobsPage;