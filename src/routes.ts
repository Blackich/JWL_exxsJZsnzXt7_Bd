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
r.get("/api/users/:id/services", i.checkAuth, i.getServicesByUserId);

// Admin Overview
r.get("/api/info/balance/vr", i.checkAuth, i.getBalanceVenro);
r.get("/api/info/balance/jp", i.checkAuth, i.getBalanceJustPanel);
r.get("/api/info/balance/wq", i.checkAuth, i.getBalanceWiq);
r.get("/api/info/users/count", i.checkAuth, i.getUsersCount);
r.get("/api/info/service/spent", i.checkAuth, i.getTotalSpent);
r.get("/api/info/service/count", i.checkAuth, i.getPurchasedPackagesCount);

// Admin Package and Custom Package
r.get("/api/package", i.checkAuth, i.getPackages);
r.get("/api/package/settings", i.checkAuth, i.getPackageSettingsWithPrice);
r.get("/api/package/custom", i.checkAuth, i.getCustomPackageList);
r.get("/api/package/custom/:id", i.checkAuth, i.getCustomPackageById);
r.post("/api/package/custom", i.checkAuth, i.createCustomPackage);
r.post("/api/package/add-user", i.addCustomPackToUser);
r.post("/api/package/test", i.sendTestPackage);

// Admin Services, Extra, Purchases
r.get("/api/services", i.checkAuth, i.getServiceList);
r.get("/api/services/:id", i.checkAuth, i.getServiceById);
r.patch("/api/services/:id/status", i.checkAuth, i.updateServiceStatus);
r.get("/api/services/:id/purchase", i.checkAuth, i.getPurchasedServiceById);
r.get("/api/services/:id/check", i.checkAuth, i.checkStatusAllSubs);
r.get("/api/services/:id/cancel", i.checkAuth, i.cancelAllSubs);

r.get("/api/extra", i.checkAuth, i.getExtraList);
r.get("/api/extra/:id", i.checkAuth, i.getExtraById);
r.get("/api/extra/:id/check", i.checkAuth, i.checkStatusForExtra);
r.post("/api/extra/:id/send-comment", i.checkAuth, i.sendExtraComments);

// User Auth
r.post("/login", i.authUser);
r.get("/logout", i.logoutUser);
r.get("/check", i.checkAuthUser, i.takeCredentialUser);

// User Social account
r.get("/social/:id", i.checkAuthUser, i.getSocialList);
r.post("/social", i.checkAuthUser, i.addInstAccount);
r.delete("/social", i.checkAuthUser, i.deleteInstAccount);

// User Package, Services, Extra
r.get("/package", i.checkAuthUser, i.getPackagesUser);
r.get("/custom/:id", i.checkAuthUser, i.getCustomPackByUserId);
r.get("/services/check-status", i.checkAuthUser, i.checkStatusServices);
r.get("/services/:id", i.checkAuthUser, i.getActiveServiceUser);
r.post("/extra/comment", i.checkAuthUser, i.saveCommentsBeforePayment);
r.get("/extra/:id", i.checkAuthUser, i.getPurchasedExtraByUserId);

// Payments
r.post("/payment/yookassa/webhook", i.paymenStatusCatch);
r.post("/payment/yookassa/package", i.paymentPackage);
r.post("/payment/yookassa/extra", i.paymentExtra);
