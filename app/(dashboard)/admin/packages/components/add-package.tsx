"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { PackageFormData, PackageSchema } from "@/zod-validation/package-zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CreatePackageDialog() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<PackageFormData>({
    resolver: zodResolver(PackageSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: undefined,
      adLimit: undefined,
      rewardPerAd: undefined,
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = (data: PackageFormData) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/packages", {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Create Package
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Package</DialogTitle>
          <DialogDescription>
            Add a new package with name, description, price, and optional image.
          </DialogDescription>
        </DialogHeader>

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
              fieldType={FormFieldType.TEXTAREA}
              label="Description"
              name="description"
              placeholder="Package description"
              control={control}
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Price"
              name="price"
              type="number"
              placeholder="Package price"
              control={control}
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Reward Per Ad"
              name="rewardPerAd"
              type="number"
              placeholder="Package reward per ad"
              control={control}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Daily ad Limit"
              name="adLimit"
              type="number"
              placeholder="Enter Daily ad limit"
              control={control}
            />
            <CustomFormField
              fieldType={FormFieldType.FILE_UPLOAD}
              label="Image URL"
              name="image"
              placeholder="https://example.com/image.jpg"
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
  );
}
