import { Image as ImageIcon, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState, useRef } from 'react';

interface HeroUploaderProps {
    onImageSelect: (file: File | null) => void;
    error?: boolean;
}

export function HeroUploader({ onImageSelect, error }: HeroUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // ファイルサイズチェック（20MB）
            if (file.size > 20 * 1024 * 1024) {
                alert('ファイルサイズが大きすぎます（20MB以下にしてください）');
                return;
            }

            const url = URL.createObjectURL(file);
            setPreview(url);
            onImageSelect(file);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative group w-full aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                    ${preview ? 'bg-black' : 'bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'}
                    ${error ? '!border-red-500/50 !bg-red-50/10 animate-pulse ring-2 ring-red-500/20' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Hero Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <p className="text-white font-medium flex items-center gap-2">
                                <ImageIcon size={20} />
                                画像を変更
                            </p>
                        </div>
                        <button
                            onClick={handleClear}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={20} />
                        </button>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                        <ImageIcon size={48} className="mb-4 transition-transform group-hover:scale-110" />
                        <p className="font-medium text-lg">メイン画像をアップロード</p>
                        <p className="text-sm opacity-60 mt-1">20MBまで</p>
                    </div>
                )}
            </div>
        </div>
    );
}
