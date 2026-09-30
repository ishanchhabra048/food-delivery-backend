import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { ImageUploader } from "../ui/ImageUploader";

const foodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  description: z.string().max(500).optional(),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(2, "Category is required").trim(),
  isAvailable: z.boolean().default(true),
});

export const MenuItemForm = ({
  initialData,
  onSubmit,
  onCancel,
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
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      category: initialData?.category || "Mains",
      isAvailable:
        initialData?.isAvailable !== undefined ? initialData.isAvailable : true,
    },
  });

  const isAvailable = watch("isAvailable");

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      image,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Item Image */}
      <div>
        <label className="block text-xs font-semibold text-fg mb-1">
          Dish Photo
        </label>
        <ImageUploader
          value={image}
          onChange={setImage}
          type="food"
          aspect="aspect-square"
          className="max-w-[160px] mx-auto sm:mx-0"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-fg mb-1">
            Dish Name *
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. Truffle Tagliatelle"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-fg mb-1">
            Price (₹ INR) *
          </label>
          <Input
            type="number"
            {...register("price")}
            placeholder="349"
            error={errors.price?.message}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-fg mb-1">
          Category *
        </label>
        <select
          {...register("category")}
          className="w-full bg-surface text-fg border border-border rounded-md px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="Starters">Starters</option>
          <option value="Mains">Mains</option>
          <option value="Desserts">Desserts</option>
          <option value="Drinks">Drinks</option>
          <option value="Sides">Sides</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-danger">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-fg mb-1">
          Ingredients & Description
        </label>
        <Textarea
          {...register("description")}
          rows={2}
          placeholder="Fresh egg pasta, summer black truffle, aged parmesan..."
          error={errors.description?.message}
        />
      </div>

      {/* In-Stock / Out of Stock Toggle */}
      <div className="flex items-center justify-between p-3 bg-surface-muted rounded-lg border border-border">
        <div>
          <span className="text-xs font-bold text-fg">In Stock & Available</span>
          <p className="text-[11px] text-fg-3">Mark sold out if ingredients are depleted</p>
        </div>
        <button
          type="button"
          onClick={() => setValue("isAvailable", !isAvailable)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isAvailable ? "bg-secondary" : "bg-gray-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isAvailable ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" loading={loading}>
          {initialData ? "Save Changes" : "Add Menu Item"}
        </Button>
      </div>
    </form>
  );
};
