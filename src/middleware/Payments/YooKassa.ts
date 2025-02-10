import { tryCatch } from "../errorHandler";
import { Address4, Address6 } from "ip-address";
import { Request, Response, NextFunction } from "express";

const ALLOWED_IPS = [
  "185.71.76.0/27",
  "185.71.77.0/27",
  "77.75.153.0/25",
  "77.75.156.11",
  "77.75.156.35",
  "77.75.154.128/25",
  "2a02:5180::/32",
];

const isIpAllowed = (ip: string): boolean => {
  for (const range of ALLOWED_IPS) {
    if (ip.includes(":")) {
      // IPv6
      const address = new Address6(ip);
      const subnet = new Address6(range);
      if (address.isInSubnet(subnet)) {
        return true;
      }
    } else {
      // IPv4
      const address = new Address4(ip);
      const subnet = new Address4(range);
      if (address.isInSubnet(subnet)) {
        return true;
      }
    }
  }
  return false;
};

export const verifyYooKassa = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestIp = req.ip || req.socket.remoteAddress;

    if (!requestIp) {
      return res.status(403).json({ message: "IP could not be determined" });
    }

    if (!isIpAllowed(requestIp)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  },
);
