import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiRequest, getUser } from "../api";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const response = await apiRequest("GET", `/profiles/${id}`);
    if (response?.ok) {
      const data = await response.json();
      setProfile(data.data);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this profile?")) return;
    const response = await apiRequest("DELETE", `/profiles/${id}`);
    if (response?.status === 204) {
      navigate("/profiles");
    }
  }

  if (loading)
    return (
      <div style={{ background: "#0f1117", minHeight: "100vh" }}>
        <Navbar />
        <p style={{ color: "#a0aec0", padding: "2rem" }}>Loading...</p>
      </div>
    );

  if (!profile)
    return (
      <div style={{ background: "#0f1117", minHeight: "100vh" }}>
        <Navbar />
        <p style={{ color: "#e53e3e", padding: "2rem" }}>Profile not found.</p>
      </div>
    );

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        <button
          onClick={() => navigate("/profiles")}
          style={{
            background: "#2d3748",
            color: "#e2e8f0",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "1.5rem",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            background: "#1a1d27",
            border: "1px solid #2d3748",
            borderRadius: "8px",
            padding: "2rem",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#7c3aed" }}>
            {profile.name}
          </h2>
          {[
            ["ID", profile.id],
            ["Gender", profile.gender],
            [
              "Gender Probability",
              `${(profile.gender_probability * 100).toFixed(1)}%`,
            ],
            ["Age", profile.age],
            ["Age Group", profile.age_group],
            ["Country", `${profile.country_id} — ${profile.country_name}`],
            [
              "Country Probability",
              `${(profile.country_probability * 100).toFixed(1)}%`,
            ],
            ["Created At", profile.created_at],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.75rem 0",
                borderBottom: "1px solid #2d3748",
              }}
            >
              <span style={{ color: "#a0aec0" }}>{label}</span>
              <span>{value}</span>
            </div>
          ))}

          {user?.role === "admin" && (
            <button
              onClick={handleDelete}
              style={{
                background: "#e53e3e",
                color: "white",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "1.5rem",
                width: "100%",
              }}
            >
              Delete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
