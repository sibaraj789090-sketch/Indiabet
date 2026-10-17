import { clerkClient, getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

export const requireAdmin: RequestHandler = async (req, res, next): Promise<void> => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Sign in is required." });
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    req.log.error("Admin access is not configured.");
    res.status(503).json({ error: "Admin access is not configured." });
    return;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const isAllowedAdmin = user.emailAddresses.some(
      (address) =>
        address.emailAddress.trim().toLowerCase() === adminEmail &&
        address.verification?.status === "verified",
    );

    if (!isAllowedAdmin) {
      res.status(403).json({ error: "This account does not have admin access." });
      return;
    }

    next();
  } catch (error) {
    req.log.error({ err: error }, "Could not verify admin account.");
    res.status(503).json({ error: "Admin verification is temporarily unavailable." });
  }
};
