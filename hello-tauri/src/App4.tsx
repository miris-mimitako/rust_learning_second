// src/App4.tsx
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Plot from "react-plotly.js";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// CSVの1行を表す型定義
interface Passenger {
  PassengerId: number;
  Survived: number;
  Pclass: number;
  Name: string;
  Sex: string;
  Age: number | null;
}

// グラフ種類の定義
type ChartType = "Bar" | "Scatter" | "Line" | "Swarm";

export default function App4() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [column, setColumn] = useState<keyof Passenger>("Age");
  const [chartType, setChartType] = useState<ChartType>("Bar");

  // データ取得
  useEffect(() => {
    invoke<Passenger[]>("load_passengers")
      .then((data) => setPassengers(data))
      .catch((err) => console.error("読み込み失敗:", err));
  }, []);

  // 数値カラム一覧
  const numericColumns: (keyof Passenger)[] = [
    "PassengerId",
    "Survived",
    "Pclass",
    "Age",
  ];

  // 選択中カラムの非null値配列
  const values = passengers
    .map((p) => p[column])
    .filter((v): v is number => v !== null && typeof v === "number");

  // Plotly trace生成
  let trace: any = {};
  let layout: any = { title: `${column} - ${chartType}`, autosize: true };

  switch (chartType) {
    case "Bar": {
      // 値の頻度集計
      const counts: Record<number, number> = {};
      values.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
      const xs = Object.keys(counts)
        .map(Number)
        .sort((a, b) => a - b);
      const ys = xs.map((x) => counts[x]);
      trace = { x: xs, y: ys, type: "bar" };
      layout.xaxis = { title: column };
      layout.yaxis = { title: "Count" };
      break;
    }
    case "Scatter": {
      trace = {
        x: values.map((_, i) => i),
        y: values,
        mode: "markers",
        type: "scatter",
      };
      layout.xaxis = { title: "Index" };
      layout.yaxis = { title: column };
      break;
    }
    case "Line": {
      trace = {
        x: values.map((_, i) => i),
        y: values,
        mode: "lines+markers",
        type: "scatter",
      };
      layout.xaxis = { title: "Index" };
      layout.yaxis = { title: column };
      break;
    }
    case "Swarm": {
      // 垂直方向に並べるSwarm
      trace = {
        x: values.map(() => (Math.random() - 0.5) * 0.3),
        y: values,
        mode: "markers",
        type: "scatter",
      };
      layout.xaxis = { showticklabels: false };
      layout.yaxis = { title: column };
      break;
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        データ可視化 (App4)
      </Typography>

      {/* カラム選択 */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>カラム</InputLabel>
          <Select
            value={column}
            label="カラム"
            onChange={(e) => setColumn(e.target.value as keyof Passenger)}
          >
            {numericColumns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>グラフ種類</InputLabel>
          <Select
            value={chartType}
            label="グラフ種類"
            onChange={(e) => setChartType(e.target.value as ChartType)}
          >
            {(["Bar", "Scatter", "Line", "Swarm"] as ChartType[]).map(
              (type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Box>

      {/* グラフ描画 */}
      {values.length > 0 && (
        <Plot
          data={[trace]}
          layout={layout}
          style={{ width: "100%", height: "500px" }}
          useResizeHandler
        />
      )}
    </Box>
  );
}
