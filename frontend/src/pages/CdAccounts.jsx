import { useState, useEffect } from "react";
import {
  Shield, TrendingUp, Calendar, Clock, DollarSign, User,
  ArrowUpRight, AlertTriangle, Search, Percent, Hash,
  CreditCard, RefreshCw, Lock, CheckCircle2, ChevronDown,
  BarChart2, Bell, Settings, LogOut,
} from "lucide-react";
import { useCdAccounts } from "../hooks/useCdAccounts";


const fmt = (v) =>
  Number(v).toLocaleString("en-IN", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function CDAccountDashboard() {
  const [accounts, setAccounts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilter] = useState("All");
  const [lastFetched, setFetched] = useState(null);
  const [spinning, setSpinning]   = useState(false);

const {data} = useCdAccounts()
console.log(data?.cds)
  

  const load = async () => {
    setLoading(true); setError(null); setSpinning(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      setAccounts(await res.json());
    } catch {
      setAccounts(MOCK_DATA);
      setError("Demo mode — connect your backend to load live data");
    } finally {
      setLoading(false);
      setFetched(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setTimeout(() => setSpinning(false), 600);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = data?.cds.filter((a) => {
    const matchQ = String(a.user).toLowerCase().includes(search.toLowerCase()) || String(a.id).includes(search);
    const matchF = filterStatus === "All" || a.status === filterStatus;
    return matchQ && matchF;
  });

  const totalP = accounts.reduce((s, a) => s + Number(a.principal_amount), 0);
  const totalM = accounts.reduce((s, a) => s + Number(a.maturity_amount), 0);
  const active = accounts.filter((a) => a.status === "Active").length;
  const gain   = totalM - totalP;

  return (
    <div style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", background: "#f0f4f8", minHeight: "100vh" }}>
        
      {/* ── TABLE SECTION ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "28px auto 40px", padding: "0 32px" }}>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 28px rgba(13,59,122,0.08), 0 1px 4px rgba(0,0,0,0.04)", border: "1px solid rgba(21,101,192,0.1)", overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafbff" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0a2342" }}>Account Registry</h2>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>
                {loading ? "Fetching from server…" : `Showing ${filtered.length} of ${accounts.length} accounts`}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#b45309", background: "#fef3c7", border: "1px solid #fde68a", padding: "6px 12px", borderRadius: 8 }}>
                  <AlertTriangle size={13} />
                  {error}
                </div>
              )}

              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #cbd5e1", borderRadius: 9, padding: "8px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <Search size={14} color="#94a3b8" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or ID…"
                  style={{ border: "none", outline: "none", fontSize: 13, color: "#1e293b", background: "transparent", width: 180 }}
                />
              </div>

              {/* Filter pills */}
              <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 9, padding: 3, border: "1px solid #e2e8f0" }}>
                {["All", "Active", "Matured"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    style={{ padding: "6px 16px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s",
                      background: filterStatus === s ? "#1565c0" : "transparent",
                      color: filterStatus === s ? "#fff" : "#64748b",
                      boxShadow: filterStatus === s ? "0 2px 8px rgba(21,101,192,0.3)" : "none",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8faff" }}>
                  {[
                    { label: "Account Holder",  icon: User       },
                    { label: "Principal",       icon: DollarSign },
                    { label: "Interest Rate",   icon: Percent    },
                    { label: "Duration",        icon: Clock      },
                    { label: "Maturity Amount", icon: TrendingUp },
                    { label: "Maturity Date",   icon: Calendar   },
                    { label: "Status",          icon: Shield     },
                    { label: "Created At",      icon: Clock      },
                  ].map(({ label, icon: Icon }) => (
                    <th key={label} style={{ padding: "13px 20px", textAlign: "left", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        <Icon size={11} color="#94a3b8" />
                        {label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} style={{ padding: "16px 20px" }}>
                          <div style={{ height: 12, borderRadius: 6, background: "#f1f5f9", width: `${40 + (j * 11) % 45}%`, animation: "pulse 1.5s ease-in-out infinite" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}>
                      <Search size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }} />
                      <div style={{ fontSize: 14, fontWeight: 600 }}>No accounts match your search</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Try a different name or ID</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((acc, idx) => {
                    const isActive  = acc.status === "Active";
                    const isMatured = acc.status === "Matured";

                    return (
                      <tr
                        key={acc.id}
                        style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fff" : "#fafbff", transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#eff6ff"}
                        onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafbff"}
                      >
        
                        {/* User */}
                        <td style={{ padding: "15px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1565c0,#42a5f5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                              {String(acc.user).split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>{acc.user}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>Account holder</div>
                            </div>
                          </div>
                        </td>

                        {/* Principal */}
                        <td style={{ padding: "15px 20px" }}>
                          <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, color: "#1e293b", fontSize: 14 }}>
                            {fmt(acc.principal_amount)}
                          </span>
                        </td>

                        {/* Interest Rate */}
                        <td style={{ padding: "15px 20px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#e8f5e9", color: "#2e7d32", padding: "4px 10px", borderRadius: 6, fontWeight: 700, fontSize: 13, fontFamily: "'Courier New', monospace" }}>
                            <TrendingUp size={11} />
                            {Number(acc.interest_rate).toFixed(2)}%
                          </div>
                        </td>

                        {/* Duration */}
                        <td style={{ padding: "15px 20px" }}>
                          <span style={{ color: "#475569", fontWeight: 600, fontFamily: "'Courier New', monospace" }}>
                            {acc.duration_years} yr{acc.duration_years !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Maturity Amount */}
                        <td style={{ padding: "15px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, color: "#1565c0", fontSize: 14 }}>
                              {fmt(acc.maturity_amount)}
                            </span>
                            <ArrowUpRight size={14} color="#2e7d32" />
                          </div>
                        </td>

                        {/* Maturity Date */}
                        <td style={{ padding: "15px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569", fontSize: 12 }}>
                            <Calendar size={12} color="#94a3b8" />
                            {acc.maturity_date}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "15px 20px" }}>
                          {isActive && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7" }}>
                              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4caf50", display: "inline-block" }} />
                              Active
                            </span>
                          )}
                          {isMatured && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#fff8e1", color: "#b45309", border: "1px solid #fde68a" }}>
                              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                              Matured
                            </span>
                          )}
                        </td>

                        {/* Created At */}
                        <td style={{ padding: "15px 20px", color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>
                          {acc.created_at}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div style={{ padding: "14px 28px", background: "#fafbff", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 12 }}>
              <Lock size={11} />
              <span>256-bit SSL Encrypted · FDIC Insured · Read-only View</span>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              © {new Date().getFullYear()} ChaseBank · All rights reserved
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}