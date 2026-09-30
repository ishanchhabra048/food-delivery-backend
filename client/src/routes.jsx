import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Layouts (eager)
import { CustomerLayout } from "./components/layout/CustomerLayout";
import { OwnerLayout } from "./components/layout/OwnerLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { RoleRoute } from "./components/layout/RoleRoute";

// Eager load Home
import { Home } from "./pages/customer/Home";

// Customer Pages (Lazy loaded per LLD Section 10.1 & 10.3)
const Restaurants = lazy(() =>
  import("./pages/customer/Restaurants").then((m) => ({ default: m.Restaurants }))
);
const RestaurantDetail = lazy(() =>
  import("./pages/customer/RestaurantDetail").then((m) => ({ default: m.RestaurantDetail }))
);
const Cart = lazy(() =>
  import("./pages/customer/Cart").then((m) => ({ default: m.Cart }))
);
const Checkout = lazy(() =>
  import("./pages/customer/Checkout").then((m) => ({ default: m.Checkout }))
);
const Orders = lazy(() =>
  import("./pages/customer/Orders").then((m) => ({ default: m.Orders }))
);
const OrderDetail = lazy(() =>
  import("./pages/customer/OrderDetail").then((m) => ({ default: m.OrderDetail }))
);
const Profile = lazy(() =>
  import("./pages/customer/Profile").then((m) => ({ default: m.Profile }))
);
const Addresses = lazy(() =>
  import("./pages/customer/Addresses").then((m) => ({ default: m.Addresses }))
);
const Login = lazy(() =>
  import("./pages/customer/Login").then((m) => ({ default: m.Login }))
);
const Register = lazy(() =>
  import("./pages/customer/Register").then((m) => ({ default: m.Register }))
);
const NotFound = lazy(() =>
  import("./pages/customer/NotFound").then((m) => ({ default: m.NotFound }))
);

// Owner Pages (Separate lazy owner chunk)
const OwnerDashboard = lazy(() =>
  import("./pages/owner/Dashboard").then((m) => ({ default: m.OwnerDashboard }))
);
const RestaurantProfile = lazy(() =>
  import("./pages/owner/RestaurantProfile").then((m) => ({ default: m.RestaurantProfile }))
);
const Menu = lazy(() =>
  import("./pages/owner/Menu").then((m) => ({ default: m.Menu }))
);
const OwnerOrders = lazy(() =>
  import("./pages/owner/Orders").then((m) => ({ default: m.OwnerOrders }))
);

// Admin Pages (Separate lazy admin chunk)
const AdminDashboard = lazy(() =>
  import("./pages/admin/Dashboard").then((m) => ({ default: m.AdminDashboard }))
);
const OwnerRequests = lazy(() =>
  import("./pages/admin/OwnerRequests").then((m) => ({ default: m.OwnerRequests }))
);
const AdminUsers = lazy(() =>
  import("./pages/admin/Users").then((m) => ({ default: m.AdminUsers }))
);
const AdminRestaurants = lazy(() =>
  import("./pages/admin/Restaurants").then((m) => ({ default: m.AdminRestaurants }))
);

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "restaurants",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Restaurants />
          </Suspense>
        ),
      },
      {
        path: "restaurants/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RestaurantDetail />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Cart />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Checkout />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Orders />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <OrderDetail />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "addresses",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Addresses />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/owner",
    element: (
      <RoleRoute allowedRoles={["restaurantOwner"]}>
        <OwnerLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <OwnerDashboard />
          </Suspense>
        ),
      },
      {
        path: "restaurant",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RestaurantProfile />
          </Suspense>
        ),
      },
      {
        path: "menu",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Menu />
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<PageLoader />}>
            <OwnerOrders />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <RoleRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: "owner-requests",
        element: (
          <Suspense fallback={<PageLoader />}>
            <OwnerRequests />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminUsers />
          </Suspense>
        ),
      },
      {
        path: "restaurants",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminRestaurants />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
