const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const sajuRoutes = require("./routes/saju");
const gunghapRoutes = require("./routes/gunghap");
const authRoutes = require("./routes/auth");
const pushRoutes = require("./routes/push");
const dailyRoutes = require("./routes/daily");
const { seedTestAccounts } = require("./lib/users");

const app = express();
app.use(helmet());
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "OPTIONS"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/saju", sajuRoutes);
app.use("/api/gunghap", gunghapRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/daily", dailyRoutes);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`API listening on :${port}`);
  await seedTestAccounts();
});
