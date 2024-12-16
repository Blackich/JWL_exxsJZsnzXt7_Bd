export type Metadata = MetadataPack | MetadataExtra;

export type AddServicePack = {
  orderId: string;
  meta: MetadataPack;
  isCustPack: boolean;
  paymentServiceName: string;
  amount: { value: number; currency: string };
};

export type AddServiceExtra = {
  orderId: string;
  meta: MetadataExtra;
  paymentServiceName: string;
};

export type TGSenderPackInfo = {
  userId: number;
  socialNicknameId: number;
  packageId: number;
  customPackage: number;
  countPosts: number;
  cost: number;
  currency: string;
  paymentServiceName: string;
};

export type TGSenderExtraInfo = {
  userId: number;
  socialNicknameId: number;
  serviceId: number;
  count: number;
  cost: number;
  currency: string;
  service: string;
};

type MetadataPack = {
  userId: number;
  packageId: number;
  countPosts: number;
  customPackage: number;
  socialNicknameId: number;
  serviceName: "package";
};

type MetadataExtra = {
  count: number;
  userId: number;
  priceRUB: number;
  priceUSD: number;
  serviceId: number;
  socialNicknameId: number;
  serviceName: "extra";
};
