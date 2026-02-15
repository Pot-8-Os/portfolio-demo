"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { ThemeToggle } from "./ThemeToggle";

import { useTheme } from "next-themes";

const links = [
    { href: "/works", label: "Works" },
    { href: "/exhibitions", label: "Exhibitions" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // ルート変更時にメニューを閉じる
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // メニュー開放時にボディのスクロールをロック
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -mr-2 text-gray-900 dark:text-white focus:outline-none"
                aria-label="Open Menu"
            >
                <FiMenu size={24} />
            </button>

            {/* Full Screen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col"
                    >
                        {/* Header in Overlay */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">MENU</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-gray-900 dark:text-white focus:outline-none hover:opacity-70 transition-opacity"
                                aria-label="Close Menu"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Links */}
                        <nav className="flex-1 flex flex-col justify-center items-center gap-8 p-6">
                            {links.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-2xl font-bold tracking-widest uppercase text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Theme Toggle in Menu */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 w-full flex justify-center"
                            >
                                <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                                    <span className="text-sm font-medium uppercase tracking-wider">Switch Theme</span>
                                    <ThemeToggle />
                                </div>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
