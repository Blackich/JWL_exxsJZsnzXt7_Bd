import { loginAdmin } from "@controllers/Admin/Auth/AdminLogin";
import { logoutAdmin } from "@controllers/Admin/Auth/AdminLogout";
import {
  checkAuth,
  takeAdminCredentials,
} from "@controllers/Admin/Auth/AdminAuthCheck";

import {
  getUsers,
  getUserById,
  updateUserStatus,
  getExtraByUserId,
  getServicesByUserId,
  getUserSocialAccounts,
  getCustomPackageByUserId,
  deleteCustomPackageByUserId,
} from "@controllers/Admin/UsersCRUD/UsersCRUD";
import {
  getRemarkByUserId,
  updateUserRemark,
} from "@controllers/Admin/UsersCRUD/UserRemark";

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
  getAllUsersForCustomPackage,
  getCustomPackageDetails,
  addCustomPackToUser,
} from "@controllers/Admin/CustomPackage";
import { getPackageDetails } from "@controllers/Admin/PackageDetails";
import {
  sendTestServices,
  getTestServicesSent,
} from "@controllers/Admin/TestServices";

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

import { loginUser } from "@controllers/User/Auth/UserLogin";
import {
  checkAuthUser,
  takeUserCredentials,
} from "@controllers/User/Auth/UserAuthCheck";
import { registerUser } from "@controllers/User/Auth/UserRegister";
import { logoutUser } from "@controllers/User/Auth/UserLogout";
import { changePasswordUser } from "@controllers/User/Auth/UserResetPassword/ChangePassword";
import { getUserEmail } from "@controllers/User/Auth/UserResetPassword/GetUserEmail";
import { checkTokenResetPass } from "@controllers/User/Auth/UserResetPassword/middleware";
import { sendPasswordResetEmail } from "@controllers/User/Auth/UserResetPassword/SendEmail";

import { deleteInstAccount } from "@controllers/User/SocialAccount/DeleteSocialAccount";
import { addInstAccount } from "@controllers/User/SocialAccount/AddSocialAccount";
import {
  getSocialList,
  getProfilePhotoByUserName,
} from "@controllers/User/SocialAccount/GetSocialAccount";
import { searchSocAccByQueryNick } from "@controllers/User/SocialAccount/SearchSocialAccount";

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
  checkRegisterPosibility,
} from "@controllers/User/Checks";

import { verifyYooKassa } from "@src/middleware/Payments/YooKassa";
import { paymentStatusCatch } from "@controllers/Payments/YooKassa/_webhook";
import { paymentPackage } from "@controllers/Payments/YooKassa/Package";
import { paymentExtra } from "@controllers/Payments/YooKassa/Extra";

import {
  getMainSettings,
  changeStatusMainSettingById,
} from "@controllers/Admin/GeneralSettings/MainSettings";
import {
  getExtraServicesStatus,
  changeStatusExtraServiceById,
} from "@controllers/Admin/GeneralSettings/ExtraServiceSettings";
import {
  getJustSettings,
  updateJustHash,
} from "@controllers/Admin/GeneralSettings/JustSettings";

export default {
  // Admin Auth
  loginAdmin,
  logoutAdmin,
  checkAuth,
  takeAdminCredentials,

  // Admin Users CRUD
  getUsers,
  getUserById,
  getExtraByUserId,
  updateUserStatus,
  getRemarkByUserId,
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
  getAllUsersForCustomPackage,
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

  getUserEmail,
  changePasswordUser,
  checkTokenResetPass,
  sendPasswordResetEmail,

  // User Social account
  getSocialList,
  addInstAccount,
  deleteInstAccount,
  searchSocAccByQueryNick,
  getProfilePhotoByUserName,

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
  checkRegisterPosibility,

  // Payments
  verifyYooKassa,
  paymentStatusCatch,
  paymentPackage,
  paymentExtra,

  // GeneralSettings
  getMainSettings,
  changeStatusMainSettingById,
  getExtraServicesStatus,
  changeStatusExtraServiceById,
  getJustSettings,
  updateJustHash,
};
