import { Router } from "express";
import i from "@src/index";

export const r = Router();

// Admin Auth
r.post("/auth/login", i.authEmployees);
r.get("/auth/logout", i.logoutEmployees);
r.get("/auth/check", i.checkAuth, i.authEmployeesCheck);
r.get("/auth/refresh", i.verifyRefreshToken, i.authEmployeesRefresh);

// Admin Users CRUD
r.get("/api/users", i.checkAuth, i.getUsers);
r.post("/api/users", i.checkAuth, i.createUser);
r.get("/api/users/:id", i.checkAuth, i.getUserById);
r.patch("/api/users/:id/status", i.checkAuth, i.updateUserStatus);
r.patch("/api/users/:id/remark", i.checkAuth, i.updateUserRemark);
r.get("/api/users/:id/social", i.checkAuth, i.getUserSocialAccounts);
r.get("/api/users/:id/custom", i.checkAuth, i.getCustomPackageByUserId);
r.delete("/api/users/:id/custom", i.checkAuth, i.deleteCustomPackageByUserId);
// router.get("/api/users/:id/services", i.checkAuth, i.getUserPurchasedServices);

// Admin Overview
r.get("/api/info/balance/vr", i.checkAuth, i.getBalanceVenro);
r.get("/api/info/balance/jp", i.checkAuth, i.getBalanceJustPanel);
r.get("/api/info/users/count", i.checkAuth, i.getUsersCount);

// Admin Package and Custom Package
r.get("/api/package", i.checkAuth, i.getPackages);
r.get("/api/package/details", i.checkAuth, i.getPackageDetailsWithPrice);
r.get("/api/package/custom", i.checkAuth, i.getCustomPackageList);
r.get("/api/package/custom/:id", i.checkAuth, i.getCustomPackageById);
r.post("/api/package/custom", i.checkAuth, i.createCustomPackage);
r.post("/api/package/add-user", i.addCustomPackToUser);

// Admin Purchase
r.get("/api/services", i.checkAuth, i.getUsersPurchasedServices);

// User Auth
r.post("/login", i.authUser);
r.get("/logout", i.logoutUser);
r.get("/check", i.checkAuthUser, i.takeCredentialUser);

// User Social account
r.get("/social/:id", i.checkAuthUser, i.getSocialList);
r.post("/social", i.checkAuthUser, i.addInstAccount);
r.delete("/social", i.checkAuthUser, i.deleteInstAccount);

// User Package and Services
r.get("/package", i.checkAuthUser, i.getPackagesUser);
r.get("/services/:id", i.checkAuthUser, i.getActiveServiceUser);

// Payments
r.post("/payment/yookassa/webhook", i.paymenStatusCatch);
r.post("/payment/yookassa/package", i.paymentPackage);
