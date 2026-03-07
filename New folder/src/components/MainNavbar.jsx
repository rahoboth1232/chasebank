import { useState } from "react";
import { Menu, X, Search, ChevronDown, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { navItems
  
 } from "../data/navitems";

export default function ChaseNavbar() {


  const [activeNav, setActiveNav] = useState("Accounts");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const activeTabs =
    navItems.find((item) => item.label === activeNav)?.tabs || [];

  return (
    <div>

      {/* Top Navbar */}
      <nav className="bg-blue-800 shadow-xl">
        <div className="max-w-screen-xl mx-auto px-4">

          <div className="flex items-center justify-between h-14">

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-blue-200 hover:text-white p-2"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Right Icons */}
            <div className="flex items-center gap-2">

              <button className="text-blue-200 hover:text-white p-2">
                <Search size={18} />
              </button>

              <Link to="/profile">
                <button className="relative text-blue-200 hover:text-white p-2">
                  <User size={18} />
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="text-blue-200 hover:text-white hidden sm:flex"
              >
                SignOut
              </button>

            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center h-full">

            {navItems.map((item) => (

              <div
                key={item.label}
                onMouseEnter={() => {
                  setDropdown(item.label);
                  setActiveNav(item.label);
                }}
                onMouseLeave={() => setDropdown(null)}
              >

                <button
                  className={`flex items-center gap-1.5 px-3 text-sm h-full border-b-2 ${
                    dropdown === item.label
                      ? "text-white border-white"
                      : "text-blue-200 border-transparent"
                  }`}
                >
                  {item.label}
                  <ChevronDown size={12} />
                </button>

                {dropdown === item.label && item.tabs.length > 0 && (

                  <div className="absolute bg-white shadow-xl w-52">

                    {item.tabs.map((tab) => (

                      <Link
                        key={tab.label}
                        to={tab.path}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {tab.label}
                      </Link>

                    ))}

                  </div>

                )}

              </div>

            ))}

          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">

          <div className="flex">

            {activeTabs.map((tab, i) => (

              <Link
                key={tab.label}
                to={tab.path}
                className={`px-5 py-3 text-sm font-medium border-b-2 ${
                  i === 0
                    ? "border-blue-700 text-blue-800 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-blue-700 hover:border-blue-400"
                }`}
              >
                {tab.label}
              </Link>

            ))}

          </div>

        </div>
      </div>

    </div>
  );
}