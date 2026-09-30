import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password);
      toast.success("Welcome back!");

      // Role-aware redirect
      if (res?.user?.role === "admin") {
        navigate("/admin");
      } else if (res?.user?.role === "restaurantOwner") {
        navigate("/owner");
      } else {
        navigate(from === "/login" ? "/" : from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    }
  };

  const fillDemo = (email, roleLabel) => {
    setValue("email", email);
    setValue("password", "Password123!");
    toast.info(`Filled credentials for ${roleLabel}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <span className="text-3xl">🍽️</span>
            <span className="font-display font-bold text-2xl text-fg">
              Any<span className="text-primary">Feast</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-display text-fg">Welcome Back</h2>
          <p className="text-xs text-fg-2">
            Sign in to manage your feasts, track orders, and order delicious food.
          </p>
        </div>

        {/* Demo Login Quick Chips */}
        <div className="p-3 bg-surface-muted rounded-xl border border-border/80 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-fg-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Quick Demo Login:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo("customer@anyfeast.com", "Customer")}
              className="text-[11px] px-2.5 py-1 rounded-md bg-surface text-fg font-medium border border-border hover:border-primary/40 hover:text-primary transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemo("owner@anyfeast.com", "Restaurant Owner")}
              className="text-[11px] px-2.5 py-1 rounded-md bg-surface text-fg font-medium border border-border hover:border-primary/40 hover:text-primary transition-colors"
            >
              Restaurant Owner
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin@anyfeast.com", "Admin")}
              className="text-[11px] px-2.5 py-1 rounded-md bg-surface text-fg font-medium border border-border hover:border-accent/40 hover:text-accent transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1">
              Email Address
            </label>
            <Input
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-md"
            loading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-fg-2">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
