import { useEditorState, type Editor } from "@tiptap/react";
import { LuUndo2, LuRedo2 } from "react-icons/lu";
import ToolbarButton from "./toolbar";

export function HistoryControls({ editor }: { editor: Editor }) {
  const { canUndo, canRedo } = useEditorState({
    editor,
    selector: (ctx) => ({
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
    }),
  });

  return (
    <div className="flex items-center gap-1">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!canUndo}
        isActive={false}
        title="Geri al"
      >
        <LuUndo2 size={18} className={!canUndo ? "opacity-30" : ""} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!canRedo}
        isActive={false}
        title="İrəli al"
      >
        <LuRedo2 size={18} className={!canRedo ? "opacity-30" : ""} />
      </ToolbarButton>
    </div>
  );
}