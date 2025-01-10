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
  getUsers,
  createUser,
  getUserById,
  updateUserStatus,
  getExtraByUserId,
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
import { getPackageDetails } from "@src/controllers/Admin/PackageDetails";
import {
  sendTestServices,
  getTestServicesSent,
} from "@src/controllers/Admin/TestServices";

import {
  getExtraServiceSettings,
  getPackageSettings,
  getTestServiceSettings,
  getExternalExchangeRate,
} from "@controllers/Admin/Settings";

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
import {
  getExtraList,
  getExtraById,
  getExtraDetails,
} from "@controllers/Admin/Extra";

import { loginUser } from "@src/controllers/User/Auth/UserLogin";
import { checkAuthUser } from "@src/controllers/User/Auth/UserAuthCheck";
import { takeUserCredentials } from "@src/controllers/User/Auth/UserAuthCheck";
import { registerUser } from "@src/controllers/User/Auth/UserRegister";
import { logoutUser } from "@src/controllers/User/Auth/UserLogout";

import {
  addInstAccount,
  deleteInstAccount,
  getSocialList,
} from "@controllers/User/SocialAccount";

import {
  getPackageDetailsUser,
  getCustomPackByUserId,
} from "@controllers/User/Package";
import { getActiveServiceUser } from "@controllers/User/Services";
import {
  saveCommentsBeforePayment,
  getPurchasedExtraByUserId,
  getExtraDetailsUser,
} from "@controllers/User/Extra";
import { sendExtraComments } from "@controllers/Purchase/PurchaseExtraComments";

import {
  checkPostsRemaining,
  checkStatusExternalServices,
  checkPackPurchaseOption,
  checkExtraPurchaseOption,
} from "@src/controllers/User/Checks";

import { paymenStatusCatch } from "@controllers/Payments/YooKassa/_webhook";
import { paymentPackage } from "@controllers/Payments/YooKassa/Package";
import { paymentExtra } from "@controllers/Payments/YooKassa/Extra";

import {
  getExtraServicesStatus,
  getGeneralSettings,
  changeStatusGenSettingById,
  changeStatusExtraServiceById,
} from "@controllers/Admin/GeneralSettings";

export default {
  // Admin Auth
  checkAuth,
  verifyRefreshToken,
  authEmployees,
  logoutEmployees,
  authEmployeesCheck,
  authEmployeesRefresh,

  // Admin Users CRUD
  getUsers,
  createUser,
  getUserById,
  getExtraByUserId,
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

  // Admin Details of Package, Custom Package, Test
  getPackageDetails,
  createCustomPackage,
  getCustomPackageDetailsById,
  getCustomPackageDetails,
  addCustomPackToUser,
  getTestServicesSent,
  sendTestServices,

  //Admin Settings for Package, Extra, Test
  getPackageSettings,
  getExtraServiceSettings,
  getTestServiceSettings,
  getExternalExchangeRate,

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
  getExtraDetails,

  // User Auth
  loginUser,
  registerUser,
  logoutUser,
  checkAuthUser,
  takeUserCredentials,

  // User Social account
  getSocialList,
  addInstAccount,
  deleteInstAccount,

  // User Package, Services, Extra
  getPackageDetailsUser,
  getCustomPackByUserId,
  getActiveServiceUser,
  saveCommentsBeforePayment,
  getExtraDetailsUser,
  sendExtraComments,
  getPurchasedExtraByUserId,

  // User Check
  checkPostsRemaining,
  checkStatusExternalServices,
  checkPackPurchaseOption,
  checkExtraPurchaseOption,

  // Payments
  paymenStatusCatch,
  paymentPackage,
  paymentExtra,

  // GeneralSettings
  getGeneralSettings,
  changeStatusGenSettingById,
  getExtraServicesStatus,
  changeStatusExtraServiceById,
};
