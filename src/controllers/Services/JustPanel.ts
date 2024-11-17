import axios from "axios";
import { formatDatePlus30Days, siteJP } from "@src/utils/utils";

const apiKeyJP = process.env.API_KEY_JP;

export const addServiceJP = async (
  url: string,
  id: number,
  min: number,
  max: number,
  posts: number,
) => {
  const response = await axios.post(`${siteJP}?action=add&
    key=${apiKeyJP}&username=${url}&
    service=${id}&min=${min}&max=${max}&
    posts=${posts}&expiry=${formatDatePlus30Days()}`);
  return response.data;
};

export const checkServiceJP = async (orderId: number) => {
  const response = await axios.post(`${siteJP}?action=status&
    key=${apiKeyJP}&order=${orderId}`);
  return response.data;
};

export const cancelServiceJP = async (orderIds: number) => {
  const response = await axios.post(`${siteJP}?action=cancel&
    key=${apiKeyJP}&orders=${orderIds}`);
  return response.data;
};

export const getServicesJP = async () => {
  const response = await axios.get(`${siteJP}?action=services&key=${apiKeyJP}`);
  return response.data;
};
