// リリースビルドではコンソールウィンドウを抑制する設定。
// デバッグビルド(debug_assertions = true)時のみコンソールが表示されます。
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// commands.rs モジュールを読み込み。
// CSV読み込みやgreet関数など、フロントエンドから呼び出すコマンドを定義しています。
mod commands;

fn main() {
    // Tauriアプリケーションのビルダーを生成
    tauri::Builder::default()
        // フロントエンドから呼び出せるコマンドを登録
        .invoke_handler(tauri::generate_handler![
            commands::load_passengers, // Titanic CSVを読み込むコマンド
            commands::greet            // 名前で挨拶を返すコマンド
        ])
        // Tauriコンテキストを生成してアプリケーションを実行
        .run(tauri::generate_context!())
        // 実行中にエラーが発生した場合は Panic してエラーメッセージを表示
        .expect("error while running tauri application");
    
    // 外部ライブラリ hello_tauri_lib の追加ランタイム処理を呼び出し
    hello_tauri_lib::run()
}
