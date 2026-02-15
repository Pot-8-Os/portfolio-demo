import { getWorksByExhibition } from "@/lib/wordpress";
import { WorksGrid } from "@/components/WorksGrid";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ExhibitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { exhibition, works } = await getWorksByExhibition(slug);

    if (!exhibition) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-4 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 md:mb-12 fade-in">
                    <Link
                        href="/exhibitions"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors mb-6 group"
                    >
                        <svg
                            className="w-4 h-4 mr-1 transform transition-transform group-hover:-translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Exhibitions
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        {exhibition.name}
                    </h1>

                    {exhibition.description && (
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 bg-white/5 border border-white/10 rounded-lg px-6 py-4 inline-block backdrop-blur-sm">
                            <span className="text-lg">{exhibition.description}</span>
                        </div>
                    )}
                </header>

                {/* Works Grid */}
                <div className="fade-in" style={{ animationDelay: "0.2s" }}>
                    {works.length > 0 ? (
                        <WorksGrid initialWorks={works} hideFilters={true} />
                    ) : (
                        <p className="text-gray-500 text-center py-20">
                            No works registered for this exhibition yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
