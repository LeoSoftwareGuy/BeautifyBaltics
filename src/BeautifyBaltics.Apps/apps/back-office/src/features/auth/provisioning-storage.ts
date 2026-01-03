const STORAGE_KEY = 'bb.pendingProvision';

export type PendingProvisionPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'client' | 'master';
};

export const savePendingProvision = (payload: PendingProvisionPayload) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
};

export const loadPendingProvision = (): PendingProvisionPayload | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingProvisionPayload) : null;
  } catch {
    return null;
  }
};

export const clearPendingProvision = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
