// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::time::SystemTime;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize, Deserialize)]
struct File {
    name: String,
    path: String,
    is_dir: bool,
    size: u64,
    last_modified: SystemTime,
}

#[tauri::command]
fn query_dir(path: Option<String>) -> Option<Vec<File>> {
    let dir_path = path.unwrap_or_else(|| "/Users/worksapce/Dev/tauri-demo".to_string());
    let mut files: Vec<File> = Vec::new();
    let mut dir_files: Vec<File> = Vec::new(); // 目录
    let mut file_files: Vec<File> = Vec::new(); // 文件

    if let Ok(entries) = std::fs::read_dir(dir_path) {
        for entry in entries {
            if let Ok(entry) = entry {
                if let Ok(metadata) = entry.path().metadata() {
                    let path = entry.path();
                    let file = File {
                        name: path.file_name().unwrap().to_str().unwrap().to_string(),
                        path: path.display().to_string(),
                        is_dir: path.is_dir(),
                        size: metadata.len(),
                        last_modified: metadata.modified().unwrap_or(SystemTime::now()),
                    };

                    if path.is_dir() {
                        dir_files.push(file);
                    } else {
                        file_files.push(file);
                    }
                }
            }
        }

        // 目录优先，且目录和文件都按字幕排序排序
        dir_files.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
        file_files.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));

        // // 读取配置文件settings
        // let settings = std::fs::read_to_string().unwrap_or_default();
        // println!("settings: {:?}", settings);

        files.extend(dir_files);
        files.extend(file_files);
        Some(files)
    } else {
        None
    }
}

#[tauri::command]
fn read_file_content(path: String) -> Option<String> {
    if let Ok(content) = std::fs::read_to_string(path) {
        Some(content)
    } else {
        None
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            query_dir,
            read_file_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
