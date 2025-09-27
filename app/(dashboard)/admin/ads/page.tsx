"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

type Ad = {
  id: string;
  name: string | null;
  url: string;
  createdAt: string;
};

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Ad | null>(null);
  const [form, setForm] = useState({ name: "", url: "" });
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  // Load ads
  useEffect(() => {
    fetch("/api/adds")
      .then((res) => res.json())
      .then((data) => {
        setAds(data.data || []);
        setLoading(false);
      });
  }, []);

  // Handle Add/Edit
  const handleSave = async () => {
    startTransition(async () => {
      try {
        const method = selected ? "PUT" : "POST";
        const url = selected ? `/api/adds/${selected.id}` : "/api/adds";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (data.success) {
          toast.success(selected ? "Ad updated" : "Ad created");
          setForm({ name: "", url: "" });
          setSelected(null);
          setOpen(false);
          const refreshed = await fetch("/api/adds").then((r) => r.json());
          setAds(refreshed.data);
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      const res = await fetch(`/api/adds/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAds(ads.filter((a) => a.id !== id));
        toast.success("Ad deleted");
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Ads Management</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setForm({ name: "", url: "" });
            setOpen(true);
          }}
        >
          + Add Ad
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Ad" : "Add Ad"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Ad Name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Ad URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : ads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No ads found.
              </TableCell>
            </TableRow>
          ) : (
            ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>{ad.name || "-"}</TableCell>
                <TableCell>
                  <a
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {ad.url}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelected(ad);
                        setForm({
                          name: ad.name || "",
                          url: ad.url,
                        });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="destructive"
                      onClick={() => handleDelete(ad.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
