import type { Editor } from "@tiptap/react";
import ToolbarButton from "./toolbar";
import { LuMinus, LuQuote } from "react-icons/lu";

interface Props {
  editor: Editor;
}

export function HorizontalRuleButton({ editor }: Props) {
  return (
    <ToolbarButton
      title="Insert Horizontal Line"
      isActive={false}
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
    >
      <LuMinus size={18} />
    </ToolbarButton>
  );
}

export function BlockquoteButton({ editor }: Props) {
  return (
    <ToolbarButton
      title="Toggle blockquote"
      isActive={false}
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
    >
      <LuQuote size={18} />
    </ToolbarButton>
  );
}