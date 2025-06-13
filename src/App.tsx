import { Allotment } from "allotment";
import SlideBar from "./components/layout/slide-bar";
import Branch from "./components/layout/branch";
import { useState } from "react";
import useContextMenu from "./hooks/useContextMenu";

export default function App() {
  useContextMenu(); // 全局关闭右键菜单
  const [fileContent, setFileContent] = useState("");

  const handleChangeFileContent = (content: string) => setFileContent(content);

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
