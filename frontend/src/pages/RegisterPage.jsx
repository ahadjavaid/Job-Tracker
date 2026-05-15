import { useState } from "react";
import { registerUser } from "../services/api";

function RegisterPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            setError("All fields are required!!");
            return;
        }
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            await registerUser({
                username: username,
                email: email,
                password: password
            });
            setSuccess(
                "Account created successfully!! Redirecting to login..."
            );
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("Registration failed!!");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleRegister();
    };

    return (
        <div style={styles.page}>

            {/* Left Side — Branding */}
            <div style={styles.leftPanel}>
                <div style={styles.brandContent}>
                    <div style={styles.logoCircle}>
                        <span style={styles.logoText}>JT</span>
                    </div>
                    <h1 style={styles.brandTitle}>
                        Join Us Today!!
                    </h1>
                    <p style={styles.brandSubtitle}>
                        Create your account and start
                        your career journey!!
                    </p>
                    <div style={styles.steps}>
                        <div style={styles.step}>
                            <div style={styles.stepNumber}>
                                1
                            </div>
                            <div style={styles.stepContent}>
                                <p style={styles.stepTitle}>
                                    Create Account
                                </p>
                                <p style={styles.stepDesc}>
                                    Register with your details
                                </p>
                            </div>
                        </div>
                        <div style={styles.step}>
                            <div style={styles.stepNumber}>
                                2
                            </div>
                            <div style={styles.stepContent}>
                                <p style={styles.stepTitle}>
                                    Browse Jobs
                                </p>
                                <p style={styles.stepDesc}>
                                    Find your perfect role
                                </p>
                            </div>
                        </div>
                        <div style={styles.step}>
                            <div style={styles.stepNumber}>
                                3
                            </div>
                            <div style={styles.stepContent}>
                                <p style={styles.stepTitle}>
                                    Get Hired!!
                                </p>
                                <p style={styles.stepDesc}>
                                    Land your dream job
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side — Register Form */}
            <div style={styles.rightPanel}>
                <div style={styles.formCard}>

                    <h2 style={styles.formTitle}>
                        Create Account
                    </h2>
                    <p style={styles.formSubtitle}>
                        Fill in your details to get started
                    </p>

                    {/* Error */}
                    {error && (
                        <div style={styles.errorBox}>
                            <span>⚠ {error}</span>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div style={styles.successBox}>
                            <span>✓ {success}</span>
                        </div>
                    )}

                    {/* Username */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Username
                        </label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    {/* Email */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Email Address
                        </label>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    {/* Password */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            Password
                        </label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        style={{
                            ...styles.registerButton,
                            opacity: loading ? 0.7 : 1
                        }}
                        onClick={handleRegister}
                        disabled={loading}>
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                    {/* Divider */}
                    <div style={styles.divider}>
                        <div style={styles.dividerLine} />
                        <span style={styles.dividerText}>
                            or
                        </span>
                        <div style={styles.dividerLine} />
                    </div>

                    {/* Login Link */}
                    <button
                        style={styles.loginButton}
                        onClick={() =>
                            window.location.href = "/login"}>
                        Already have an account? Sign In
                    </button>

                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        display: "flex",
        height: "100vh",
        backgroundColor: "#0f0f1a",
        fontFamily: "'Segoe UI', sans-serif"
    },
    leftPanel: {
        flex: 1,
        background:
            "linear-gradient(135deg, #1a1a3e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px"
    },
    brandContent: {
        color: "white",
        maxWidth: "400px"
    },
    logoCircle: {
        width: "80px",
        height: "80px",
        borderRadius: "20px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "30px",
        boxShadow: "0 10px 30px rgba(67,97,238,0.4)"
    },
    logoText: {
        color: "white",
        fontSize: "28px",
        fontWeight: "bold"
    },
    brandTitle: {
        fontSize: "38px",
        fontWeight: "800",
        margin: "0 0 15px 0",
        background:
            "linear-gradient(135deg, #ffffff, #a8b8ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    brandSubtitle: {
        fontSize: "16px",
        color: "#a8b8d8",
        marginBottom: "40px",
        lineHeight: "1.6"
    },
    steps: {
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },
    step: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    stepNumber: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "16px",
        flexShrink: "0",
        boxShadow: "0 4px 15px rgba(67,97,238,0.3)"
    },
    stepContent: {
        display: "flex",
        flexDirection: "column",
        gap: "2px"
    },
    stepTitle: {
        color: "white",
        fontWeight: "600",
        margin: "0",
        fontSize: "16px"
    },
    stepDesc: {
        color: "#6b7280",
        margin: "0",
        fontSize: "14px"
    },
    rightPanel: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        backgroundColor: "#0f0f1a"
    },
    formCard: {
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        flexDirection: "column",
        gap: "18px"
    },
    formTitle: {
        color: "white",
        fontSize: "32px",
        fontWeight: "700",
        margin: "0"
    },
    formSubtitle: {
        color: "#6b7280",
        margin: "0",
        fontSize: "16px"
    },
    errorBox: {
        backgroundColor: "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "8px",
        padding: "12px 16px",
        color: "#ef4444",
        fontSize: "14px"
    },
    successBox: {
        backgroundColor: "rgba(34,197,94,0.15)",
        border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: "8px",
        padding: "12px 16px",
        color: "#22c55e",
        fontSize: "14px"
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    label: {
        color: "#9ca3af",
        fontSize: "14px",
        fontWeight: "500"
    },
    input: {
        backgroundColor: "#1a1a2e",
        border: "1px solid #2d2d4e",
        borderRadius: "10px",
        padding: "14px 16px",
        color: "white",
        fontSize: "16px",
        outline: "none"
    },
    registerButton: {
        padding: "14px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(67,97,238,0.4)"
    },
    divider: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    dividerLine: {
        flex: 1,
        height: "1px",
        backgroundColor: "#2d2d4e"
    },
    dividerText: {
        color: "#6b7280",
        fontSize: "14px"
    },
    loginButton: {
        padding: "14px",
        backgroundColor: "transparent",
        color: "#4361ee",
        border: "2px solid #4361ee",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer"
    }
};

export default RegisterPage;