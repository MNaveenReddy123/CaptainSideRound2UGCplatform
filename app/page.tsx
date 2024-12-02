"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoCard } from "@/components/video-card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { VideoIcon, Search } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  file_url: string;
  user_id: string;
  created_at: string;
}

export default function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userChoice = sessionStorage.getItem("userChoice");
    if (userChoice === "continue" || userChoice === "signedIn") {
      setShowWelcome(false);
      fetchVideos();
    }
  }, []);

  // Trigger fetchVideos when searchQuery changes
  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      let query;

      // Fetch all videos when searchQuery is empty
      if (searchQuery.trim()) {
        query = supabase
          .from("content")
          .select("*")
          .ilike("title", `%${searchQuery}%`)
          .order("created_at", { ascending: false });
      } else {
        query = supabase
          .from("content")
          .select("*")
          .order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setVideos(data || []); // Update state with fetched videos
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch videos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    sessionStorage.setItem("userChoice", "continue");
    setShowWelcome(false);
    fetchVideos();
  };

  const handleSignIn = () => {
    setIsRedirecting(true);
    sessionStorage.setItem("userChoice", "signedIn");
    setTimeout(() => {
      window.location.href = "/auth";
    }, 500);
  };

  return (
    <>
      {showWelcome ? (
        isRedirecting ? (
          // Spinner for redirecting
          <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted">
            <div className="spinner border-4 border-t-4 border-primary rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-8 text-center">
            <VideoIcon className="h-16 w-16 mb-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Share Your Videos with the World
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-[600px]">
              Upload, manage, and share your videos with our easy-to-use platform.
              Join our community today!
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" className="font-semibold" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold"
                onClick={handleContinue}
              >
                Continue Without Signing In
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="container py-8 px-4 mx-auto max-w-7xl">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Discover Videos</h1>
            <p className="text-muted-foreground">
              Explore amazing content created by our community
            </p>
          </div>

          <div className="mt-8 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center mt-8">
              <div className="spinner border-4 border-t-4 border-primary rounded-full w-16 h-16 animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
              {videos.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No videos found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
