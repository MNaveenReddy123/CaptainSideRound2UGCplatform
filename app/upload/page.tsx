"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "File size should be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload video file
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from("videos")
        .upload(fileName, file);

      if (fileError) throw fileError;

      // Get file URL
      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Save video metadata
      const { error: dbError } = await supabase.from("content").insert([
        {
          title,
          description,
          file_url: urlData.publicUrl,
          user_id: user?.id,
        },
      ]);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });

      router.push("/my-videos");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container max-w-2xl py-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Upload Video</h1>
          <p className="text-muted-foreground">
            Share your amazing content with the world
          </p>
        </div>

        <form onSubmit={handleUpload} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="video" className="text-sm font-medium">
              Video File
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="video"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and
                    drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, WebM or OGG (MAX. 10MB)
                  </p>
                </div>
                <Input
                  id="video"
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </label>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected file: {file.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
