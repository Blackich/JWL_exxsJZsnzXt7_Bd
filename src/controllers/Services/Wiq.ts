import axios from "axios";
import { siteWiq } from "@src/utils/utils";

const apiKeyWQ = process.env.API_KEY_WQ;

export const addExtraServiceWQ = async (
  nickname: string,
  id: number,
  count: number,
) => {
  const url = `https://www.instagram.com/${nickname}`;
  const response = await axios.get(`${siteWiq}?action=create&
    key=${apiKeyWQ}&link=${url}&service=${id}&
    quantity=${count}`);
  return response.data;
};

export const addTestServiceWQ = async (
  url: string,
  id: number,
  count: number,
) => {
  const response = await axios.get(`${siteWiq}?action=create&
    key=${apiKeyWQ}&link=${url}&service=${id}&
    quantity=${count}`);
  return response.data;
};

export const checkServiceWQ = async (orderId: number) => {
  const response = await axios.get(`${siteWiq}?action=status&
    key=${apiKeyWQ}&order=${orderId}`);
  return response.data;
};
