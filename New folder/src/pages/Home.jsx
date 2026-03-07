import { useState } from "react";
import { TopNav } from "../components/HomeNavbar";
import LoginCard from "../components/LoginCard";
import landingImg from "../assets/home.webp"


/* ─── Mock Data ─── */


const ICONS = [
  { icon: "💼", label: "Business" },
  { icon: "💳", label: "Credit cards" },
  { icon: "👛", label: "Checking" },
  { icon: "✈️", label: "Travel" },
  { icon: "🐷", label: "Savings" },
  { icon: "🏠", label: "Home loans" },
];

const CARDS = [
  {
    title: "Sapphire Reserve®",
    icon: "💳",
    blue: true,
    badge: "Exclusive Offer:",
    headline: "Up to 175,000 points",
    sub: "See if you're preapproved with no impact to your credit score.",
    btn: "Get started",
    outline: false,
  },
  {
    title: "Home Lending",
    icon: "🏠",
    blue: true,
    badge: "Guaranteed on-time closing",
    headline: "Or get $5,000",
    sub: "Eligible products close in as soon as three weeks.",
    btn: "Get started",
    outline: false,
  },
  {
    title: "J.P. Morgan",
    icon: "👥",
    blue: false,
    badge: "Don't go it alone",
    headline: "",
    sub: "Work with a dedicated advisor to reach your goals.",
    btn: "Continue",
    outline: true,
  },
];


function HeroSection({ onLogin, loginError }) {
  return (
    <section className="bg-[#005eb8] min-h-[420px] flex items-center px-10 py-12">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center gap-10 flex-wrap">

        {/* Left: decorative image placeholder */}
        <div className=" items-center justify-center text-white/40 text-7xl select-none">
          <img src={landingImg} alt="" />
        </div>

        {/* Center: copy */}
        <div className="text-white max-w-md">
          <h3 className="text-4xl font-bold leading-snug mb-3">
            New Chase checking customers
          </h3>
          <p className="text-blue-100 text-base mb-6">
            Open a Chase Total Checking® account with qualifying activities
          </p>
          <a
            href="#"
            className="inline-block bg-[#1f8f3c] hover:bg-[#177032] text-white px-3 py-2 rounded font-semibold text-[18px] transition-colors"
          >
            Open an account
          </a>
        </div>

        {/* Right: login */}
        <LoginCard onLogin={onLogin} error={loginError} />
      </div>
    </section>
  );
}

function ChooseSection() {
  const [activeIcon, setActiveIcon] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  return (
    <section className="bg-white py-16 px-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">Choose what's right for you</h2>

      {/* Icons */}
      <div className="flex justify-center gap-8 mb-12 flex-wrap">
        {ICONS.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIcon(i)}
            className={`flex flex-col items-center gap-2 text-sm font-medium transition-all ${
              activeIcon === i ? "text-[#005eb8] scale-110" : "text-gray-500 hover:text-[#005eb8]"
            }`}
          >
            <span className="text-3xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex justify-center gap-7 flex-wrap">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="w-72 rounded-md shadow-lg overflow-hidden text-left"
          >
            <div className={`px-5 py-5 flex justify-between items-center ${card.blue ? "bg-[#005eb8] text-white" : "bg-gray-100 text-gray-900"}`}>
              <h3 className="font-bold text-lg">{card.title}</h3>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="px-5 py-5 text-sm text-gray-600 space-y-1">
              <p className="font-bold text-gray-900">{card.badge}</p>
              {card.headline && <p className="text-base font-semibold text-gray-800">{card.headline}</p>}
              <p>{card.sub}</p>
            </div>
            <button
              className={`w-full py-3 font-semibold text-sm transition-colors ${
                card.outline
                  ? "bg-white text-[#005eb8] border-t border-gray-200 hover:bg-gray-50"
                  : "bg-[#0b6efd] hover:bg-[#0957d0] text-white"
              }`}
            >
              {card.btn}
            </button>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setActiveDot(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${activeDot === i ? "bg-[#005eb8]" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </section>
  );
}

function PromoSection() {
  return (
    <section className="bg-white py-16 px-10 max-w-6xl mx-auto">

      {/* Top promo */}
      <div className="flex items-center justify-between gap-12 mb-14 flex-wrap">
        <div className="w-96 h-52 rounded-xl bg-[#005eb8] flex items-center justify-center text-white">
          <div className="text-center">
            <p className="text-lg mb-1">Earn up to</p>
            <p className="text-8xl font-black leading-none">$500</p>
          </div>
        </div>
        <div className="max-w-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Keep your business moving forward with Chase
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Open a new Chase Business Complete Checking® account with qualifying
            activities. For new business checking customers only.
          </p>
          <a href="#" className="inline-block bg-[#15803d] hover:bg-[#166534] text-white px-6 py-2.5 rounded font-semibold text-sm transition-colors">
            Open account
          </a>
        </div>
      </div>

      <hr className="border-gray-200 mb-14" />

      {/* Bottom promo */}
      <div className="flex items-center justify-between gap-12 flex-wrap">
        <div className="max-w-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Earn a $200 bonus
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Plus, earn unlimited 1.5% cash back or more on all purchases,
            including 3% on dining and drugstores —{" "}
            <strong className="text-gray-900">all with no annual fee.</strong>
          </p>
          <a href="#" className="inline-block bg-[#0b6efd] hover:bg-[#0957d0] text-white px-6 py-2.5 rounded font-semibold text-sm transition-colors">
            Learn more
          </a>
        </div>
        <div className="w-96 h-52 rounded-xl bg-gradient-to-br from-gray-900 to-blue-900 flex items-end justify-end p-4">
          <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5">
            NO ANNUAL FEE
          </span>
        </div>
      </div>

    </section>
  );
}

/* ─── Root ─── */
export default function ChasePage() {
  const [loginError, setLoginError] = useState("");

  const handleLogin = (username, password) => {
    if (!username || !password) {
      setLoginError("Please enter your username and password.");
    } else {
      setLoginError("");
      alert(`Signing in as: ${username}`);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <TopNav />
      <HeroSection onLogin={handleLogin} loginError={loginError} />
      <ChooseSection />
      <PromoSection />
    </div>
  );
}