import { Allotment } from "allotment";
import SlideBar from "./components/layout/slide-bar";
import Branch from "./components/layout/branch";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function App() {
  const [fileContent, setFileContent] = useState("");

  const handleChangeFileContent = (content: string) => setFileContent(content);

  useEffect(() => {
    // 获取当前所有环境变量
    invoke("get_env", { key: "NODE_ENV" }).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div className="bg-primary h-screen flex flex-col">
      <Allotment defaultSizes={[100, 500]}>
        <Allotment.Pane minSize={160}>
          <SlideBar onChangeFileContent={handleChangeFileContent} />
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          {fileContent ? (
            <Branch fileContent={fileContent} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-zinc-400">No File Selected</div>
            </div>
          )}
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
