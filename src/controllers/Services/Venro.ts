import axios from "axios";
import { siteVenro } from "@src/utils/utils";

const apiKeyVR = process.env.API_KEY_VR;

export const addServiceVR = async (
  nickname: string,
  id: number,
  count: number,
  posts: number,
  speed: number,
) => {
  const url = `https://www.instagram.com/${nickname}`;
  const response = await axios.get(`${siteVenro}?action=add&
    key=${apiKeyVR}&url=${url}&
    type=${id}&count=${count}&
    posts=${posts}&speed=${speed}`);
  return response.data;
};

export const addExtraServiceVR = async (
  nickname: string,
  id: number,
  count: number,
  speed: number,
) => {
  const url = `https://www.instagram.com/${nickname}`;
  const response = await axios.get(`${siteVenro}?action=add&
    key=${apiKeyVR}&url=${url}&type=${id}&
    count=${count}&speed=${speed}`);
  return response.data;
};

export const addTestServiceVR = async (
  url: string,
  id: number,
  count: number,
  speed: number,
) => {
  const response = await axios.get(`${siteVenro}?action=add&
    key=${apiKeyVR}&url=${url}&type=${id}&
    count=${count}&speed=${speed}`);
  return response.data;
};

export const checkServiceVR = async (id: number) => {
  const response = await axios.get(`${siteVenro}?action=check&
    key=${apiKeyVR}&id=${id}`);
  return response.data;
};

export const cancelServiceVR = async (id: number) => {
  const response = await axios.get(`${siteVenro}?action=cancel&
    key=${apiKeyVR}&id=${id}`);
  return response.data;
};

export const getServiceDetailsVR = async () => {
  const response = await axios.get(
    `${siteVenro}?action=services&key=${apiKeyVR}`,
  );
  return response.data;
};

export const checkStatusSites = async () => {
  const respVR = await axios.get("https://venro.ru/").catch((res) => res);
  const respJP = await axios
    .get("https://justanotherpanel.com/")
    .catch((res) => res);
  const status = [respVR.status, respJP.status];
  return status;
};
