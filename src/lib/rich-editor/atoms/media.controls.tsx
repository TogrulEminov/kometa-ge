import type { Editor } from "@tiptap/react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { LuYoutube, LuVideo } from "react-icons/lu";
import ToolbarButton from "./toolbar";

interface Props {
  editor: Editor;
}

const RATIOS = [
  { label: "16:9", w: 640, h: 360 },
  { label: "4:3", w: 640, h: 480 },
  { label: "1:1", w: 480, h: 480 },
];

const extractYouTubeID = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

export default function MediaControls({ editor }: Props) {
  const [activeRatio, setActiveRatio] = useState(RATIOS[0]);
  const [url, setUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const addVideo = () => {
    if (!url.trim()) return;

    const videoId = extractYouTubeID(url);

    if (!videoId) {
      alert("Düzgün YouTube URL deyil");
      return;
    }

    editor.commands.setYoutubeVideo({
      src: `https://www.youtube.com/watch?v=${videoId}`,
      width: activeRatio.w,
      height: activeRatio.h,
    });

    setUrl("");
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <ToolbarButton
        onClick={() => setIsExpanded(!isExpanded)}
        isActive={editor.isActive("youtube")}
        title="Video əlavə et"
      >
        <LuYoutube size={18} />
      </ToolbarButton>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
            YouTube URL
          </label>

          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUrl(e.target.value)
            }
            onKeyDown={(e) => e.key === "Enter" && addVideo()}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300/40 focus:border-sky-400 transition-all mb-4"
          />

          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
            Ölçü
          </label>

          <div className="flex gap-2 mb-4">
            {RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                type="button"
                onClick={() => setActiveRatio(ratio)}
                className={`flex-1 py-1.5 text-xs cursor-pointer font-semibold rounded-md transition-colors
                  ${
                    activeRatio.label === ratio.label
                      ? "bg-sky-100 text-sky-700 border border-sky-300"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400 mb-4 text-center">
            {activeRatio.w} × {activeRatio.h} px
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={addVideo}
              disabled={!url.trim()}
              className="flex-1 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 py-2 px-4 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium rounded-lg transition-all"
            >
              <LuVideo size={14} />
              Əlavə et
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="py-2 cursor-pointer px-4 text-slate-500 hover:bg-slate-100 text-sm font-medium rounded-lg transition-all"
            >
              Ləğv et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}