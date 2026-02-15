/**
 * インタラクティブギャラリーコンポーネント
 *
 * サムネイルグリッド + ライトボックス表示
 * - HQ画質切り替え（プリロード付き）
 * - キーボードナビゲーション（Hキーで画質切替）
 * - グラスモーフィズムUI
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "./lightbox.css";

import { CgSpinner } from "react-icons/cg";

import { ExtendedSlide, InteractiveGalleryProps } from "@/types";
import { useQualityToggle, useLightboxKeyboard } from "@/hooks";
import { QualityToggleButton, GalleryThumbnail } from "@/components";

export default function InteractiveGallery({ images }: InteractiveGalleryProps) {
    // 状態管理
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    // 原寸URL付きのスライドデータ
    const slides = useMemo<ExtendedSlide[]>(
        () =>
            images.map((src) => ({
                src,
                originalSrc: src,
            })),
        [images]
    );

    // 画質切り替えフック
    const { currentQualityState, getQualityState, handleQualityToggle } =
        useQualityToggle({ slides, currentIndex: index });

    // キーボードショートカット
    useLightboxKeyboard({
        isOpen: open,
        onQualityToggle: handleQualityToggle,
    });

    // コールバック

    const handleOpen = useCallback((i: number) => {
        setIndex(i);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleView = useCallback(({ index: newIndex }: { index: number }) => {
        setIndex(newIndex);
    }, []);

    // スライド描画

    /** 画質状態を反映したカスタムスライド描画 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderSlide = useCallback(
        ({ slide, rect }: { slide: any; rect: { width: number; height: number } }) => {
            const extSlide = slide as ExtendedSlide;
            const slideIndex = slides.findIndex((s) => s.src === extSlide.src);
            const qualityState = getQualityState(slideIndex);
            const isOriginal = qualityState === "original";

            return (
                <div
                    className="relative w-full h-full flex items-center justify-center"
                    style={{ width: "100%", height: "100%" }}
                >
                    {/* 最適化画像 */}
                    <Image
                        src={extSlide.src}
                        alt=""
                        fill
                        className={`
                            object-contain
                            transition-opacity duration-500 ease-out
                            ${isOriginal ? "opacity-0" : "opacity-100"}
                        `}
                        sizes={`${Math.ceil(rect.width)}px`}
                        quality={75}
                        priority
                    />
                    {/* 原寸画像（切替時のみ表示） */}
                    {(qualityState === "original" || qualityState === "loading") && (
                        <Image
                            src={extSlide.originalSrc}
                            alt=""
                            fill
                            className={`
                                object-contain
                                transition-opacity duration-500 ease-out
                                ${isOriginal ? "opacity-100" : "opacity-0"}
                            `}
                            sizes={`${Math.ceil(rect.width)}px`}
                            unoptimized
                            quality={100}
                            priority
                        />
                    )}
                    {/* 読み込み中インジケーター */}
                    {qualityState === "loading" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-lg border border-white/10 text-white/80 text-sm flex items-center gap-2">
                                <CgSpinner className="animate-spin" size={16} />
                                <span>Loading original...</span>
                            </div>
                        </div>
                    )}
                </div>
            );
        },
        [slides, getQualityState]
    );

    // レンダリング

    return (
        <div className="mt-20 fade-in" style={{ animationDelay: "0.3s" }}>
            {/* セクションヘッダー */}
            <h2 className="text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider">Gallery</h2>

            {/* サムネイルグリッド */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {slides.map((slide, i) => (
                    <GalleryThumbnail
                        key={slide.src}
                        src={slide.src}
                        index={i}
                        onClick={handleOpen}
                    />
                ))}
            </div>

            {/* ライトボックス */}
            <Lightbox
                open={open}
                close={handleClose}
                index={index}
                slides={slides}
                on={{ view: handleView }}
                plugins={[Counter]}
                toolbar={{
                    buttons: [
                        <QualityToggleButton
                            key="quality-toggle"
                            qualityState={currentQualityState}
                            onToggle={handleQualityToggle}
                        />,
                        "close",
                    ],
                }}
                render={{
                    slide: renderSlide,
                }}
                carousel={{
                    finite: false,
                    preload: 2,
                }}
                animation={{
                    fade: 300,
                    swipe: 300,
                }}
            />
        </div>
    );
}
