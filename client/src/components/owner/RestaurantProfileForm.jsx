import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { ImageUploader } from "../ui/ImageUploader";

const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  description: z.string().max(500).optional(),
  cuisine: z.string().min(2, "Cuisine category is required").trim(),
  address: z.string().min(5, "Address must be at least 5 characters").trim(),
  isOpen: z.boolean().default(true),
});

export const RestaurantProfileForm = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const [image, setImage] = useState(
    initialData?.image || { url: "", publicId: "" }
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      cuisine: initialData?.cuisine || "Italian",
      address: initialData?.address || "",
      isOpen: initialData?.isOpen !== undefined ? initialData.isOpen : true,
    },
  });

  const isOpen = watch("isOpen");

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      image,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Cover Image Upload */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-fg mb-2">
          Restaurant Cover Image
        </label>
        <ImageUploader
          value={image}
          onChange={setImage}
          type="restaurant"
          aspect="aspect-[16/7]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-fg mb-1">
            Restaurant Name *
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. Trattoria Bella"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-fg mb-1">
            Primary Cuisine *
          </label>
          <Input
            {...register("cuisine")}
            placeholder="e.g. Italian, Indian, Japanese, Burgers"
            error={errors.cuisine?.message}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-fg mb-1">
          Store Address *
        </label>
        <Input
          {...register("address")}
          placeholder="123 Gourmet Ave, Metropolis"
          error={errors.address?.message}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-fg mb-1">
          Description & Story
        </label>
        <Textarea
          {...register("description")}
          rows={3}
          placeholder="Tell customers what makes your kitchen special..."
          error={errors.description?.message}
        />
      </div>

      {/* Open/Closed Toggle */}
      <div className="flex items-center justify-between p-4 bg-surface-muted rounded-lg border border-border">
        <div>
          <h4 className="text-sm font-bold text-fg">Accepting Orders Now</h4>
          <p className="text-xs text-fg-2 mt-0.5">
            Toggle off when kitchen is closed or at peak capacity
          </p>
        </div>
        <button
          type="button"
          onClick={() => setValue("isOpen", !isOpen)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isOpen ? "bg-secondary" : "bg-gray-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isOpen ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          {initialData ? "Save Changes" : "Create Restaurant Profile"}
        </Button>
      </div>
    </form>
  );
};
