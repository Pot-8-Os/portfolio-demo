import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { HeroUploader } from './components/HeroUploader';
import { MainInputs } from './components/MainInputs';
import { MetaInputs } from './components/MetaInputs';
import { GalleryUploader } from './components/GalleryUploader';
import { PublishingOverlay } from './components/PublishingOverlay';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ManageList } from './components/ManageList';
import { uploadMedia, createWork } from './lib/wordpress';

function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'manager'>('editor');
  const [heroImage, setHeroImage] = useState<File | null>(null);

  // フォーム入力値
  const [title, setTitle] = useState('');
  const [concept, setConcept] = useState('');
  const [content, setContent] = useState('');
  const [creator, setCreator] = useState('');
  const [format, setFormat] = useState('');
  const [tool, setTool] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [client, setClient] = useState('');
  const [url, setUrl] = useState('');

  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // UI状態
  const [isPublishing, setIsPublishing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    hero?: boolean;
    title?: boolean;
    concept?: boolean;
    creator?: boolean;
    url?: boolean;
    server?: string;
  }>({});

  // エラー箇所へのスクロール用ref
  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // バリデーション → 確認モーダル表示
  const handleCheckValidation = () => {
    const newErrors: typeof errors = {};
    if (!heroImage) newErrors.hero = true;
    if (!title) newErrors.title = true;
    if (!concept) newErrors.concept = true;
    if (!creator) newErrors.creator = true;

    // URLバリデーション（入力がある場合のみチェック）
    if (url && !url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
      newErrors.url = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // 最初のエラーまでスクロール
      if (newErrors.hero) heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (newErrors.title || newErrors.concept) mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (newErrors.creator) metaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return;
    }

    // 有効なら確認モーダルを表示
    setShowConfirm(true);
  };

  // 投稿実行
  const executePublish = async () => {
    setShowConfirm(false);
    setIsPublishing(true);
    setErrors({});

    try {
      // スラッグを先に生成（画像ファイル名に使用するため）
      const slug = `suac-grad-${Date.now()}`;
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

      // 1. ヒーロー画像のアップロード
      let heroMedia: any = null;
      if (heroImage) {
        const ext = heroImage.name.split('.').pop();
        const newName = `${slug}_${today}_hero.${ext}`;
        heroMedia = await uploadMedia(heroImage, title || 'Hero Image', newName); // リネームしてアップロード
      } else {
        throw new Error('ヒーロー画像は必須です');
      }

      // 2. ギャラリー画像のアップロード (並列処理)
      const galleryUploadPromises = galleryImages.map(async (img, index) => {
        const galleryIndex = index + 1;
        const alt = title ? `${title} - Gallery ${galleryIndex}` : `Gallery Image ${galleryIndex}`;
        const ext = img.file.name.split('.').pop();
        const seq = String(galleryIndex).padStart(2, '0');
        const newName = `${slug}_${today}_${seq}.${ext}`;

        return await uploadMedia(img.file, alt, newName);
      });

      const uploadedGalleryImages = await Promise.all(galleryUploadPromises);

      const galleryIds = uploadedGalleryImages.map(img => img.id);
      const galleryUrls = uploadedGalleryImages
        .map(img => img.source_url)
        .filter((url): url is string => !!url);

      // 作品データの作成
      await createWork({
        title,
        content,
        slug, // 生成済みスラッグを使用
        status: 'publish',
        featured_media: heroMedia.id,
        // バックエンドフックのトリガー
        suac_auto_tag: 'true',
        suac_creator_name: creator,
        suac_format_name: format,
        suac_tool_names: tool,
        suac_meta_productiondate: date,
        suac_meta_duration: duration,
        suac_meta_client: client,
        // URLにプロトコルがない場合は https:// を自動付与
        suac_meta_url: url && !url.match(/^https?:\/\//) ? `https://${url}` : url,
        suac_meta_concept: concept,
        suac_meta_gallery: galleryIds,
        // フロントエンドから直接URL文字列を送信（PHP側の変換不具合回避）
        suac_gallery: galleryUrls.join('|'),
      });

      // 完了アニメーション表示
      setIsComplete(true);

      // アニメーション表示後、フォームをリセット
      await new Promise(resolve => setTimeout(resolve, 2500));
      setTitle('');
      setConcept('');
      setContent('');
      setHeroImage(null);
      setGalleryImages([]);
      setCreator('');
      setFormat('');
      setTool('');
      setDate('');
      setDuration('');
      setClient('');
      setUrl('');
      window.scrollTo(0, 0);

    } catch (e: any) {
      console.error('投稿エラー:', e);
      const msg = e.response?.data?.message || e.message || 'Unknown error';
      setErrors(prev => ({ ...prev, server: msg }));
    } finally {
      setIsPublishing(false);
      setIsComplete(false);
    }
  };

  return (
    <>
      <PublishingOverlay isVisible={isPublishing} isComplete={isComplete} />

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executePublish}
      />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPublish={handleCheckValidation}
        isPublishing={isPublishing}
      />

      {/* サーバーエラーのグローバル表示 */}
      {errors.server && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl font-bold animate-bounce flex items-center gap-2">
          <span>⚠️ {errors.server}</span>
          <button onClick={() => clearError('server')} className="bg-white/20 rounded-full p-1 hover:bg-white/40"><span className="sr-only">Close</span>✕</button>
        </div>
      )}

      <Layout>
        {activeTab === 'editor' ? (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* ヒーロー画像 */}
            <div ref={heroRef} className="scroll-mt-24">
              <HeroUploader
                onImageSelect={(file) => {
                  setHeroImage(file);
                  if (file) clearError('hero');
                }}
                error={errors.hero}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
              {/* メインコンテンツ（左） */}
              <div className="lg:col-span-2 space-y-4">
                <div ref={mainRef} className="scroll-mt-24">
                  <MainInputs
                    title={title} setTitle={(val) => { setTitle(val); if (val) clearError('title'); }}
                    concept={concept} setConcept={(val) => { setConcept(val); if (val) clearError('concept'); }}
                    content={content} setContent={setContent}
                    errors={errors}
                  />
                </div>

                {/* ギャラリー */}
                <GalleryUploader images={galleryImages} setImages={setGalleryImages} />
              </div>

              {/* サイドバー（右） */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div ref={metaRef} className="scroll-mt-24">
                    <MetaInputs
                      creator={creator}
                      setCreator={(val) => { setCreator(val); if (val) clearError('creator'); }}
                      format={format} setFormat={setFormat}
                      tool={tool} setTool={setTool}
                      date={date} setDate={setDate}
                      duration={duration} setDuration={setDuration}
                      client={client} setClient={setClient}
                      url={url} setUrl={setUrl}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 最下部の投稿ボタン（モバイルでヘッダーが隠れても操作可能にする） */}
            <div className="pt-4 pb-8">
              <button
                onClick={handleCheckValidation}
                disabled={isPublishing}
                className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 shadow-lg"
              >
                投稿する
              </button>
            </div>
          </div>
        ) : (
          <ManageList />
        )}
      </Layout>
    </>
  );
}

export default App;
