import Image from "next/image";
import { getWorkBySlug, getWorks } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";
import type { Metadata } from "next";

export async function generateStaticParams() {
    try {
        const works = await getWorks();
        return works.map((work) => ({
            slug: work.slug,
        }));
    } catch (e) {
        console.warn('BUILD WARN: Could not fetch works for static generation (Print Page)', e);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const work = await getWorkBySlug(slug);
    return {
        title: work ? `${work.title} - Print` : "Print",
    };
}

export default async function PrintPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const work = await getWorkBySlug(slug);

    if (!work) {
        notFound();
    }

    const creatorName = work.creators?.nodes[0]?.name || "Unknown";

    return (
        <div className="fixed inset-0 z-[100] h-screen w-screen bg-gray-100 overflow-hidden flex items-center justify-center print:static print:h-auto print:w-auto print:block print:overflow-visible print:bg-white">
            {/* Print/Download Button */}
            <PrintButton workTitle={work.title} creatorName={creatorName} />

            {/* A4 Sheet Wrapper */}
            <div className="w-full h-full flex items-center justify-center p-8 print:p-0 print:block print:w-auto print:h-auto">
                <div
                    className="bg-white shadow-2xl print:shadow-none relative flex flex-col overflow-hidden origin-center"
                    style={{
                        width: '210mm',
                        height: '297mm',
                        maxWidth: 'calc(100vw - 4rem)',
                        maxHeight: 'calc(100vh - 4rem)',
                        aspectRatio: '210 / 297',
                    }}
                >
                    {/* Header Image (Half Height) */}
                    <div className="h-[50%] relative bg-gray-200">
                        {work.featuredImage?.node?.sourceUrl ? (
                            <Image
                                src={work.featuredImage.node.sourceUrl}
                                alt={work.featuredImage.node.altText || work.title}
                                fill
                                sizes="210mm"
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                        {/* Overlay Title */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-12 pt-32">
                            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                                {work.title}
                            </h1>
                            <div className="flex gap-4 text-white/90 text-xl font-medium">
                                {work.creators?.nodes[0]?.name && (
                                    <span>{work.creators.nodes[0].name}</span>
                                )}
                                {work.suac?.client && (
                                    <>
                                        <span>|</span>
                                        <span>{work.suac.client}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-12 flex flex-col justify-between">

                        {/* Concept / Main Text */}
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-300 pb-2">
                                Concept
                            </h2>
                            {work.suac?.concept ? (
                                <p className="text-2xl font-serif leading-relaxed text-gray-700">
                                    {work.suac.concept}
                                </p>
                            ) : (
                                <div className="text-xl text-gray-400 italic">No concept description available.</div>
                            )}
                        </div>

                        {/* Metadata Items */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-8">
                            {work.formats?.nodes && (
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Format</h3>
                                    <p className="text-lg font-medium text-gray-700">{work.formats.nodes.map(n => n.name).join(", ")}</p>
                                </div>
                            )}
                            {work.tools?.nodes && (
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Tools</h3>
                                    <p className="text-lg font-medium text-gray-700">{work.tools.nodes.map(n => n.name).join(", ")}</p>
                                </div>
                            )}
                            {work.suac?.productiondate && (
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Date</h3>
                                    <p className="text-lg font-medium text-gray-700">{work.suac.productiondate}</p>
                                </div>
                            )}
                            {work.suac?.duration && (
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Duration</h3>
                                    <p className="text-lg font-medium text-gray-700">{work.suac.duration}</p>
                                </div>
                            )}
                        </div>

                        {/* Gallery Thumbnails */}
                        {work.suac?.gallery && (
                            <div className="mt-6">
                                <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Gallery</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {work.suac.gallery.split('|').filter(url => url.trim()).slice(0, 4).map((url, index) => (
                                        <div key={index} className="aspect-square relative rounded overflow-hidden bg-gray-100">
                                            <Image
                                                src={url.trim()}
                                                alt={`Gallery ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="50mm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer / QR Placeholders */}
                        <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-end">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Created by</p>
                                <p className="text-2xl font-semibold tracking-tight text-gray-700">PORTFOLIO-DEMO</p>
                            </div>
                            {work.suac?.url && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-600 mb-1">{work.suac.url}</p>
                                    {/* In a real app, generate QR Code here */}
                                    <div className="w-16 h-16 bg-gray-900 ml-auto flex items-center justify-center text-white text-[10px]">
                                        QR CODE
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Settings for Browser */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                        padding: 0;
                    }
                    html, body, main, #__next, [data-nextjs-scroll-focus-boundary] {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        min-height: 0 !important;
                        height: auto !important;
                        overflow: visible !important;
                    }
                    body > * {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .no-print, header, footer, nav {
                        display: none !important;
                    }
                    /* Reset scaling for print */
                    .origin-center {
                        transform: none !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        max-width: none !important;
                        max-height: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
