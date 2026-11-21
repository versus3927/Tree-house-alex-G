import express from "express";
import pg from "pg";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// ---- database ----
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("railway")
    ? { rejectUnauthorized: false }
    : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS planks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'a visitor',
      text TEXT NOT NULL,
      tone INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // seed a few default planks if the table is empty
  const { rows } = await pool.query("SELECT COUNT(*)::int AS c FROM planks");
  if (rows[0].c === 0) {
    const seeds = [
      { id: "s1", name: "moss", text: "found this song at 2am. never really left.", tone: 2 },
      { id: "s2", name: "june", text: "one ladder, two people, zero worries.", tone: 4 },
      { id: "s3", name: "kit", text: "smallest club in the world. best club.", tone: 1 },
      { id: "s4", name: "alex", text: "this loop makes me want to disappear into the woods.", tone: 0 },
      { id: "s5", name: "sarah", text: "played this in the car until the tape wore out.", tone: 3 },
    ];
    for (const s of seeds) {
      await pool.query(
        "INSERT INTO planks (id, name, text, tone) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
        [s.id, s.name, s.text, s.tone]
      );
    }
  }
  console.log("Database ready");
}

// ---- API routes ----

// GET all planks
app.get("/api/planks", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, text, tone FROM planks ORDER BY created_at DESC LIMIT 100"
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /api/planks error:", err);
    res.status(500).json({ error: "Failed to load planks" });
  }
});

// POST a new plank
app.post("/api/planks", async (req, res) => {
  try {
    const { id, name, text, tone } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }
    const safeName = (typeof name === "string" && name.trim()) ? name.trim().slice(0, 20) : "a visitor";
    const safeText = text.trim().slice(0, 90);
    const safeTone = typeof tone === "number" ? Math.max(0, Math.min(4, Math.floor(tone))) : 0;
    const safeId = (typeof id === "string" && id.trim()) ? id.trim().slice(0, 30) : `${Date.now().toString(36)}`;

    await pool.query(
      "INSERT INTO planks (id, name, text, tone) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
      [safeId, safeName, safeText, safeTone]
    );
    res.status(201).json({ id: safeId, name: safeName, text: safeText, tone: safeTone });
  } catch (err) {
    console.error("POST /api/planks error:", err);
    res.status(500).json({ error: "Failed to save plank" });
  }
});

// DELETE a plank by id
app.delete("/api/planks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM planks WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/planks error:", err);
    res.status(500).json({ error: "Failed to delete plank" });
  }
});

// ---- serve frontend ----
app.use(express.static(join(__dirname, "dist")));
app.get("/{*path}", (_req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

// ---- start ----
const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to init DB:", err);
    // start anyway so the site works without the DB
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB)`));
  });
