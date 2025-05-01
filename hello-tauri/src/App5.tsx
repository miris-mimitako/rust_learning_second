// src/App5.tsx
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Rust の Stats 構造体と一致させる
interface Stats {
  count: number;
  sum: number;
  mean: number;
  std_dev: number;
  median: number;
}

// Passenger の数値カラム名
const numericColumns = [
  "PassengerId",
  "Survived",
  "Pclass",
  "Age",
] as const;

type Column = typeof numericColumns[number];

export default function App5() {
  const [column, setColumn] = useState<Column>("Age");
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // カラム選択時に Rust へ問い合わせて統計量取得
  useEffect(() => {
    setLoading(true);
    invoke<Stats | null>("compute_stats", { column })
      .then(res => {
        setStats(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("統計量取得失敗:", err);
        setLoading(false);
      });
  }, [column]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rust 側で統計量計算 (App5)
      </Typography>

      {/* カラム選択 */}
      <FormControl sx={{ minWidth: 200, mb: 3 }}>
        <InputLabel>カラム選択</InputLabel>
        <Select
          value={column}
          label="カラム選択"
          onChange={e => setColumn(e.target.value as Column)}
        >
          {numericColumns.map(col => (
            <MenuItem key={col} value={col}>
              {col}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 結果表示 */}
      {loading ? (
        <Typography>読み込み中...</Typography>
      ) : stats ? (
        <Box>
          <Typography>件数 (count): {stats.count}</Typography>
          <Typography>合計 (sum): {stats.sum.toFixed(2)}</Typography>
          <Typography>平均 (mean): {stats.mean.toFixed(2)}</Typography>
          <Typography>標準偏差 (std_dev): {stats.std_dev.toFixed(2)}</Typography>
          <Typography>中央値 (median): {stats.median.toFixed(2)}</Typography>
        </Box>
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
}