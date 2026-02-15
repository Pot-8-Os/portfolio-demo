# SUAC Graduation Works Portfolio (2026)

## 1. Overview
静岡文化芸術大学 デザイン研究科 2025年度 修了制作のためのポートフォリオサイトおよび作品管理システムです。
Next.jsによる高速な閲覧体験と、WordPressをヘッドレスCMSとして活用した柔軟な作品管理を実現しています。

## 2. Features

### For Viewers (Portfolio Site)
- **High Performance**: Next.js App Router と SSG/ISR を活用した爆速なページ遷移
- **Smooth Animations**: Framer Motion による洗練されたインタラクションとページ遷移エフェクト
- **Responsive Design**: Tailwind CSS v4 を採用し、スマートフォンからデスクトップまで最適化されたレイアウト
- **Smart Filtering**: 制作フォーマット（Web/App/Phys）、使用ツール、制作者によるリアルタイム絞り込み検索

### For Creators (CMS & Editor)
- **Dedicated Editor**: 作品投稿専用のSPA（Single Page Application）を提供
- **Real-time Preview**: プレビューを見ながら直感的に作品情報を入力可能
- **Secure Handling**:
  - 画像の自動リネーム（`slug_date_seq`形式）によるファイル名衝突の回避
  - フロントエンド主導の確実なデータ保存プロセス
  - 並列アップロードによる高速なメディア送信

## 3. Tech Stack

### Frontend (User View)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **State Management**: React Hooks

### Editor (Creator View)
- **Framework**: React 19 + Vite
- **HTTP Client**: Axios
- **UI Components**: Lucide React

### Backend & Infrastructure
- **CMS**: WordPress (Headless Mode)
- **Server**: Docker, Docker Compose
- **Web Server**: Nginx (Reverse Proxy)
- **Database**: MySQL 8.0

## 4. Prerequisites
- Node.js v18+
- Docker & Docker Compose
- WordPress Environment (or Docker container)

## 5. Installation

### Configuration (Start Here)
1. **環境変数の設定**:
   `.env.example` をコピーして `.env` を作成し、ドメインやIPを設定します。
   ```bash
   cp .env.example .env
   vi .env
   ```
2. **設定ファイルの生成**:
   以下のスクリプトで Nginx 設定ファイルを生成します（`.gitignore` 済み）。
   ```bash
   chmod +x scripts/setup_nginx_config.sh
   ./scripts/setup_nginx_config.sh
   ```

### Backend (WordPress)
本リポジトリにはカスタムプラグインが含まれています。
1. WordPressをインストール（推奨: Docker構成）
2. `suac-editor/wordpress-plugin/` 内の `suac-backend-config.php` を使用、またはディレクトリごと `wp-content/plugins/` に配置してプラグイン化
3. WordPress管理画面でプラグインを有効化
4. パーマリンク設定を「投稿名」に変更して保存（REST API有効化のため）

### Frontend (Next.js)
```bash
# 依存関係のインストール
npm install

# 環境変数の設定 (.env.local)
NEXT_PUBLIC_API_URL=https://your-wordpress-site.com/wp-json

# 開発サーバーの起動
npm run dev
```

### Editor (Vite)
```bash
cd suac-editor
npm install

# 環境変数の設定 (.env)
VITE_API_BASE=https://your-wordpress-site.com/wp-json
VITE_AUTH_PASS=your_api_password

# 開発サーバーの起動
npm run dev
```

## 6. Directory Structure
```
.
├── src/                # Next.js Frontend Source
│   ├── app/            # App Router Pages
│   ├── components/     # UI Components
│   └── lib/            # Utilities (API, etc.)
├── suac-editor/        # Editor SPA (Vite + React)
│   ├── src/            # Editor Frontend Source
│   └── wordpress-plugin/ # WordPress Backend Plugin (suac-backend-config.php)
├── nginx/              # Nginx Configuration
├── docker-compose.yml  # Container Orchestration
└── public/             # Static Assets
```

## 7. Future Work
- (TBD)

## 8. License
This project is licensed under the MIT License.

## 9. Author
Hamada Sho (for SUAC Graduation Works 2026)
