import MonacoEditor from "@monaco-editor/react";

interface BranchProps {
  fileContent: string;
}

export default function Branch({ fileContent }: BranchProps) {
  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        width="100%"
        language="typescript"
        theme="vs-dark"
        value={fileContent}
      />
    </div>
  );
}
