export type TestSettings = {
  typeService: string;
  serviceId: number;
  siteId: number;
  count: number;
  drip: number;
};

export type ExtraSettings = {
  serviceId: number;
  siteId: number;
};

export type TGSenderCommentInfo = {
  extraId: number;
  userId: number;
  socialNicknameId: number;
  countComments: number;
  commentServiceName: string;
  extraServiceId: number;
};