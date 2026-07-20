import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";
import { formatFirebaseError, uploadImage } from "../services/dataService";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
}: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState(value || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, folder, setProgress);
      onChange(url);
      setUrlInput(url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(formatFirebaseError(err));
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    onChange(trimmed);
    setError("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-bold text-violet-900">{label}</label>
        <div className="flex gap-1 clay-sm p-1">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === "url" ? "bg-violet-500 text-white shadow" : "text-violet-600"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === "upload" ? "bg-violet-500 text-white shadow" : "text-violet-600"
            }`}
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Upload
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <div className="flex gap-2">
          <input
            type="url"
            className="clay-input"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onBlur={applyUrl}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={applyUrl}
            className="clay-btn px-4 shrink-0 text-sm"
          >
            Set
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="clay-inset w-full py-8 flex flex-col items-center gap-2 text-violet-600 hover:text-violet-800 transition-colors cursor-pointer disabled:opacity-70"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <ImagePlus className="h-8 w-8" />
            )}
            <span className="text-sm font-bold">
              {uploading ? `Uploading... ${progress}%` : "Click to upload image"}
            </span>
            <span className="text-xs text-violet-400">PNG, JPG, WEBP up to 10MB</span>
            {uploading && (
              <div className="w-2/3 max-w-xs skill-bar-track mt-1">
                <div className="skill-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-rose-500 leading-relaxed">{error}</p>
      )}

      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-28 w-28 object-cover rounded-2xl shadow-md border-2 border-white"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/200x200/ddd6fe/6d28d9?text=Invalid";
            }}
          />
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlInput("");
            }}
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
