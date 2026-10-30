import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ACCEPT: Record<string, string> = {
  image: "image/*",
  video: "video/*",
  file: "image/*,video/*,application/pdf,.doc,.docx,.zip",
};

export type MediaKind = "image" | "video" | "file";

export function MediaField({
  id,
  kind = "file",
  value,
  onChange,
}: {
  id: string;
  kind?: MediaKind;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${id}/${crypto.randomUUID()}.${ext}`;
      console.log("[upload] uploading to path:", path);

      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        console.error("[upload] storage error:", error);
        throw error;
      }

      // Use the permanent public URL — the bucket is public so no expiry issues
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      console.log("[upload] public URL:", data.publicUrl);
      onChange(data.publicUrl);
      toast.success("Uploaded");
    } catch (e) {
      console.error("[upload] caught:", e);
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const isImage = /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(value);
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(value);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          placeholder="Paste a link or upload a file"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT[kind]}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          <span className="ml-1 hidden sm:inline">Upload</span>
        </Button>
        {value ? (
          <Button type="button" variant="ghost" size="icon" aria-label="Clear" onClick={() => onChange("")}>
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      {value && isImage ? (
        <img src={value} alt="Preview" className="h-24 w-auto rounded-md border border-border object-cover" />
      ) : null}
      {value && isVideo ? (
        <video src={value} controls className="h-32 w-auto rounded-md border border-border" />
      ) : null}
      {value && !isImage && !isVideo ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-xs text-accent underline"
        >
          {value}
        </a>
      ) : null}
    </div>
  );
}
