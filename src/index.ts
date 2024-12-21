import {
  checkAuth,
  verifyRefreshToken,
} from "@controllers/Admin/Auth/CheckAuth";
import {
  authEmployees,
  logoutEmployees,
  authEmployeesCheck,
  authEmployeesRefresh,
} from "@controllers/Admin/Auth/AdminAuth";

import {
  createUser,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRemark,
  getServicesByUserId,
  getUserSocialAccounts,
  getCustomPackageByUserId,
  deleteCustomPackageByUserId,
} from "@controllers/Admin/UsersCRUD";

import {
  getTotalSpent,
  getUsersCount,
  getBalanceWiq,
  getBalanceVenro,
  getBalanceJustPanel,
  getPurchasedPackagesCount,
} from "@controllers/Admin/Overview";

import {
  createCustomPackage,
  getCustomPackageDetailsById,
  getCustomPackageDetails,
  addCustomPackToUser,
} from "@controllers/Admin/CustomPackage";
import {
  getPackageSettingsWithPrice,
  getPackageDetails,
} from "@src/controllers/Admin/PackageDetails";
import { sendTestServices } from "@src/controllers/Admin/TestServices";

import {
  getServiceList,
  getServiceById,
  updateServiceStatus,
  getPurchasedServiceById,
} from "@controllers/Admin/Services";
import {
  checkStatusAllSubs,
  checkStatusForExtra,
} from "@controllers/Purchase/Entity/CheckStatusSubs";
import { cancelAllSubs } from "@controllers/Purchase/Entity/CancelSubs";
import { getExtraList, getExtraById } from "@controllers/Admin/Extra";

import {
  authUser,
  logoutUser,
  checkAuthUser,
  takeCredentialUser,
} from "@controllers/User/Auth/UserAuth";

import {
  addInstAccount,
  deleteInstAccount,
  getSocialList,
} from "@controllers/User/SocialAccount";

import {
  getPackageDetailsUser,
  getCustomPackByUserId,
} from "@controllers/User/Package";
import {
  getActiveServiceUser,
  checkStatusServices,
} from "@controllers/User/Services";
import {
  saveCommentsBeforePayment,
  getPurchasedExtraByUserId,
} from "@controllers/User/Extra";
import { sendExtraComments } from "@controllers/Purchase/PurchaseExtraComments";

import { paymenStatusCatch } from "@controllers/Payments/YooKassa/_webhook";
import { paymentPackage } from "@controllers/Payments/YooKassa/Package";
import { paymentExtra } from "@controllers/Payments/YooKassa/Extra";

export default {
  // Admin Auth
  checkAuth,
  verifyRefreshToken,
  authEmployees,
  logoutEmployees,
  authEmployeesCheck,
  authEmployeesRefresh,

  // Admin Users CRUD
  createUser,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRemark,
  getServicesByUserId,
  getUserSocialAccounts,
  getCustomPackageByUserId,
  deleteCustomPackageByUserId,

  // Admin Overview
  getTotalSpent,
  getUsersCount,
  getBalanceWiq,
  getBalanceVenro,
  getBalanceJustPanel,
  getPurchasedPackagesCount,

  // Admin Details, Settings of Package, Custom Package, Test
  getPackageDetails,
  getPackageSettingsWithPrice,
  createCustomPackage,
  getCustomPackageDetailsById,
  getCustomPackageDetails,
  addCustomPackToUser,
  sendTestServices,

  // Admin Services, Extra, Purchases
  getServiceList,
  getServiceById,
  updateServiceStatus,
  getPurchasedServiceById,
  checkStatusAllSubs,
  cancelAllSubs,

  getExtraList,
  getExtraById,
  checkStatusForExtra,

  // User Auth
  authUser,
  logoutUser,
  checkAuthUser,
  takeCredentialUser,

  // User Social account
  getSocialList,
  addInstAccount,
  deleteInstAccount,

  // User Package, Services, Extra
  getPackageDetailsUser,
  getCustomPackByUserId,
  getActiveServiceUser,
  checkStatusServices,
  saveCommentsBeforePayment,
  sendExtraComments,
  getPurchasedExtraByUserId,

  // Payments
  paymenStatusCatch,
  paymentPackage,
  paymentExtra,
};
