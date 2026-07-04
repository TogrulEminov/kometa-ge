import { useCallback, useRef, useState } from "react";
import { LuLink, LuUnlink } from "react-icons/lu";
import ToolbarButton from "./toolbar";
import type { Editor } from "@tiptap/react";

interface BtnProps {
  editor: Editor;
}

export default function LinkButton({ editor }: BtnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(() => {
    const attrs = editor.getAttributes("link");

    setValue(attrs.href ?? "");
    setOpenInNewTab(attrs.target === "_blank");

    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setValue("");
    setOpenInNewTab(false);
  }, []);

  const applyLink = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const href =
      trimmed.startsWith("http") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:")
        ? trimmed
        : `https://${trimmed}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .toggleLink({
        href,
        target: openInNewTab ? "_blank" : "_self",
      })
      .run();

    closeModal();
  }, [editor, value, openInNewTab, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  return (
    <>
      <ToolbarButton
        title="Link (Ctrl+K)"
        onClick={openModal}
        isActive={editor.isActive("link")}
      >
        <LuLink size={16} />
      </ToolbarButton>

      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onMouseDown={(e) => {
            if (e.target === overlayRef.current) closeModal();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Link əlavə et
            </h3>

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyLink();
                if (e.key === "Escape") closeModal();
              }}
              placeholder="https://example.com"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300/40 transition-all mb-3"
            />

            <div
              onClick={() => setOpenInNewTab(!openInNewTab)}
              className="flex items-center gap-2 mb-4 cursor-pointer select-none group"
            >
              <div
                className={`w-8 h-4 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                  openInNewTab ? "bg-sky-400" : "bg-slate-200"
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${
                    openInNewTab ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
              <span className="text-xs text-slate-500 group-hover:text-slate-700">
                Yeni tabda aç
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={applyLink}
                disabled={!value.trim()}
                className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-100 text-white text-sm font-medium rounded-lg transition-all"
              >
                Tətbiq et
              </button>

              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="py-2 px-3 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <LuUnlink size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={closeModal}
                className="py-2 px-4 text-slate-500 hover:bg-slate-100 text-sm font-medium rounded-lg transition-all"
              >
                Ləğv et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}