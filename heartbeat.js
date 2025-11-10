let connected = {};

export default function handler(req, res) {
  const user = req.query.user;
  const now = Date.now();
  const timeout = 5000;

  if (user) connected[user] = now;

  for (const [u, t] of Object.entries(connected)) {
    if (now - t > timeout) delete connected[u];
  }

  res.status(200).json({ connected: Object.keys(connected) });
}
