import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "sonner";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").trim(),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const Register = () => {
  const { register: registerAuth, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerAuth({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        role: "User", // Defaults strictly to User per LLD
      });

      // Auto-login after registration
      await login(data.email, data.password);
      toast.success("Account created successfully! Welcome to Tiffino.");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <span className="text-3xl">🍽️</span>
            <span className="font-display font-bold text-2xl text-fg">
              Tiff<span className="text-primary">ino</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-display text-fg">Create Account</h2>
          <p className="text-xs text-fg-2">
            Join Tiffino to order fresh meals and track live delivery.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">
              Full Name
            </label>
            <Input
              icon={User}
              placeholder="Jane Doe"
              {...register("fullName")}
              error={errors.fullName?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1">
              Email Address
            </label>
            <Input
              icon={Mail}
              type="email"
              placeholder="jane@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1">
              Phone Number
            </label>
            <Input
              icon={Phone}
              placeholder="9876543210"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1">
              Password
            </label>
            <Input
              icon={Lock}
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1">
              Confirm Password
            </label>
            <Input
              icon={Lock}
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md"
            loading={isSubmitting}
          >
            Create Customer Account
          </Button>
        </form>

        <p className="text-center text-xs text-fg-2">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
