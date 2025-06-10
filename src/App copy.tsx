import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface File {
  name: string;
  path: string;
  is_dir: boolean;
  size: number;
  last_modified: string;
}

function FileItem({
  file,
  level = 0,
  onFileContent,
}: {
  file: File;
  level?: number;
  onFileContent: (content: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<File[]>([]);

  const handleClick = async () => {
    if (file.is_dir) {
      if (!isExpanded) {
        try {
          const result = await invoke("query_dir", { path: file.path });
          setChildren(result as File[]);
        } catch (error) {
          console.error("Failed to load directory:", error);
        }
      }
      setIsExpanded(!isExpanded);
    } else {
      const result = await invoke("read_file_content", { path: file.path });
      onFileContent(result as string);
    }
  };

  return (
    <div className="file-tree">
      <div
        className={`file-item ${file.is_dir ? "directory" : "file"}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleClick}
      >
        <span className="file-icon">
          {file.is_dir ? (isExpanded ? "📂" : "📁") : "📄"}
        </span>
        <span className="file-name">{file.name}</span>
      </div>
      {isExpanded &&
        children.map((child) => (
          <FileItem
            key={child.path}
            file={child}
            level={level + 1}
            onFileContent={onFileContent}
          />
        ))}
    </div>
  );
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileContent, setFileContent] = useState<string>("");
  useEffect(() => {
    invoke("query_dir").then((files) => {
      console.log(files);
      setFiles(files as File[]);
    });
  }, []);

  const handleFileContent = (content: string) => {
    setFileContent(content);
  };

  return (
    <main className="container">
      <div className="app-layout">
        <div className="file-list">
          {files.map((file) => (
            <FileItem
              key={file.path}
              file={file}
              onFileContent={handleFileContent}
            />
          ))}
        </div>
        <div className="file-content">
          {fileContent ? (
            <>
              <div className="file-content-body">
                <pre contentEditable>{fileContent}</pre>
              </div>
            </>
          ) : (
            <div className="file-content-empty">
              <span>选择一个文件查看内容</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
