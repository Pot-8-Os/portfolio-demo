import Image from "next/image";
import Link from "next/link";
import { getWorkBySlug, getWorks } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import InteractiveGallery from "./InteractiveGallery";
import { FiArrowLeft, FiExternalLink, FiPrinter } from "react-icons/fi";

/** 製作日を「YYYY年M月」形式にフォーマット */
function formatProductionDate(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
    } catch {
        return dateStr;
    }
}

export async function generateStaticParams() {
    try {
        const works = await getWorks();
        return works.map((work) => ({
            slug: work.slug,
        }));
    } catch (e) {
        console.warn('ビルド時に作品一覧を取得できませんでした', e);
        return [];
    }
}

export default async function WorkDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const work = await getWorkBySlug(slug);

    if (!work) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            {/* 戻るボタン */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline decoration-1 underline-offset-4 hover:no-underline"
                >
                    <FiArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back to Works
                </Link>
            </div>

            {/* ヒーロー画像 */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="aspect-[16/9] relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 fade-in">
                    {work.featuredImage?.node?.sourceUrl ? (
                        <Image
                            src={work.featuredImage.node.sourceUrl}
                            alt={work.featuredImage.node.altText || work.title}
                            fill
                            sizes="(max-width: 1152px) 100vw, 1152px"
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                    )}
                </div>
            </div>

            {/* コンテンツ */}
            <div className="max-w-6xl mx-auto px-6 pt-12 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* メインコンテンツ */}
                    <div className="lg:col-span-2 fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                            {work.title}
                        </h1>

                        {work.suac?.concept && (
                            <div className="mb-8">
                                <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                                    Concept
                                </h2>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {work.suac.concept}
                                </p>
                            </div>
                        )}

                        {work.content && (
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: work.content }}
                            />
                        )}



                        {/* インタラクティブギャラリー */}
                        {work.suac?.gallery && (
                            <InteractiveGallery
                                images={work.suac.gallery.split('|').map(url => url.trim()).filter(url => url)}
                            />
                        )}
                    </div>

                    {/* サイドバー */}
                    <div className="fade-in" style={{ animationDelay: "0.2s" }}>
                        <div className="sticky top-28 space-y-6">
                            {work.creators?.nodes && work.creators.nodes.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                                        Creator
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {work.creators.nodes.map((creator) => (
                                            <span key={creator.slug} className="text-lg">
                                                {creator.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {work.formats?.nodes && work.formats.nodes.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                                        Format
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {work.formats.nodes.map((format) => (
                                            <span key={format.slug} className="text-lg">
                                                {format.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {work.tools?.nodes && work.tools.nodes.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                                        Tools
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {work.tools.nodes.map((tool) => (
                                            <span key={tool.slug} className="text-lg">
                                                {tool.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {work.suac?.client && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                                        Client
                                    </h3>
                                    <p className="text-lg">{work.suac.client}</p>
                                </div>
                            )}

                            {work.suac?.productiondate && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                                        Date
                                    </h3>
                                    <p className="text-lg">
                                        {formatProductionDate(work.suac.productiondate)}
                                    </p>
                                </div>
                            )}

                            {work.suac?.duration && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                                        Duration
                                    </h3>
                                    <p className="text-lg">{work.suac.duration}</p>
                                </div>
                            )}

                            {work.suac?.url && (
                                <div className="mt-8">
                                    <a
                                        href={work.suac.url.match(/^https?:\/\//) ? work.suac.url : `https://${work.suac.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center bg-black dark:bg-gray-700 text-white dark:text-gray-100 px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
                                    >
                                        View Project
                                        <FiExternalLink size={16} className="ml-2" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* 印刷ビューボタン（デスクトップのみ表示） */}
            <div className="hidden md:flex fixed bottom-6 right-6 z-40 no-print">
                <Link
                    href={`/works/${slug}/print`}
                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium border border-gray-300 dark:border-gray-600"
                    title="Print View"
                >
                    <FiPrinter size={18} />
                    Print
                </Link>
            </div>
        </div>
    );
}
