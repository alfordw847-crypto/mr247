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
import { Package } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface EditPackageDialogProps {
  pkg: Package;
}

export default function EditPackageDialog({ pkg }: EditPackageDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PackageFormData>({
    resolver: zodResolver(PackageSchema),
    defaultValues: {
      name: pkg?.name || "",
      description: pkg?.description || "",
      image: pkg?.image || "",
      price: pkg?.price,
      adLimit: pkg?.adLimit,
      rewardPerAd: pkg?.rewardPerAd,
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: PackageFormData) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/packages/${pkg.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          router.refresh();
          toast.success("Package updated successfully!");
        } else {
          const err = await res.json();
          toast.error(err?.message || "Failed to update package");
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
        <Button variant="outline" className="text-blue-600 border-blue-600">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
          <DialogDescription>
            Update package details like name, description, price, image, and
            add-ons.
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
              placeholder="Package price"
              control={control}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Per Day show Ad"
              name="adLimit"
              type="number"
              placeholder="Per Day show Ad"
              control={control}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Reward per Ad"
              name="rewardPerAd"
              type="number"
              placeholder="Reward per ad"
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
                {isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
