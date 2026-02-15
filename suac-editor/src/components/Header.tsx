import { Upload, Loader2 } from 'lucide-react';

interface HeaderProps {
    activeTab: 'editor' | 'manager';
    setActiveTab: (tab: 'editor' | 'manager') => void;
    onPublish?: () => void;
    isPublishing?: boolean;
}

export function Header({ activeTab, setActiveTab, onPublish, isPublishing }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 transition-all duration-300">
            <nav className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden md:block">
                        SUACの集い
                    </span>

                    {/* Mobile Logo Fallback */}
                    <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white md:hidden">
                        SUAC
                    </span>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-full border border-gray-200 dark:border-white/5">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'editor'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <span className="hidden sm:inline">新規投稿</span>
                        <span className="sm:hidden">投稿</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('manager')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'manager'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <span className="hidden sm:inline">管理一覧</span>
                        <span className="sm:hidden">管理</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {activeTab === 'editor' && (
                        <button
                            type="button"
                            onClick={onPublish}
                            disabled={isPublishing}
                            className="flex items-center gap-2 px-3 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                        >
                            {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                            <span className="hidden sm:inline">{isPublishing ? '公開中...' : '投稿する'}</span>
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}
