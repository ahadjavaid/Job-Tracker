import { useState, useEffect } from "react";
import {
    getAllJobs,
    getAllApplications,
    createJob,
    deleteJob,
    updateApplicationStatus
} from "../services/api";

function AdminDashboard() {

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState("jobs");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // New job form state
    const [newJob, setNewJob] = useState({
        title: "",
        company: "",
        description: "",
        location: "",
        jobType: "FULL_TIME"
    });

    useEffect(() => {
        loadJobs();
        loadApplications();
    }, []);

    const loadJobs = async () => {
        try {
            const response = await getAllJobs();
            setJobs(response.data);
        } catch (err) {
            setError("Failed to load jobs!!");
        }
    };

    const loadApplications = async () => {
        try {
            const response = await getAllApplications();
            setApplications(response.data);
        } catch (err) {
            setError("Failed to load applications!!");
        }
    };

    const handleCreateJob = async () => {
        if (!newJob.title || !newJob.company
            || !newJob.description
            || !newJob.location) {
            setError("All job fields are required!!");
            return;
        }

        try {
            setLoading(true);
            await createJob(newJob);
            setMessage("Job created successfully!!");
            // Reset form
            setNewJob({
                title: "",
                company: "",
                description: "",
                location: "",
                jobType: "FULL_TIME"
            });
            loadJobs();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm(
            "Are you sure you want to delete this job?"))
            return;

        try {
            await deleteJob(jobId);
            setMessage("Job deleted successfully!!");
            loadJobs();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError("Failed to delete job!!");
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            setMessage("Status updated successfully!!");
            loadApplications();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError("Failed to update status!!");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div style={styles.container}>

            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.navTitle}>
                    Job Tracker — Admin
                </h2>
                <div style={styles.navRight}>
                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={styles.content}>

                {/* Messages */}
                {message && (
                    <p style={styles.success}>{message}</p>
                )}
                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === "jobs"
                                ? styles.activeTab : {})
                        }}
                        onClick={() =>
                            setActiveTab("jobs")}>
                        Manage Jobs ({jobs.length})
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === "applications"
                                ? styles.activeTab : {})
                        }}
                        onClick={() =>
                            setActiveTab("applications")}>
                        Applications ({applications.length})
                    </button>
                </div>

                {/* JOBS TAB */}
                {activeTab === "jobs" && (
                    <div>

                        {/* Create Job Form */}
                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}>
                                Post New Job
                            </h3>

                            <input
                                style={styles.input}
                                placeholder="Job Title"
                                value={newJob.title}
                                onChange={(e) => setNewJob({
                                    ...newJob,
                                    title: e.target.value
                                })}
                            />

                            <input
                                style={styles.input}
                                placeholder="Company"
                                value={newJob.company}
                                onChange={(e) => setNewJob({
                                    ...newJob,
                                    company: e.target.value
                                })}
                            />

                            <input
                                style={styles.input}
                                placeholder="Location"
                                value={newJob.location}
                                onChange={(e) => setNewJob({
                                    ...newJob,
                                    location: e.target.value
                                })}
                            />

                            <textarea
                                style={styles.textarea}
                                placeholder="Job Description"
                                value={newJob.description}
                                onChange={(e) => setNewJob({
                                    ...newJob,
                                    description: e.target.value
                                })}
                            />

                            <select
                                style={styles.select}
                                value={newJob.jobType}
                                onChange={(e) => setNewJob({
                                    ...newJob,
                                    jobType: e.target.value
                                })}>
                                <option value="FULL_TIME">
                                    Full Time
                                </option>
                                <option value="PART_TIME">
                                    Part Time
                                </option>
                                <option value="INTERNSHIP">
                                    Internship
                                </option>
                            </select>

                            <button
                                style={styles.createButton}
                                onClick={handleCreateJob}
                                disabled={loading}>
                                {loading
                                    ? "Creating..."
                                    : "Post Job"}
                            </button>
                        </div>

                        {/* Jobs List */}
                        <h3 style={styles.sectionTitle}>
                            All Jobs
                        </h3>
                        <div style={styles.list}>
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <div>
                                            <h4 style={styles.cardTitle}>
                                                {job.title}
                                            </h4>
                                            <p style={styles.cardSubtitle}>
                                                {job.company} —{" "}
                                                {job.location}
                                            </p>
                                        </div>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() =>
                                                handleDeleteJob(
                                                    job.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* APPLICATIONS TAB */}
                {activeTab === "applications" && (
                    <div>
                        <h3 style={styles.sectionTitle}>
                            All Applications
                        </h3>
                        <div style={styles.list}>
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <div>
                                            <h4 style={styles.cardTitle}>
                                                {app.jobTitle}
                                            </h4>
                                            <p style={styles.cardSubtitle}>

                Application ID: {app.id}

            </p>
                                            <p style={styles.cardSubtitle}>
                                                Applicant:{" "}
                                                {app.applicantUsername}
                                            </p>
                                            <p style={styles.cardSubtitle}>
                                                Company:{" "}
                                                {app.company}
                                            </p>
                                            <p style={styles.cardSubtitle}>
                                                UserID:{" "}
                                                {app.userId}
                                            </p>
                                             <p style={styles.cardSubtitle}>

                Applied At:{" "}

                {new Date(app.appliedAt).toLocaleString()}

            </p>
                                        </div>

                                        {/* Status Dropdown */}
                                        <select
                                            style={styles.statusSelect}
                                            value={app.status}
                                            onChange={(e) =>
                                                handleStatusUpdate(
                                                    app.id,
                                                    e.target.value
                                                )}>
                                            <option value="APPLIED">
                                                Applied
                                            </option>
                                            <option value="INTERVIEW">
                                                Interview
                                            </option>
                                            <option value="OFFER">
                                                Offer
                                            </option>
                                            <option value="REJECTED">
                                                Rejected
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
        gap: "12px"
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
        maxWidth: "1000px",
        margin: "0 auto"
    },
    tabs: {
        display: "flex",
        gap: "10px",
        marginBottom: "25px"
    },
    tab: {
        padding: "10px 24px",
        backgroundColor: "white",
        border: "2px solid #ddd",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px"
    },
    activeTab: {
        backgroundColor: "#4361ee",
        color: "white",
        border: "2px solid #4361ee"
    },
    formCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    formTitle: {
        color: "#1a1a2e",
        margin: "0 0 5px 0"
    },
    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "15px"
    },
    textarea: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "15px",
        minHeight: "80px",
        resize: "vertical"
    },
    select: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "15px"
    },
    createButton: {
        padding: "12px",
        backgroundColor: "#4361ee",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "bold"
    },
    sectionTitle: {
        color: "#1a1a2e",
        marginBottom: "15px"
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    card: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    cardTitle: {
        color: "#1a1a2e",
        margin: "0 0 5px 0"
    },
    cardSubtitle: {
        color: "#666",
        margin: "2px 0",
        fontSize: "14px"
    },
    deleteButton: {
        padding: "8px 16px",
        backgroundColor: "#ef233c",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },
    statusSelect: {
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "14px",
        cursor: "pointer"
    },
    success: {
        color: "green",
        textAlign: "center",
        marginBottom: "15px",
        fontWeight: "bold"
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: "15px"
    }
};

export default AdminDashboard;