"use client";

import { usePathname } from "next/navigation";
import { FiDownload, FiChevronLeft } from "react-icons/fi";

interface PrintButtonProps {
    workTitle: string;
    creatorName: string;
}

export default function PrintButton({ workTitle, creatorName }: PrintButtonProps) {
    const pathname = usePathname();
    // /print を除去して作品詳細ページのURLを取得
    const backUrl = pathname.replace(/\/print$/, "");

    const handlePrint = () => {
        // PDFファイル名用にドキュメントタイトルを設定
        const originalTitle = document.title;
        document.title = `${workTitle} - ${creatorName}`;
        window.print();
        // 印刷ダイアログ後に元のタイトルを復元
        setTimeout(() => {
            document.title = originalTitle;
        }, 100);
    };

    return (
        <div className="fixed top-6 right-6 z-[200] flex gap-3 print:hidden no-print">
            <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-3 bg-gray-800 text-white font-medium rounded-xl shadow-lg hover:bg-gray-700 transition-all hover:shadow-xl active:scale-95"
            >
                <FiDownload size={20} />
                PDFダウンロード
            </button>
            <a
                href={backUrl}
                className="flex items-center gap-2 px-4 py-3 bg-white !text-black font-semibold rounded-xl shadow-2xl hover:bg-gray-50 transition-all hover:shadow-xl border border-gray-200 ring-1 ring-gray-300"
            >
                <FiChevronLeft size={18} strokeWidth={2.5} />
                戻る
            </a>
        </div>
    );
}
