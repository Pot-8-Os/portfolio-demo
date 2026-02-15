/**
 * Gallery/Lightbox Types
 * Type definitions for the interactive gallery and lightbox components
 */

/**
 * Extended Slide type with original source for HQ mode
 * Extends YARL's base Slide type to include originalSrc for quality toggle
 */
export interface ExtendedSlide {
    src: string;
    originalSrc: string;
}

/**
 * Quality state machine states for the HQ toggle UX
 *
 * - 'optimized': Initial state, showing Next.js optimized image
 * - 'loading': Transitional state, preloading original image
 * - 'original': Final state, showing full-resolution original
 */
export type QualityState = "optimized" | "loading" | "original";

/**
 * Props for the InteractiveGallery component
 */
export interface InteractiveGalleryProps {
    images: string[];
}
