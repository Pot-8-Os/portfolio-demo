import Link from "next/link";
import { getWorks, getExhibitions, type Work, type TaxonomyNode } from "@/lib/wordpress";
import { WorksGrid } from "@/components/WorksGrid";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";

export default async function Home() {
  let latestWorks: Work[] = [];
  let exhibitions: TaxonomyNode[] = [];

  try {
    // ホームページ用に最新の作品と展覧会を取得
    latestWorks = (await getWorks()).slice(0, 3);
    exhibitions = await getExhibitions();
  } catch (e) {
    console.warn('ビルド時にホームページ用データを取得できませんでした', e);
  }

  const currentExhibition = exhibitions[0];

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500">

      {/* ヒーローセクション */}
      <section className="flex flex-col justify-center items-center max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16">
        <div className="w-full fade-in">

          <div className="relative p-6 md:p-10 rounded-[1.5rem] overflow-hidden border border-white/60 dark:border-white/5 shadow-xl backdrop-blur-2xl bg-white/40 dark:bg-white/5">
            {/* ガラス光沢エフェクト */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/5 pointer-events-none" />

            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-4 leading-none text-gray-900 dark:text-gray-100 mix-blend-overlay dark:mix-blend-normal opacity-90 text-center">
              PORTFOLIO
            </h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-t border-gray-900/10 dark:border-white/10 pt-4 mt-2">
              <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed tracking-tight">
                Design & Technology<br />
                <span className="text-gray-500 dark:text-gray-400 text-xs mt-1 block">
                  Research outcomes from my university life.
                </span>
              </p>
              <Link href="/about" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest underline decoration-1 underline-offset-4 hover:no-underline hover:opacity-60 transition-all mt-2 md:mt-0 self-end md:self-auto">
                About Me <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 最新の作品グリッド */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-end justify-between mb-4 fade-in px-2">
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
            Latest Works
          </h2>
          <Link
            href="/works"
            className="group flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest underline decoration-1 underline-offset-4 hover:no-underline hover:opacity-60 transition-all"
          >
            All Works
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative z-10">
          {/* WorksGridを3カラム・狭いギャップでオーバーライド */}
          <WorksGrid initialWorks={latestWorks} hideFilters className="md:grid-cols-3 gap-6" />
        </div>
      </section>

      {/* 現在の展覧会カード */}
      {currentExhibition && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex items-end justify-between mb-6 fade-in px-2">
            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
              Exhibition
            </h2>
            <Link
              href="/exhibitions"
              className="group flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest underline decoration-1 underline-offset-4 hover:no-underline hover:opacity-60 transition-all"
            >
              All Exhibitions
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <Link href={`/exhibitions/${currentExhibition.slug}`} className="block group relative rounded-[1.5rem] overflow-hidden aspect-[16/10] md:aspect-[2.4/1] fade-in shadow-xl transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1">
            {/* 背景画像 */}
            {currentExhibition.works?.nodes?.[0]?.featuredImage?.node?.sourceUrl ? (
              <Image
                src={currentExhibition.works.nodes[0].featuredImage.node.sourceUrl}
                alt={currentExhibition.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
            )}

            {/* グラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-12 flex flex-col justify-end text-white">
              <div className="max-w-4xl transform transition-transform duration-500 group-hover:translate-x-2">
                <div className="inline-flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Current Exhibition</span>
                </div>
                <h3 className="text-2xl md:text-5xl font-bold mb-4 tracking-tight leading-none">
                  {currentExhibition.name}
                </h3>
                <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed line-clamp-2">
                  {currentExhibition.description || "View detailed exhibition information."}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}
    </div >
  );
}
