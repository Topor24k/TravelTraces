const AUTH_SESSION_STORAGE_KEY = "traveltraces.authSessionActive";
const LOCAL_AUTH_USER_KEY = "traveltraces.localAuthUserId";
const PASSWORD_MIN_LENGTH = 8;

export type AuthUser = {
  user_id: string;
  email: string;
  group_ids: string[];
  token_expires_at: number;
  created_at?: string;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

type LocalAuthAccount = {
  user_id: string;
  email: string;
  password?: string;
  password_hash?: string;
  group_ids: string[];
  token_expires_at: number;
  created_at: string;
};

async function localDb() {
  return import("./localDb");
}

function authSessionIsMarkedActive() {
  return window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY) === "true";
}

function markAuthSessionActive(userId?: string) {
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, "true");
  if (userId) window.localStorage.setItem(LOCAL_AUTH_USER_KEY, userId);
}

function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(LOCAL_AUTH_USER_KEY);
}

async function hashPrototypePassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function loginWithBackend(email: string, password: string): Promise<AuthUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  if (!normalizedEmail) throw new ApiRequestError("Email is required.", 422);
  if (!normalizedEmail.includes("@")) throw new ApiRequestError("Enter a valid email address.", 422);
  if (normalizedPassword.length < PASSWORD_MIN_LENGTH) {
    throw new ApiRequestError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`, 422);
  }

  const { readLocalTable, upsertLocalRow } = await localDb();
  const account = readLocalTable<LocalAuthAccount>("authSessions").find((row) => row.email === normalizedEmail);
  if (!account) throw new ApiRequestError("No account found. Please create an account first.", 401);
  const candidateHash = await hashPrototypePassword(normalizedPassword);
  const passwordMatches = account.password_hash ? account.password_hash === candidateHash : account.password === normalizedPassword;
  if (!passwordMatches) throw new ApiRequestError("Incorrect password.", 401);
  if (!account.password_hash) {
    upsertLocalRow<LocalAuthAccount>("authSessions", { ...account, password: undefined, password_hash: candidateHash }, (row) => row.user_id);
  }
  const auth = { user_id: account.user_id, email: account.email, group_ids: account.group_ids, token_expires_at: Date.now() + 1000 * 60 * 60 * 24 * 30, created_at: account.created_at };
  markAuthSessionActive(auth.user_id);
  return auth;
}

export async function signupWithBackend(name: string, email: string, password: string): Promise<AuthUser> {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  if (!normalizedName) throw new ApiRequestError("Full name is required.", 422);
  if (!normalizedEmail) throw new ApiRequestError("Email is required.", 422);
  if (!normalizedEmail.includes("@")) throw new ApiRequestError("Enter a valid email address.", 422);
  if (normalizedPassword.length < PASSWORD_MIN_LENGTH) {
    throw new ApiRequestError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`, 422);
  }

  const { readLocalTable, upsertLocalRow } = await localDb();
  const existing = readLocalTable<LocalAuthAccount>("authSessions").find((row) => row.email === normalizedEmail);
  if (existing) throw new ApiRequestError("Email already exists.", 409);
  const auth: AuthUser = {
    user_id: typeof crypto.randomUUID === "function" ? `local-user-${crypto.randomUUID()}` : `local-user-${Date.now()}`,
    email: normalizedEmail,
    group_ids: [],
    token_expires_at: Date.now() + 1000 * 60 * 60 * 24 * 30,
    created_at: new Date().toISOString(),
  };
  upsertLocalRow<LocalAuthAccount>("authSessions", {
    ...auth,
    password_hash: await hashPrototypePassword(normalizedPassword),
    created_at: auth.created_at ?? new Date().toISOString(),
  }, (row) => row.user_id);
  markAuthSessionActive(auth.user_id);
  return auth;
}

export async function logoutFromBackend(): Promise<void> {
  clearAuthSession();
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  if (!authSessionIsMarkedActive()) return null;
  const activeUserId = window.localStorage.getItem(LOCAL_AUTH_USER_KEY);
  const { readLocalTable } = await localDb();
  const account = readLocalTable<LocalAuthAccount>("authSessions").find((row) => row.user_id === activeUserId);
  if (!account) {
    clearAuthSession();
    return null;
  }
  return { user_id: account.user_id, email: account.email, group_ids: account.group_ids, token_expires_at: account.token_expires_at, created_at: account.created_at };
}

export async function deleteAccount(password: string): Promise<{ status: "deleted"; deleted_counts: Record<string, number>; residual_access_removed: boolean }> {
  const activeUserId = window.localStorage.getItem(LOCAL_AUTH_USER_KEY);
  const { deleteLocalUserData, readLocalTable } = await localDb();
  if (activeUserId) {
    const account = readLocalTable<LocalAuthAccount>("authSessions").find((row) => row.user_id === activeUserId);
    const passwordMatches = account
      ? account.password_hash
        ? account.password_hash === await hashPrototypePassword(password)
        : account.password === password
      : false;
    if (!passwordMatches) throw new ApiRequestError("Password confirmation failed.", 401);
    const deletedCounts = deleteLocalUserData(activeUserId);
    clearAuthSession();
    return { status: "deleted", deleted_counts: deletedCounts, residual_access_removed: true };
  }
  clearAuthSession();
  return { status: "deleted", deleted_counts: {}, residual_access_removed: true };
}
