"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function AboutPage() {
    const [showAllExperience, setShowAllExperience] = useState(false);
    const visibleExperiences = showAllExperience ? experiences : experiences.slice(0, 3);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="max-w-5xl mx-auto px-6 pt-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-start">
                    {/* Profile Image */}
                    <div className="fade-in">
                        <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#171717] group shadow-lg">
                            <img
                                src="/profile.jpg"
                                alt="Profile"
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="fade-in space-y-8" style={{ animationDelay: "0.1s" }}>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-6">
                                About
                            </h1>
                            <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                                <p>
                                    デザイン、ビジネス、テクノロジー。この3つの領域を行き来しながら、新しい価値を見つけることが好きです。
                                </p>
                                <p>
                                    法学・商学からスタートし、スタートアップでの新規事業立ち上げを経て、現在は上場企業にてWebサービスのプロダクトづくりに励んでいます。
                                    一方で、大学院にてデザインを学び直し、理論と実践を行き来しながら視野を広げています。
                                </p>
                                <p>
                                    複雑な課題をシンプルに解決し、使う人が心地よさを感じるものづくりを。
                                    二人の子供たちから教わる「遊び心」も大切にしながら、美しく機能するプロダクトを社会に届けていきたいと考えています。
                                </p>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 space-y-4">
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </span>
                                <span className="text-lg font-medium">HAMADA SHO</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </span>
                                <div className="space-y-1">
                                    <div className="text-base">Graduate student (Design)</div>
                                    <div className="text-base">Product Manager (Web Services)</div>
                                    <div className="text-base">Father of Two</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </span>
                                <span className="text-base">Hamamatsu, JAPAN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <h2 className="text-xs font-medium text-gray-500 mb-8 uppercase tracking-wider fade-in border-b border-gray-100 dark:border-gray-800 pb-2">
                    Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((skill, index) => (
                        <div
                            key={skill.name}
                            className="fade-in bg-white dark:bg-[#171717] rounded-lg p-5 border border-gray-100 dark:border-[#262626] hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                            style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-sm">{skill.name}</h3>
                                <div className="text-yellow-500 text-xs tracking-widest">{renderStars(skill.level)}</div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{skill.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience Section */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                <h2 className="text-xs font-medium text-gray-500 mb-8 uppercase tracking-wider fade-in border-b border-gray-100 dark:border-gray-800 pb-2">
                    Experience
                </h2>
                <div className="space-y-0 relative border-l border-gray-200 dark:border-gray-800 ml-3 md:ml-0">
                    <AnimatePresence initial={false} mode="wait">
                        {visibleExperiences.map((exp, index) => (
                            <motion.div
                                key={exp.period}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="relative pl-8 md:pl-12 pb-12 last:pb-0"
                            >
                                {/* Dot */}
                                <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 bg-white dark:bg-black border-2 border-gray-400 dark:border-gray-500 rounded-full" />

                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                                    <span className="text-sm font-mono text-gray-500 w-32 shrink-0">{exp.period}</span>
                                    <div>
                                        <h3 className="text-lg font-bold">{exp.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed max-w-2xl">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Show More Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setShowAllExperience(!showAllExperience)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        {showAllExperience ? (
                            <>
                                Show Less <FiChevronUp />
                            </>
                        ) : (
                            <>
                                Show More ({experiences.length - 3} more) <FiChevronDown />
                            </>
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
}

const skills = [
    { name: "Product Management", level: 4, description: "戦略策定, ロードマップ, KPI設計, アジャイル開発" },
    { name: "Business Design", level: 4, description: "ビジネスモデル構築, 新規事業開発, マーケティング" },
    { name: "UI/UX Design", level: 3, description: "Figma, ユーザーリサーチ, プロトタイピング, HCD" },
    { name: "Frontend Dev", level: 2, description: "React, Next.js, TypeScript, Tailwind CSS" },
    { name: "Legal & IP", level: 3, description: "知的財産管理, 契約実務, 法的リスク分析" },
    { name: "Creative Direction", level: 3, description: "ブランディング, コンコンセプト設計, アートディレクション" },
];

function renderStars(level: number): string {
    return "★".repeat(level) + "☆".repeat(5 - level);
}

const experiences = [
    {
        period: "2024 - Present",
        title: "上場企業 (Product Manager)",
        description: "基幹事業のプロダクトマネジメントを統括。市場分析に基づく戦略立案から、エンジニア・デザイナーと協働した機能実装までをリードし、事業成長に貢献。",
    },
    {
        period: "2023 - Present",
        title: "静岡文化芸術大学 (デザイン研究科)",
        description: "実務と理論の往還を目指し、デザイン学を専攻。美学、デザイン思考、サービスデザインの研究を通じ、プロダクト開発への新たな視座を獲得。",
    },
    {
        period: "2019 - 2020",
        title: "ビジネス図解研究所",
        description: "「ビジネスモデル図鑑2.0」の執筆・出版プロジェクトに参画。複雑なビジネス構造を視覚的に解き明かす『ビジネス図解』の手法を確立・普及。",
    },
    {
        period: "2018 - 2024",
        title: "ベンチャー企業 (Marketing / PM)",
        description: "マーケティング責任者としてユーザー獲得戦略を立案・実行。その後プロダクト企画へ領域を広げ、顧客フィードバックを基にした機能改善サイクルを構築。",
    },
    {
        period: "2013 - 2018",
        title: "スタートアップ企業 (Co-founder)",
        description: "創業メンバーとして参画。事業計画の策定から営業、バックオフィス業務まで幅広く手掛け、組織の0→1フェーズを牽引。",
    },
    {
        period: "2008 - 2012",
        title: "中央大学大学院 (法務研究科)",
        description: "論理的思考力と法的知識を修得。複雑な事象を構造化し、解決策を導き出すリーガルマインドを醸成。",
    },
    {
        period: "2004 - 2008",
        title: "慶応義塾大学 (商学部)",
        description: "マーケティングと企業戦略を専攻。ビジネスの基礎体力と、定量・定性両面からの分析手法を学ぶ。",
    },
    {
        period: "2003 - 2004",
        title: "明治大学 (法学部)",
        description: "法律学の基礎を学習。",
    },
    {
        period: "2000 - 2003",
        title: "神奈川県立 川和高校",
        description: "",
    },
];
