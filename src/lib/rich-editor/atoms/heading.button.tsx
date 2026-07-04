import type { Editor } from "@tiptap/react";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuPilcrow,
} from "react-icons/lu";
import ButtonsDropdown from "./dropdown";
import { heading_key } from "../data/constant";

interface BtnProps {
  editor: Editor;
}

const headings = [
  { level: 1, Icon: LuHeading1, label: "Başlıq 1" },
  { level: 2, Icon: LuHeading2, label: "Başlıq 2" },
  { level: 3, Icon: LuHeading3, label: "Başlıq 3" },
] as const;

const itemClass =
  "w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-colors duration-200 cursor-pointer first:rounded-t-md last:rounded-b-md flex items-center gap-2";

export default function HeadingButton({ editor }: BtnProps) {
  const activeHeading = headings.find(({ level }) =>
    editor.isActive("heading", { level })
  );

  const ActiveIcon = activeHeading?.Icon ?? LuPilcrow;
  const isHeadingActive = !!activeHeading;

  return (
    <ButtonsDropdown
      stateKey={heading_key}
      element={
        <button
          type="button"
          title="Başlıq"
          className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-md transition-all duration-300
            ${
              isHeadingActive
                ? "bg-sky-100 text-sky-700"
                : "text-black hover:bg-slate-100"
            }`}
        >
          <ActiveIcon size={18} />
        </button>
      }
    >
      <button
        type="button"
        className={`${itemClass} ${
          !isHeadingActive ? "bg-sky-50 text-sky-700" : ""
        }`}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <LuPilcrow size={14} />
        Paragraph
      </button>

      {headings.map(({ level, Icon, label }) => (
        <button
          key={level}
          type="button"
          className={`${itemClass} ${
            editor.isActive("heading", { level })
              ? "bg-sky-50 text-sky-700"
              : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level }).run()
          }
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </ButtonsDropdown>
  );
}