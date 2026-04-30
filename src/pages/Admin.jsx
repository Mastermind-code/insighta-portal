import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { apiRequest, getUser } from "../api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const currentUser = getUser();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const response = await apiRequest("GET", "/admin/users");
    if (response?.ok) {
      const data = await response.json();
      setUsers(data.data);
    }
    setLoading(false);
  }

  async function handleRoleChange(userId, newRole) {
    const response = await apiRequest("PATCH", `/admin/users/${userId}/role`, { role: newRole });
    if (response?.ok) {
      setMessage("Role updated.");
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      const data = await response?.json();
      setMessage(data?.message || "Failed to update role.");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleStatusToggle(userId, currentStatus) {
    const newStatus = !currentStatus;
    const response = await apiRequest("PATCH", `/admin/users/${userId}/status`, { is_active: newStatus });
    if (response?.ok) {
      setMessage(`User ${newStatus ? "activated" : "deactivated"}.`);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_active: newStatus } : u));
    } else {
      const data = await response?.json();
      setMessage(data?.message || "Failed to update status.");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  const cell = { padding: "0.75rem 1rem", borderBottom: "1px solid #2d3748" };
  const headerCell = { ...cell, color: "#a0aec0", background: "#2d3748", textAlign: "left" };

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Admin Panel</h2>
        <p style={{ color: "#a0aec0", marginBottom: "1.5rem" }}>Manage user roles and account status.</p>

        {message && (
          <div style={{
            background: "#2d3748", color: "#68d391", padding: "0.75rem 1rem",
            borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem",
          }}>
            {message}
          </div>
        )}

        {loading ? (
          <p style={{ color: "#a0aec0" }}>Loading users...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr>
                  {["Username", "Email", "Role", "Status", "Last Login", "Actions"].map((h) => (
                    <th key={h} style={headerCell}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} style={{ opacity: u.is_active ? 1 : 0.5 }}>
                      <td style={cell}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {u.avatar_url && (
                            <img src={u.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                          )}
                          @{u.username}
                          {isSelf && <span style={{ fontSize: "0.7rem", color: "#7c3aed" }}>(you)</span>}
                        </div>
                      </td>
                      <td style={cell}>{u.email || "—"}</td>
                      <td style={cell}>
                        <span style={{
                          padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
                          background: u.role === "admin" ? "#553c9a" : "#2b4c7e",
                          color: u.role === "admin" ? "#e9d8fd" : "#bee3f8",
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={cell}>
                        <span style={{
                          padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
                          background: u.is_active ? "#276749" : "#742a2a",
                          color: u.is_active ? "#9ae6b4" : "#fed7d7",
                        }}>
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ ...cell, color: "#a0aec0", fontSize: "0.8rem" }}>
                        {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : "Never"}
                      </td>
                      <td style={cell}>
                        {isSelf ? (
                          <span style={{ color: "#4a5568", fontSize: "0.8rem" }}>—</span>
                        ) : (
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              style={{
                                background: "#2d3748", border: "1px solid #4a5568", color: "#e2e8f0",
                                padding: "0.3rem 0.5rem", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer",
                              }}
                            >
                              <option value="analyst">analyst</option>
                              <option value="admin">admin</option>
                            </select>
                            <button
                              onClick={() => handleStatusToggle(u.id, u.is_active)}
                              style={{
                                background: u.is_active ? "#742a2a" : "#276749",
                                color: u.is_active ? "#fed7d7" : "#9ae6b4",
                                border: "none", padding: "0.3rem 0.6rem", borderRadius: "6px",
                                cursor: "pointer", fontSize: "0.8rem",
                              }}
                            >
                              {u.is_active ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
