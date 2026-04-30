import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUser, logout } from "../api";

export default function Account() {
  const user = getUser();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Account</h2>
        <div
          style={{
            background: "#1a1d27",
            border: "1px solid #2d3748",
            borderRadius: "8px",
            padding: "2rem",
          }}
        >
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt="avatar"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                marginBottom: "1rem",
              }}
            />
          )}
          {[
            ["Username", `@${user?.username}`],
            ["Email", user?.email || "—"],
            ["Role", user?.role],
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
              <span style={{ color: label === "Role" ? "#7c3aed" : "#e2e8f0" }}>
                {value}
              </span>
            </div>
          ))}
          <button
            onClick={handleLogout}
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
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
