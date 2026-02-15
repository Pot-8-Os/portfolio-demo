import { Check } from 'lucide-react';

interface PublishingOverlayProps {
    isVisible: boolean;
    isComplete: boolean;
}

export function PublishingOverlay({ isVisible, isComplete }: PublishingOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative flex flex-col items-center">
                {/* Icon Container */}
                <div className={`
                    relative w-24 h-24 mb-8 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${isComplete ? 'scale-110 rotate-0' : 'scale-100'}
                `}>
                    {/* Favicon Spinner */}
                    <img
                        src="/favicon.svg"
                        alt="Loading"
                        className={`
                            w-full h-full object-contain transition-all duration-500
                            ${isComplete ? 'grayscale-0' : 'grayscale animate-spin'}
                        `}
                        style={{ animationDuration: '2s' }}
                    />

                    {/* Success Checkmark Badge */}
                    <div className={`
                        absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2
                        transition-all duration-500 delay-100 shadow-lg
                        ${isComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                    `}>
                        <Check size={24} strokeWidth={3} />
                    </div>
                </div>

                {/* Status Text */}
                <h2 className="text-2xl font-bold tracking-widest transition-all duration-300 text-gray-900 dark:text-white">
                    {isComplete ? (
                        <span className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            投稿完了
                        </span>
                    ) : (
                        <span className="animate-pulse">
                            送信中...
                        </span>
                    )}
                </h2>

                {isComplete && (
                    <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                        ページを更新します
                    </p>
                )}
            </div>
        </div>
    );
}
