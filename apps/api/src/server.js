const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const sajuRoutes = require("./routes/saju");
const gunghapRoutes = require("./routes/gunghap");

const app = express();
app.use(helmet());
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/saju", sajuRoutes);
app.use("/api/gunghap", gunghapRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on :${port}`));
