
import { useState, useEffect } from 'react';
import { getWorks, updateWork, getTermBySlug } from '../lib/wordpress';
import { ConfirmationModal } from './ConfirmationModal';

export const ManageList = () => {
    const [works, setWorks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // モーダル状態
    const [modalOpen, setModalOpen] = useState(false);
    const [targetWork, setTargetWork] = useState<any | null>(null);

    const fetchWorks = async () => {
        setLoading(true);
        try {
            // 1. suac-gradタームIDを解決
            const term = await getTermBySlug('restriction', 'suac-grad');

            if (!term) {
                setError('システムエラー: suac-grad タグが見つかりません。');
                setLoading(false);
                return;
            }

            // 2. 制限フィルター付きで作品を取得
            // バックエンド側で未認証アクセスは拒否される
            const data = await getWorks({
                per_page: 20,
                _embed: true, // アイキャッチ画像取得用
                restriction: term.id,
                status: 'any' // 下書き・予約投稿等も含む
            });
            setWorks(data);
        } catch (err: any) {
            console.error(err);
            setError('データの取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const handleStatusToggleRequest = (work: any) => {
        setTargetWork(work);
        setModalOpen(true);
    };

    const executeToggle = async () => {
        if (!targetWork) return;

        const isPublished = targetWork.status === 'publish';
        // 公開中なら下書きに、それ以外なら公開に切り替え
        const newStatus = isPublished ? 'draft' : 'publish';

        // 楽観的更新
        const originalWorks = [...works];
        setWorks(works.map(w => w.id === targetWork.id ? { ...w, status: newStatus } : w));
        setModalOpen(false);

        try {
            await updateWork(targetWork.id, { status: newStatus });
        } catch (err) {
            alert('更新に失敗しました。');
            setWorks(originalWorks); // 元に戻す
        } finally {
            setTargetWork(null);
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'publish': return { label: '公開中', color: 'bg-green-100 text-green-800' };
            case 'draft': return { label: '下書き', color: 'bg-gray-200 text-gray-600' };
            case 'pending': return { label: '承認待ち', color: 'bg-yellow-100 text-yellow-800' };
            case 'future': return { label: '予約投稿', color: 'bg-blue-100 text-blue-800' };
            case 'private': return { label: '非公開', color: 'bg-red-100 text-red-800' };
            default: return { label: status, color: 'bg-gray-200 text-gray-600' };
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">読み込み中...</div>;
    if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

    return (
        <>
            {/* Confirmation Modal - アニメーションコンテナの外に配置してfixed位置ずれを防止 */}
            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={executeToggle}
                title={targetWork?.status === 'publish' ? '作品を下書きに戻しますか？' : '作品を公開しますか？'}
                message={targetWork?.status === 'publish'
                    ? <>下書きに戻すと、ユーザーは閲覧できません。<br />ステータスは「下書き」になります。</>
                    : <>公開すると、ウェブサイト上で閲覧できます。<br />ステータスは「公開済」になります。</>
                }
                confirmText={targetWork?.status === 'publish' ? '下書きに戻す' : '公開する'}
                confirmColor={targetWork?.status === 'publish' ? 'red' : 'blue'}
            />

            <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">管理記事一覧</h2>
                    <button onClick={fetchWorks} className="text-sm text-indigo-600 hover:text-indigo-800 font-bold">
                        ↺ 再読み込み
                    </button>
                </div>

                <div className="grid gap-4">
                    {works.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
                            記事が見つかりませんでした。
                        </div>
                    ) : (
                        works.map((work) => {
                            const statusInfo = getStatusInfo(work.status);
                            const isPublished = work.status === 'publish';

                            const thumbnailUrl = work._embedded?.['wp:featuredmedia']?.[0]?.source_url
                                || work._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.thumbnail?.source_url
                                || null;

                            return (
                                <div key={work.id} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md flex flex-row gap-3 sm:gap-4 overflow-hidden">

                                    {/* サムネイル */}
                                    <div className="shrink-0">
                                        {thumbnailUrl ? (
                                            <img
                                                src={thumbnailUrl}
                                                alt={work.title.rendered}
                                                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg bg-gray-100"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* コンテンツ */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            <span className="text-xs text-gray-400 shrink-0">{new Date(work.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mb-0.5">
                                            <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 truncate">{work.title.rendered}</h3>
                                        </div>
                                        <div className="text-xs text-gray-500 line-clamp-2">
                                            {work.content?.rendered?.replace(/<[^>]+>/g, '') || '本文なし'}
                                        </div>
                                    </div>

                                    {/* アクション */}
                                    <div className="flex flex-col items-center gap-3.5 shrink-0 justify-center">
                                        <button
                                            onClick={() => handleStatusToggleRequest(work)}
                                            type="button"
                                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition border whitespace-nowrap ${isPublished
                                                ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                : 'bg-green-600 text-white hover:bg-green-700 border-transparent'
                                                }`}
                                        >
                                            {isPublished ? '下書きに戻す' : '公開する'}
                                        </button>
                                        <a
                                            href={`${import.meta.env.APP_EDITOR_API_BASE?.replace('/wp-json', '') || ''}/wp-admin/post.php?post=${work.id}&action=edit`}
                                            target="_blank"
                                            className="text-[11px] text-gray-400 hover:text-indigo-500 transition"
                                        >
                                            CMSで編集
                                        </a>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};
