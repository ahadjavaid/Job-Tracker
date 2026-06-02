import { useState } from "react";
import { loginUser } from "../services/api";

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Please enter username and password!!");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const response = await loginUser({
                username: username,
                password: password
            });
            const { token, role } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("username", username);
            if (role === "ROLE_ADMIN") {
                window.location.href = "/admin";
            } else if (role === "ROLE_EMPLOYER") {
                window.location.href = "/employer";
            } else {
                window.location.href = "/jobs";
            }
        } catch (err) {
            setError("Invalid username or password!!");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div style={styles.page}>

            {/* Left Side — Branding */}
            <div style={styles.leftPanel}>
                <div style={styles.brandContent}>
                    <div style={styles.logoCircle}>
                        <span style={styles.logoText}>HF</span>
                    </div>
                    <h1 style={styles.brandTitle}>
                        HireFlow
                    </h1>
                    <p style={styles.brandSubtitle}>
                        Your career journey starts here!!
                    </p>
                    <div style={styles.features}>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>
                                ✦
                            </span>
                            <span>Browse hundreds of jobs</span>
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>
                                ✦
                            </span>
                            <span>Track your applications</span>
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.featureIcon}>
                                ✦
                            </span>
                            <span>Get hired faster</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side — Login Form */}
            <div style={styles.rightPanel}>
                <div style={styles.formCard}>

                    <h2 style={styles.formTitle}>
                        Welcome Back!!
                    </h2>
                    <p style={styles.formSubtitle}>
                        Sign in to your account
                    </p>

                    {/* Error */}
                    {error && (
                        <div style={styles.errorBox}>
                            <span>⚠ {error}</span>
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
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)}
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        style={{
                            ...styles.loginButton,
                            opacity: loading ? 0.7 : 1
                        }}
                        onClick={handleLogin}
                        disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    {/* Divider */}
                    <div style={styles.divider}>
                        <div style={styles.dividerLine} />
                        <span style={styles.dividerText}>
                            or
                        </span>
                        <div style={styles.dividerLine} />
                    </div>

                    {/* Register Link */}
                    <button
                        style={styles.registerButton}
                        onClick={() =>
                            window.location.href = "/register"}>
                        Create New Account
                    </button>

                    <p style={styles.hint}>
                        Press Enter to sign in quickly!!
                    </p>

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

    // Left Panel
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
        fontSize: "42px",
        fontWeight: "800",
        margin: "0 0 15px 0",
        background:
            "linear-gradient(135deg, #ffffff, #a8b8ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    brandSubtitle: {
        fontSize: "18px",
        color: "#a8b8d8",
        marginBottom: "40px",
        lineHeight: "1.6"
    },
    features: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    featureItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#c8d8f0",
        fontSize: "16px"
    },
    featureIcon: {
        color: "#4361ee",
        fontSize: "18px"
    },

    // Right Panel
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
        gap: "20px"
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
        outline: "none",
        transition: "border-color 0.2s"
    },
    loginButton: {
        padding: "14px",
        background:
            "linear-gradient(135deg, #4361ee, #7209b7)",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(67,97,238,0.4)",
        transition: "transform 0.2s"
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
    registerButton: {
        padding: "14px",
        backgroundColor: "transparent",
        color: "#4361ee",
        border: "2px solid #4361ee",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer"
    },
    hint: {
        color: "#4b5563",
        fontSize: "13px",
        textAlign: "center",
        margin: "0"
    }
};

export default LoginPage;