import { useState, useEffect } from "react";
import {
    getEmployerJobs,
    getEmployerApplications,
    createJob,
    deleteJob,
    updateApplicationStatus
} from "../services/api";

function EmployerDashboard() {

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState("jobs");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [expandedJobId, setExpandedJobId] = useState(null);

    const [newJob, setNewJob] = useState({
        title: "",
        company: "",
        description: "",
        location: "",
        jobType: "FULL_TIME"
    });

    const toggleJobDetails = (jobId) => {
        if (expandedJobId === jobId) {
            setExpandedJobId(null);
        } else {
            setExpandedJobId(jobId);
        }
    };

    useEffect(() => {
        loadJobs();
        loadApplications();
    }, []);

    const loadJobs = async () => {
        try {
            const response = await getEmployerJobs();
            setJobs(response.data);
        } catch (err) {
            setError("Failed to load jobs!!");
        }
    };

    const loadApplications = async () => {
        try {
            const response = await getEmployerApplications();
            setApplications(response.data);
        } catch (err) {
            setError("Failed to load applications!!");
        }
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const showError = (msg) => {
        setError(msg);
        setTimeout(() => setError(""), 3000);
    };

    const handleCreateJob = async () => {
        if (!newJob.title || !newJob.company
            || !newJob.description || !newJob.location) {
            showError("All fields are required!!");
            return;
        }
        try {
            setLoading(true);
            await createJob(newJob);
            showMessage("Job posted successfully!!");
            setNewJob({
                title: "",
                company: "",
                description: "",
                location: "",
                jobType: "FULL_TIME"
            });
            setShowForm(false);
            loadJobs();
        } catch (err) {
            if (err.response && err.response.data) {
                showError(err.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm(
            "Delete this job permanently?")) return;
        try {
            await deleteJob(jobId);
            showMessage("Job deleted!!");
            loadJobs();
        } catch (err) {
            showError("Failed to delete job!!");
        }
    };

    const handleStatusUpdate = async (
        appId, newStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            showMessage("Status updated!!");
            loadApplications();
        } catch (err) {
            showError("Failed to update status!!");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "APPLIED": return "#4361ee";
            case "INTERVIEW": return "#f77f00";
            case "OFFER": return "#22c55e";
            case "REJECTED": return "#ef4444";
            default: return "#6b7280";
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
                    <span style={styles.adminBadge}>
                        EMPLOYER
                    </span>
                </div>
                <div style={styles.navRight}>
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
                    <div>
                        <h2 style={styles.pageTitle}>
                            Employer Dashboard
                        </h2>
                        <p style={styles.pageSubtitle}>
                            Manage jobs and applications
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <span style={styles.statNumber}>
                            {jobs.length}
                        </span>
                        <span style={styles.statLabel}>
                            Total Jobs
                        </span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statNumber}>
                            {applications.length}
                        </span>
                        <span style={styles.statLabel}>
                            Total Applications
                        </span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={{
                            ...styles.statNumber,
                            color: "#f77f00"
                        }}>
                            {applications.filter(
                                a => a.status === "INTERVIEW"
                            ).length}
                        </span>
                        <span style={styles.statLabel}>
                            Interviews
                        </span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={{
                            ...styles.statNumber,
                            color: "#22c55e"
                        }}>
                            {applications.filter(
                                a => a.status === "OFFER"
                            ).length}
                        </span>
                        <span style={styles.statLabel}>
                            Offers Given
                        </span>
                    </div>
                </div>

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

                {/* Tabs */}
                <div style={styles.tabsRow}>
                    <div style={styles.tabs}>
                        <button
                            style={{
                                ...styles.tab,
                                ...(activeTab === "jobs"
                                    ? styles.activeTab
                                    : {})
                            }}
                            onClick={() =>
                                setActiveTab("jobs")}>
                            Jobs ({jobs.length})
                        </button>
                        <button
                            style={{
                                ...styles.tab,
                                ...(activeTab === "applications"
                                    ? styles.activeTab
                                    : {})
                            }}
                            onClick={() =>
                                setActiveTab("applications")}>
                            Applications (
                            {applications.length})
                        </button>
                    </div>
                    {activeTab === "jobs" && (
                        <button
                            style={styles.postJobBtn}
                            onClick={() =>
                                setShowForm(!showForm)}>
                            {showForm ? "✕ Cancel" :
                                "+ Post New Job"}
                        </button>
                    )}
                </div>

                {/* JOBS TAB */}
                {activeTab === "jobs" && (
                    <div>

                        {/* Create Job Form */}
                        {showForm && (
                            <div style={styles.formCard}>
                                <h3 style={styles.formTitle}>
                                    Post New Job
                                </h3>
                                <div style={styles.formGrid}>
                                    <input
                                        style={styles.input}
                                        placeholder="Job Title"
                                        value={newJob.title}
                                        onChange={(e) =>
                                            setNewJob({
                                                ...newJob,
                                                title:
                                                    e.target
                                                        .value
                                            })}
                                    />
                                    <input
                                        style={styles.input}
                                        placeholder="Company"
                                        value={newJob.company}
                                        onChange={(e) =>
                                            setNewJob({
                                                ...newJob,
                                                company:
                                                    e.target
                                                        .value
                                            })}
                                    />
                                    <input
                                        style={styles.input}
                                        placeholder="Location"
                                        value={newJob.location}
                                        onChange={(e) =>
                                            setNewJob({
                                                ...newJob,
                                                location:
                                                    e.target
                                                        .value
                                            })}
                                    />
                                    <select
                                        style={styles.select}
                                        value={newJob.jobType}
                                        onChange={(e) =>
                                            setNewJob({
                                                ...newJob,
                                                jobType:
                                                    e.target
                                                        .value
                                            })}>
                                        <option
                                            value="FULL_TIME">
                                            Full Time
                                        </option>
                                        <option
                                            value="PART_TIME">
                                            Part Time
                                        </option>
                                        <option
                                            value="INTERNSHIP">
                                            Internship
                                        </option>
                                    </select>
                                </div>
                                <textarea
                                    style={styles.textarea}
                                    placeholder="Job Description"
                                    value={newJob.description}
                                    onChange={(e) =>
                                        setNewJob({
                                            ...newJob,
                                            description:
                                                e.target.value
                                        })}
                                />
                                <button
                                    style={{
                                        ...styles.submitBtn,
                                        opacity:
                                            loading ? 0.7 : 1
                                    }}
                                    onClick={handleCreateJob}
                                    disabled={loading}>
                                    {loading
                                        ? "Posting..."
                                        : "Post Job"}
                                </button>
                            </div>
                        )}

                        {/* Jobs List */}
                        <div style={styles.list}>
                            {jobs.map((job) => (
                                <div key={job.id} style={styles.jobCardContainer}>
                                    <div
                                        style={{ ...styles.listCard, cursor: "pointer" }}
                                        onClick={() => toggleJobDetails(job.id)}>
                                        <div style={styles.listCardLeft}>
                                            <div style={styles.listLogo}>
                                                {job.company.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 style={styles.listTitle}>
                                                    {job.title}
                                                </h4>
                                                <p style={styles.listSub}>
                                                    {job.company} {" — "} {job.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            style={styles.listCardRight}
                                            onClick={(e) => e.stopPropagation()}>
                                            <span style={styles.openBadge}>
                                                OPEN
                                            </span>
                                            <button
                                                style={styles.deleteBtn}
                                                onClick={() => handleDeleteJob(job.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Job Details */}
                                    {expandedJobId === job.id && (
                                        <div style={styles.jobDetailsPanel}>
                                            <div style={styles.detailsGrid}>
                                                <div style={styles.detailItem}>
                                                    <span style={styles.detailLabel}>Job Type:</span>
                                                    <span style={styles.detailValue}>
                                                        {job.jobType.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <div style={styles.detailItem}>
                                                    <span style={styles.detailLabel}>Posted At:</span>
                                                    <span style={styles.detailValue}>
                                                        {new Date(job.postedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={styles.detailDescriptionBox}>
                                                <span style={styles.detailLabel}>Description:</span>
                                                <p style={styles.detailDescriptionText}>
                                                    {job.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* APPLICATIONS TAB */}
                {activeTab === "applications" && (
                    <div style={styles.list}>
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                style={styles.listCard}>
                                <div
                                    style={styles.listCardLeft}>
                                    <div style={styles.listLogo}>
                                        {app.company
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <div>
                                            <h4 style={styles.listTitle}>
                                                {app.jobTitle}
                                            </h4>


                                            <p style={styles.listSub}>
                                                Applicant Name: {app.applicantUsername}
                                            </p>

                                            <p style={styles.listSub}>
                                                Company: {app.company}
                                            </p>


                                            <p style={styles.listSub}>
                                                Applied At:{" "}
                                                {new Date(app.appliedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div style={
                                    styles.listCardRight}>
                                    <select
                                        style={{
                                            ...styles.statusSelect,
                                            color:
                                                getStatusColor(
                                                    app.status),
                                            borderColor:
                                                getStatusColor(
                                                    app.status)
                                                + "44"
                                        }}
                                        value={app.status}
                                        onChange={(e) =>
                                            handleStatusUpdate(
                                                app.id,
                                                e.target.value
                                            )}>
                                        <option value="APPLIED">
                                            Applied
                                        </option>
                                        <option
                                            value="INTERVIEW">
                                            Interview
                                        </option>
                                        <option value="OFFER">
                                            Offer
                                        </option>
                                        <option
                                            value="REJECTED">
                                            Rejected
                                        </option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
    adminBadge: {
        backgroundColor: "rgba(247,37,133,0.2)",
        color: "#f72585",
        border: "1px solid rgba(247,37,133,0.3)",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "1px"
    },
    navRight: {
        display: "flex",
        gap: "12px"
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
        maxWidth: "1100px",
        margin: "0 auto"
    },
    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },
    pageTitle: {
        color: "white",
        fontSize: "32px",
        fontWeight: "700",
        margin: "0 0 6px 0"
    },
    pageSubtitle: {
        color: "#6b7280",
        margin: "0",
        fontSize: "16px"
    },
    statsRow: {
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
    tabsRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },
    tabs: {
        display: "flex",
        gap: "4px",
        backgroundColor: "#13131f",
        border: "1px solid #1e1e3a",
        borderRadius: "10px",
        padding: "4px"
    },
    tab: {
        padding: "10px 24px",
        backgroundColor: "transparent",
        color: "#6b7280",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500"
    },
    activeTab: {
        backgroundColor: "#1e1e3a",
        color: "white"
    },
    postJobBtn: {
        padding: "10px 20px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px"
    },
    formCard: {
        backgroundColor: "#13131f",
        border: "1px solid #1e1e3a",
        borderRadius: "16px",
        padding: "28px",
        marginBottom: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    formTitle: {
        color: "white",
        margin: "0",
        fontSize: "18px",
        fontWeight: "600"
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px"
    },
    input: {
        backgroundColor: "#0f0f1a",
        border: "1px solid #2d2d4e",
        borderRadius: "8px",
        padding: "12px 14px",
        color: "white",
        fontSize: "14px",
        outline: "none"
    },
    select: {
        backgroundColor: "#0f0f1a",
        border: "1px solid #2d2d4e",
        borderRadius: "8px",
        padding: "12px 14px",
        color: "white",
        fontSize: "14px",
        outline: "none"
    },
    textarea: {
        backgroundColor: "#0f0f1a",
        border: "1px solid #2d2d4e",
        borderRadius: "8px",
        padding: "12px 14px",
        color: "white",
        fontSize: "14px",
        outline: "none",
        minHeight: "80px",
        resize: "vertical"
    },
    submitBtn: {
        padding: "12px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "15px"
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    listCard: {
        backgroundColor: "#13131f",
        border: "1px solid #1e1e3a",
        borderRadius: "12px",
        padding: "20px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    listCardLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    listLogo: {
        width: "44px",
        height: "44px",
        borderRadius: "10px",
        background:
            "linear-gradient(135deg, #4361ee22, #7209b722)",
        border: "1px solid #2d2d4e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#a8b8ff",
        fontWeight: "bold",
        fontSize: "18px",
        flexShrink: "0"
    },
    listTitle: {
        color: "white",
        margin: "0 0 4px 0",
        fontSize: "16px",
        fontWeight: "600"
    },
    listSub: {
        color: "#6b7280",
        margin: "0",
        fontSize: "13px"
    },
    listCardRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    openBadge: {
        backgroundColor: "rgba(34,197,94,0.15)",
        color: "#22c55e",
        border: "1px solid rgba(34,197,94,0.3)",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700"
    },
    deleteBtn: {
        padding: "8px 16px",
        backgroundColor: "rgba(239,68,68,0.15)",
        color: "#ef4444",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500"
    },
    statusSelect: {
        backgroundColor: "#0f0f1a",
        border: "1px solid",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        outline: "none"
    },
    jobCardContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "0"
    },
    jobDetailsPanel: {
        backgroundColor: "#1a1a2e",
        border: "1px solid #2d2d4e",
        borderRadius: "12px",
        padding: "20px 24px",
        marginTop: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px"
    },
    detailItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },
    detailLabel: {
        color: "#6b7280",
        fontSize: "13px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    detailValue: {
        color: "white",
        fontSize: "15px",
        fontWeight: "500"
    },
    detailDescriptionBox: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundColor: "#0f0f1a",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #1e1e3a"
    },
    detailDescriptionText: {
        color: "#9ca3af",
        fontSize: "14px",
        lineHeight: "1.6",
        margin: "0"
    }
};

export default EmployerDashboard;