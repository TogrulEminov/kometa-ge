import type { Editor } from "@tiptap/react";
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuStrikethrough,
} from "react-icons/lu";
import ToolbarButton from "./toolbar";

interface BtnProps {
  editor: Editor;
}

export function BoldButton({ editor }: BtnProps) {
  return (
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleBold().run()}
      isActive={editor.isActive("bold")}
      title="Bold (Ctrl+B)"
    >
      <LuBold size={18} />
    </ToolbarButton>
  );
}

export function ItalicButton({ editor }: BtnProps) {
  return (
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleItalic().run()}
      isActive={editor.isActive("italic")}
      title="Italic (Ctrl+I)"
    >
      <LuItalic size={18} />
    </ToolbarButton>
  );
}

export function UnderlineButton({ editor }: BtnProps) {
  return (
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      isActive={editor.isActive("underline")}
      title="Underline (Ctrl+U)"
    >
      <LuUnderline size={18} />
    </ToolbarButton>
  );
}

export function StrikeButton({ editor }: BtnProps) {
  return (
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleStrike().run()}
      isActive={editor.isActive("strike")}
      title="Strikethrough"
    >
      <LuStrikethrough size={18} />
    </ToolbarButton>
  );
}