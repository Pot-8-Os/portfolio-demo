"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-8 h-8" />; // レイアウトシフト防止用プレースホルダー
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            aria-label="Toggle Dark Mode"
        >
            <div className="relative w-4 h-4 overflow-hidden">
                <motion.div
                    initial={false}
                    animate={{
                        y: isDark ? 32 : 0,
                        opacity: isDark ? 0 : 1,
                        rotate: isDark ? 90 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <FiSun className="w-4 h-4" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        y: isDark ? 0 : -32,
                        opacity: isDark ? 1 : 0,
                        rotate: isDark ? 0 : -90
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <FiMoon className="w-4 h-4" />
                </motion.div>
            </div>
        </button>
    );
}
