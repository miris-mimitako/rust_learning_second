// src/App3.tsx
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Plot from "react-plotly.js";
import { Typography, Box } from "@mui/material";

// CSVの1行を表す型定義（commands.rs の Passenger と一致させる）
interface Passenger {
  PassengerId: number;
  Name: string;
  Sex: string;
  Age: number | null;
}

export default function App3() {
  // データと統計量をステートで保持
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [mean, setMean]         = useState<number | null>(null);
  const [stdDev, setStdDev]     = useState<number | null>(null);
  const [median, setMedian]     = useState<number | null>(null);

  useEffect(() => {
    // Rust側コマンドでデータ取得
    invoke<Passenger[]>("load_passengers")
      .then(data => {
        setPassengers(data);
        // 年齢だけの配列を抽出し、nullは除外
        const ages = data
          .map(p => p.Age)
          .filter((a): a is number => a !== null);
        if (ages.length > 0) {
          // 平均
          const sum = ages.reduce((s, a) => s + a, 0);
          const avg = sum / ages.length;
          setMean(avg);

          // 標準偏差
          const variance = ages
            .map(a => (a - avg) ** 2)
            .reduce((s, v) => s + v, 0) / ages.length;
          setStdDev(Math.sqrt(variance));

          // 中央値
          const sorted = [...ages].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          const med =
            sorted.length % 2 === 1
              ? sorted[mid]
              : (sorted[mid - 1] + sorted[mid]) / 2;
          setMedian(med);
        }
      })
      .catch(err => {
        console.error("データ読み込み失敗:", err);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {/* 統計量の表示 */}
      <Typography variant="h4" gutterBottom>
        Titanic 年齢データの統計量
      </Typography>
      <Typography>
        平均: {mean !== null ? mean.toFixed(2) : "─"} /{" "}
        標準偏差: {stdDev !== null ? stdDev.toFixed(2) : "─"} /{" "}
        中央値: {median !== null ? median.toFixed(2) : "─"}
      </Typography>

      {/* Plotly ヒストグラム */}
      {passengers.length > 0 && (
        <Plot
          data={[
            {
              x: passengers.map(p => p.Age).filter((a): a is number => a !== null),
              type: "histogram",
              nbinsx: 20,
            },
          ]}
          layout={{
            title: "Age Distribution",
            xaxis: { title: "Age" },
            yaxis: { title: "Count" },
            autosize: true,
          }}
          style={{ width: "100%", height: "500px" }}
          useResizeHandler
        />
      )}
    </Box>
  );
}
