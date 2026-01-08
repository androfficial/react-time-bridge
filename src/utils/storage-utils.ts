/**
 * Safe wrappers around Web Storage (localStorage).
 *
 * In some environments (private mode, restricted iframes, etc.) localStorage access can throw.
 */

export const safeStorageGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeStorageSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};
