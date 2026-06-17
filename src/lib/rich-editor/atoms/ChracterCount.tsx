import { useEditorState, type Editor } from "@tiptap/react";

interface BtnProps {
  editor: Editor;
}

export default function CharacterCountComponent({ editor }: BtnProps) {
  const { characters, words, activeNode, activeMarks } = useEditorState({
    editor,
    selector: (ctx) => {
      const { editor } = ctx;

      // 1. Blok Tipini Müəyyən Etmək
      let nodeType = "Paraqraf";
      if (editor.isActive("heading", { level: 1 })) nodeType = "H1";
      else if (editor.isActive("heading", { level: 2 })) nodeType = "H2";
      else if (editor.isActive("heading", { level: 3 })) nodeType = "H3";
      else if (editor.isActive("blockquote")) nodeType = "Sitat";
      else if (editor.isActive("codeBlock")) nodeType = "Kod";
      else if (editor.isActive("bulletList")) nodeType = "Siyahı";
      else if (editor.isActive("orderedList")) nodeType = "Nömrəli";

      // Fix: Explicitly define the array type as string[]
      const marks: string[] = [];
      if (editor.isActive("bold")) marks.push("Qalın");
      if (editor.isActive("italic")) marks.push("Maili");
      if (editor.isActive("underline")) marks.push("Altı cızılı");
      if (editor.isActive("strike")) marks.push("Üstü cızılı");
      if (editor.isActive("code")) marks.push("Inline Kod");

      return {
        characters: editor.storage.characterCount.characters(),
        words: editor.storage.characterCount.words(),
        activeNode: nodeType,
        activeMarks: marks,
      };
    },
  });
  return (
    <div className="flex justify-between items-center mt-2 px-3 py-2 text-[10px] font-bold text-slate-500 border-t border-gray-200 bg-gray-50 uppercase tracking-tight shadow-inner">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span className="text-sky-600">Blok: {activeNode}</span>
        </div>

        {/* Əgər hər hansı format (Bold və s.) aktivdirsə göstər */}
        {activeMarks.length > 0 && (
          <div className="flex gap-1 border-l border-gray-300 pl-2">
            {activeMarks.map((mark) => (
              <span
                key={mark}
                className="bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded text-[9px]"
              >
                {mark}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <span className="hidden sm:inline">{words} söz</span>
        <span>{characters} simvol</span>
      </div>
    </div>
  );
}
