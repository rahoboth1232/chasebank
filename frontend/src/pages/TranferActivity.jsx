import { useState } from "react";
import {
  ArrowUpRight,
  Search,
  Download,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useTransferData } from "../hooks/useTransfer";


// ── Helpers ──────────────────────────────────────────────
const fmt = (amount) =>
  Number(amount).toLocaleString("en-US", { style: "currency", currency: "USD" });

const fmtDate = (iso) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
};

const StatusBadge = ({ status }) => {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
        <CheckCircle2 size={11} /> Completed
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
        <Clock size={11} /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5">
      <XCircle size={11} /> Rejected
    </span>
  );
};


export default function TransferActivity() {
  const { data, isLoading: loading, error } = useTransferData();
  // Supports both { transfer_requests: [...] } and plain array
  const transfers = data?.transfer_requests ?? data ?? [];

  console.log(transfers)

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  // ── Filter ──
  const filtered = transfers.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      String(t.id).includes(q) ||
      (t.from_account ?? "").toLowerCase().includes(q) ||
      (t.to_account ?? "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All" || t.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  console.log(filtered)

  // ── Totals ──
  const totalPending   = filtered.filter((t) => t.status === "pending").reduce((s, t) => s + Number(t.amount), 0);
  const totalCompleted = filtered.filter((t) => t.status === "approved").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Source Serif 4', Georgia, serif; }
        .sans  { font-family: 'DM Sans', sans-serif; }
        .row-anim { animation: rowIn 0.2s ease both; }
        @keyframes rowIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        .detail-anim { animation: detailIn 0.18s ease both; }
        @keyframes detailIn { from { opacity:0; } to { opacity:1; } }
        .hover-row:hover { background: #f0f4ff; }
        .skeleton { background: linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%); background-size:200% 100%; animation: shimmer 1.2s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      <div className="max-w-screen-lg mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-1 sans">Pay & Transfer</p>
            <h1 className="serif text-3xl font-semibold text-gray-900 leading-tight">Transfer Activity</h1>
            <p className="text-sm text-gray-400 mt-1 sans">
              {loading ? "Loading..." : `${transfers.length} transfer${transfers.length !== 1 ? "s" : ""} on record`}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-sm font-medium text-blue-700 border border-blue-200 bg-white px-4 py-2 rounded-md hover:bg-blue-50 transition sans">
              <RefreshCw size={14} /> New Transfer
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 bg-white px-4 py-2 rounded-md hover:bg-gray-50 transition sans">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 sans">Total Transfers</p>
            <p className="serif text-2xl font-semibold text-gray-800">{filtered.length}</p>
            <p className="text-xs text-gray-400 mt-1 sans">In this view</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 sans">Pending Amount</p>
            <p className="serif text-2xl font-semibold text-amber-600">{fmt(totalPending)}</p>
            <p className="text-xs text-gray-400 mt-1 sans">Awaiting processing</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 sans">Completed Amount</p>
            <p className="serif text-2xl font-semibold text-green-700">{fmt(totalCompleted)}</p>
            <p className="text-xs text-gray-400 mt-1 sans">Successfully processed</p>
          </div>
        </div>

        {/* ── Search & Filter bar ── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or account..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-50 sans"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Pending", "Completed", "Failed"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition sans ${
                  statusFilter === f
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error state ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 sans mb-4">
            Failed to load transfers: {error}
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Head */}
          <div className="grid grid-cols-12 px-5 py-2.5 border-b border-gray-100 bg-gray-50">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-gray-400 sans">#</span>
            <span className="col-span-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sans">Accounts</span>
            <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sans">Date & Time</span>
            <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-400 sans">Status</span>
            <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-400 sans text-right pr-6">Amount</span>
          </div>

          {/* Skeletons */}
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-5 py-4 border-b border-gray-100 gap-3">
              <div className="col-span-1 h-4 skeleton rounded w-6" />
              <div className="col-span-4 h-4 skeleton rounded w-4/5" />
              <div className="col-span-3 h-4 skeleton rounded w-3/4" />
              <div className="col-span-2 h-5 skeleton rounded-full w-20" />
              <div className="col-span-2 h-4 skeleton rounded w-14 ml-auto" />
            </div>
          ))}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400 sans text-sm">No transfers found.</div>
          )}

          {/* Rows */}
          {!loading && filtered.map((t, i) => {
            const { date, time } = fmtDate(t.created_at);
            const isExp = expanded === t.id;

            return (
              <div key={t.id} className="border-b border-gray-100 last:border-0">
                <div
                  className="grid grid-cols-12 items-center px-5 py-4 cursor-pointer hover-row transition row-anim"
                  style={{ animationDelay: `${i * 35}ms` }}
                  onClick={() => setExpanded(isExp ? null : t.id)}
                >
                  {/* ID */}
                  <div className="col-span-1">
                    <span className="text-xs font-mono text-gray-400">#{t.id}</span>
                  </div>

                  {/* Accounts */}
                  <div className="col-span-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                      <ArrowUpRight size={14} className="text-blue-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 sans truncate">From: {t.from_account ?? "Your Account"}</p>
                      <p className="text-xs text-gray-700 font-medium sans truncate">To: {t.to_account ?? "Recipient"}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-3">
                    <p className="text-sm text-gray-700 sans">{date}</p>
                    <p className="text-xs text-gray-400 sans">{time}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge status={t.status} />
                
                  </div>

                  {/* Amount + chevron */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className={`serif text-base font-semibold ${
                      t.status === "failed"
                        ? "line-through text-red-400"
                        : t.status === "approved"
                        ? "text-green-700"
                        : "text-gray-800"
                    }`}>
                      {fmt(t.amount)}
                    </span>
                    <ChevronRight
                      size={15}
                      className={`text-gray-300 transition-transform duration-200 shrink-0 ${isExp ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                {isExp && (
                  <div className="detail-anim bg-blue-50/60 border-t border-blue-100 px-5 py-4">
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 sans">Transfer ID</p>
                        <p className="text-sm font-mono text-gray-700">#{t.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 sans">From</p>
                        <p className="text-sm text-gray-700 sans font-medium">{t.from_account ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 sans">To</p>
                        <p className="text-sm text-gray-700 sans font-medium">{t.to_account ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 sans">Submitted</p>
                        <p className="text-sm text-gray-700 sans">{date} · {time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {t.status === "completed" && (
                        <button className="text-xs font-semibold text-blue-700 border border-blue-200 bg-white px-3 py-1.5 rounded-md hover:bg-blue-50 transition sans">
                          View Receipt
                        </button>
                      )}
                      {t.status === "pending" && (
                        <button className="text-xs font-semibold text-red-600 border border-red-200 bg-white px-3 py-1.5 rounded-md hover:bg-red-50 transition sans">
                          Cancel Transfer
                        </button>
                      )}
                      {t.status === "failed" && (
                        <button className="text-xs font-semibold text-blue-700 border border-blue-200 bg-white px-3 py-1.5 rounded-md hover:bg-blue-50 transition sans">
                          Retry Transfer
                        </button>
                      )}
                      <button className="text-xs font-semibold text-gray-500 border border-gray-200 bg-white px-3 py-1.5 rounded-md hover:bg-gray-50 transition sans">
                        Dispute
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 sans mt-5 text-center">
          Showing {filtered.length} of {transfers.length} transfer{transfers.length !== 1 ? "s" : ""} · Transfers may take 1–3 business days
        </p>
      </div>
    </div>
  );
}