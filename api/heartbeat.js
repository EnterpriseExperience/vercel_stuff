import { get, set } from "@vercel/edge-config";

export default async function handler(req, res) {
  const user = req.query.user;
  const timeout = 5000;
  const now = Date.now();

  let connected = (await get("connections")) || {};

  if (user) connected[user] = now;

  for (const [u, t] of Object.entries(connected)) {
    if (now - t > timeout) delete connected[u];
  }

  await set("connections", connected);

  res.status(200).json({ connected: Object.keys(connected) });
}
