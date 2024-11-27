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
  getUserSocialAccounts,
  getCustomPackageByUserId,
  deleteCustomPackageByUserId,
} from "@controllers/Admin/UsersCRUD";

import {
  getBalanceJustPanel,
  getBalanceVenro,
  getUsersCount,
} from "@controllers/Admin/Overview";

import {
  createCustomPackage,
  getCustomPackageById,
  getCustomPackageList,
  addCustomPackToUser,
} from "@controllers/Admin/CustomPackage";
import {
  getPackageDetailsWithPrice,
  getPackages,
} from "@controllers/Admin/Package";

import {
  getServiceList,
  getServiceById,
  updateSeviceStatus,
  getPurchasedServiceById,
} from "@controllers/Admin/Services";
import { checkStatusAllSubs } from "@controllers/Purchase/Entity/CheckStatusSubs";
import { cancelAllSubs } from "@controllers/Purchase/Entity/CancelSubs";

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
  getPackagesUser,
  getCustomPackByUserId,
} from "@controllers/User/Package";
import { getActiveServiceUser } from "@controllers/User/Services";

import { paymenStatusCatch } from "@controllers/Payments/YooKassa/_webhook";
import { paymentPackage } from "@controllers/Payments/YooKassa/Package";

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
  getUserSocialAccounts,
  getCustomPackageByUserId,
  deleteCustomPackageByUserId,

  // Admin Overview
  getBalanceJustPanel,
  getBalanceVenro,
  getUsersCount,

  // Admin Package and Custom Package
  getPackages,
  getPackageDetailsWithPrice,
  createCustomPackage,
  getCustomPackageById,
  getCustomPackageList,
  addCustomPackToUser,

  // Admin Services and Purchases
  getServiceList,
  getServiceById,
  updateSeviceStatus,
  getPurchasedServiceById,
  checkStatusAllSubs,
  cancelAllSubs,

  // User Auth
  authUser,
  logoutUser,
  checkAuthUser,
  takeCredentialUser,

  // User Social account
  getSocialList,
  addInstAccount,
  deleteInstAccount,

  // User Package and Services
  getPackagesUser,
  getCustomPackByUserId,
  getActiveServiceUser,

  // Payments
  paymenStatusCatch,
  paymentPackage,
};
