import { useState } from "react";
import { Modal, Divider } from "antd";
import type { Editor } from "@tiptap/react";
import ToolbarButton from "./toolbar";
import { LuCode } from "react-icons/lu";

interface BtnProps {
  editor: Editor;
}

function htmlToSource(html: string): string {
  return html
    .replace(/></g, ">\n<")
    .replace(/<\/p>/g, "</p>\n")
    .replace(/<br\s*\/?>/g, "<br>\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sourceToHtml(source: string): string {
  return source.replace(/\n/g, "").trim();
}

export function CodeButton({ editor }: BtnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceValue, setSourceValue] = useState("");

  const openModal = () => {
    setSourceValue(htmlToSource(editor.getHTML()));
    setIsOpen(true);
  };

  const handleOk = () => {
    editor.commands.setContent(sourceToHtml(sourceValue));
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ToolbarButton
        onClick={openModal}
        isActive={isOpen}
        title="HTML Source"
      >
        <LuCode size={20} />
      </ToolbarButton>

      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-700">
            <LuCode className="text-sky-500" size={18} />
            <span className="text-[15px] font-bold uppercase tracking-tight">
              HTML Mənbə Kodu
            </span>
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tətbiq et"
        cancelText="Ləğv et"
        width={800}
        centered
        destroyOnHidden
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
            padding: "16px 0",
          },
        }}
      >
        <Divider style={{ margin: "10px 0 16px 0" }} />

        <textarea
          className="w-full p-3 font-mono text-sm border border-gray-300 rounded bg-gray-50 resize-y outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          style={{ minHeight: "400px" }}
          value={sourceValue}
          onChange={(e) => setSourceValue(e.target.value)}
          spellCheck={false}
        />
      </Modal>
    </>
  );
}