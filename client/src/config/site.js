export const siteConfig = {
  name: "Tiffino",
  tagline: "Fresh, homemade & restaurant tiffins delivered to your door",
  description: "Order delicious food from the finest local kitchens and restaurants with fast live delivery tracking.",
  nav: {
    customer: [
      { label: "Home", href: "/" },
      { label: "Restaurants", href: "/restaurants" },
      { label: "My Orders", href: "/orders" },
    ],
    owner: [
      { label: "Dashboard", href: "/owner" },
      { label: "Restaurant Profile", href: "/owner/restaurant" },
      { label: "Menu Manager", href: "/owner/menu" },
      { label: "Live Orders", href: "/owner/orders" },
    ],
    admin: [
      { label: "Dashboard", href: "/admin" },
      { label: "Owner Requests", href: "/admin/owner-requests" },
      { label: "Users Directory", href: "/admin/users" },
      { label: "Restaurants", href: "/admin/restaurants" },
    ],
  },
};
