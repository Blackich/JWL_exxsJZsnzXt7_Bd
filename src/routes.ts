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
r.get("/api/users/:id/extra", i.checkAuth, i.getExtraByUserId);

// Admin Overview
r.get("/api/info/balance/vr", i.checkAuth, i.getBalanceVenro);
r.get("/api/info/balance/jp", i.checkAuth, i.getBalanceJustPanel);
r.get("/api/info/balance/wq", i.checkAuth, i.getBalanceWiq);
r.get("/api/info/users/count", i.checkAuth, i.getUsersCount);
r.get("/api/info/service/spent", i.checkAuth, i.getTotalSpent);
r.get("/api/info/service/count", i.checkAuth, i.getPurchasedPackagesCount);

// Admin Details of Package, Custom Package, Test
r.get("/api/package/details", i.checkAuth, i.getPackageDetails);
r.get("/api/custom-package/details", i.checkAuth, i.getCustomPackageDetails);
r.post("/api/custom-package", i.checkAuth, i.createCustomPackage);
r.post("/api/custom-package/add-user", i.addCustomPackToUser);
r.get("/api/custom-package/:id", i.checkAuth, i.getCustomPackageDetailsById);
r.get("/api/test", i.checkAuth, i.getTestServicesSent);
r.post("/api/test", i.checkAuth, i.sendTestServices);

//Admin Settings for Package, Extra, Test
r.get("/api/settings/package", i.checkAuth, i.getPackageSettings);
r.get("/api/settings/extra", i.checkAuth, i.getExtraServiceSettings);
r.get("/api/settings/test", i.checkAuth, i.getTestServiceSettings);
r.get("/api/settings/exchange-rate", i.checkAuth, i.getExternalExchangeRate);

// Admin Services, Extra, Purchases
r.get("/api/services", i.checkAuth, i.getServiceList);
r.get("/api/services/:id", i.checkAuth, i.getServiceById);
r.patch("/api/services/:id/status", i.checkAuth, i.updateServiceStatus);
r.get("/api/services/:id/purchase", i.checkAuth, i.getPurchasedServiceById);
r.get("/api/services/:id/check", i.checkAuth, i.checkStatusAllSubs);
r.get("/api/services/:id/cancel", i.checkAuth, i.cancelAllSubs);

r.get("/api/extra", i.checkAuth, i.getExtraList);
r.get("/api/extra-details", i.checkAuth, i.getExtraDetails);
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
r.get("/package/details", i.checkAuthUser, i.getPackageDetailsUser);
r.get("/custom-package/details/:id", i.checkAuthUser, i.getCustomPackByUserId);
r.get("/services/:id", i.checkAuthUser, i.getActiveServiceUser);
r.post("/extra/comment", i.checkAuthUser, i.saveCommentsBeforePayment);
r.get("/extra-details", i.checkAuthUser, i.getExtraDetailsUser);
r.get("/extra/:id", i.checkAuthUser, i.getPurchasedExtraByUserId);

//User Checks
r.get("/check/external-status", i.checkAuthUser, i.checkStatusExternalServices);
r.post("/check/remaining-posts", i.checkAuthUser, i.checkPostsRemaining);

// Payments
r.post("/payment/yookassa/webhook", i.paymenStatusCatch);
r.post("/payment/yookassa/package", i.paymentPackage);
r.post("/payment/yookassa/extra", i.paymentExtra);
