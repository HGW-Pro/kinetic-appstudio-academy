"use client";

import { useRef, useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";
import { useToast } from "./ToastProvider";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB, matches the bucket's file_size_limit
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export default function ImageUploader({
  onUploaded,
  pathPrefix = "uploads",
  label = "Upload image",
}: {
  onUploaded: (publicUrl: string) => void;
  pathPrefix?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { show } = useToast();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = `Unsupported file type "${file.type}". Use PNG, JPEG, WEBP, or GIF.`;
      setError(msg);
      show(msg, "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      const msg = `File is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 10MB.`;
      setError(msg);
      show(msg, "error");
      return;
    }

    setUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const safeName = `${crypto.randomUUID()}.${ext}`;
      const path = `${pathPrefix}/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("course-assets")
        .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage.from("course-assets").getPublicUrl(path);
      if (!publicUrlData?.publicUrl) {
        throw new Error("Upload succeeded but no public URL was returned.");
      }

      setPreview(publicUrlData.publicUrl);
      onUploaded(publicUrlData.publicUrl);
      show("Image uploaded.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setError(msg);
      show(msg, "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700 disabled:opacity-60"
        />
        {uploading && <span className="text-xs text-slate-500">Uploading…</span>}
      </div>
      {error && <p className="text-xs text-red-600">⚠️ {error}</p>}
      {preview && (
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <img src={preview} alt="Uploaded preview" className="h-16 w-16 rounded object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-600">{preview}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(preview)}
              className="mt-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              Copy URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
