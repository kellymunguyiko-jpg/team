import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../lib/firebase";
import type { TeamMember, Skill, Project, AboutInfo } from "../types";

function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function cleanUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val === undefined) continue;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      out[key] = cleanUndefined(val as Record<string, unknown>);
    } else {
      out[key] = val;
    }
  }
  return out;
}

// ---------- Team ----------
export async function getTeamMembers(): Promise<TeamMember[]> {
  const snap = await getDocs(collection(db, "team"));
  return sortByOrder(
    snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember))
  );
}

export function subscribeTeam(cb: (data: TeamMember[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, "team"),
    (snap) => {
      cb(
        sortByOrder(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember))
        )
      );
    },
    (err) => {
      console.error("Team subscription error:", err);
      cb([]);
    }
  );
}

export async function addTeamMember(
  data: Omit<TeamMember, "id">
): Promise<string> {
  const payload = cleanUndefined({ ...data } as Record<string, unknown>);
  const docRef = await addDoc(collection(db, "team"), payload);
  return docRef.id;
}

export async function updateTeamMember(
  id: string,
  data: Partial<TeamMember>
): Promise<void> {
  const { id: _id, ...rest } = data as TeamMember;
  await updateDoc(
    doc(db, "team", id),
    cleanUndefined({ ...rest } as Record<string, unknown>)
  );
}

export async function deleteTeamMember(id: string): Promise<void> {
  await deleteDoc(doc(db, "team", id));
}

// ---------- Skills ----------
export async function getSkills(): Promise<Skill[]> {
  const snap = await getDocs(collection(db, "skills"));
  return sortByOrder(
    snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill))
  );
}

export function subscribeSkills(cb: (data: Skill[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, "skills"),
    (snap) => {
      cb(
        sortByOrder(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill)))
      );
    },
    (err) => {
      console.error("Skills subscription error:", err);
      cb([]);
    }
  );
}

export async function addSkill(data: Omit<Skill, "id">): Promise<string> {
  const payload = cleanUndefined({
    ...data,
    percentage: Number(data.percentage) || 0,
  } as Record<string, unknown>);
  const docRef = await addDoc(collection(db, "skills"), payload);
  return docRef.id;
}

export async function updateSkill(
  id: string,
  data: Partial<Skill>
): Promise<void> {
  const { id: _id, ...rest } = data as Skill;
  const payload = cleanUndefined({
    ...rest,
    ...(rest.percentage !== undefined
      ? { percentage: Number(rest.percentage) || 0 }
      : {}),
  } as Record<string, unknown>);
  await updateDoc(doc(db, "skills", id), payload);
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db, "skills", id));
}

// ---------- Projects ----------
export async function getProjects(): Promise<Project[]> {
  const snap = await getDocs(collection(db, "projects"));
  return sortByOrder(
    snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
  );
}

export function subscribeProjects(cb: (data: Project[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, "projects"),
    (snap) => {
      cb(
        sortByOrder(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
        )
      );
    },
    (err) => {
      console.error("Projects subscription error:", err);
      cb([]);
    }
  );
}

export async function addProject(data: Omit<Project, "id">): Promise<string> {
  const payload = cleanUndefined({
    ...data,
    tags: data.tags || [],
    featured: !!data.featured,
    createdAt: Date.now(),
  } as Record<string, unknown>);
  const docRef = await addDoc(collection(db, "projects"), payload);
  return docRef.id;
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<void> {
  const { id: _id, ...rest } = data as Project;
  await updateDoc(
    doc(db, "projects", id),
    cleanUndefined({ ...rest } as Record<string, unknown>)
  );
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// ---------- About ----------
export async function getAbout(): Promise<AboutInfo | null> {
  const snap = await getDoc(doc(db, "about", "main"));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as AboutInfo;
}

export function subscribeAbout(
  cb: (data: AboutInfo | null) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, "about", "main"),
    (snap) => {
      if (!snap.exists()) {
        cb(null);
        return;
      }
      cb({ id: snap.id, ...snap.data() } as AboutInfo);
    },
    (err) => {
      console.error("About subscription error:", err);
      cb(null);
    }
  );
}

export async function saveAbout(data: Omit<AboutInfo, "id">): Promise<void> {
  const payload = cleanUndefined({ ...data } as Record<string, unknown>);
  await setDoc(doc(db, "about", "main"), payload, { merge: true });
}

// ---------- Image Upload ----------
function guessContentType(file: File): string {
  if (file.type && file.type.startsWith("image/")) return file.type;
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    avif: "image/avif",
  };
  return map[ext] || "image/jpeg";
}

export async function uploadImage(
  file: File,
  folder: string = "uploads",
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!file) throw new Error("No file selected");
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be under 10MB");
  }

  const contentType = guessContentType(file);
  if (!contentType.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const safeFolder = (folder || "uploads").replace(/[^a-zA-Z0-9/_-]/g, "");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const name = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const storageRef = ref(storage, name);
  const metadata = { contentType };

  // Prefer resumable upload (better progress + reliability)
  if (onProgress) {
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file, metadata);
      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          onProgress(pct);
        },
        (err) => reject(err),
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  }

  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    if (!url || !url.includes("firebasestorage")) return;
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore if not found or external URL
  }
}

export function formatFirebaseError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes("permission-denied") || raw.includes("PERMISSION_DENIED")) {
    return "Permission denied. Publish open Firestore & Storage rules in Firebase Console.";
  }
  if (raw.includes("storage/unauthorized")) {
    return "Storage unauthorized. Publish storage.rules in Firebase Console → Storage → Rules.";
  }
  if (raw.includes("storage/unknown") || raw.includes("storage/retry-limit")) {
    return "Storage error. Enable Storage in Firebase Console and publish rules.";
  }
  if (raw.includes("storage/object-not-found")) {
    return "File not found in Storage.";
  }
  if (raw.includes("auth/")) {
    return "Auth error. Enable Email/Password and create a user in Firebase Authentication.";
  }
  if (raw.includes("offline") || raw.includes("unavailable")) {
    return "Network/Firebase unavailable. Check internet and project setup.";
  }
  return raw.replace("FirebaseError: ", "").slice(0, 180);
}
