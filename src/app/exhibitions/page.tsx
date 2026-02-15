import { getExhibitions } from "@/lib/wordpress";
import Link from "next/link";

export const revalidate = 60;

export default async function ExhibitionPage() {
    const exhibitions = await getExhibitions();

    return (
        <div className="min-h-screen pt-4 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 md:mb-16 fade-in flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors mb-4 group"
                        >
                            <svg className="w-4 h-4 mr-1 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
                            Exhibitions
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            これまでに開催された展覧会やイベントのアーカイブです。
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in" style={{ animationDelay: "0.2s" }}>
                    {exhibitions.length > 0 ? (
                        exhibitions.map((exhibition) => {
                            // サムネイル用にランダムな作品を選択（サーバーサイドで実行、revalidateまで固定）
                            const works = exhibition.works?.nodes || [];
                            const randomWork = works.length > 0 ? works[Math.floor(Math.random() * works.length)] : null;
                            const thumbnail = randomWork?.featuredImage?.node.sourceUrl;

                            return (
                                <Link
                                    key={exhibition.slug}
                                    href={`/exhibitions/${exhibition.slug}`}
                                    className="group block relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 
                                             shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 aspect-[4/3] md:aspect-[16/10]"
                                >
                                    {/* サムネイル背景 */}
                                    {thumbnail && (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${thumbnail})` }}
                                        />
                                    )}

                                    {/* グラデーションオーバーレイ */}
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${thumbnail ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/10' : 'bg-gray-100 dark:bg-white/5'}`} />

                                    {/* コンテンツ */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                                <span className={`text-xs uppercase tracking-wider font-medium ${thumbnail ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400'}`}>
                                                    {exhibition.count ? `${exhibition.count} Works` : "Exhibition"}
                                                </span>
                                            </div>
                                            <h2 className={`text-2xl md:text-3xl font-bold mb-2 leading-tight ${thumbnail ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                                {exhibition.name}
                                            </h2>
                                            {exhibition.description && (
                                                <p className={`text-sm line-clamp-2 ${thumbnail ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {exhibition.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* 矢印アイコン */}
                                        <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                                            <svg
                                                className={`w-6 h-6 ${thumbnail ? 'text-white' : 'text-gray-900 dark:text-white'}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-500">
                            <p>No exhibitions found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
