import axios from "axios";
import { db } from "@src/main";
import { formatDatePlus30Days, siteJP } from "@src/utils/utils";
import { logErr } from "@src/middleware/errorHandler";

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
  return response.data;
};

export const addExtraServiceJP = async (
  nickname: string,
  id: number,
  quantity: number,
) => {
  const url = `https://www.instagram.com/${nickname}`;
  const response = await axios.post(`${siteJP}?action=add&
    key=${apiKeyJP}&link=${url}&service=${id}&
    quantity=${quantity}&runs=10&interval=60`);
  return response.data;
};

export const addTestServiceJP = async (
  url: string,
  id: number,
  count: number,
  runs: number,
) => {
  const response = await axios.post(`${siteJP}?action=add&
    key=${apiKeyJP}&link=${url}&service=${id}&
    quantity=${count}&runs=${runs}&interval=30`);
  return response.data;
};

export const addTestServiceJPNoDrip = async (
  url: string,
  id: number,
  count: number,
) => {
  const response = await axios.post(`${siteJP}?action=add&
    key=${apiKeyJP}&link=${url}&service=${id}&
    quantity=${count}`);
  return response.data;
};

export const sendCommentsServiceJP = async (
  url: string,
  id: number,
  comments: string[],
) => {
  const response = await axios.post(`${siteJP}?action=add&
    key=${apiKeyJP}&link=${url}&service=${id}&
    comments=${comments.map((comm) => comm.concat("\\n")).join("")}`);
  return response.data;
};

export const checkServiceJP = async (orderId: number) => {
  const response = await axios.post(`${siteJP}?action=status&
    key=${apiKeyJP}&order=${orderId}`);
  return response.data;
};

export const cancelServiceJP = async (orderId: number) => {
  const justSett = await getJustSettings();
  if (!justSett) return 400;
  const url = `https://justanotherpanel.com/subscriptions/stop/${orderId}`;
  const cookies = `_identity_user=${justSett.identity}; hash=${justSett.hash};`;
  const response = await axios
    .get(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookies,
      },
    })
    .catch(() => ({ status: 400 }));
  return response.status;
};

export const getServiceDetailsJP = async () => {
  const response = await axios.get(`${siteJP}?action=services&key=${apiKeyJP}`);
  return response.data;
};

//--------------------------------------------------

const getJustSettings = async () => {
  return await db
    .promise()
    .query(`SELECT identity, hash FROM Just_setting`)
    .then(([result]) => (result as { identity: string; hash: string }[])?.[0])
    .catch((err) => logErr(err, "JustPanel/getJustSettings"));
};
