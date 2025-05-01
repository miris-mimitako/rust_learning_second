use serde::{Deserialize, Serialize};  // `Deserialize`でCSV→構造体変換、`Serialize`でJSON返却
use tauri::command;                    // `#[command]`マクロ用
use std::{env, fs::File, path::PathBuf};                     // ファイル読み込み用
use csv::ReaderBuilder;                // CSVパーサ

// CSVの1行を受け取るための構造体定義
#[derive(Debug, Deserialize, Serialize)]
pub struct Passenger {
    // SerdeでPascalCaseのフィールド名を使う場合は
    // #[serde(rename_all = "PascalCase")] を構造体直上に置いて統一可
    pub PassengerId: u32,              // 乗客ID
    pub Survived: u8,                  // 生存フラグ (0 or 1)
    pub Pclass: u8,                    // 乗客クラス (1,2,3)
    pub Name: String,                  // 乗客氏名
    pub Sex: String,                   // 性別
    pub Age: Option<f32>,              // 年齢（欠損値はNone）
}

// フロントエンドから `invoke("load_passengers")` で呼び出される関数
#[command]
pub fn load_passengers() -> Vec<Passenger> {
    // 1. カレントディレクトリを取得（開発時はプロジェクトルート、実行時はバンドル先）
    let root: PathBuf = env::current_dir().expect("カレントディレクトリの取得に失敗");
    // 2. 必要なディレクトリ名をつなげてフルパスを構築
    let csv_path = root.join("objects").join("train.csv");
    println!("CSVファイルのフルパス: {:?}", csv_path);

    // CSVファイルを開く
    let file = File::open(&csv_path);
    if file.is_err() {
        // ファイルが開けなかったら空リストを返却
        return vec![];
    }

    // カスタム設定でリーダーを作成（ヘッダー付き）
    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_reader(file.unwrap());

    let mut passengers = Vec::new();
    // 1行ずつデシリアライズして構造体に変換
    for result in rdr.deserialize() {
        if let Ok(record) = result {
            passengers.push(record);
        }
    }
    // 最終的なVectorを返却
    passengers
}

// フロントエンドから `invoke("greet", { name })` で呼び出される関数
#[command]
pub fn greet(name: &str) -> String {
    // format!マクロで挨拶文を生成
    format!("Hello, {}!", name)
}

// ─────────────────────────────────────────────────────────────
// ここから追加：Ageの平均を算出する関数
// フロントエンドから `invoke("average_age")` で呼び出せるように #[command] を付与
#[command]
pub fn average_age() -> Option<f32> {
    // 乗客データを読み込み
    let passengers = load_passengers();

    // Age フィールドが Some のものだけを取り出して合計と件数を計算
    let (sum, count) = passengers
        .iter()
        .filter_map(|p| p.Age)          // Option<f32> を展開し、None は除外
        .fold((0.0, 0), |(s, c), age| {
            (s + age, c + 1)            // 合計値に加算し、件数をインクリメント
        });

    // 件数が0件でなければ平均値を計算してSomeで返却、0件ならNoneを返却
    if count > 0 {
        Some(sum / count as f32)
    } else {
        None
    }
}

// 統計量を返却する構造体
#[derive(Debug, Serialize)]
pub struct Stats {
    pub count: usize,     // 件数
    pub sum: f64,         // 合計
    pub mean: f64,        // 平均
    pub std_dev: f64,     // 標準偏差
    pub median: f64,      // 中央値
}


// 指定カラムの統計量を計算するコマンド
#[command]
pub fn compute_stats(column: &str) -> Option<Stats> {
    // CSV ファイルのパスを組み立て
    let root = std::env::current_dir().ok()?;
    let csv_path = root.join("objects").join("train.csv");
    let file = std::fs::File::open(&csv_path).ok()?;
    let mut rdr = csv::ReaderBuilder::new()
        .has_headers(true)
        .from_reader(file);

    // 指定カラムの値を全件収集（f64 に変換）
    let mut values: Vec<f64> = Vec::new();
    for result in rdr.deserialize::<Passenger>() {
        if let Ok(rec) = result {
            // column 名で分岐
            let v = match column {
                "PassengerId" => rec.PassengerId as f64,
                "Survived"   => rec.Survived as f64,
                "Pclass"     => rec.Pclass as f64,
                "Age"        => rec.Age.unwrap_or(0.0) as f64,
                _             => continue,
            };
            values.push(v);
        }
    }

    let count = values.len();
    if count == 0 {
        return None;  // データなし
    }

    // 合計と平均
    let sum: f64 = values.iter().sum();
    let mean = sum / count as f64;

    // 分散と標準偏差（母集団標準偏差）
    let variance: f64 = values
        .iter()                             // values（Vec<f64>）の各要素をイテレータで取り出し
        .map(|x| (x - mean).powi(2))       // 各要素 x について、平均 mean との差 (x - mean) を計算し、それを二乗 (powi(2)) する　|x| が各xの要素に対する処理である。
        .sum::<f64>()                      // その二乗偏差の全要素を合計。::<f64> は戻り値の型指定です
        / (count as f64);                  // データ数 count で割ることで「平均二乗偏差＝分散」を求める
    let std_dev = variance.sqrt();

    // 中央値
    values.sort_by(|a, b| a.partial_cmp(b).unwrap()); // 昇順にソート
    // 中央値の計算
    let median = if count % 2 == 1 {
        // 奇数件数の場合は中央の値を取得
        values[count / 2]
    } else {
        // 偶数件数の場合は中央の2つの値の平均を取得
        // 例：4件の場合は 2,3番目の値の平均を取る
        (values[count / 2 - 1] + values[count / 2]) / 2.0
    };

    Some(Stats { count, sum, mean, std_dev, median })
}