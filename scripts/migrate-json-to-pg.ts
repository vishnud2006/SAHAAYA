import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL environment variable is not defined.");
  console.error("Please configure DATABASE_URL in .env.local before running this migration.");
  process.exit(1);
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "store.json");
const TMP_DB_FILE = path.join("/tmp", "sahaaya_data", "store.json");

async function migrate() {
  console.log("🔄 Starting SAHAAYA JSON to PostgreSQL Data Migration...");

  let loadedData: { users?: any[]; cases?: any[] } | null = null;

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      loadedData = JSON.parse(content);
      console.log(`📁 Read local file: ${DB_FILE}`);
    } catch (e) {
      console.warn("Could not read local store.json:", e);
    }
  } else if (fs.existsSync(TMP_DB_FILE)) {
    try {
      const content = fs.readFileSync(TMP_DB_FILE, "utf-8");
      loadedData = JSON.parse(content);
      console.log(`📁 Read /tmp store: ${TMP_DB_FILE}`);
    } catch (e) {
      console.warn("Could not read /tmp store.json:", e);
    }
  }

  if (!loadedData || (!Array.isArray(loadedData.users) && !Array.isArray(loadedData.cases))) {
    console.log("ℹ️ No existing JSON data found to migrate. Exiting safely.");
    process.exit(0);
  }

  if (!DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL environment variable is not defined.");
    console.error("Please configure DATABASE_URL in .env.local before running this migration.");
    process.exit(1);
  }

  const dbUrl = DATABASE_URL;
  const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

  const client = await pool.connect();

  try {
    // 1. Ensure tables exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" varchar(128) PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" text NOT NULL,
        "salt" varchar(64) NOT NULL,
        "auth_provider" varchar(32) DEFAULT 'email' NOT NULL,
        "avatar_url" text,
        "google_id" varchar(255),
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "cases" (
        "id" varchar(128) PRIMARY KEY NOT NULL,
        "user_id" varchar(128) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "title" text NOT NULL,
        "raw_input" text NOT NULL,
        "priority" varchar(32) NOT NULL,
        "input_sources" jsonb NOT NULL,
        "result" jsonb NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
      CREATE INDEX IF NOT EXISTS "users_google_id_idx" ON "users" ("google_id");
      CREATE INDEX IF NOT EXISTS "cases_user_id_idx" ON "cases" ("user_id");
      CREATE INDEX IF NOT EXISTS "cases_created_at_idx" ON "cases" ("created_at");
      CREATE INDEX IF NOT EXISTS "cases_user_created_idx" ON "cases" ("user_id", "created_at");
    `);

    let usersImported = 0;
    let usersSkipped = 0;

    const rawUsers = loadedData.users || [];
    for (const u of rawUsers) {
      if (!u.id || !u.email) continue;
      const res = await client.query('SELECT id FROM "users" WHERE id = $1 OR LOWER(email) = LOWER($2)', [
        u.id,
        u.email,
      ]);
      if (res.rows.length === 0) {
        await client.query(
          `INSERT INTO "users" (id, name, email, password_hash, salt, auth_provider, avatar_url, google_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            u.id,
            u.name || "User",
            u.email.toLowerCase().trim(),
            u.passwordHash || "",
            u.salt || "",
            u.authProvider || "email",
            u.avatarUrl || null,
            u.googleId || null,
            u.createdAt ? new Date(u.createdAt) : new Date(),
            u.updatedAt ? new Date(u.updatedAt) : new Date(),
          ]
        );
        usersImported++;
      } else {
        usersSkipped++;
      }
    }

    let casesImported = 0;
    let casesSkipped = 0;

    const rawCases = loadedData.cases || [];
    for (const c of rawCases) {
      if (!c.id || !c.userId) continue;

      // Check if user exists
      const userCheck = await client.query('SELECT id FROM "users" WHERE id = $1', [c.userId]);
      if (userCheck.rows.length === 0) {
        console.warn(`⚠️ Skipping case ${c.id}: owner user ${c.userId} not found in database.`);
        continue;
      }

      const caseCheck = await client.query('SELECT id FROM "cases" WHERE id = $1', [c.id]);
      if (caseCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO "cases" (id, user_id, title, raw_input, priority, input_sources, result, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            c.id,
            c.userId,
            c.title || "Case Analysis",
            c.rawInput || "",
            c.priority || "MEDIUM",
            JSON.stringify(c.inputSources || ["text"]),
            JSON.stringify(c.result || {}),
            c.createdAt ? new Date(c.createdAt) : new Date(),
            c.updatedAt ? new Date(c.updatedAt) : new Date(),
          ]
        );
        casesImported++;
      } else {
        casesSkipped++;
      }
    }

    console.log(`✅ Migration complete!`);
    console.log(`   Users: ${usersImported} imported, ${usersSkipped} already existing`);
    console.log(`   Cases: ${casesImported} imported, ${casesSkipped} already existing`);
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
