import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GlobalDrawer } from "./GlobalDrawer";  // ← 先ほどのコンポーネントをインポート
import "./styles.css";
import { Layout } from "./Layout";
// React のマウント先を取得（非nullアサーション）
const rootEl = document.getElementById("root")!;

createRoot(rootEl).render(
  <React.StrictMode>
    {/* 全ページ共通のスライドバー */}
    <GlobalDrawer />

    {/* メインアプリ */}
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>
);
