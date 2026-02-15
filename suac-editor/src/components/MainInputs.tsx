import { useRef, useEffect } from 'react';

interface MainInputsProps {
    title: string;
    setTitle: (val: string) => void;
    concept: string;
    setConcept: (val: string) => void;
    content: string;
    setContent: (val: string) => void;
    errors?: { title?: boolean; concept?: boolean };
}

export function MainInputs({ title, setTitle, concept, setConcept, content, setContent, errors }: MainInputsProps) {
    const conceptRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize logic（min-heightを維持しつつ内容に合わせてリサイズ）
    const autoResize = (elem: HTMLTextAreaElement | null) => {
        if (elem) {
            elem.style.height = 'auto';
            const minH = parseInt(getComputedStyle(elem).minHeight) || 0;
            elem.style.height = Math.max(elem.scrollHeight, minH) + 'px';
        }
    };

    useEffect(() => {
        autoResize(conceptRef.current);
    }, [concept]);

    useEffect(() => {
        autoResize(contentRef.current);
    }, [content]);

    return (
        <div className="space-y-4">
            {/* Title */}
            <div className="group space-y-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</span>
                    <span className="text-[10px] text-blue-500 font-bold px-1.5 py-0.5 bg-blue-500/10 rounded">必須</span>
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="作品タイトル"
                    className={`
                        w-full text-2xl sm:text-3xl font-bold bg-transparent border-none focus:ring-0 px-0 py-1 transition-all
                        placeholder-gray-300 dark:placeholder-gray-700
                        ${errors?.title ? 'placeholder-red-300 text-red-600' : ''}
                    `}
                />
                <div className={`
                    h-0.5 w-0 transition-all duration-300 group-focus-within:w-full
                    ${errors?.title ? 'bg-red-500 w-full animate-pulse' : 'bg-blue-500'}
                `} />
            </div>

            {/* Concept */}
            <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                    <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${errors?.concept ? 'text-red-500' : 'text-gray-400'}`}>コンセプト</label>
                    <span className="text-[10px] text-blue-500 font-bold px-1.5 py-0.5 bg-blue-500/10 rounded">必須</span>
                </div>
                <textarea
                    ref={conceptRef}
                    rows={1}
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="作品のコンセプトを1〜2行で簡潔に..."
                    className={`
                        w-full text-base sm:text-xl leading-relaxed text-gray-700 dark:text-gray-200
                        border focus:border-blue-500/20 rounded-lg resize-none focus:ring-0 px-3 py-2 overflow-hidden transition-colors
                        ${errors?.concept
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500/50'
                            : 'bg-gray-100 dark:bg-gray-800/80 border-transparent'}
                    `}
                />
            </div>

            {/* Content (Body) */}
            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">本文・詳細</label>
                </div>
                <textarea
                    ref={contentRef}
                    rows={2}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="作品の詳細な解説やあらすじを入力してください..."
                    className="w-full text-base sm:text-lg leading-loose text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800/80 border border-transparent focus:border-blue-500/20 rounded-lg resize-none focus:ring-0 px-3 py-3 overflow-hidden font-sans transition-colors"
                />
            </div>
        </div>
    );
}
