import { Editor } from "@tiptap/react";
import {
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
} from "react-icons/lu";
import ToolbarButton from "./toolbar";

export function AlignmentButtons({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const alignments = [
    {
      name: "left",
      icon: <LuAlignLeft size={18} />,
      title: "Sola düzləndir",
    },
    {
      name: "center",
      icon: <LuAlignCenter size={18} />,
      title: "Mərkəzə düzləndir",
    },
    {
      name: "right",
      icon: <LuAlignRight size={18} />,
      title: "Sağa düzləndir",
    },
    {
      name: "justify",
      icon: <LuAlignJustify size={18} />,
      title: "Hər iki tərəfə",
    },
  ];

  return (
    <div className="flex items-center gap-0.5">
      {alignments.map((align) => (
        <ToolbarButton
          key={align.name}
          onClick={() =>
            editor.chain().focus().setTextAlign(align.name).run()
          }
          isActive={editor.isActive({ textAlign: align.name })}
          title={align.title}
        >
          {align.icon}
        </ToolbarButton>
      ))}
    </div>
  );
}