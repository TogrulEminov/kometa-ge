import { type Editor } from "@tiptap/react";
import { LuList, LuListOrdered } from "react-icons/lu";
import ToolbarButton from "./toolbar";

interface BtnProps {
  editor: Editor | null;
}

export function UnorderedList({ editor }: BtnProps) {
  if (!editor) return null;

  return (
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      isActive={editor.isActive("bulletList")}
      title="Bullet List"
    >
      <LuList size={18} />
    </ToolbarButton>
  );
}

export function NumberedList({ editor }: BtnProps) {
  if (!editor) return null;

  return (
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      isActive={editor.isActive("orderedList")}
      title="Numbered List"
    >
      <LuListOrdered size={18} />
    </ToolbarButton>
  );
}