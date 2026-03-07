import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

const MENU_ITEMS = [
  { label: "Overview", active: true },
  { label: "Personal details", hasArrow: true },
  { label: "Sign-in & security", hasArrow: true },
  { label: "Account settings", hasArrow: true },
  { label: "Alerts", hasArrow: true },
];

function OverviewPanel({ cards }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">{card.title}</h2>
          <p className="text-xs text-gray-500 mb-3">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

function DetailsPanel({ fields, onEdit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm divide-y divide-gray-100">
      {fields.map((f) => (
        <div key={f.label} className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs text-gray-500">{f.label}</p>
            <p className="text-sm font-medium text-gray-800">{f.value || "Not set"}</p>
          </div>

          {f.editable && (
            <button
              onClick={() => onEdit(f.key)}
              className="text-xs text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ChaseProfileSection() {

  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  console.log(profile)

  const [activeMenu, setActiveMenu] = useState("Overview");
  const [visible, setVisible] = useState(true);

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  if (isLoading) return <p className="p-6">Loading profile...</p>;

  const overviewCards = [
    {
      title: "Personal details",
      description: "Update your email, phone or address."
    },
    {
      title: "Sign-in & security",
      description: "Update username or password."
    },
    {
      title: "Account settings",
      description: "Customize your banking experience."
    },
    {
      title: "Alerts",
      description: "Manage account alerts."
    }
  ];

  const personalFields = [
    { label: "Full Name", value: profile?.full_name, key: "email", editable: true },
    { label: "Email address", value: profile?.email, key: "email", editable: true },
    { label: "Phone number", value: profile?.mobile, key: "phone", editable: true },
    { label: "Mailing address", value: profile?.address, key: "address", editable: true }
  ];

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(profile[field] || "");
  };

  const handleSave = () => {

    updateProfileMutation.mutate({
      [editingField]: editValue
    });

    setEditingField(null);
  };

  if (!visible) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <button
          onClick={() => setVisible(true)}
          className="px-5 py-2 bg-blue-900 text-white rounded"
        >
          Open Profile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 flex items-start justify-center px-4">

      <div className="w-full bg-white shadow-lg rounded-sm overflow-hidden relative">

        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-gray-500"
        >
          <X size={18} />
        </button>

        <div className="bg-blue-800 px-6 py-3">
          <span className="text-white text-base font-medium">
            Profile & Settings
          </span>
        </div>

        <div className="flex min-h-[420px]">

          {/* Sidebar */}
          <div className="w-56 border-r border-gray-200 bg-white">
            <ul className="py-2">
              {MENU_ITEMS.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => setActiveMenu(item.label)}
                    className={`w-full flex items-center justify-between px-5 py-3 text-sm ${
                      activeMenu === item.label
                        ? "border-l-4 border-blue-900 text-blue-900 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {item.label}
                    {item.hasArrow && <ChevronRight size={14} />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="flex-1 px-8 py-6 bg-gray-50">

            {activeMenu === "Overview" && (
              <OverviewPanel cards={overviewCards} />
            )}

            {activeMenu === "Personal details" && (
              <DetailsPanel
                fields={personalFields}
                onEdit={handleEdit}
              />
            )}

          </div>
        </div>

        {/* Edit Modal */}
        {editingField && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">

            <div className="bg-white p-6 rounded w-80">

              <h3 className="font-semibold mb-3">
                Edit {editingField}
              </h3>

              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="border w-full p-2 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button onClick={() => setEditingField(null)}>
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-blue-900 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}