// Admin authentication utilities

export const checkAdminSession = () => {
  const adminToken = localStorage.getItem("adminToken");
  const adminEmail = localStorage.getItem("adminEmail");
  const userRole = localStorage.getItem("userRole");

  return adminToken && adminEmail && userRole === "admin";
};

export const getAdminSession = () => {
  return {
    adminToken: localStorage.getItem("adminToken"),
    adminEmail: localStorage.getItem("adminEmail"),
    userRole: localStorage.getItem("userRole"),
  };
};

export const setAdminSession = (email, token) => {
  localStorage.setItem("adminToken", token);
  localStorage.setItem("adminEmail", email);
  localStorage.setItem("userRole", "admin");
};

export const clearAdminSession = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("userRole");
};
