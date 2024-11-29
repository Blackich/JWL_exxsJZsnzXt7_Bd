import axios from "axios";
import { formatDatePlus30Days, siteJP } from "@src/utils/utils";

const apiKeyJP = process.env.API_KEY_JP;

export const addServiceJP = async (
  nickname: string,
  id: number,
  min: number,
  max: number,
  posts: number,
) => {
  const url = `https://www.instagram.com/${nickname}`;
  const response = await axios.post(`${siteJP}?action=add&
    key=${apiKeyJP}&username=${url}&
    service=${id}&min=${min}&max=${max}&
    posts=${posts}&expiry=${formatDatePlus30Days()}`);
  return { data: response.data, siteId: 2, siteServiceId: id };
};

export const addTestServiceJP = async (
  url: string,
  id: number,
  count: number,
) => {
  const response = await axios.post(`${siteJP}?action=add&
    key=${apiKeyJP}&link=${url}&
    service=${id}&quantity=${count}`);
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
