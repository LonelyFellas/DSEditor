import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface File {
  name: string;
  path: string;
  is_dir: boolean;
}

function FileTree({
  files,
  level = 0,
  onFileClick,
  activePath,
}: {
  files: File[];
  level?: number;
  onFileClick: (file: File) => void;
  activePath: string;
}) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (file: File) => {
    setExpanded((prev) => ({
      ...prev,
      [file.path]: !prev[file.path],
    }));
  };

  return (
    <>
      {files.map((file) => (
        <div key={file.path}>
          <div
            className={[
              "flex items-center h-8 cursor-pointer rounded select-none pr-2",
              activePath === file.path
                ? "bg-blue-600 text-white"
                : "hover:bg-zinc-700/60",
              file.is_dir ? "font-semibold" : "",
            ].join(" ")}
            style={{ paddingLeft: `${level * 1.25}rem` }}
            onClick={() => {
              if (file.is_dir) handleToggle(file);
              else onFileClick(file);
            }}
          >
            <span className="w-5 text-center mr-1">
              {file.is_dir ? (expanded[file.path] ? "📂" : "📁") : "📄"}
            </span>
            <span className="truncate" title={file.name}>
              {file.name}
            </span>
          </div>
          {file.is_dir && expanded[file.path] && (
            <SubTree
              path={file.path}
              level={level + 1}
              onFileClick={onFileClick}
              activePath={activePath}
            />
          )}
        </div>
      ))}
    </>
  );
}

function SubTree({
  path,
  level,
  onFileClick,
  activePath,
}: {
  path: string;
  level: number;
  onFileClick: (file: File) => void;
  activePath: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    invoke("query_dir", { path }).then((res) => setFiles(res as File[]));
  }, [path]);
  return (
    <FileTree
      files={files}
      level={level}
      onFileClick={onFileClick}
      activePath={activePath}
    />
  );
}

interface SlideBarProps {
  onChangeFileContent: (content: string) => void;
}

export default function SlideBar({ onChangeFileContent }: SlideBarProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [activePath, setActivePath] = useState("");
  useEffect(() => {
    invoke("query_dir").then((res) => setFiles(res as File[]));
  }, []);

  const handleFileClick = (file: File) => {
    setActivePath(file.path);
    invoke("read_file_content", { path: file.path }).then((res) => {
      onChangeFileContent(res as string);
    });
  };

  return (
    <div className="bg-zinc-900 text-zinc-200 h-full overflow-y-auto text-sm">
      <FileTree
        files={files}
        onFileClick={handleFileClick}
        activePath={activePath}
      />
    </div>
  );
}
