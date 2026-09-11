import { SavedCase, SahaayaAnalysisResult, PriorityLevel } from "@/types";

const DB_NAME = "sahaaya_offline_db";
const STORE_NAME = "offline_cases";
const DB_VERSION = 1;
const FALLBACK_KEY = "sahaaya_offline_cases_v1";

interface OfflineCaseSnapshot {
  id: string;
  userId?: string;
  title: string;
  rawInput: string;
  priority: PriorityLevel;
  inputSources: Array<"text" | "voice" | "image" | "document">;
  result: SahaayaAnalysisResult;
  createdAt: string;
  updatedAt: string;
  savedOfflineAt: string;
}

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

function sanitizeForOffline(data: any): OfflineCaseSnapshot {
  const caseId = data.id || `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const title =
    data.title ||
    data.result?.situation?.slice(0, 60) ||
    "Field Case Snapshot";

  return {
    id: caseId,
    userId: data.userId || "local-device",
    title,
    rawInput: data.rawInput || data.result?.situation || "",
    priority: data.priority || data.result?.priority || "MEDIUM",
    inputSources: data.inputSources || data.result?.inputSources || ["text"],
    result: {
      situation: data.result?.situation || "",
      intent: data.result?.intent || "",
      priority: data.result?.priority || data.priority || "MEDIUM",
      whatMayHelp: data.result?.whatMayHelp || [],
      whyRelevant: data.result?.whyRelevant || [],
      informationStillNeeded: data.result?.informationStillNeeded || [],
      documentsNeeded: data.result?.documentsNeeded || [],
      importantInfo: data.result?.importantInfo || [],
      recommendedNextStep: data.result?.recommendedNextStep,
      refinementPrompt: data.result?.refinementPrompt,
      detectedInformation: data.result?.detectedInformation || [],
      verified: data.result?.verified || [],
      needsConfirmation: data.result?.needsConfirmation || [],
      actions: data.result?.actions || [],
      resources: data.result?.resources || [],
      verifiedResources: data.result?.verifiedResources || [],
      warnings: data.result?.warnings || [],
      analyzedAt: data.result?.analyzedAt || new Date().toLocaleTimeString(),
      sourceType: data.result?.sourceType || "text",
      inputSources: data.result?.inputSources || data.inputSources || ["text"],
    },
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    savedOfflineAt: new Date().toISOString(),
  };
}

export async function saveCaseOffline(caseData: any): Promise<OfflineCaseSnapshot> {
  const snapshot = sanitizeForOffline(caseData);

  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(snapshot);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    return snapshot;
  } catch (err) {
    // Fallback to localStorage
    try {
      const existing = getFallbackCases();
      const filtered = existing.filter((c) => c.id !== snapshot.id);
      filtered.unshift(snapshot);
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(filtered));
      return snapshot;
    } catch {
      return snapshot;
    }
  }
}

export async function getOfflineCases(): Promise<OfflineCaseSnapshot[]> {
  try {
    const db = await openIndexedDB();
    return await new Promise<OfflineCaseSnapshot[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        results.sort(
          (a, b) =>
            new Date(b.savedOfflineAt || b.createdAt).getTime() -
            new Date(a.savedOfflineAt || a.createdAt).getTime()
        );
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getFallbackCases();
  }
}

export async function getOfflineCaseById(id: string): Promise<OfflineCaseSnapshot | null> {
  try {
    const db = await openIndexedDB();
    return await new Promise<OfflineCaseSnapshot | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    const cases = getFallbackCases();
    return cases.find((c) => c.id === id) || null;
  }
}

export async function deleteOfflineCase(id: string): Promise<boolean> {
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback
    try {
      const existing = getFallbackCases();
      const filtered = existing.filter((c) => c.id !== id);
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(filtered));
    } catch {
      // Ignored
    }
  }
  return true;
}

export async function isCaseSavedOffline(id: string): Promise<boolean> {
  if (!id) return false;
  const item = await getOfflineCaseById(id);
  return !!item;
}

function getFallbackCases(): OfflineCaseSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
