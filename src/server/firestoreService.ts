import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  Firestore,
} from 'firebase/firestore';
import path from 'path';
import fs from 'fs';
import { Appeal, Organization, ShtabTask, MahallaTask } from '../types.js';

let dbInstance: Firestore | null = null;
let firestoreFailed = false;
let cachedConfig: any = null;

function sanitizeDoc<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function loadConfig(): any {
  if (cachedConfig) return cachedConfig;

  // 1. Try environment variable FIREBASE_CONFIG
  if (process.env.FIREBASE_CONFIG) {
    try {
      cachedConfig = JSON.parse(process.env.FIREBASE_CONFIG);
      return cachedConfig;
    } catch (e) {
      console.warn('⚠️ FIREBASE_CONFIG muhit o‘zgaruvchisini o‘qishda xatolik:', e);
    }
  }

  // 2. Try file firebase-applet-config.json
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    try {
      cachedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return cachedConfig;
    } catch (e) {
      console.warn('⚠️ firebase-applet-config.json faylini o‘qishda xatolik:', e);
    }
  }

  return null;
}

export function getFirestoreInstance(): Firestore | null {
  if (firestoreFailed) return null;
  if (dbInstance) return dbInstance;
  try {
    const config = loadConfig();
    if (!config || !config.projectId) {
      return null;
    }

    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    dbInstance = getFirestore(app, config.firestoreDatabaseId || undefined);
    return dbInstance;
  } catch (err: any) {
    console.warn('⚠️ Firestore initialization fallback to local storage:', err?.message || err);
    firestoreFailed = true;
    return null;
  }
}

export function getFirestoreDatabaseInfo() {
  const config = loadConfig() || {};
  return {
    isConfigured: !!config.projectId,
    projectId: config.projectId || '',
    databaseId: config.firestoreDatabaseId || '(default)',
  };
}

function handleFirestoreError(action: string, err: any) {
  const errMsg = err?.message || String(err);
  console.warn(`⚠️ Firestore ${action} note:`, errMsg);
}

export async function fetchAppealsFromFirestore(): Promise<Appeal[] | null> {
  const db = getFirestoreInstance();
  if (!db) return null;
  try {
    const snapshot = await getDocs(collection(db, 'appeals'));
    if (snapshot.empty) return [];
    const list: Appeal[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Appeal);
    });
    return list;
  } catch (err: any) {
    handleFirestoreError('fetchAppeals', err);
    return null;
  }
}

export async function saveAppealsToFirestore(appeals: Appeal[]): Promise<void> {
  const db = getFirestoreInstance();
  if (!db || !appeals.length) return;
  try {
    const chunkSize = 400;
    for (let i = 0; i < appeals.length; i += chunkSize) {
      const chunk = appeals.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      for (const a of chunk) {
        if (!a.id) continue;
        const ref = doc(db, 'appeals', String(a.id));
        batch.set(ref, sanitizeDoc(a), { merge: true });
      }
      await batch.commit();
    }
    console.log(`✅ [Firestore] ${appeals.length} ta murojaat bulutli bazaga sinxronlandi.`);
  } catch (err: any) {
    handleFirestoreError('saveAppeals', err);
  }
}

export async function saveSingleAppealToFirestore(appeal: Appeal): Promise<void> {
  const db = getFirestoreInstance();
  if (!db || !appeal.id) return;
  try {
    await setDoc(doc(db, 'appeals', String(appeal.id)), sanitizeDoc(appeal), { merge: true });
    console.log(`✅ [Firestore] Murojaat #${appeal.id} bulutli bazaga saqlandi.`);
  } catch (err: any) {
    handleFirestoreError('saveSingleAppeal', err);
  }
}

export async function fetchOrganizationsFromFirestore(): Promise<Organization[] | null> {
  const db = getFirestoreInstance();
  if (!db) return null;
  try {
    const snapshot = await getDocs(collection(db, 'organizations'));
    if (snapshot.empty) return [];
    const list: Organization[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Organization);
    });
    return list;
  } catch (err: any) {
    handleFirestoreError('fetchOrganizations', err);
    return null;
  }
}

export async function saveOrganizationsToFirestore(organizations: Organization[]): Promise<void> {
  const db = getFirestoreInstance();
  if (!db || !organizations.length) return;
  try {
    const chunkSize = 400;
    for (let i = 0; i < organizations.length; i += chunkSize) {
      const chunk = organizations.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      for (const org of chunk) {
        if (!org.id) continue;
        const ref = doc(db, 'organizations', String(org.id));
        batch.set(ref, sanitizeDoc(org), { merge: true });
      }
      await batch.commit();
    }
    console.log(`✅ [Firestore] ${organizations.length} ta tashkilot bulutli bazaga sinxronlandi.`);
  } catch (err: any) {
    handleFirestoreError('saveOrganizations', err);
  }
}

