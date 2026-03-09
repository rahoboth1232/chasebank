import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, FileText, Download } from "lucide-react";
import { useTransaction } from "../hooks/useTransaction";
import { useDocuments } from "../hooks/useDocuments";


const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

const LEFT_SECTIONS = [
  "Statements",
  "Tax documents",
  "ATM and branch receipts",
  "Notice and letters",
  "Check downloads",
  "Escrow documents",
];

const SECTION_DATA = {
  Statements: {
    info: "You can view up to 7 years of Bank statements. We'll usually post your online statement 3–5 business days after your statement cycle ends.",
    rows: [
      { date: "Feb 11, 2026", type: "Statement", size: "2 Pages" },
      { date: "Jan 13, 2026", type: "Statement", size: "2 Pages" },
      { date: "Dec 10, 2025", type: "Statement", size: "3 Pages" },
      { date: "Nov 12, 2025", type: "Statement", size: "2 Pages" },
    ],
  },
  "Tax documents": {
    info: "Tax documents such as 1099-INT forms are available here. These are typically posted by January 31st each year.",
    rows: [
      { date: "Jan 28, 2026", type: "1099-INT", size: "1 Page" },
      { date: "Jan 30, 2025", type: "1099-INT", size: "1 Page" },
    ],
  },
  "ATM and branch receipts": {
    info: "View receipts from ATM withdrawals and branch transactions made within the last 2 years.",
    rows: [
      { date: "Mar 01, 2026", type: "ATM Receipt", size: "1 Page" },
      { date: "Feb 20, 2026", type: "Branch Receipt", size: "1 Page" },
      { date: "Feb 05, 2026", type: "ATM Receipt", size: "1 Page" },
    ],
  },
  "Notice and letters": {
    info: "Important notices and letters from Chase regarding your account will appear here.",
    rows: [
      { date: "Jan 15, 2026", type: "Account Notice", size: "2 Pages" },
      { date: "Dec 01, 2025", type: "Rate Change Letter", size: "1 Page" },
    ],
  },
  "Check downloads": {
    info: "Download copies of checks you've written or deposited within the last 7 years.",
    rows: [
      { date: "Feb 18, 2026", type: "Written Check", size: "1 Page" },
      { date: "Jan 22, 2026", type: "Deposited Check", size: "1 Page" },
    ],
  },
  "Escrow documents": {
    info: "Escrow-related documents including analysis statements and disbursement notices.",
    rows: [{ date: "Jan 05, 2026", type: "Escrow Analysis", size: "3 Pages" }],
  },
};

const DOCUMENTS_PANEL = [
  {
    category: "Statements",
    items: [
      {
        name: "February 2026 Statement",
        date: "Feb 11, 2026",
        size: "2 Pages",
      },
      { name: "January 2026 Statement", date: "Jan 13, 2026", size: "2 Pages" },
    ],
  },
  {
    category: "Tax Documents",
    items: [{ name: "2025 1099-INT", date: "Jan 28, 2026", size: "1 Page" }],
  },
  {
    category: "Notices & Letters",
    items: [
      { name: "Account Notice", date: "Jan 15, 2026", size: "2 Pages" },
      { name: "Rate Change Letter", date: "Dec 01, 2025", size: "1 Page" },
    ],
  },
];

