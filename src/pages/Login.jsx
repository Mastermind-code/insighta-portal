import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../api";

const API_BASE = "https://stage-1-data-persistence-api-design.vercel.app/api/v1";

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        // If already logged in go straight to dashboard
        if (isLoggedIn()) {
            navigate("/dashboard");
        }
    }, []);

    function handleLogin() {
        // Redirect to backend which handles GitHub OAuth
        window.location.href = `${API_BASE}/auth/github`;
    }

    return (
        <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: "100vh", background: "#0f1117"
        }}>
            <div style={{
                background: "#1a1d27", border: "1px solid #2d3748",
                borderRadius: "12px", padding: "3rem",
                width: "100%", maxWidth: "400px", textAlign: "center"
            }}>
                <h1 style={{ color: "#7c3aed", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                    Insighta Labs+
                </h1>
                <p style={{ color: "#a0aec0", marginBottom: "2rem" }}>
                    Demographic Intelligence Platform
                </p>
                <button onClick={handleLogin} style={{
                    background: "#24292e", color: "white",
                    border: "none", padding: "0.8rem 1.5rem",
                    borderRadius: "6px", cursor: "pointer",
                    fontSize: "1rem", width: "100%",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "0.5rem"
                }}>
                    <svg height="20" width="20" viewBox="0 0 16 16" fill="white">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    Continue with GitHub
                </button>
            </div>
        </div>
    );
}