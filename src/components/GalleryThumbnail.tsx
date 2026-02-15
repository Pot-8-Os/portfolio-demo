/**
 * GalleryThumbnail Component
 * Thumbnail with center-blur hover effect for gallery grid
 */

import Image from "next/image";
import { FiMaximize2 } from "react-icons/fi";

interface GalleryThumbnailProps {
    src: string;
    index: number;
    onClick: (index: number) => void;
}

export function GalleryThumbnail({ src, index, onClick }: GalleryThumbnailProps) {
    return (
        <button
            onClick={() => onClick(index)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer"
        >
            <Image
                src={src}
                alt={`Gallery image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-all duration-300 ease-out group-hover:scale-105 group-hover:blur-sm"
            />
            {/* Center blur overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className={`
                        p-3 rounded-full
                        bg-white/0 group-hover:bg-white/10
                        border border-white/0 group-hover:border-white/20
                        text-white
                        opacity-0 group-hover:opacity-100
                        scale-50 group-hover:scale-100
                        transition-all duration-300 ease-out
                        backdrop-blur-sm
                    `}
                >
                    <FiMaximize2 size={24} className="drop-shadow-lg" />
                </div>
            </div>
        </button>
    );
}
