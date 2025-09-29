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
import { zodResolver } from "@hookform/resolvers/zod";
import { Banner } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";

// ✅ Validation schema
const bannerSchema = z.object({
  name: z.string().min(2, "Banner name is required"),
  url: z.string().url("Please enter a valid URL"),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface EditBannerDialogProps {
  banner: Banner | null;
  onUpdate?: (updatedBanner: Banner) => void;
}

export default function EditBannerDialog({
  banner,
  onUpdate,
}: EditBannerDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  // ✅ populate form when banner changes
  useEffect(() => {
    if (banner) {
      form.reset({
        name: banner.name || "",
        url: banner.url || "",
      });
    }
  }, [banner, form]);

  const handleUpdate = async (values: BannerFormValues) => {
    if (!banner) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const updated = await res.json();
      if (res.ok) {
        onUpdate?.(updated.data);
        setOpen(false);
        window.location.reload();
      } else {
        console.error("Update failed", updated.error);
      }
    } catch (err) {
      console.error("Update failed", err);
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Banner Name"
              name="name"
              placeholder="Enter banner name"
              control={form.control}
            />

            <CustomFormField
              fieldType={FormFieldType.FILE_UPLOAD}
              label="Banner URL"
              name="url"
              file
              placeholder="Enter banner URL"
              control={form.control}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
