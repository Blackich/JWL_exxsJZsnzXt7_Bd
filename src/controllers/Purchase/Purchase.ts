// import axios from "axios";
// import { db } from "../../main.js";
// import { addServiceJP } from "../Services/JustPanel.js";
// import { addServiceVR } from "../Services/Venro.js";
// import { getRandomPercentage } from "../../utils/utils.js";

// export const purchasePack = async (url, likes, countPosts) => {
//   const details = await packageDetails();
//   return await details.map((detail) => {
//     const quantity = detail.ratio * likes;

//     if (detail.siteId === 1) {
//       const speed = 20;
//       const count = quantity < 100
//         ? 100 + getRandomPercentage(likes, 0, 0.02)
//         : quantity + getRandomPercentage(quantity, 0, 0.02);
//       return {
//         url,
//         serviceId: detail.serviceId,
//         count: count,
//         countPosts,
//         speed
//       }
//       // return addServiceVR(url, detail.serviceId, likes, countPosts, speed);
//     }

//     if (detail.siteId === 2) {
//       const min = quantity < 100 ? 100 : quantity;
//       const max = quantity < 100 ? 115 : quantity + quantity * 0.02;
//       return {
//         url,
//         serviceId: detail.serviceId,
//         min,
//         max,
//         countPosts
//       }
//       // return addServiceJP(url, detail.serviceId, min, max, countPosts);
//     }
//   })
//   // try {
//   // const likes = await addServiceVR(url, 13, 500, 3, 50);
//   // const reach = await addServiceVR(url, 106, 500, 3, 50);
//   // const saves = await addServiceVR(url, 99, 500, 3, 50);
//   // const profileVisits = await addServiceJP(url, 7447, 200, 250, 2);
//   // const viewsVideo = await addServiceJP(url, 6, 500, 3, 50);
//   // const reposts = await addServiceJP(url, 6376, 30, 35, 2);
//   //   return {
//   //     likes: likes,
//   //     reach: reach,
//   //     saves: saves,
//   //     profileVisits: profileVisits,
//   //     reposts: reposts,
//   //     viewsVideo: viewsVideo
//   //   };
//   // } catch (err) {
//   //   console.log(err);
//   // }
// }


// export const packageDetails = async () => {
//   const data = await db.promise()
//     .query(`SELECT * FROM Package_detail 
//             WHERE status = 1`)
//     .then(([result]) => {
//       return result
//     });
//   return data
// }