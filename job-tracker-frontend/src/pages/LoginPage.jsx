import { useState } from "react";
import { loginUser } from "../services/api";

function LoginPage() {

    // State for form inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // State for feedback messages
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // This runs when user clicks Login button
    const handleLogin = async () => {

        // Basic validation
        if (!username || !password) {
            setError("Please enter username and password!!");
            return;
        }

        try {
            // Show loading state
            setLoading(true);
            setError("");

            // Call Spring Boot login endpoint!!
            const response = await loginUser({
                username: username,
                password: password
            });

            // Extract data from response
            const { token, role } = response.data;

            // Save token and role in browser storage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("username", username);

            // Redirect based on role
            if (role === "ROLE_ADMIN") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/jobs";
            }

        } catch (err) {
            // Show error message
            setError("Invalid username or password!!");
        } finally {
            // Hide loading state
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                {/* Title */}
                <h2 style={styles.title}>
                    Job Tracker
                </h2>
                <p style={styles.subtitle}>
                    Login to your account
                </p>

                {/* Error Message */}
                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                {/* Username Input */}
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)}
                />

                {/* Password Input */}
                <div style={styles.passwordWrapper}>
                    <input
                        style={styles.input}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        style={styles.eyeButton}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                                    stroke="#555"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="3"
                                    stroke="#555"
                                    strokeWidth="2"
                                />
                            </svg>
                        ) : (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                                    stroke="#555"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8.5 8.5C9.32843 7.67157 10.5 7.5 12 7.5C15 7.5 16.5 9.5 16.5 12C16.5 13.5 15 15.5 12 15.5C10.5 15.5 9.32843 15.3284 8.5 14.5"
                                    stroke="#555"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 3L21 21"
                                    stroke="#555"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Login Button */}
                <button
                    style={styles.button}
                    onClick={handleLogin}
                    disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Register Link */}
                <p style={styles.registerText}>
                    Don't have an account?{" "}
                    <span
                        style={styles.link}
                        onClick={() =>
                            window.location.href = "/register"}>
                        Register here
                    </span>
                </p>

            </div>
        </div>
    );
}

// Styles object — like CSS but written in JavaScript!!
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5"
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    title: {
        textAlign: "center",
        color: "#1a1a2e",
        fontSize: "28px",
        margin: "0"
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        margin: "0"
    },
    passwordWrapper: {
        position: "relative",
        width: "100%",
        overflow: "hidden"
    },
    input: {
        width: "100%",
        padding: "12px 45px 12px 12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "16px",
        outline: "none",
        boxSizing: "border-box"
    },
    eyeButton: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "32px",
        height: "32px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",
        color: "#555"
    },
    button: {
        padding: "12px",
        backgroundColor: "#4361ee",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer"
    },
    error: {
        color: "red",
        textAlign: "center",
        margin: "0"
    },
    registerText: {
        textAlign: "center",
        color: "#666",
        margin: "0"
    },
    link: {
        color: "#4361ee",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default LoginPage;