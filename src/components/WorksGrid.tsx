"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Work } from "@/types/wordpress";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwindクラスのマージユーティリティ
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface WorksGridProps {
    initialWorks: Work[];
    hideFilters?: boolean;
    className?: string;
}

export function WorksGrid({ initialWorks, hideFilters = false, className }: WorksGridProps) {
    // ユニークなフォーマットを抽出してフィルター選択肢を生成
    const allFormats = Array.from(
        new Set(
            initialWorks.flatMap((work) =>
                work.formats?.nodes?.map((n) => n.name) || []
            )
        )
    ).sort();

    const filters = ["All", ...allFormats];
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredWorks = activeFilter === "All"
        ? initialWorks
        : initialWorks.filter((work) =>
            work.formats?.nodes?.some((n) => n.name === activeFilter)
        );


    return (
        <div className="space-y-6">
            {/* フィルターUI */}
            {/* ... */}

            {/* グリッド */}
            <motion.div
                layout
                className={cn("grid grid-cols-1 md:grid-cols-2 gap-8", className)}
            >
                <AnimatePresence mode="popLayout">
                    {filteredWorks.map((work, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={work.id}
                        >
                            <Link
                                href={`/works/${work.slug}`}
                                className="group block h-full"
                            >
                                <article className="h-full bg-gray-50 dark:bg-[#171717] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-transparent dark:border-[#262626] hover:border-gray-300 dark:hover:border-gray-700">
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        {work.featuredImage?.node?.sourceUrl ? (
                                            <Image
                                                src={work.featuredImage.node.sourceUrl}
                                                alt={work.featuredImage.node.altText || work.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1152px) 50vw, 576px"
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                                        )}

                                        {/* ホバー時のオーバーレイグラデーション */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* フォーマットバッジ */}
                                        <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                            {work.formats?.nodes && work.formats.nodes.length > 0 && (
                                                <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs text-white border border-white/20">
                                                    {work.formats.nodes[0].name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-400 transition-all">
                                            {work.title}
                                        </h3>
                                        <div className="flex items-center justify-between gap-4">
                                            {work.formats?.nodes && work.formats.nodes.length > 0 && (
                                                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                                    {work.formats.nodes.map(n => n.name).join(" / ")}
                                                </span>
                                            )}

                                            {work.creators?.nodes && work.creators.nodes.length > 0 && (
                                                <span className="text-sm text-gray-400 dark:text-gray-500">
                                                    {work.creators.nodes[0].name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
