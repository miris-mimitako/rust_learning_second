// App2.tsx

import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";    // Tauri の invoke API
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";                            // MUI コンポーネント群

// CSV から読み込むデータの型定義
interface Passenger {
  PassengerId: number;
  Name: string;
  Sex: string;
  Age: number | null;
}

export default function App() {
  // 乗客リストをステートで保持
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  // 平均年齢をステートで保持（null は取得失敗またはデータなしを表す）
  const [averageAge, setAverageAge] = useState<number | null>(null);

  useEffect(() => {
    // ───────────────────────────────────────────────────────────
    // 1. 乗客データを Rust 側の `load_passengers` から取得
    invoke<Passenger[]>("load_passengers")
      .then((data) => setPassengers(data)) // 成功したらテーブル用ステートにセット
      .catch((err) => console.error("読み込み失敗:", err));

    // 2. 平均年齢を Rust 側の `average_age` から取得
    invoke<number | null>("average_age")
      .then((avg) => {
        // Option<f32> の None は null、Some(x) は x として受け取られる
        setAverageAge(avg);
      })
      .catch((err) => console.error("平均年齢取得失敗:", err));
    // ───────────────────────────────────────────────────────────
  }, []);  // 初回マウント時のみ実行

  return (
    <div style={{ padding: 20 }}>
      {/* ページ見出し */}
      <Typography variant="h2" gutterBottom>
        This page is App2.tsx
      </Typography>

      {/* TITANIC 乗客リストのタイトルと平均年齢を同じ行に表示 */}
      <Typography variant="h4" gutterBottom>
        Titanic 乗客リスト{" "}
        {averageAge !== null
          ? `Age.Ave = ${averageAge.toFixed(3)}`  // 小数点以下3桁で表示
          : "Age.Ave = 不明"                      // データなし時の表示
        }
      </Typography>

      {/* テーブルコンテナ */}
      <TableContainer component={Paper}>
        <Table>
          {/* テーブルヘッダー */}
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>名前</TableCell>
              <TableCell>性別</TableCell>
              <TableCell>年齢</TableCell>
            </TableRow>
          </TableHead>

          {/* テーブルボディ */}
          <TableBody>
            {passengers.map((p) => (
              <TableRow key={p.PassengerId}>
                {/* 1行ごとにセルを作成 */}
                <TableCell>{p.PassengerId}</TableCell>
                <TableCell>{p.Name}</TableCell>
                <TableCell>{p.Sex}</TableCell>
                <TableCell>{p.Age ?? "不明"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
