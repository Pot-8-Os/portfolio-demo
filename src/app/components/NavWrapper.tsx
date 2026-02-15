"use client";

import { usePathname } from "next/navigation";

export default function NavWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // 印刷ページではナビゲーションを非表示
    const isPrintPage = pathname.includes("/print");

    if (isPrintPage) {
        return null;
    }

    return <>{children}</>;
}
