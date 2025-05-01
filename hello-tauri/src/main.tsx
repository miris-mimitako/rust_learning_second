// main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import App2 from "./App2";
import App3 from "./App3";
import App4 from "./App4";
import App5 from "./App5";  // 追加
import { GlobalDrawer } from "./GlobalDrawer";
import { Layout } from "./Layout";
import "./styles.css";

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(
  <React.StrictMode>
    {/* HashRouter でアプリ全体をラップ */}
    <HashRouter>
      {/* 全ページ共通のスライドバー */}
      <GlobalDrawer />

      {/* メインアプリ領域 */}
      <Layout>
        <Routes>
          <Route path="/"       element={<App />}   />
          <Route path="/app2"   element={<App2 />}  />
          <Route path="/app3"   element={<App3 />}  />  {/* ← 可視化画面のルート追加 */}
          <Route path="/app4"   element={<App4 />}  />  {/* ← 可視化画面のルート追加 */}
          <Route path="/app5" element={<App5 />} />  {/* App5 を追加 */}
        </Routes>
      </Layout>
    </HashRouter>
  </React.StrictMode>
);
