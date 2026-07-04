import type { Editor } from "@tiptap/react";
import type { ChangeEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { LuImage, LuUpload, LuLink } from "react-icons/lu";
import ToolbarButton from "./toolbar";
import { postAPI } from "@/services/apiServices";
import { getForCards } from "@/utils/getFullimageUrl";

interface Props {
  editor: Editor;
}

export default function ImageUpload({ editor }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageWidth, setImageWidth] = useState("100%");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);

      const response = await postAPI("/api/files/upload-file", formData);
      const data = response.data;

      editor
        .chain()
        .focus()
        .setImage({
          src: getForCards(data as any),
          width: imageWidth,
        } as any)
        .run();

      setIsOpen(false);
    } catch (err) {
      console.error("Yükləmə xətası:", err);
    } finally {
      setIsLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleLinkSubmit = useCallback(() => {
    if (!imageUrl.trim()) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl.trim(),
        width: imageWidth,
      } as any)
      .run();

    setImageUrl("");
    setIsOpen(false);
  }, [editor, imageUrl, imageWidth]);

  return (
    <div className="re-upload-wrapper">
      <ToolbarButton
        isActive={isOpen}
        title="Şəkil əlavə et"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isLoading ? (
          <LuUpload size={18} className="re-upload-bounce" />
        ) : (
          <LuImage size={18} />
        )}
      </ToolbarButton>

      {isOpen && (
        <>
          <div
            className="re-upload-overlay"
            onClick={() => setIsOpen(false)}
          />

          <div className="re-upload-popover">
            <p className="re-upload-title">Şəkil Ayarları</p>

            {/* Ölçü */}
            <div className="re-upload-section">
              <label className="re-upload-label">
                Şəkil genişliyi:{" "}
                <span className="re-upload-mono">{imageWidth}</span>
              </label>

              <div className="re-upload-btn-group">
                {["25%", "50%", "100%"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setImageWidth(size)}
                    className={`re-upload-size-btn ${
                      imageWidth === size ? "active" : "inactive"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="re-upload-divider" />

            {/* URL input */}
            <div className="re-upload-input-group">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL yapışdırın..."
                className="re-upload-input"
              />

              <button onClick={handleLinkSubmit} className="re-upload-link-btn">
                <LuLink size={14} />
              </button>
            </div>

            {/* separator */}
            <div className="re-upload-or">
              <div className="re-upload-or-line" />
              <span className="re-upload-or-text">VƏ YA</span>
              <div className="re-upload-or-line" />
            </div>

            {/* file upload */}
            <button
              onClick={() => inputRef.current?.click()}
              className="re-upload-action-btn"
            >
              <LuUpload size={16} />
              Kompüterdən
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="re-hidden"
              onChange={handleFileUpload}
            />
          </div>
        </>
      )}
    </div>
  );
}