// Route constants and configurations
// This file centralizes all route definitions for easier maintenance

export const PUBLIC_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  LISTING_DETAIL: "/listings/:id",
  NOT_FOUND: "*",
};

export const PROTECTED_ROUTES = {
  PROFILE: "/profile",
  ADD_LISTING: "/add-listing",
  EDIT_LISTING: "/edit-listing/:id",
  DASHBOARD: "/dashboard",
};

export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
};

// Helper function to generate route paths
export const getRoute = (routeName, params = {}) => {
  let route = ALL_ROUTES[routeName];
  if (!route) return "/";

  // Replace dynamic parameters
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, value);
  });

  return route;
};
