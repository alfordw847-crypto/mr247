"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Banner } from "@prisma/client";
import { useEffect, useState } from "react";

interface EditBannerDialogProps {
  banner: Banner | null;
  onUpdate?: (updatedBanner: Banner) => void; // callback to update parent state
}

export default function EditBannerDialog({
  banner,
  onUpdate,
}: EditBannerDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (banner) {
      setName(banner.name || "");
      setUrl(banner.url || "");
    }
  }, [banner]);

  const handleUpdate = async () => {
    if (!banner) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
      });

      const updated = await res.json();
      if (res.ok) {
        onUpdate?.(updated.data); // Update parent component state
        setOpen(false); // close dialog
      } else {
        console.error("Update failed", updated.error);
        alert(updated.error || "Update failed");
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Banner Name"
            disabled={loading}
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Banner URL"
            disabled={loading}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
