import { useState } from "react";
import {
  Search,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  X,
  RefreshCw,
  Plane,
  Gift,
  CreditCard,
  Menu,
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { Link } from "react-router-dom";

function TabBar() {
  const [active, setActive] = useState("Overview");
  const tabs = ["Overview", "Statements & documents", "Profile & settings"];
  return (
    <div className="bg-white border-b border-gray-200 px-6 flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`py-2.5 px-4 text-xs font-semibold rounded-t transition-colors ${
            active === tab
              ? "bg-[#003087] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function CreditCards() {
  const [open, setOpen] = useState(true);

  const cards = [
    {
      name: "Slate (…4950)",
      alert: true,
      alertMsg: "Your account is closed.",
      alertSub:
        "If you have a balance on this account, please continue to make your payments by the due date each month.",
      alertLink: "Your new statement period ends on Mar 11, 2026.",
      balance: "$0.00",
      balanceLabel: "Current balance",
      details: [
        { label: "Last statement balance", value: "$0.00" },
        { label: "Available credit", value: "$0.00" },
      ],
      showCard: true,
      cardColor: "from-gray-400 to-gray-600",
    },
    {
      name: "Freedom (…0490)",
      alert: false,
      balance: "$1,948.18",
      balanceLabel: "Current balance",
      details: [
        { label: "Mar 7, 2026", value: "" },
        { label: "Min payment due", value: "$40.00" },
        { label: "Last statement balance", value: "$1,404.07" },
        { label: "Available credit", value: "$16,451.82" },
      ],
      showCard: true,
      cardColor: "from-blue-400 to-blue-700",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-700">Credit cards</span>
        <button onClick={() => setOpen(!open)} className="text-gray-400">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {open && (
        <div className="divide-y divide-gray-100">
          {cards.map((card, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-[#003087] hover:underline cursor-pointer">
                    {card.name}
                  </span>
                  <ChevronRight size={12} className="text-[#003087]" />
                </div>
                <div className="flex gap-2">
                  <button className="bg-[#003087] text-white text-xs px-3 py-1.5 rounded font-semibold hover:bg-[#002070]">
                    Pay card
                  </button>
                  <button className="border border-gray-300 text-xs px-3 py-1.5 rounded font-semibold text-gray-700 flex items-center gap-1 hover:bg-gray-50">
                    More <ChevronDown size={11} />
                  </button>
                </div>
              </div>

              {card.alert && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2 text-[10px] text-gray-700 space-y-0.5">
                  <p className="font-semibold text-blue-800">
                    ⚑ {card.alertMsg}
                  </p>
                  <p>{card.alertSub}</p>
                  <p className="text-blue-600 underline cursor-pointer">
                    {card.alertLink}
                  </p>
                </div>
              )}

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.balance}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {card.balanceLabel}
                  </p>
                  <div className="flex gap-6 mt-2">
                    {card.details.map((d, j) => (
                      <div key={j}>
                        {d.value && (
                          <p className="text-xs font-semibold text-gray-800">
                            {d.value}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-500">{d.label}</p>
                      </div>
                    ))}
                  </div>
                  {!card.alert && (
                    <p className="text-[10px] text-[#003087] hover:underline cursor-pointer mt-1">
                      See last statement (archived) · Slate 2 →
                    </p>
                  )}
                </div>
                {card.showCard && (
                  <div
                    className={`w-14 h-9 rounded bg-gradient-to-br ${card.cardColor} shadow-md`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Rewards Panel ── */
function Rewards() {
  return (
    <div className="bg-white border border-gray-200 rounded mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-700">Rewards</span>
        <ChevronRight size={14} className="text-gray-400" />
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 rounded-full p-1">
              <Star size={12} className="text-white fill-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">1,406</p>
              <p className="text-[10px] text-gray-500">
                Ultimate Rewards® points
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-[#003087]" />
        </div>
        <hr className="border-gray-100" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">— 150</p>
            <p className="text-[10px] text-gray-500">Amazon Rewards points</p>
            <p className="text-[10px] text-gray-400">(…7688)</p>
          </div>
          <ChevronRight size={14} className="text-[#003087]" />
        </div>
      </div>
    </div>
  );
}

/* ── Travel Panel ── */
function Travel() {
  return (
    <div className="bg-white border border-gray-200 rounded mb-3">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-700">Travel</span>
      </div>
      <div className="px-4 py-3 flex items-center gap-2">
        <Plane size={16} className="text-[#003087]" />
        <div>
          <p className="text-xs font-semibold text-[#003087] hover:underline cursor-pointer">
            Explore adventures around the world
          </p>
          <p className="text-[10px] text-gray-500">
            Book hotels, flights, car rentals & more
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Chase Offers Panel ── */
function ChaseOffers() {
  const offers = [
    { label: "Curbersone", pct: "10% cash back", color: "bg-orange-100" },
    { label: "TicketDo", pct: "20% cash back", color: "bg-green-100" },
    { label: "Gaunt Arme", pct: "10% cash back", color: "bg-blue-100" },
  ];
  const [dot, setDot] = useState(0);

  return (
    <div className="bg-white border border-gray-200 rounded mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Gift size={13} className="text-gray-600" />
          <span className="text-xs font-bold text-gray-700">Chase Offers</span>
        </div>
        <div className="flex items-center gap-2">
          <button className={`w-8 h-4 rounded-full transition-colors relative`}>
            <span
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all `}
            />
          </button>
          <ChevronRight size={14} className="text-gray-400" />
        </div>
      </div>

      <div className="px-4 py-2 text-[10px] text-gray-500">
        Add deals, shop and get cash back. Amazon Chase + more.
      </div>

      {/* Offer image tiles */}
      <div className="flex gap-2 px-4 pb-3">
        {offers.map((o, i) => (
          <div
            key={i}
            className={`flex-1 rounded ${o.color} h-16 flex items-end p-1.5`}
          >
            <div>
              <p className="text-[9px] font-bold text-gray-800">{o.label}</p>
              <p className="text-[9px] text-gray-600">{o.pct}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 pb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            onClick={() => setDot(i)}
            className={`rounded-full transition-all ${dot === i ? "w-4 h-2 bg-[#003087]" : "w-2 h-2 bg-gray-300"}`}
          />
        ))}
      </div>

      <div className="px-4 pb-3">
        <button className="w-full border border-[#003087] text-[#003087] text-xs py-2 rounded font-semibold hover:bg-blue-50 transition-colors">
          See your offers
        </button>
      </div>
    </div>
  );
}

/* ── Credit Journey ── */
function CreditJourney() {
  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="px-4 py-3">
        <p className="text-xs font-bold text-gray-700">Credit Journey</p>
      </div>
    </div>
  );
}

/* ── Root Dashboard ── */
export default function ChaseDashboard() {
  const[open,setOpen] = useState(false)
  const { data: accounts, isLoading, isError } = useDashboard();

  console.log(accounts);

  const acc = accounts?.accounts;

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Error loading dashboard</p>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* <TopNav />
      <TabBar /> */}

      <div className="max-w-5xl mx-auto px-4 py-4 flex gap-4">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          {acc.map((accounts) => (
            <div
              key={accounts.id}
              className="bg-white border border-gray-200 rounded mb-3"
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-700">
                  Bank accounts
                </span>
               
                 </div>

              <div className="px-4 py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-semibold text-[#003087] hover:underline cursor-pointer">
                        {accounts.account_type}
                      </span>
                      <ChevronRight size={12} className="text-[#003087]" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${accounts.balance}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Available balance
                    </p>
                    {open && <div className="flex gap-10 w-full">

                      <div>
  <p className="text-[15px] text-gray-500 mt-0.5">Deposit this month</p>
  <p className="text-xl font-bold text-gray-900">
                        ${accounts.deposits_month_total}

  </p>
                      </div>

                      <div>
                          <p className="text-[15px] text-gray-500 mt-0.5">Withdrawl this month</p>
                          <p className="text-xl font-bold text-gray-900">  
                        ${accounts.deposits_month_total}

                          </p>
                      </div>
                      

                      </div>}
                  </div>

                  <div className="flex gap-2">
                    <Link to="/transfer">
                      <button className="bg-[#003087] text-white text-xs px-3 py-1.5 rounded font-semibold hover:bg-[#002070]">
                        Transfer money
                      </button>
                    </Link>
                    <button
                      onClick={() => setOpen(!open)}
                      className="border border-gray-300 text-xs px-3 py-1.5 rounded font-semibold text-gray-700 flex items-center gap-1 hover:bg-gray-50"
                    >
                      More <ChevronDown size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <CreditCards />
        </div>

        {/* Right column */}
        <div className="w-56 shrink-0">
          <Rewards />
          <Travel />
          <ChaseOffers />
          <CreditJourney />
        </div>
      </div>
    </div>
  );
}
