"use strict";
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const webpush = require("web-push");
const { authMiddleware } = require("../lib/auth");
const { upsertSubscription, removeSubscription, getAllSubscriptions } = require("../lib/pushStore");

const pushLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
});

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@fortune.local";

let vapidConfigured = false;
if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
  vapidConfigured = true;
}

/** GET /api/push/vapid-public - return VAPID public key */
router.get("/vapid-public", (req, res) => {
  res.json({ ok: true, publicKey: VAPID_PUBLIC });
});

/** POST /api/push/subscribe - save subscription */
router.post("/subscribe", pushLimiter, authMiddleware, (req, res) => {
  try {
    const { subscription } = req.body || {};
    if (!subscription?.endpoint) throw new Error("subscription.endpoint이 필요합니다.");
    upsertSubscription(req.user.id, subscription);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

/** DELETE /api/push/subscribe - remove subscription */
router.delete("/subscribe", pushLimiter, authMiddleware, (req, res) => {
  removeSubscription(req.user.id);
  res.json({ ok: true });
});

/**
 * POST /api/push/send-daily - send today's fortune push to all subscribers
 * Protected by a shared secret header (for cron / GitHub Actions trigger)
 */
router.post("/send-daily", async (req, res) => {
  const secret = req.headers["x-push-secret"];
  const expected = process.env.PUSH_CRON_SECRET || "";
  if (!expected || secret !== expected) {
    return res.status(403).json({ ok: false, error: "forbidden" });
  }

  if (!vapidConfigured) {
    return res.status(503).json({ ok: false, error: "VAPID keys not configured" });
  }

  const subs = getAllSubscriptions();
  let sent = 0;
  let failed = 0;

  const payload = JSON.stringify({
    title: "오늘의 운세 🔮",
    body: `${new Date().toLocaleDateString("ko-KR")} 오늘의 운세를 확인하세요!`,
    url: "/daily",
  });

  for (const entry of subs) {
    try {
      await webpush.sendNotification(entry.subscription, payload);
      sent++;
    } catch (err) {
      failed++;
      console.error(`[push] Failed for user ${entry.userId}:`, err.message);
    }
  }

  res.json({ ok: true, sent, failed });
});

module.exports = router;
