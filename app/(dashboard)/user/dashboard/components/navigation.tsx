"use client";
import { Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: "/user/dashboard", icon: Home, label: "Home", special: false },
    // { href: "/explore", icon: Search, label: "Explore" },
    // { href: "/create", icon: Plus, label: "Create", special: false },
    // { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/user/profile", icon: User, label: "Profile" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-muted">
      <div className=" container  dark:bg-gray-900 border-t mb-1 border-gray-200 dark:border-gray-800 shadow-2xl">
        {/* Navigation Items - Full Width Equal Distribution */}
        <div className="flex items-stretch w-full">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            if (item.special) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-1 flex flex-col items-center justify-center relative -top-4 px-2 py-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group mb-1">
                    <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center px-2  transition-all duration-200 group"
              >
                {active && (
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1" />
                )}
                <div
                  className={`p-1 rounded-lg transition-all duration-200  ${
                    active
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </div>

                <span
                  className={`text-xs font-medium transition-all duration-200 ${
                    active
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
