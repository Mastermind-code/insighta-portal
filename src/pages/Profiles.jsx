import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: "",
    country_id: "",
    age_group: "",
    min_age: "",
    max_age: "",
    page: 1,
    limit: 10,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  async function fetchProfiles() {
    setLoading(true);
    const response = await apiRequest("GET", "/profiles", null, filters);
    if (response?.ok) {
      const data = await response.json();
      setProfiles(data.data);
      setMeta({
        page: data.page,
        total_pages: data.total_pages,
        total: data.total,
      });
    }
    setLoading(false);
  }

  function handleFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Profiles</h2>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { key: "gender", options: ["", "male", "female"], label: "Gender" },
            {
              key: "age_group",
              options: ["", "child", "teenager", "adult", "senior"],
              label: "Age Group",
            },
          ].map((f) => (
            <select
              key={f.key}
              value={filters[f.key]}
              onChange={(e) => handleFilter(f.key, e.target.value)}
              style={{
                background: "#2d3748",
                border: "1px solid #4a5568",
                color: "#e2e8f0",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
              }}
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o || f.label}
                </option>
              ))}
            </select>
          ))}
          <input
            placeholder="Country (e.g. NG)"
            value={filters.country_id}
            onChange={(e) => handleFilter("country_id", e.target.value)}
            style={{
              background: "#2d3748",
              border: "1px solid #4a5568",
              color: "#e2e8f0",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              width: "140px",
            }}
          />
          <input
            type="number"
            placeholder="Min Age"
            value={filters.min_age}
            onChange={(e) => handleFilter("min_age", e.target.value)}
            style={{
              background: "#2d3748",
              border: "1px solid #4a5568",
              color: "#e2e8f0",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              width: "100px",
            }}
          />
          <input
            type="number"
            placeholder="Max Age"
            value={filters.max_age}
            onChange={(e) => handleFilter("max_age", e.target.value)}
            style={{
              background: "#2d3748",
              border: "1px solid #4a5568",
              color: "#e2e8f0",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              width: "100px",
            }}
          />
        </div>

        {loading ? (
          <p style={{ color: "#a0aec0" }}>Loading profiles...</p>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.9rem",
                }}
              >
                <thead>
                  <tr style={{ background: "#2d3748" }}>
                    {[
                      "Name",
                      "Gender",
                      "Age",
                      "Age Group",
                      "Country",
                      "Probability",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          color: "#a0aec0",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/profiles/${p.id}`)}
                      style={{
                        cursor: "pointer",
                        borderBottom: "1px solid #2d3748",
                      }}
                    >
                      <td style={{ padding: "0.75rem 1rem" }}>{p.name}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background:
                              p.gender === "male" ? "#2b6cb0" : "#702459",
                            color: p.gender === "male" ? "#bee3f8" : "#fed7e2",
                          }}
                        >
                          {p.gender}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>{p.age}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>{p.age_group}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {p.country_id} — {p.country_name}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {(p.gender_probability * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
                alignItems: "center",
              }}
            >
              <button
                disabled={meta.page <= 1}
                onClick={() => handleFilter("page", meta.page - 1)}
                style={{
                  background: "#2d3748",
                  color: "#e2e8f0",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  opacity: meta.page <= 1 ? 0.4 : 1,
                }}
              >
                ← Prev
              </button>
              <span style={{ color: "#a0aec0" }}>
                Page {meta.page} of {meta.total_pages}
              </span>
              <button
                disabled={meta.page >= meta.total_pages}
                onClick={() => handleFilter("page", meta.page + 1)}
                style={{
                  background: "#2d3748",
                  color: "#e2e8f0",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  opacity: meta.page >= meta.total_pages ? 0.4 : 1,
                }}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
