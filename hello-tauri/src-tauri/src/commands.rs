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
