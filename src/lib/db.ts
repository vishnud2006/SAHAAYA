import fs from "fs";
import path from "path";
import crypto from "crypto";
import { User, SavedCase, ActionItem, DashboardSummaryStats } from "@/types";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc, and, or } from "drizzle-orm";
import * as schema from "@/db/schema";

interface DatabaseSchema {
  users: User[];
  cases: SavedCase[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "store.json");

const TMP_DATA_DIR = path.join("/tmp", "sahaaya_data");
const TMP_DB_FILE = path.join(TMP_DATA_DIR, "store.json");

// ==========================================
// 1. POSTGRESQL LAYER (Neon / PostgreSQL)
// ==========================================

let _pool: Pool | null = null;
let _drizzleDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getPostgresDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.trim() === "") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Production database is not configured. Please set DATABASE_URL in environment variables."
      );
    }
    return null;
  }

  if (!_drizzleDb) {
    const isLocal =
      connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

    _pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    _drizzleDb = drizzle(_pool, { schema });
  }

  return _drizzleDb;
}

// ==========================================
// 2. LOCAL DEV JSON FALLBACK ENGINE
// ==========================================

let memoryDb: DatabaseSchema | null = null;

function initializeLocalJsonDatabase(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  let loadedData: DatabaseSchema | null = null;

  try {
    if (fs.existsSync(TMP_DB_FILE)) {
      const content = fs.readFileSync(TMP_DB_FILE, "utf-8");
      loadedData = JSON.parse(content);
    } else if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      loadedData = JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not read local JSON DB file, using memory storage:", err);
  }

  if (loadedData && Array.isArray(loadedData.users) && Array.isArray(loadedData.cases)) {
    memoryDb = loadedData;
    return memoryDb;
  }

  memoryDb = {
    users: [],
    cases: [],
  };

  persistLocalJsonDatabase();
  return memoryDb;
}

function persistLocalJsonDatabase() {
  if (!memoryDb) return;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
    return;
  } catch {
    // Falls through to /tmp in read-only environments
  }

  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(TMP_DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
  } catch (tmpErr) {
    console.warn("Could not write persistent DB file, keeping in-memory:", tmpErr);
  }
}

// ==========================================
// 3. UNIFIED DATABASE ACCESS LAYER
// ==========================================

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = getPostgresDb();
  const normalized = email.toLowerCase().trim();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    return jsonDb.users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  try {
    const rows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, normalized))
      .limit(1);

    if (rows.length === 0) return null;
    const u = rows[0];
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      salt: u.salt,
      authProvider: (u.authProvider as "email" | "google") || "email",
      avatarUrl: u.avatarUrl || undefined,
      googleId: u.googleId || undefined,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
      updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : String(u.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL findUserByEmail error:", err);
    throw new Error("Failed to query user record.");
  }
}

