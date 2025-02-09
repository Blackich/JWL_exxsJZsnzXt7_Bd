export type RejectExternal = {
  id: number;
  status: number;
  createdAt: string;
  externalSetting: СommonSettings | string;
};

export type СommonSettings =
  | PackageSettings
  | ExtraSettings
  | TestSettings
  | CancelSettings;

export type PackageSettings = PackageSettingsVR | PackageSettingsJP;
export type ExtraSettings = ExtraSettingsVR | ExtraSettingsJP | ExtraSettingsWQ;
export type TestSettings =
  | TestSettingsVR
  | TestSettingsJPNoDrip
  | TestSettingsJPDrip
  | TestSettingsWQ;
export type CancelSettings = {
  serviceName: "Cancel";
  siteId: number;
  orderId: number;
};

export type PackageSettingsVR = {
  serviceName: "Pack";
  siteId: number;
  siteServiceId: number;
  nickname: string;
  countPosts: number;
  count: number;
  speed: number;
  tableServiceId: number;
};
export type PackageSettingsJP = {
  serviceName: "Pack";
  siteId: number;
  siteServiceId: number;
  nickname: string;
  countPosts: number;
  min: number;
  max: number;
  tableServiceId: number;
};

export type ExtraSettingsVR = {
  serviceName: "Extra";
  siteId: number;
  siteServiceId: number;
  nickname: string;
  speed: number;
  count: number;
  tableExtraId: number;
};
export type ExtraSettingsJP = {
  serviceName: "Extra";
  siteId: number;
  siteServiceId: number;
  nickname: string;
  count: number;
  tableExtraId: number;
};
export type ExtraSettingsWQ = {
  serviceName: "Extra";
  siteId: number;
  siteServiceId: number;
  nickname: string;
  count: number;
  tableExtraId: number;
};

export type TestSettingsVR = {
  serviceName: "Test";
  siteId: number;
  siteServiceId: number;
  count: number;
  speed: number;
  link: string;
};
export type TestSettingsJPDrip = {
  serviceName: "Test";
  siteId: number;
  siteServiceId: number;
  drip: number;
  count: number;
  runs: number;
  link: string;
};
export type TestSettingsJPNoDrip = {
  serviceName: "Test";
  siteId: number;
  siteServiceId: number;
  drip: number;
  count: number;
  link: string;
};
export type TestSettingsWQ = {
  serviceName: "Test";
  siteId: number;
  siteServiceId: number;
  count: number;
  link: string;
};
