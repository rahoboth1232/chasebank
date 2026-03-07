import navImage from "../assets/image.png"


const NAV_LINKS = ["Personal", "Business", "Commercial"];
const SUB_NAV = ["Checking", "Savings & CDs", "Credit cards", "Home loans", "Auto", "Investing", "Education & goals", "Travel"];
export  function TopNav() {
  return (
    <header className="flex flex-col gap-3 px-16 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <nav className="flex gap-6">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" className="text-sm text-gray-800 hover:text-[#005eb8] font-medium transition-colors">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5 text-sm text-gray-700">
          <span className="hover:text-[#005eb8] cursor-pointer transition-colors">Customer service</span>
          <span className="text-lg cursor-pointer hover:text-[#005eb8] transition-colors">🔍</span>
        </div>
      </div>

      {/* Logo placeholder */}
      <div className="flex items-center">
       <img src={navImage} alt="" />
      </div>

      {/* Sub nav */}
      <nav className="flex gap-6 overflow-x-auto pb-1">
        {SUB_NAV.map((l) => (
          <a key={l} href="#" className="text-sm text-gray-700 whitespace-nowrap hover:text-[#005eb8] transition-colors">
            {l}
          </a>
        ))}
      </nav>
    </header>
  );
}