export async function findUserById(id: string): Promise<User | null> {
  const db = getPostgresDb();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    return jsonDb.users.find((u) => u.id === id) || null;
  }

  try {
    const rows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const u = rows[0];
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      salt: u.salt,
      authProvider: (u.authProvider as "email" | "google") || "email",
      avatarUrl: u.avatarUrl || undefined,
      googleId: u.googleId || undefined,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
      updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : String(u.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL findUserById error:", err);
    throw new Error("Failed to query user profile.");
  }
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
  salt: string
): Promise<User> {
  const db = getPostgresDb();
  const normalizedEmail = email.toLowerCase().trim();
  const id = `user-${crypto.randomUUID()}`;

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    const newUser: User = {
      id,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      salt,
      authProvider: "email",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jsonDb.users.push(newUser);
    persistLocalJsonDatabase();
    return newUser;
  }

  try {
    const now = new Date();
    const [inserted] = await db
      .insert(schema.users)
      .values({
        id,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        salt,
        authProvider: "email",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      email: inserted.email,
      passwordHash: inserted.passwordHash,
      salt: inserted.salt,
      authProvider: "email",
      createdAt: inserted.createdAt instanceof Date ? inserted.createdAt.toISOString() : String(inserted.createdAt),
      updatedAt: inserted.updatedAt instanceof Date ? inserted.updatedAt.toISOString() : String(inserted.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL createUser error:", err);
    throw new Error("Failed to create user account.");
  }
}

export async function findOrCreateGoogleUser(data: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<User> {
  const db = getPostgresDb();
  const normalizedEmail = data.email.toLowerCase().trim();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    const existingUser = jsonDb.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail || u.googleId === data.googleId
    );

    if (existingUser) {
      existingUser.googleId = data.googleId;
      if (data.avatarUrl && !existingUser.avatarUrl) {
        existingUser.avatarUrl = data.avatarUrl;
      }
      if (!existingUser.authProvider) {
        existingUser.authProvider = "email";
      }
      existingUser.updatedAt = new Date().toISOString();
      persistLocalJsonDatabase();
      return existingUser;
    }

    const newUser: User = {
      id: `user-${crypto.randomUUID()}`,
      name: data.name?.trim() || data.email.split("@")[0],
      email: normalizedEmail,
      passwordHash: "",
      salt: "",
      authProvider: "google",
      avatarUrl: data.avatarUrl,
      googleId: data.googleId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jsonDb.users.push(newUser);
    persistLocalJsonDatabase();
    return newUser;
  }

  try {
    // 1. Check if user already exists
    const existing = await db
      .select()
      .from(schema.users)
      .where(or(eq(schema.users.email, normalizedEmail), eq(schema.users.googleId, data.googleId)))
      .limit(1);

    const now = new Date();

    if (existing.length > 0) {
      const u = existing[0];
      const [updated] = await db
        .update(schema.users)
        .set({
          googleId: data.googleId,
          avatarUrl: data.avatarUrl || u.avatarUrl,
          updatedAt: now,
        })
        .where(eq(schema.users.id, u.id))
        .returning();

      return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        passwordHash: updated.passwordHash,
        salt: updated.salt,
        authProvider: (updated.authProvider as "email" | "google") || "email",
        avatarUrl: updated.avatarUrl || undefined,
        googleId: updated.googleId || undefined,
        createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : String(updated.createdAt),
        updatedAt: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : String(updated.updatedAt),
      };
    }

    // 2. Insert new user
    const id = `user-${crypto.randomUUID()}`;
    const [inserted] = await db
      .insert(schema.users)
      .values({
        id,
        name: data.name?.trim() || data.email.split("@")[0],
        email: normalizedEmail,
        passwordHash: "",
        salt: "",
        authProvider: "google",
        avatarUrl: data.avatarUrl || null,
        googleId: data.googleId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      email: inserted.email,
      passwordHash: inserted.passwordHash,
      salt: inserted.salt,
      authProvider: "google",
      avatarUrl: inserted.avatarUrl || undefined,
      googleId: inserted.googleId || undefined,
      createdAt: inserted.createdAt instanceof Date ? inserted.createdAt.toISOString() : String(inserted.createdAt),
      updatedAt: inserted.updatedAt instanceof Date ? inserted.updatedAt.toISOString() : String(inserted.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL findOrCreateGoogleUser error:", err);
    throw new Error("Failed to process Google login.");
  }
}

export async function createCase(
  data: Omit<SavedCase, "id" | "createdAt" | "updatedAt">
): Promise<SavedCase> {
  const db = getPostgresDb();
  const id = `case-${crypto.randomUUID()}`;

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    const newCase: SavedCase = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jsonDb.cases.unshift(newCase);
    persistLocalJsonDatabase();
    return newCase;
  }

  try {
    const now = new Date();
    const [inserted] = await db
      .insert(schema.cases)
      .values({
        id,
        userId: data.userId,
        title: data.title,
        rawInput: data.rawInput,
        priority: data.priority,
        inputSources: data.inputSources,
        result: data.result,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return {
      id: inserted.id,
      userId: inserted.userId,
      title: inserted.title,
      rawInput: inserted.rawInput,
      priority: inserted.priority,
      inputSources: inserted.inputSources,
      result: inserted.result,
      createdAt: inserted.createdAt instanceof Date ? inserted.createdAt.toISOString() : String(inserted.createdAt),
      updatedAt: inserted.updatedAt instanceof Date ? inserted.updatedAt.toISOString() : String(inserted.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL createCase error:", err);
    throw new Error("Failed to save case.");
  }
}

export async function getCasesByUserId(userId: string): Promise<SavedCase[]> {
  const db = getPostgresDb();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    return jsonDb.cases.filter((c) => c.userId === userId);
  }

  try {
    const rows = await db
      .select()
      .from(schema.cases)
      .where(eq(schema.cases.userId, userId))
      .orderBy(desc(schema.cases.createdAt));

    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      title: r.title,
      rawInput: r.rawInput,
      priority: r.priority,
      inputSources: r.inputSources,
      result: r.result,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
    }));
  } catch (err) {
    console.error("PostgreSQL getCasesByUserId error:", err);
    throw new Error("Failed to retrieve cases.");
  }
}

export async function getCaseById(id: string, userId: string): Promise<SavedCase | null> {
  const db = getPostgresDb();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    return jsonDb.cases.find((c) => c.id === id && c.userId === userId) || null;
  }

  try {
    const rows = await db
      .select()
      .from(schema.cases)
      .where(and(eq(schema.cases.id, id), eq(schema.cases.userId, userId)))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      userId: r.userId,
      title: r.title,
      rawInput: r.rawInput,
      priority: r.priority,
      inputSources: r.inputSources,
      result: r.result,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL getCaseById error:", err);
    throw new Error("Failed to retrieve case.");
  }
}

export async function deleteCase(id: string, userId: string): Promise<boolean> {
  const db = getPostgresDb();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    const initialLen = jsonDb.cases.length;
    jsonDb.cases = jsonDb.cases.filter((c) => !(c.id === id && c.userId === userId));
    if (jsonDb.cases.length !== initialLen) {
      persistLocalJsonDatabase();
      return true;
    }
    return false;
  }

  try {
    const res = await db
      .delete(schema.cases)
      .where(and(eq(schema.cases.id, id), eq(schema.cases.userId, userId)))
      .returning({ id: schema.cases.id });

    return res.length > 0;
  } catch (err) {
    console.error("PostgreSQL deleteCase error:", err);
    throw new Error("Failed to delete case.");
  }
}

export async function updateCaseActions(
  caseId: string,
  userId: string,
  actions: ActionItem[]
): Promise<SavedCase | null> {
  const db = getPostgresDb();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    const caseItem = jsonDb.cases.find((c) => c.id === caseId && c.userId === userId);
    if (!caseItem) return null;

    caseItem.result.actions = actions;
    caseItem.updatedAt = new Date().toISOString();
    persistLocalJsonDatabase();
    return caseItem;
  }

  try {
    const existing = await getCaseById(caseId, userId);
    if (!existing) return null;

    const updatedResult = {
      ...existing.result,
      actions,
    };
    const now = new Date();

    const [updated] = await db
      .update(schema.cases)
      .set({
        result: updatedResult,
        updatedAt: now,
      })
      .where(and(eq(schema.cases.id, caseId), eq(schema.cases.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      userId: updated.userId,
      title: updated.title,
      rawInput: updated.rawInput,
      priority: updated.priority,
      inputSources: updated.inputSources,
      result: updated.result,
      createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : String(updated.createdAt),
      updatedAt: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : String(updated.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL updateCaseActions error:", err);
    throw new Error("Failed to update case actions.");
  }
}

export async function updateCaseFull(
  caseId: string,
  userId: string,
  data: {
    title?: string;
    priority?: any;
    rawInput?: string;
    result?: any;
    inputSources?: any;
  }
): Promise<SavedCase | null> {
  const db = getPostgresDb();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    const caseItem = jsonDb.cases.find((c) => c.id === caseId && c.userId === userId);
    if (!caseItem) return null;

    if (data.title) caseItem.title = data.title;
    if (data.priority) caseItem.priority = data.priority;
    if (data.rawInput) caseItem.rawInput = data.rawInput;
    if (data.result) caseItem.result = data.result;
    if (data.inputSources) caseItem.inputSources = data.inputSources;
    caseItem.updatedAt = new Date().toISOString();

    persistLocalJsonDatabase();
    return caseItem;
  }

  try {
    const existing = await getCaseById(caseId, userId);
    if (!existing) return null;

    const patch: Partial<typeof schema.cases.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (data.title) patch.title = data.title;
    if (data.priority) patch.priority = data.priority;
    if (data.rawInput) patch.rawInput = data.rawInput;
    if (data.result) patch.result = data.result;
    if (data.inputSources) patch.inputSources = data.inputSources;

    const [updated] = await db
      .update(schema.cases)
      .set(patch)
      .where(and(eq(schema.cases.id, caseId), eq(schema.cases.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      userId: updated.userId,
      title: updated.title,
      rawInput: updated.rawInput,
      priority: updated.priority,
      inputSources: updated.inputSources,
      result: updated.result,
      createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : String(updated.createdAt),
      updatedAt: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : String(updated.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL updateCaseFull error:", err);
    throw new Error("Failed to update case.");
  }
}

export async function updateUserProfile(userId: string, name: string): Promise<User | null> {
  const db = getPostgresDb();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    const user = jsonDb.users.find((u) => u.id === userId);
    if (!user) return null;

    user.name = name.trim();
    user.updatedAt = new Date().toISOString();
    persistLocalJsonDatabase();
    return user;
  }

  try {
    const now = new Date();
    const [updated] = await db
      .update(schema.users)
      .set({
        name: name.trim(),
        updatedAt: now,
      })
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      passwordHash: updated.passwordHash,
      salt: updated.salt,
      authProvider: (updated.authProvider as "email" | "google") || "email",
      avatarUrl: updated.avatarUrl || undefined,
      googleId: updated.googleId || undefined,
      createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : String(updated.createdAt),
      updatedAt: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : String(updated.updatedAt),
    };
  } catch (err) {
    console.error("PostgreSQL updateUserProfile error:", err);
    throw new Error("Failed to update profile.");
  }
}

export async function changeUserPassword(
  userId: string,
  newPasswordHash: string,
  newSalt: string
): Promise<boolean> {
  const db = getPostgresDb();

  if (!db) {
    const jsonDb = initializeLocalJsonDatabase();
    const user = jsonDb.users.find((u) => u.id === userId);
    if (!user) return false;

    user.passwordHash = newPasswordHash;
    user.salt = newSalt;
    user.updatedAt = new Date().toISOString();
    persistLocalJsonDatabase();
    return true;
  }

  try {
    const now = new Date();
    const [updated] = await db
      .update(schema.users)
      .set({
        passwordHash: newPasswordHash,
        salt: newSalt,
        updatedAt: now,
      })
      .where(eq(schema.users.id, userId))
      .returning();

    return !!updated;
  } catch (err) {
    console.error("PostgreSQL changeUserPassword error:", err);
    throw new Error("Failed to change password.");
  }
}

export async function getDashboardStats(userId: string): Promise<DashboardSummaryStats> {
  const casesList = await getCasesByUserId(userId);
  const totalAnalyses = casesList.length;
  const highPriority = casesList.filter(
    (c) => c.priority === "CRITICAL" || c.priority === "HIGH"
  ).length;

  let completedActions = 0;

  for (const c of casesList) {
    if (c.result?.actions) {
      for (const a of c.result.actions) {
        if (a.status === "completed") {
          completedActions += 1;
        }
      }
    }
  }

  const activeCases = casesList.filter(
    (c) =>
      c.result?.actions &&
      c.result.actions.some((a) => a.status !== "completed")
  ).length;

  return {
    totalAnalyses,
    highPriority,
    activeCases: activeCases || (totalAnalyses > 0 ? totalAnalyses : 0),
    completedActions,
  };
}
