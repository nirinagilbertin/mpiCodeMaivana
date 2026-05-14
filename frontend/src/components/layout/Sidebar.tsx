import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Map,
  Bell,
  TrendingUp,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    section: "Principal",
    items: [
      {
        to: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        to: "/admin/reports",
        label: "Signalements",
        icon: FileText,
      },
      {
        to: "/map",
        label: "Carte",
        icon: Map,
      },
    ],
  },
  {
    section: "Analyse",
    items: [
      {
        to: "/admin/critical-zones",
        label: "Zones critiques",
        icon: AlertTriangle,
      },
      {
        to: "/admin/trends",
        label: "Tendances",
        icon: TrendingUp,
      },
    ],
  },
  {
    section: "Système",
    items: [
      {
        to: "/admin/notifications",
        label: "Notifications",
        icon: Bell,
      },
      {
        to: "/admin/settings",
        label: "Paramètres",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        hidden lg:flex flex-col
        bg-white border-r border-gray-100
        transition-all duration-200 ease-in-out
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center h-16 border-b border-gray-50
          ${collapsed ? "justify-center px-2" : "justify-between px-4"}
        `}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
            <LayoutDashboard size={16} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors
            ${collapsed ? "hidden" : ""}
          `}
          aria-label={collapsed ? "Développer" : "Réduire"}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-4">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.section}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${
                      isActive(item.to, item.exact)
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bouton réduire/développer en bas */}
      <div className="p-2 border-t border-gray-50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "Développer la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}