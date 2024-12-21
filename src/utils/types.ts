export type PackageDetails = {
  id: number;
  likes: number;
  price_rub_15: number;
  price_rub_30: number;
  price_usd_15: number;
  price_usd_30: number;
};

export type SocialNickname = {
  id: number;
  userId: number;
  messangerId: number;
  nickname: string;
  status: number;
  createdAt: string;
};

export type CustomPackageDetails = {
  id: number;
  likes: number;
  reach: number;
  saves: number;
  profileVisits: number;
  reposts: number;
  videoViews: number;
  countPosts: number;
  price_rub: number;
  price_usd: number;
  createdAt: number;
};

export type PackageSettings = {
  id: number;
  siteId: number;
  typeService: string;
  serviceId: number;
  status: number;
  ratio: number;
  createdAt: string;
};

export type PurchasePackage = {
  id: number;
  serviceId: number;
  siteId: number;
  siteServiceId: number;
  orderId: number;
};

export type Service = {
  id: number;
  userId: number;
  socialNicknameId: number;
  packageId: number | null;
  customPackageId: number | null;
  customPackage: number;
  countPosts: number;
  orderId: string;
  status: number;
  createdAt: string;
  cost: number;
  currency: string;
};
