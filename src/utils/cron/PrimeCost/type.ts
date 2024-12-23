export type AllServiceSettings = {
  servicesVR: ExternalServiceSettings[];
  servicesJP: ExternalServiceSettings[];
  servicesWQ: ExternalServiceSettings[];
  packageSettings: DatabaseServiceSettings[];
  extraServiceSettings: DatabaseServiceSettings[];
  testServiceSettings: DatabaseServiceSettings[];
};

export type DatabaseServiceSettings = {
  id: number;
  cost: number;
  siteId: number;
  serviceId: number;
};

export type ExternalServiceSettings = {
  service: string;
  name: string;
  rate: string;
};

export type TableNameKey = keyof typeof TableName;

export enum TableName {
  pack = "Package_setting",
  extra = "Extra_service_setting",
  test = "Test_service_setting",
}

export type TGMessageProps = {
  was: number;
  became: number;
  siteId: number;
  serviceName: string;
  siteServiceId: number;
  tableKey: TableNameKey;
};
