import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Plus, X } from 'lucide-react';
import clsx from 'clsx';

interface GalleryImage {
    id: string;
    file: File;
    previewUrl: string;
}

interface GalleryUploaderProps {
    images: GalleryImage[];
    setImages: (images: GalleryImage[]) => void;
}

export function GalleryUploader({ images, setImages }: GalleryUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // ファイルサイズチェック（20MB）
            if (file.size > 20 * 1024 * 1024) {
                alert('ファイルサイズが大きすぎます（20MB以下にしてください）');
                // 入力をクリア
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            const newImage: GalleryImage = {
                id: Math.random().toString(36).substr(2, 9),
                file,
                previewUrl: URL.createObjectURL(file)
            };
            setImages([...images, newImage]);

            // clear input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (id: string) => {
        setImages(images.filter(img => img.id !== id));
    };

    return (
        <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">ギャラリー</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <img src={img.previewUrl} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                            onClick={() => removeImage(img.id)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {/* Add Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className={clsx(
                        "aspect-square rounded-xl bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700",
                        "flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all",
                        "cursor-pointer"
                    )}
                >
                    <Plus size={32} />
                    <span className="text-sm font-medium">写真を追加</span>
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
