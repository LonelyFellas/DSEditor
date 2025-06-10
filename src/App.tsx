import { Allotment } from "allotment";

export default function App() {
  return (
    <div className="bg-primary h-screen flex flex-col">
      <Allotment defaultSizes={[250, 500]}>
        <Allotment.Pane minSize={160}>
          <div className="">file list</div>
        </Allotment.Pane>
        <Allotment.Pane snap>
          <div>file content</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
