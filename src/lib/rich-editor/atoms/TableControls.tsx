import { useState } from "react";
import { type Editor } from "@tiptap/react";
import { LuTable, LuColumns3, LuRows3, LuTrash2 } from "react-icons/lu";
import ToolbarButton from "./toolbar";

export function TableControls({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredGrid, setHoveredGrid] = useState({ rows: 0, cols: 0 });

  if (!editor) return null;

  const insertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setIsOpen(false);
    setHoveredGrid({ rows: 0, cols: 0 });
  };

  return (
    <div className="relative flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
      {/* Əsas Cədvəl Düyməsi */}
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        isActive={isOpen || editor.isActive("table")}
        title="Cədvəl əlavə et"
      >
        <LuTable size={20} />
      </ToolbarButton>

      {/* Grid Seçim Paneli (Popup) */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 z-50 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 min-w-50 w-fit animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Cədvəl Qurucu
              </span>
              <span className="text-[10px] font-mono bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded border border-sky-100">
                {hoveredGrid.rows || 0} x {hoveredGrid.cols || 0}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((row) =>
                [1, 2, 3, 4, 5].map((col) => (
                  <div
                    key={`${row}-${col}`}
                    onMouseEnter={() =>
                      setHoveredGrid({ rows: row, cols: col })
                    }
                    onMouseLeave={() => setHoveredGrid({ rows: 0, cols: 0 })}
                    onClick={() => insertTable(row, col)}
                    className={`w-6 h-6 border transition-all duration-150 rounded-[3px] cursor-pointer shadow-sm ${
                      row <= hoveredGrid.rows && col <= hoveredGrid.cols
                        ? "bg-sky-500 border-sky-600 ring-2 ring-sky-200 scale-110 z-10"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  />
                )),
              )}
            </div>
          </div>
        </>
      )}

      {/* Cədvəl Daxilindəki Kömekçi Düymələr */}
      {editor.isActive("table") && (
        <div className="flex items-center gap-1 bg-white border border-sky-100 shadow-lg p-1 rounded-lg ml-2 animate-in slide-in-from-left-2 duration-300">
          <button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-md transition-colors"
            title="Sütun əlavə et"
          >
            <LuColumns3 size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-md transition-colors"
            title="Sətir əlavə et"
          >
            <LuRows3 size={18} />
          </button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-md transition-colors"
            title="Cədvəli sil"
          >
            <LuTrash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
