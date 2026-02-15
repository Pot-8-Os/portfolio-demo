import { getWorks, type Work } from "@/lib/wordpress";
import { WorksGrid } from "@/components/WorksGrid";

export default async function WorksPage() {
    let works: Work[] = [];
    try {
        works = await getWorks();
    } catch (e) {
        console.warn('BUILD WARN: Could not fetch works for Works Page', e);
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-6">
                <div className="fade-in">
                    <h1 className="text-5xl md:text-5xl font-bold tracking-tight mb-6">
                        Works
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl">
                        これまでに手がけたプロジェクトや、実験的な制作の記録。
                    </p>
                </div>
            </section>

            {/* Works Grid with Filtering */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
                <WorksGrid initialWorks={works} />
            </section>
        </div >
    );
}
