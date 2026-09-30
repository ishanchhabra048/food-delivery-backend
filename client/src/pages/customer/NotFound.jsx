import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";

export const NotFound = () => {
  const { user } = useAuth();

  const homePath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "restaurantOwner"
      ? "/owner"
      : "/";

  const homeLabel =
    user?.role === "admin"
      ? "Return to Admin Console"
      : user?.role === "restaurantOwner"
      ? "Return to Owner Dashboard"
      : "Back to Home";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-full bg-surface-muted border border-border flex items-center justify-center text-primary mb-6 shadow-sm">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "12s" }} />
      </div>

      <span className="font-mono font-bold text-4xl text-primary mb-2">404</span>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-fg mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-fg-2 max-w-md mb-8 leading-relaxed">
        The delicious recipe or page you're searching for seems to have vanished from our kitchen menu.
      </p>

      <Button to={homePath} variant="primary" size="lg" iconLeft={ArrowLeft}>
        {homeLabel}
      </Button>
    </div>
  );
};
