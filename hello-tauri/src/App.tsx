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

  useEffect(() => {
    // コンポーネント初回マウント時に一度だけ呼び出す
    invoke<Passenger[]>("load_passengers")
      .then((data) => setPassengers(data)) // Rust からの配列を state にセット
      .catch((err) => console.error("読み込み失敗:", err));
  }, []);  // 依存配列空で初回のみ実行

  return (
    <div style={{ padding: 20 }}>
      {/* 見出し */}
      <Typography variant="h4" gutterBottom>
        Titanic 乗客リスト
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
