"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./style.css";
import CharacterCount from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import FontSize from "@tiptap/extension-text-style/font-size";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  BoldButton,
  ItalicButton,
  StrikeButton,
  UnderlineButton,
} from "@/lib/rich-editor/atoms/character.buttons";
import {
  NumberedList,
  UnorderedList,
} from "@/lib/rich-editor/atoms/list.button";
import FontSizeButton from "@/lib/rich-editor/atoms/font.button";
import HeadingButton from "@/lib/rich-editor/atoms/heading.button";
import Heading from "@tiptap/extension-heading";
import {
  BlockquoteButton,
  HorizontalRuleButton,
} from "@/lib/rich-editor/atoms/layout.controls";
import Blockquote from "@tiptap/extension-blockquote";
import Youtube from "@tiptap/extension-youtube";
import MediaControls from "@/lib/rich-editor/atoms/media.controls";
import Image from "@tiptap/extension-image";
import ImageUpload from "@/lib/rich-editor/atoms/image.upload";
import Link from "@tiptap/extension-link";
import LinkButton from "@/lib/rich-editor/atoms/link.button";
import CharacterCountComponent from "@/lib/rich-editor/atoms/ChracterCount";
import { CodeButton } from "@/lib/rich-editor/atoms/code";
import { TableControls } from "@/lib/rich-editor/atoms/TableControls";
import PreviewBtn from "@/lib/rich-editor/atoms/mode.preview";
import { AlignmentButtons } from "@/lib/rich-editor/atoms/alignment.buttons";
import { HistoryControls } from "@/lib/rich-editor/atoms/HistoryButton";
import { useEffect } from "react";
interface RichEditorCoreProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}
export default function RichEditor({
  value,
  onChange,
  onBlur,
  placeholder,
}: RichEditorCoreProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "custom-bullet-list",
          },
        },

        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "custom-ordered-list",
          },
        },
      }),
      CharacterCount,
      Youtube.configure({
        controls: true,
        modestBranding: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Heading.configure({
        HTMLAttributes: {
          class: "custom-heading",
        },
        levels: [1, 2, 3],
      }),
      Table.configure({
        resizable: true, // Xanaların ölçüsünü dəyişmək imkanı
      }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      FontSize,
      TextStyle,
      HorizontalRule,
      Blockquote,
      Image,

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // ✅ Blur olanda RHF-ə xəbər ver (validation üçün)
    onBlur: () => {
      onBlur?.();
    },
  });
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      editor.commands.setContent(value ?? "");
    }
  }, [value, editor]);
  if (!editor) return null;
  return (
    <div className="w-full min-w-50 h-auto bg-gray-100 border border-[#ddd] rounded-sm mb-4 p-2">
      <div className="bg-gray-50 p-2">
        <div className={"flex items-center gap-2"}>
          <div
            className={
              "flex w-fit items-center pr-2 mr-2 border-r border-gray-200"
            }
          >
            <BoldButton editor={editor} />
            <ItalicButton editor={editor} />
            <UnderlineButton editor={editor} />
            <StrikeButton editor={editor} />
          </div>
          <div
            className={"flex w-fit items-center pr-2 border-r border-gray-200"}
          >
            <UnorderedList editor={editor} />
            <NumberedList editor={editor} />
          </div>

          <div
            className={"flex w-fit items-center pr-2 border-r border-gray-200"}
          >
            <FontSizeButton editor={editor} />
          </div>
          <div
            className={"flex w-fit items-center pr-2 border-r border-gray-200"}
          >
            <HeadingButton editor={editor} />
          </div>

          <div
            className={"flex w-fit items-center pr-2 border-r border-gray-200"}
          >
            <HorizontalRuleButton editor={editor} />
            <BlockquoteButton editor={editor} />
          </div>

          <div
            className={"flex w-fit items-center pr-2 border-r border-gray-200"}
          >
            <MediaControls editor={editor} />
            <ImageUpload editor={editor} />
            <LinkButton editor={editor} />
          </div>
          <div className="flex w-fit items-center">
            <AlignmentButtons editor={editor} />
            <TableControls editor={editor} />
            <CodeButton editor={editor} />
            <PreviewBtn editor={editor} />
            <HistoryControls editor={editor} />
          </div>
        </div>
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
      <CharacterCountComponent editor={editor} />
    </div>
  );
}
