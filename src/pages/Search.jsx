import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    const response = await apiRequest("GET", "/profiles/search", null, {
      q: query,
    });
    if (response?.ok) {
      const data = await response.json();
      setResults(data.data);
      setMeta({
        total: data.total,
        page: data.page,
        total_pages: data.total_pages,
      });
    } else {
      const data = await response?.json();
      setError(data?.message || "Search failed");
      setResults([]);
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Natural Language Search</h2>

        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "young males from nigeria" or "adult females from kenya"'
            style={{
              flex: 1,
              background: "#2d3748",
              border: "1px solid #4a5568",
              color: "#e2e8f0",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#7c3aed",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        {error && (
          <div
            style={{
              background: "#742a2a",
              color: "#fed7d7",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {loading && <p style={{ color: "#a0aec0" }}>Searching...</p>}

        {results.length > 0 && (
          <>
            <p style={{ color: "#a0aec0", marginBottom: "1rem" }}>
              Found {meta.total} results
            </p>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr style={{ background: "#2d3748" }}>
                  {["Name", "Gender", "Age", "Country"].map((h) => (
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
                {results.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/profiles/${p.id}`)}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid #2d3748",
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem" }}>{p.name}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{p.gender}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{p.age}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{p.country_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
