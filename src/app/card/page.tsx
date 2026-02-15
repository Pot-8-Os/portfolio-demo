"use client";

import { useEffect, useState } from "react";
import { FiMail, FiGlobe } from "react-icons/fi";
import { FaXTwitter, FaGithub, FaDribbble, FaLinkedinIn } from "react-icons/fa6";

export default function CardPage() {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        // 現在のURLをQRコードにエンコード
        const currentUrl = typeof window !== "undefined" ? window.location.origin : "";
        // QR Code API を使用
        setQrCodeUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                currentUrl
            )}`
        );
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black">
            <div className="max-w-sm w-full text-center fade-in">
                {/* Profile Image */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                    <span className="text-5xl">👤</span>
                </div>

                {/* Name & Title */}
                <h1 className="text-2xl font-bold tracking-tight mb-1">Site7</h1>
                <p className="text-gray-500 mb-2">Designer / Developer</p>
                <p className="text-sm text-gray-400 mb-8">Tokyo, Japan</p>

                {/* Divider */}
                <div className="w-16 h-px bg-gray-200 dark:bg-gray-800 mx-auto mb-8" />

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                    <a
                        href="mailto:contact@site7.example"
                        className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <FiMail size={18} />
                        <span className="text-sm">contact@site7.example</span>
                    </a>
                    <a
                        href="/"
                        className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <FiGlobe size={18} />
                        <span className="text-sm">portfolio.site7.example</span>
                    </a>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mb-8">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            aria-label={link.name}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>

                {/* QR Code */}
                {qrCodeUrl && (
                    <div className="inline-block p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={qrCodeUrl}
                            alt="Portfolio QR Code"
                            width={120}
                            height={120}
                            className="block dark:invert"
                        />
                        <p className="text-xs text-gray-400 mt-2">Scan to visit portfolio</p>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 space-y-3">
                    <a
                        href="/contact"
                        className="block w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-xl hover:opacity-90 transition-opacity"
                    >
                        お問い合わせ
                    </a>
                    <a
                        href="/"
                        className="block w-full py-3 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                        作品を見る
                    </a>
                </div>
            </div>
        </div>
    );
}

const socialLinks = [
    { name: "Twitter", url: "#", icon: <FaXTwitter size={18} /> },
    { name: "GitHub", url: "#", icon: <FaGithub size={18} /> },
    { name: "Dribbble", url: "#", icon: <FaDribbble size={18} /> },
    { name: "LinkedIn", url: "#", icon: <FaLinkedinIn size={18} /> },
];
