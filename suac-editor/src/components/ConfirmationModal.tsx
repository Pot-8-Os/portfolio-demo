import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: React.ReactNode;
    confirmText?: string;
    confirmColor?: string; // 'blue' | 'red'
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor = 'blue' }: ConfirmationModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmColor === 'red'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        }`}>
                        <AlertTriangle size={24} />
                    </div>

                    <h3 className="text-xl font-bold mb-2">
                        {title || 'この内容で公開しますか？'}
                    </h3>

                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                        {message || (
                            <>
                                公開すると、サイト上で閲覧できるようになります。<br />
                                入力内容に間違いがないか確認ください。
                            </>
                        )}
                    </div>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-3 px-4 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${confirmColor === 'red'
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                                }`}
                        >
                            {confirmText || '公開する'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
