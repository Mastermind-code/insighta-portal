import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiRequest, getUser, saveUser, saveTokens, getToken, clearTokens, clearSession } from "../api";

const API_BASE = "https://stage-1-data-persistence-api-design.vercel.app/api/v1";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(getUser());
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlAccessToken = params.get("access_token");
        const urlRefreshToken = params.get("refresh_token");

        async function bootstrap() {
            // Local dev: tokens arrive in URL because cross-origin httponly cookies
            // can't be sent back in fetch requests from HTTP localhost.
            // Production: no URL tokens — httponly cookies are used automatically.
            let bearerToken = null;

            if (urlAccessToken && urlRefreshToken) {
                window.history.replaceState({}, "", "/dashboard");
                saveTokens(urlAccessToken, urlRefreshToken);
                bearerToken = urlAccessToken;
            } else {
                // StrictMode second run or returning user — token already in sessionStorage
                bearerToken = getToken();
            }

            try {
                const headers = { "X-API-Version": "1" };
                if (bearerToken) headers["Authorization"] = `Bearer ${bearerToken}`;

                const res = await fetch(`${API_BASE}/auth/whoami`, {
                    credentials: "include",
                    headers,
                });

                if (!res.ok) {
                    clearTokens();
                    clearSession();
                    navigate("/");
                    return;
                }

                const data = await res.json();
                saveUser(data.data);
                setUser(data.data);
                fetchStats();
            } catch (err) {
                console.error("[Dashboard] /whoami error:", err);
                clearTokens();
                clearSession();
                navigate("/");
            }
        }

        bootstrap();
    }, []);

    async function fetchStats() {
        try {
            const [totalRes, maleRes, femaleRes] = await Promise.all([
                apiRequest("GET", "/profiles", null, { limit: 1 }),
                apiRequest("GET", "/profiles", null, { gender: "male", limit: 1 }),
                apiRequest("GET", "/profiles", null, { gender: "female", limit: 1 })
            ]);

            const totalData = await totalRes?.json();
            const maleData = await maleRes?.json();
            const femaleData = await femaleRes?.json();

            setStats({
                total: totalData?.total,
                pages: totalData?.total_pages,
                males: maleData?.total,
                females: femaleData?.total
            });
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <div style={{ background: "#0f1117", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
                <h2 style={{ marginBottom: "0.5rem" }}>
                    Welcome back, @{user?.username}
                </h2>
                <p style={{ color: "#a0aec0", marginBottom: "2rem" }}>
                    Role: <span style={{ color: "#7c3aed" }}>{user?.role}</span>
                </p>

                {loading ? (
                    <p style={{ color: "#a0aec0" }}>Loading stats...</p>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem", marginBottom: "2rem"
                    }}>
                        {[
                            { label: "Total Profiles", value: stats?.total },
                            { label: "Male Profiles", value: stats?.males },
                            { label: "Female Profiles", value: stats?.females },
                            { label: "Total Pages", value: stats?.pages },
                        ].map(stat => (
                            <div key={stat.label} style={{
                                background: "#1a1d27", border: "1px solid #2d3748",
                                borderRadius: "8px", padding: "1.5rem", textAlign: "center"
                            }}>
                                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#7c3aed" }}>
                                    {stat.value ?? "—"}
                                </div>
                                <div style={{ color: "#a0aec0", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
