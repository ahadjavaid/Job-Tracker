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

        // Basic validation
        if (!username || !email || !password) {
            setError("All fields are required!!");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            // Call Spring Boot register endpoint!!
            await registerUser({
                username: username,
                email: email,
                password: password
            });

            // Success — redirect to login
            setSuccess(
                "Account created successfully!! Redirecting..."
            );

            // Wait 2 seconds then redirect to login
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);

        } catch (err) {
            // Show error from Spring Boot!!
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("Registration failed!!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <h2 style={styles.title}>Job Tracker</h2>
                <p style={styles.subtitle}>
                    Create your account
                </p>

                {/* Error Message */}
                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                {/* Success Message */}
                {success && (
                    <p style={styles.success}>{success}</p>
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

                {/* Email Input */}
                <input
                    style={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)}
                />

                {/* Password Input */}
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)}
                />

                {/* Register Button */}
                <button
                    style={styles.button}
                    onClick={handleRegister}
                    disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

                {/* Login Link */}
                <p style={styles.loginText}>
                    Already have an account?{" "}
                    <span
                        style={styles.link}
                        onClick={() =>
                            window.location.href = "/login"}>
                        Login here
                    </span>
                </p>

            </div>
        </div>
    );
}

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
    input: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "16px",
        outline: "none"
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
    success: {
        color: "green",
        textAlign: "center",
        margin: "0"
    },
    loginText: {
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

export default RegisterPage;