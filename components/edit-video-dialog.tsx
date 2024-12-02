"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface EditVideoDialogProps {
  video: {
    id: string;
    title: string;
    description: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function EditVideoDialog({
  video,
  open,
  onOpenChange,
  onUpdate,
}: EditVideoDialogProps) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("content")
        .update({ title, description })
        .eq("id", video.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video updated successfully!",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update video.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updating}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={updating}>
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}