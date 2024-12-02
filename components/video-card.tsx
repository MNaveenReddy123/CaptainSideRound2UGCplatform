"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { EditVideoDialog } from "@/components/edit-video-dialog";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    file_url: string;
    user_id: string;
  };
  onDelete?: () => void;
  showActions?: boolean;
}

export function VideoCard({ video, onDelete, showActions = false }: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("content")
        .delete()
        .match({ id: video.id });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully!",
      });

      onDelete?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete video.",
        variant: "destructive",
      });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-video relative cursor-pointer" onClick={() => setIsOpen(true)}>
          <video
            src={video.file_url}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-16 h-16 text-white" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{video.title}</h3>
          <p className="text-muted-foreground line-clamp-2 mt-1">
            {video.description}
          </p>
          {showActions && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{video.title}</DialogTitle>
            <DialogDescription>{video.description}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video mt-4">
            <video
              ref={videoRef}
              src={video.file_url}
              className="w-full h-full"
              controls
              autoPlay
            />
          </div>
        </DialogContent>
      </Dialog>

      <EditVideoDialog
        video={video}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={onDelete!}
      />
    </>
  );
}
