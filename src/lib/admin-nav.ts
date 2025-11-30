export type ManagerRole = "admin" | "superAdmin" | "staff";

export const getDefaultAdminRoute = (role: ManagerRole) =>
  role === "superAdmin" ? "/admin/dashboard" : "/admin/bookings";

export const isSuperAdmin = (role: ManagerRole) => role === "superAdmin";
