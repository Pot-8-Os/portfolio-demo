import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

interface MetaInputsProps {
    creator: string;
    setCreator: (val: string) => void;
    format: string;
    setFormat: (val: string) => void;
    tool: string;
    setTool: (val: string) => void;
    date: string;
    setDate: (val: string) => void;
    duration: string;
    setDuration: (val: string) => void;
    client: string;
    setClient: (val: string) => void;
    url: string;
    setUrl: (val: string) => void;
    errors?: { creator?: boolean, url?: boolean };
}

const InputRow = ({ value, onChange, placeholder, required = false, error = false }: { value: string, onChange: (val: string) => void, placeholder: string, required?: boolean, error?: boolean }) => (
    <div className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors",
        error
            ? "bg-red-50 dark:bg-red-900/10 border-red-500 focus-within:border-red-600"
            : "bg-gray-50 dark:bg-gray-900/50 border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-700"
    )}>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={clsx(
                "bg-transparent border-none focus:ring-0 w-full text-base",
                required && "placeholder-blue-900/30 dark:placeholder-blue-200/30 font-medium"
            )}
        />
        {required && <span className="text-xs text-blue-500 font-bold px-1.5 py-0.5 bg-blue-500/10 rounded whitespace-nowrap flex-shrink-0">REQ</span>}
        {error && <span className="text-xs text-red-500 font-bold px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 rounded whitespace-nowrap flex-shrink-0">ERROR</span>}
    </div>
);

export function MetaInputs({
    creator, setCreator,
    format, setFormat,
    tool, setTool,
    date, setDate,
    duration, setDuration,
    client, setClient,
    url, setUrl,
    errors
}: MetaInputsProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">作品情報</h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            <div className={clsx("space-y-3 transition-all duration-300 overflow-hidden", isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0")}>

                {/* Creator (Required) */}
                <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors
                    ${errors?.creator
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-500 focus-within:border-red-600'
                        : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 focus-within:border-blue-400'}
                `}>
                    <input
                        type="text"
                        value={creator}
                        onChange={(e) => setCreator(e.target.value)}
                        placeholder="制作者名"
                        className="bg-transparent border-none focus:ring-0 w-full text-base font-medium"
                    />
                    <span className={`
                        text-xs font-bold px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0
                        ${errors?.creator ? 'text-red-500 bg-red-100' : 'text-blue-500 bg-blue-500/10'}
                    `}>必須</span>
                </div>

                <InputRow value={format} onChange={setFormat} placeholder="作品形態 (例: インスタレーション)" />
                <InputRow value={tool} onChange={setTool} placeholder="使用ツール (例: Unity, Blender)" />
                <InputRow value={date} onChange={setDate} placeholder="制作日 (例: 2024-01)" />

                <div className="pt-4 pb-2">
                    <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
                </div>

                <InputRow value={duration} onChange={setDuration} placeholder="制作期間 (例: 3ヶ月)" />
                <InputRow value={client} onChange={setClient} placeholder="クライアント (任意)" />
                <InputRow value={url} onChange={setUrl} placeholder="関連URL (任意)" error={errors?.url} />
            </div>
        </div>
    );
}
