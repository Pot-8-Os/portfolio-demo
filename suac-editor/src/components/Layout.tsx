import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans">
            <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
                {children}
            </main>
        </div>
    );
}
