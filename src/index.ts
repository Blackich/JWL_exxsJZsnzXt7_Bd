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
} from "@controllers/Admin/CustomPackage";
import {
  getPackageDetailsWithPrice,
  getPackages,
} from "@controllers/Admin/Package";

import { getUsersPurchasedServices } from "@controllers/Admin/Services";

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

import { getPackagesUser } from "@controllers/User/Package";
import { getActiveServiceUser } from "@controllers/User/Services";

import { paymenStatusCatch } from "@src/controllers/Payments/YooKassa/_webhook";
import { paymentPackage } from "@src/controllers/Payments/YooKassa/Package";


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

  // Admin Purchase
  getUsersPurchasedServices,

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
  getActiveServiceUser,

  // Payments
  paymenStatusCatch,
  paymentPackage,
};
