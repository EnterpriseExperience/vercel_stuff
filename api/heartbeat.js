import { get, set } from "@vercel/edge-config";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");
  const timeout = 5000;
  const now = Date.now();

  let connected = (await get("connections")) || {};

  if (user) {
    connected[user] = now;
  }

  // Clean up timed-out connections
  for (const [u, t] of Object.entries(connected)) {
    if (now - t > timeout) {
      delete connected[u];
    }
  }

  await set("connections", connected);

  return new Response(
    JSON.stringify({ connected: Object.keys(connected) }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
