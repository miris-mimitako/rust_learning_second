// タイプセーフなTSファイルとしてコメント付きで設定をまとめます

// --- Tauri設定 (tauri.conf.json 相当) ---
export const tauriConfig = {
  // アプリ名として画面に表示される文字列
  productName: "hello-tauri",
  // アプリのバージョン
  version: "0.1.0",
  // 一意のアプリ識別子 (バンドルID)
  identifier: "com.hello-tauri.app",

  build: {
    // 開発モード起動前に実行するコマンド
    beforeDevCommand: "pnpm dev",
    // 開発モードで読み込むURL
    devUrl: "http://localhost:1420",
    // リリースビルド前に実行するコマンド
    beforeBuildCommand: "pnpm build",
    // フロントエンドビルド成果物ディレクトリ
    frontendDist: "../dist",
  },

  app: {
    // グローバルに`window.__TAURI__`を注入するか
    withGlobalTauri: true,
    windows: [
      {
        // ウィンドウタイトル
        title: "hello-tauri",
        // 初期幅(px)
        width: 800,
        // 初期高さ(px)
        height: 600,
      },
    ],
    security: {
      // CSP設定。nullでCSP無効化
      csp: null,
    },
  },

  bundle: {
    // インストーラを有効化
    active: true,
    // 対象プラットフォーム (all, msi, debなど)
    targets: "all",
    // アプリアイコン一覧
    icon: [
      "icons/32x32.png",       // Windows/Linux 32x32
      "icons/128x128.png",     // 128x128
      "icons/128x128@2x.png",  // Retina対応
      "icons/icon.icns",       // macOS向けICNS
      "icons/icon.ico"         // Windows向けICO
    ],
  },
};

// --- TypeScriptコンパイラ設定 (tsconfig.json 相当) ---
export const tsConfig = {
  compilerOptions: {
    // 出力ターゲット (モダンブラウザ向け)
    target: "ES2020",
    // React JSX変換方式
    jsx: "react-jsx",
    // モジュール解決方式
    moduleResolution: "node",
    // 型定義(.d.ts)を探すルート配列
    typeRoots: [
      "./node_modules/@types",
      "./src/types"
    ],
    // クラスフィールドを defineProperty 呼び出しで生成する
    useDefineForClassFields: true,
    // モジュール形式
    module: "ESNext",
    // 利用可能なLib定義
    lib: ["ES2020", "DOM", "DOM.Iterable"],
    // ライブラリ型チェックのスキップ (ビルド高速化)
    skipLibCheck: true,

    // Bundlerモード用オプション
    allowImportingTsExtensions: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,

    // 厳格モードとLinting周り
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
  },
  // コンパイル対象ファイル/フォルダ
  include: ["src"],
};

// --- Vite設定 (vite.config.ts 相当) ---
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Viteが開発起点とするディレクトリ
  root: "src",
  // Rustエラーも隠さない
  clearScreen: false,
  server: {
    // 開発サーバー待ち受けポート
    port: 1420,
    // ポートが埋まっていたら即失敗
    strictPort: true,
    // LAN向けHMR用ホスト (環境変数に基づく)
    host: process.env.TAURI_DEV_HOST || false,
    hmr: process.env.TAURI_DEV_HOST
      ? {
          protocol: "ws",
          host: process.env.TAURI_DEV_HOST,
          port: 1421,
        }
      : undefined,
    watch: {
      // Rust側ソースは監視対象外
      ignored: ["**/src-tauri/**"],
    },
  },
  plugins: [react()],
});
