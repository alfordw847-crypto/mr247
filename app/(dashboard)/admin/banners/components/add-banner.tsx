"use client";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { BannerSchema } from "@/zod-validation/banner-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export type BannerFormData = z.infer<typeof BannerSchema>;

export default function AddBannerDialog() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<BannerFormData>({
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = (data: BannerFormData) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          toast.success("Package created successfully!");
          router.refresh();
          reset();
        } else {
          const err = await res.json();
          toast.error(err?.message || "Failed to create package");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <span className="bg-primary text-white px-4 py-2 rounded-md">
            {" "}
            Add Banner
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Banner</DialogTitle>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Name"
                name="name"
                placeholder="Package name"
                control={control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Banner Image"
                name="url"
                placeholder="Enter  banner url "
                control={control}
              />
              <DialogFooter className="border-t pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
