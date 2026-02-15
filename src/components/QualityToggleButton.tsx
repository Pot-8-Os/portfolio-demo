/**
 * QualityToggleButton Component
 * Glassmorphism styled button for HQ image quality toggle
 */

import { FiCheck, FiArrowUp } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { QualityState } from "@/types";

interface QualityToggleButtonProps {
    qualityState: QualityState;
    onToggle: () => void;
}

export function QualityToggleButton({ qualityState, onToggle }: QualityToggleButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={qualityState === "loading"}
            className={`
                group relative flex items-center gap-2 px-4 py-2 ml-2
                rounded-xl text-sm font-medium
                transition-all duration-300 ease-out
                backdrop-blur-xl
                border border-white/10
                ${qualityState === "original"
                    ? "bg-white/20 text-white shadow-lg shadow-white/10"
                    : qualityState === "loading"
                        ? "bg-white/5 text-white/60 cursor-wait"
                        : "bg-black/40 text-white/80 hover:bg-white/10 hover:text-white"
                }
                active:scale-95
            `}
            title="Toggle High Quality (Keyboard: H)"
        >
            {qualityState === "loading" ? (
                <CgSpinner className="animate-spin" size={16} />
            ) : qualityState === "original" ? (
                <FiCheck size={14} strokeWidth={3} />
            ) : (
                <FiArrowUp size={16} />
            )}
            <span className="hidden sm:inline">
                {qualityState === "loading" ? "Loading..." : "HQ"}
            </span>
            {qualityState === "original" && (
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-sm -z-10" />
            )}
        </button>
    );
}
