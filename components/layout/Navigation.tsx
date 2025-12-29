"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Map, Sparkles, User, ChevronLeft, ChevronRight } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "首页",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/",
  },
  {
    id: "journey",
    label: "写作之旅",
    icon: <Map className="w-5 h-5" />,
    path: "/journey",
  },
  {
    id: "studio",
    label: "演练场",
    icon: <Sparkles className="w-5 h-5" />,
    path: "/studio",
  },
  {
    id: "profile",
    label: "我的",
    icon: <User className="w-5 h-5" />,
    path: "/profile",
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Update CSS variable for sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "80px" : "250px"
    );
  }, [isCollapsed]);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-surface border-t border-border">
          <div className="grid grid-cols-4 h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className="flex flex-col items-center justify-center gap-1 relative"
                >
                  {isActive && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-1 bg-primary"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div
                    className={`transition-colors ${
                      isActive ? "text-primary" : "text-text-secondary"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs transition-colors ${
                      isActive ? "text-primary font-medium" : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex fixed left-0 top-0 bottom-0 bg-surface border-r border-border flex-col z-40"
        animate={{
          width: isCollapsed ? "80px" : "250px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                <h1 className="text-xl font-bold text-text-primary">Gu's Method</h1>
                <p className="text-xs text-text-secondary mt-1">手把手带你练写作</p>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex justify-center"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">G</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-text-secondary hover:text-text-primary"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={isActive ? "text-primary" : ""}>{item.icon}</div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
