import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { router } from "./routes";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              duration: 3500,
              className: "font-sans text-xs",
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
