import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const addressSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").trim(),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  addressLine: z.string().min(5, "Address must be at least 5 characters").trim(),
  city: z.string().min(2, "City is required").trim(),
  state: z.string().min(2, "State is required").trim(),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
});

export const AddressForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      fullName: "",
      phoneNumber: "",
      addressLine: "",
      city: "Metropolis",
      state: "State",
      pincode: "110001",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-fg mb-1">
            Recipient Full Name
          </label>
          <Input
            {...register("fullName")}
            placeholder="Jane Doe"
            error={errors.fullName?.message}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-fg mb-1">
            Contact Phone Number
          </label>
          <Input
            {...register("phoneNumber")}
            placeholder="9876543210"
            error={errors.phoneNumber?.message}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-fg mb-1">
          Street Address / Apartment
        </label>
        <Input
          {...register("addressLine")}
          placeholder="Flat 4B, Sunflower Apts, Main Road"
          error={errors.addressLine?.message}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-fg mb-1">City</label>
          <Input {...register("city")} placeholder="City" error={errors.city?.message} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-fg mb-1">State</label>
          <Input {...register("state")} placeholder="State" error={errors.state?.message} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-fg mb-1">Pincode</label>
          <Input {...register("pincode")} placeholder="110001" error={errors.pincode?.message} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        {onCancel && (
          <Button type="button" variant="outline" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" loading={loading}>
          {initialData ? "Update Address" : "Save Address"}
        </Button>
      </div>
    </form>
  );
};
