# Node.js公式イメージをベースに
FROM node:20-alpine

WORKDIR /app

# 依存関係をインストール（TypeScript含むdevDependenciesも必要）
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
# ソースコードをコピー
COPY . .

# ビルド引数を受け取る（これがないとビルド時に環境変数が空になる）
ARG WORDPRESS_API_URL
ENV WORDPRESS_API_URL=${WORDPRESS_API_URL}

# プロダクションビルド
RUN npm run build

# 本番用にdevDependenciesを削除
# RUN npm prune --production

# ポート3000を公開
EXPOSE 3000

# 本番モードで起動
CMD ["npm", "start"]
