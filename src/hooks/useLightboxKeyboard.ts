/**
 * useLightboxKeyboard Hook
 * Handles keyboard shortcuts for the lightbox
 */

import { useEffect } from "react";

interface UseLightboxKeyboardOptions {
    isOpen: boolean;
    onQualityToggle: () => void;
}

/**
 * Hook for managing lightbox keyboard shortcuts
 *
 * Shortcuts:
 * - H: Toggle HQ quality mode
 */
export function useLightboxKeyboard({
    isOpen,
    onQualityToggle,
}: UseLightboxKeyboardOptions): void {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "h" || e.key === "H") {
                e.preventDefault();
                onQualityToggle();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onQualityToggle]);
}
