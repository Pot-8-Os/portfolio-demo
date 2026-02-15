/**
 * useQualityToggle Hook
 * Manages image quality state for lightbox with preloading and state machine
 */

import { useState, useCallback, useRef, useMemo } from "react";
import { QualityState, ExtendedSlide } from "@/types";

interface UseQualityToggleOptions {
    slides: ExtendedSlide[];
    currentIndex: number;
}

interface UseQualityToggleReturn {
    qualityStates: Map<number, QualityState>;
    currentQualityState: QualityState;
    getQualityState: (index: number) => QualityState;
    handleQualityToggle: () => Promise<void>;
}

/**
 * Preloads an image and caches the result
 */
function createPreloader() {
    const cache = new Set<string>();

    return (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (cache.has(src)) {
                resolve();
                return;
            }

            const img = new window.Image();
            img.onload = () => {
                cache.add(src);
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    };
}

/**
 * Hook for managing image quality states in a lightbox
 *
 * State machine:
 * - optimized + click → loading (start preload)
 * - loading + preload complete → original
 * - original + click → optimized (reset)
 */
export function useQualityToggle({
    slides,
    currentIndex,
}: UseQualityToggleOptions): UseQualityToggleReturn {
    const [qualityStates, setQualityStates] = useState<Map<number, QualityState>>(
        () => new Map()
    );

    const preloadImage = useRef(createPreloader()).current;

    const getQualityState = useCallback(
        (slideIndex: number): QualityState => {
            return qualityStates.get(slideIndex) ?? "optimized";
        },
        [qualityStates]
    );

    const currentQualityState = useMemo(
        () => getQualityState(currentIndex),
        [getQualityState, currentIndex]
    );

    const handleQualityToggle = useCallback(async () => {
        const currentState = getQualityState(currentIndex);
        const slide = slides[currentIndex];

        if (currentState === "optimized") {
            // 最適化 → 読み込み中 へ遷移
            setQualityStates((prev) => new Map(prev).set(currentIndex, "loading"));

            try {
                await preloadImage(slide.originalSrc);
                await new Promise((r) => setTimeout(r, 100));
                setQualityStates((prev) => new Map(prev).set(currentIndex, "original"));
            } catch {
                setQualityStates((prev) => new Map(prev).set(currentIndex, "optimized"));
            }
        } else if (currentState === "original") {
            // 原寸 → 最適化 へ遷移
            setQualityStates((prev) => new Map(prev).set(currentIndex, "optimized"));
        }
    }, [getQualityState, currentIndex, slides, preloadImage]);

    return {
        qualityStates,
        currentQualityState,
        getQualityState,
        handleQualityToggle,
    };
}
