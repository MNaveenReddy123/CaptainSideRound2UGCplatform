"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { VideoCard } from "@/components/video-card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  file_url: string;
  user_id: string;
  created_at: string;
}

export default function MyVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const fetchMyVideos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your videos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    fetchMyVideos();
  };

  return (
    <div className="container py-8 px-4 mx-auto max-w-7xl">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">My Videos</h1>
        <p className="text-muted-foreground">
          Manage your uploaded content
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              showActions
              onDelete={handleDelete}
            />
          ))}
          {videos.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">You haven't uploaded any videos yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}