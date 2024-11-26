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
  return { data: response.data, siteId: 1, siteServiceId: id };
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

export const getServicesVR = async () => {
  const response = await axios.get(
    `${siteVenro}?action=services&key=${apiKeyVR}`,
  );
  return response.data;
};
