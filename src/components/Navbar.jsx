import { Link, useNavigate } from "react-router-dom";
import { logout, getUser } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav
      style={{
        background: "#1a1d27",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #2d3748",
      }}
    >
      <span style={{ color: "#7c3aed", fontWeight: 700, fontSize: "1.2rem" }}>
        Insighta Labs+
      </span>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link
          to="/dashboard"
          style={{ color: "#a0aec0", textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <Link
          to="/profiles"
          style={{ color: "#a0aec0", textDecoration: "none" }}
        >
          Profiles
        </Link>
        <Link to="/search" style={{ color: "#a0aec0", textDecoration: "none" }}>
          Search
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin" style={{ color: "#f6ad55", textDecoration: "none" }}>
            Admin
          </Link>
        )}
        <Link
          to="/account"
          style={{ color: "#a0aec0", textDecoration: "none" }}
        >
          @{user?.username || "Account"}
        </Link>
        <button
          onClick={handleLogout}
          style={{
            background: "#e53e3e",
            color: "white",
            border: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
