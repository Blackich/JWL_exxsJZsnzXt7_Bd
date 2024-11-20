import { Router } from "express";
import i from "@src/index";

export const router = Router();

// Admin Auth
router.post("/auth/login", i.authEmployees);
router.get("/auth/logout", i.logoutEmployees);
router.get("/auth/check", i.checkAuth, i.authEmployeesCheck);
router.get("/auth/refresh", i.verifyRefreshToken, i.authEmployeesRefresh);

// Admin Users CRUD
router.get("/api/users", i.checkAuth, i.getUsers);
router.post("/api/users", i.checkAuth, i.createUser);
router.get("/api/users/:id", i.checkAuth, i.getUserById);
router.patch("/api/users/:id/status", i.checkAuth, i.updateUserStatus);
router.patch("/api/users/:id/remark", i.checkAuth, i.updateUserRemark);
router.get("/api/users/:id/social", i.checkAuth, i.getUserSocialAccounts);
// router.get("/api/users/:id/services", i.checkAuth, i.getUserPurchasedServices);

// Admin Overview
router.get("/api/info/balance/vr", i.checkAuth, i.getBalanceVenro);
router.get("/api/info/balance/jp", i.checkAuth, i.getBalanceJustPanel);
router.get("/api/info/users/count", i.checkAuth, i.getUsersCount);

// Admin Package and Custom Package
router.get("/api/package", i.checkAuth, i.getPackages);
router.get("/api/package/details", i.checkAuth, i.getPackageDetailsWithPrice);
router.get("/api/package/custom", i.checkAuth, i.getCustomPackageList);
router.get("/api/package/custom/:id", i.checkAuth, i.getCustomPackageById);
router.post("/api/package/custom", i.checkAuth, i.createCustomPackage);
router.post("/api/package/add-user", i.addCustomPackToUser);

// Admin Purchase
router.get("/api/services", i.checkAuth, i.getUsersPurchasedServices);

// User Auth
router.post("/login", i.authUser);
router.get("/logout", i.logoutUser);
router.get("/check", i.checkAuthUser, i.takeCredentialUser);

// User Social account
router.get("/social/:id", i.checkAuthUser, i.getSocialList);
router.post("/social", i.checkAuthUser, i.addInstAccount);
router.delete("/social", i.checkAuthUser, i.deleteInstAccount);

// User Package and Services
router.get("/package", i.checkAuthUser, i.getPackagesUser);
router.get("/services/:id", i.checkAuthUser, i.getActiveServiceUser);

// Payments
router.post("/payment/yookassa/webhook", i.paymenStatusCatch);
router.post("/payment/yookassa/package", i.paymentPackage);