export default function ChaseStatements() {
  const [activeAccount, setActiveAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("Accounts");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [activeSection, setActiveSection] = useState("Statements");

  const { data } = useTransaction();
  console.log(data)
  const { data: documents } = useDocuments();
  
  const accounts =
  [...new Set(data?.entries?.map((entry) => entry.entry_type))] || [];

  const section = SECTION_DATA[activeSection];
  
useEffect(() => {
  if (accounts.length && !activeAccount) {
    setActiveAccount(accounts[0]);
  }
}, [accounts]);



const filteredTransactions = data?.entries?.filter(
  (entry) => entry.entry_type === activeAccount
);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Page Title */}
      <div className="bg-blue-800 px-8 py-4">
        <h1 className="text-white text-lg font-semibold tracking-wide">
          Statements and Documents
        </h1>
      </div>

      <div className="flex max-w-6xl mx-auto">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen pt-4 flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-2">
            {["Accounts", "Documents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-[#1a3a6b] border-b-2 border-[#1a3a6b]"
                    : "text-gray-500 hover:text-[#1a3a6b]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Accounts tab */}
          {activeTab === "Accounts" && (
            <ul>
              {accounts.map((acc) => (
                <li key={acc}>
                  <button
                    onClick={() => setActiveAccount(acc)}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                      activeAccount === acc
                        ? "border-l-4 border-[#1a3a6b] text-[#1a3a6b] font-semibold bg-blue-50 pl-3"
                        : "border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#1a3a6b]"
                    }`}
                  >
                    {acc}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Documents tab sidebar */}
          {activeTab === "Documents" && (
            <div className="px-4 py-3">
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                View all documents across your accounts in one place.
              </p>
              {DOCUMENTS_PANEL.map((group) => (
                <div key={group.category} className="mb-4">
                  <p className="text-xs font-semibold text-[#1a3a6b] mb-1.5">
                    {group.category}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <button className="w-full text-left text-xs text-[#1a5fa8] hover:underline py-1 flex items-center gap-1.5">
                          <FileText size={11} className="flex-shrink-0" />
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* ── ACCOUNTS TAB ── */}
          {activeTab === "Accounts" && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-[#1a3a6b] flex items-center justify-center">
                  <FileText size={14} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-800">
                 {activeAccount}
                </h2>
              </div>

              <p className="text-xs text-[#1a5fa8] mb-4 ml-9">
                If you don't see an account, statement or document, it may be
                hidden; you can unhide those in{" "}
                <span className="underline cursor-pointer">
                  show all hide accounts
                </span>
                .
              </p>

              <div className="flex gap-4">
              

                {/* Dynamic right panel */}
                <div className="flex-1 bg-white border border-gray-200 rounded-sm">
                  <div className="bg-[#f0f4fa] border-b border-gray-200 px-4 py-3">
                    <p className="text-xs font-semibold text-gray-800 mb-1">
                      ▼ {activeSection}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {section.info}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Having trouble opening your documents?{" "}
                      <span className="text-[#1a5fa8] underline cursor-pointer">
                        Get help
                      </span>
                    </p>
                  </div>

                  <div className="px-4 pt-3 pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <label className="text-xs text-gray-600 font-medium">
                        View
                      </label>
                      <div className="relative">
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 appearance-none pr-6 focus:outline-none focus:border-[#1a3a6b]"
                        >
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={10}
                          className="absolute right-1.5 top-2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-500 font-medium">
                            Date
                          </th>
                          <th className="text-left py-2 text-gray-500 font-medium">
                            Type
                          </th>
                         
                          <th className="text-left py-2 text-gray-500 font-medium">
                            credit
                          </th>
                          <th className="text-left py-2 text-gray-500 font-medium">
                            balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions?.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-2.5 text-gray-700">{row.date}</td>

                            <td className="py-2.5 text-gray-700">
                              {row.entry_type}
                            </td>

                           

                            <td className="py-2.5 text-gray-700">
                              ${row.credit || row.debit}
                            </td>

                            <td className="py-2.5 text-gray-700">
                              ${row.balance}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── DOCUMENTS TAB ── */}
          {activeTab === "Documents" && (
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="bg-[#f0f4fa] border-b border-gray-200 px-5 py-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-0.5">
                  All Documents
                </h2>
                <p className="text-xs text-gray-500">
                  A consolidated view of all your statements, tax documents, and
                  notices across all accounts.
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="divide-y divide-gray-100">
                  {documents?.documents?.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-[#1a3a6b]" />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-800">
                            {doc.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            Document · {doc.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={doc.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#1a5fa8] hover:underline flex items-center gap-1"
                        >
                          <FileText size={11} /> Open
                        </a>

                        <a
                          href={doc.file}
                          download
                          className="text-xs text-[#1a5fa8] hover:underline flex items-center gap-1"
                        >
                          <Download size={11} /> Save
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
