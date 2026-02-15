import axios from 'axios';

// WordPress REST API エンドポイント
// .env で APP_EDITOR_API_BASE, APP_EDITOR_AUTH_USER, APP_EDITOR_AUTH_PASS を設定してください
const API_BASE = import.meta.env.APP_EDITOR_API_BASE || 'https://cms-demo.proletari.art/wp-json';
const AUTH_USER = import.meta.env.APP_EDITOR_AUTH_USER || 'suac';
const AUTH_PASS = import.meta.env.APP_EDITOR_AUTH_PASS || '';

if ((!API_BASE || !AUTH_USER || !AUTH_PASS) && import.meta.env.MODE !== 'development') {
    console.error('環境変数 APP_EDITOR_API_BASE / AUTH_USER / AUTH_PASS が未設定です');
}

// 認証付きHTTPクライアント
const client = axios.create({
    baseURL: API_BASE,
    headers: {
        'Authorization': `Basic ${btoa(`${AUTH_USER}:${AUTH_PASS}`)}`,
        'Content-Type': 'application/json'
    }
});

// 型定義
export interface WPMedia {
    id: number;
    source_url: string;
}

export interface WPTerm {
    id: number;
    name: string;
    slug: string;
}

export interface WPWork {
    title: string;
    content: string;
    status: 'publish' | 'draft';
    featured_media?: number;
    meta?: {
        suac_concept?: string;
        suac_gallery?: number[]; // 添付ファイルIDの配列
        productiondate?: string;
        duration?: string;
        client?: string;
        url?: string;
    };
    // タクソノミー
    slug?: string; // カスタムURLスラッグ
    // タクソノミー（カテゴリ分類）
    creator?: number[];
    format?: number[];
    tool?: number[];
    restriction?: number[];

    // バックエンドフック用パラメータ
    suac_auto_tag?: string;
    suac_creator_name?: string;
    suac_format_name?: string;
    suac_tool_names?: string;      // カンマ区切りで複数指定
    suac_meta_concept?: string;
    suac_meta_gallery?: number[];
    suac_gallery?: string; // フロントエンドから直接送信するURL文字列
    suac_meta_productiondate?: string;
    suac_meta_duration?: string;
    suac_meta_client?: string;
    suac_meta_url?: string;
}

// メディアのアップロード
export const uploadMedia = async (file: File, altText: string, newFileName?: string): Promise<WPMedia> => {
    let uploadFile = file;
    if (newFileName) {
        // Blobから新しいFileオブジェクトを作成してリネーム
        uploadFile = new File([file.slice(0, file.size, file.type)], newFileName, { type: file.type });
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('alt_text', altText);
    formData.append('caption', altText); // キャプションも設定しておくと便利

    const response = await client.post<WPMedia>('/wp/v2/media', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};

// タクソノミー検索
export const searchTaxonomy = async (taxonomy: 'creator' | 'format' | 'tool', search: string): Promise<WPTerm[]> => {
    const response = await client.get<WPTerm[]>(`/wp/v2/${taxonomy}`, {
        params: { search, per_page: 10 }
    });
    return response.data;
};

// タクソノミーの新規作成
export const createTerm = async (taxonomy: 'creator' | 'format' | 'tool' | 'restriction', name: string, args: Record<string, unknown> = {}): Promise<WPTerm> => {
    const response = await client.post<WPTerm>(`/wp/v2/${taxonomy}`, { name, ...args });
    return response.data;
};

// スラッグでタクソノミーを検索
export const getTermBySlug = async (taxonomy: 'restriction', slug: string): Promise<WPTerm | null> => {
    try {
        const response = await client.get<WPTerm[]>(`/wp/v2/${taxonomy}`, {
            params: { slug }
        });
        return response.data[0] || null;
    } catch (e) {
        return null;
    }
};

// 作品の新規作成
export const createWork = async (work: WPWork): Promise<any> => {
    const response = await client.post('/wp/v2/works', work);
    return response.data;
};

// 作品の更新
export const updateWork = async (id: number, data: Partial<WPWork>): Promise<any> => {
    const response = await client.post(`/wp/v2/works/${id}`, data);
    return response.data;
};

// 作品一覧の取得（管理画面用）
export const getWorks = async (params: Record<string, unknown> = {}): Promise<WPWork[]> => {
    const response = await client.get('/wp/v2/works', { params });
    return response.data;
};

// 認証チェック
export const validateSuacGrad = async () => {
    try {
        const response = await client.get('/wp/v2/users/me');
        return response.status === 200;
    } catch (e) {
        return false;
    }
};
