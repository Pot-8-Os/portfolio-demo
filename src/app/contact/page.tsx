"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiMapPin, FiDownload } from "react-icons/fi";
import { FaXTwitter, FaGithub, FaLinkedinIn, FaYoutube, FaPersonRunning } from "react-icons/fa6";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        // TODO: フォーム送信ロジックを実装する（例: APIルートやFormspree）
        // 現在は成功をシミュレーション
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setStatus("success");
        setFormData({ name: "", email: "", message: "" });

        // 一定時間後にステータスをリセット
        setTimeout(() => setStatus("idle"), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen">
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* 連絡先情報 */}
                    <div className="fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            Contact
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                            プロジェクトのご相談、お見積もり、その他お問い合わせはこちらからお気軽にどうぞ。
                            通常、2〜3営業日以内にご返信いたします。
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center">
                                    <FiMail size={20} />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Email</span>
                                    <p className="font-medium">{contactEmail}</p>
                                </div>
                            </div>
                            {/* ... location ... */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center">
                                    <FiMapPin size={20} />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Location</span>
                                    <p className="font-medium">Hamamatsu, JAPAN</p>
                                </div>
                            </div>
                        </div>

                        {/* SNSリンク */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
                                SNS
                            </h3>
                            <div className="flex gap-4">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                        aria-label={link.name}
                                    >
                                        {link.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* お問い合わせフォーム */}
                    <div className="fade-in" style={{ animationDelay: "0.1s" }}>
                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    お名前 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={status === "sending" || status === "success"}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all disabled:opacity-50"
                                    placeholder="山田 太郎"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    メールアドレス <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={status === "sending" || status === "success"}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all disabled:opacity-50"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    メッセージ <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    disabled={status === "sending" || status === "success"}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all resize-none disabled:opacity-50"
                                    placeholder="お問い合わせ内容をご記入ください..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === "sending" || status === "success"}
                                className={`w-full py-4 font-medium rounded-xl transition-all flex items-center justify-center gap-2 ${status === "success"
                                    ? "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                    : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-70"
                                    }`}
                            >
                                {status === "sending" ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        送信中...
                                    </>
                                ) : status === "success" ? (
                                    <>
                                        <span className="text-xl">✓</span>
                                        送信完了
                                    </>
                                ) : (
                                    "送信する"
                                )}
                            </button>
                        </form>

                        {/* レジュメダウンロード */}
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                            <a
                                href="/resume.pdf"
                                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <FiDownload size={18} />
                                レジュメをダウンロード (PDF)
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

const socialLinks = [
    { name: "X", url: "https://x.com/elonmusk", icon: <FaXTwitter size={20} /> },
    { name: "GitHub", url: "https://github.com/Pot-8-Os", icon: <FaGithub size={20} /> },
    { name: "Hobby", url: "https://www.nhp-marathon.com/", icon: <FaPersonRunning size={20} /> },
    { name: "YouTube", url: "https://www.youtube.com/@GUNDAM", icon: <FaYoutube size={20} /> },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/sho-hamada-954a4829/", icon: <FaLinkedinIn size={20} /> },
];