export async function fetchSettingsFromFirestore(): Promise<any | null> {
  const db = getFirestoreInstance();
  if (!db) return null;
  try {
    const d = await getDoc(doc(db, 'settings', 'appConfig'));
    if (!d.exists()) return null;
    return d.data();
  } catch (err: any) {
    handleFirestoreError('fetchSettings', err);
    return null;
  }
}

export async function saveSettingsToFirestore(settings: any): Promise<void> {
  const db = getFirestoreInstance();
  if (!db) return;
  try {
    await setDoc(doc(db, 'settings', 'appConfig'), sanitizeDoc(settings), { merge: true });
    console.log(`✅ [Firestore] Sozlamalar bulutli bazaga saqlandi.`);
  } catch (err: any) {
    handleFirestoreError('saveSettings', err);
  }
}

export async function fetchTasksFromFirestore(): Promise<ShtabTask[] | null> {
  const db = getFirestoreInstance();
  if (!db) return null;
  try {
    const snapshot = await getDocs(collection(db, 'shtab_tasks'));
    if (snapshot.empty) return [];
    const list: ShtabTask[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as ShtabTask);
    });
    return list;
  } catch (err: any) {
    handleFirestoreError('fetchTasks', err);
    return null;
  }
}

export async function saveTasksToFirestore(tasks: ShtabTask[]): Promise<void> {
  const db = getFirestoreInstance();
  if (!db || !tasks.length) return;
  try {
    const chunkSize = 400;
    for (let i = 0; i < tasks.length; i += chunkSize) {
      const chunk = tasks.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      for (const t of chunk) {
        if (!t.id) continue;
        const ref = doc(db, 'shtab_tasks', String(t.id));
        batch.set(ref, sanitizeDoc(t), { merge: true });
      }
      await batch.commit();
    }
    console.log(`✅ [Firestore] ${tasks.length} ta shtab vazifasi bulutli bazaga sinxronlandi.`);
  } catch (err: any) {
    handleFirestoreError('saveTasks', err);
  }
}

export async function saveSingleTaskToFirestore(task: ShtabTask): Promise<void> {
  const db = getFirestoreInstance();
  if (!db || !task.id) return;
  try {
    await setDoc(doc(db, 'shtab_tasks', String(task.id)), sanitizeDoc(task), { merge: true });
  } catch (err: any) {
    handleFirestoreError('saveSingleTask', err);
  }
}

export async function deleteTaskFromFirestore(taskId: string): Promise<void> {
  const db = getFirestoreInstance();
  if (!db || !taskId) return;
  try {
    await deleteDoc(doc(db, 'shtab_tasks', String(taskId)));
  } catch (err: any) {
    handleFirestoreError('deleteTask', err);
  }
}

export async function fetchMahallaTasksFromFirestore(): Promise<MahallaTask[] | null> {
  const db = getFirestoreInstance();
  if (!db) return null;
  try {
    const snapshot = await getDocs(collection(db, 'mahalla_tasks'));
    if (snapshot.empty) return [];
    const list: MahallaTask[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as MahallaTask);
    });
    return list;
  } catch (err: any) {
    handleFirestoreError('fetchMahallaTasks', err);
    return null;
  }
}

export async function saveMahallaTasksToFirestore(tasks: MahallaTask[]): Promise<void> {
  const db = getFirestoreInstance();
  if (!db || !tasks.length) return;
  try {
    const chunkSize = 400;
    for (let i = 0; i < tasks.length; i += chunkSize) {
      const chunk = tasks.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      for (const t of chunk) {
        if (!t.id) continue;
        const ref = doc(db, 'mahalla_tasks', String(t.id));
        batch.set(ref, sanitizeDoc(t), { merge: true });
      }
      await batch.commit();
    }
    console.log(`✅ [Firestore] ${tasks.length} ta mahalla vazifasi bulutli bazaga sinxronlandi.`);
  } catch (err: any) {
    handleFirestoreError('saveMahallaTasks', err);
  }
}

export async function saveSingleMahallaTaskToFirestore(task: MahallaTask): Promise<void> {
  const db = getFirestoreInstance();
  if (!task || !task.id) return;
  try {
    await setDoc(doc(db, 'mahalla_tasks', String(task.id)), sanitizeDoc(task), { merge: true });
  } catch (err: any) {
    handleFirestoreError('saveSingleMahallaTask', err);
  }
}

export async function deleteMahallaTaskFromFirestore(taskId: string): Promise<void> {
  const db = getFirestoreInstance();
  if (!db || !taskId) return;
  try {
    await deleteDoc(doc(db, 'mahalla_tasks', String(taskId)));
  } catch (err: any) {
    handleFirestoreError('deleteMahallaTask', err);
  }
}
