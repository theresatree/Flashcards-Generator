const GEMINI_API_KEY_STORAGE_KEY = "GEMINI_API_KEY";
const HF_API_KEY_STORAGE_KEY = "HF_API_KEY";


export function getGeminiApiKey(): string {
  const key = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
  if (key && key.trim() !== "") {
    return key;
  }
  return ""; // means not found
}

export function getHFApiKey(): string {
  const key = localStorage.getItem(HF_API_KEY_STORAGE_KEY);
  if (key && key.trim() !== "") {
    return key;
  }
  return ""; // means not found
}




/**
 * Save or update the API key.
 */
export function setGeminiApiKey(key: string) {
  localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());
}

export function setHFApiKey(key: string) {
  localStorage.setItem(HF_API_KEY_STORAGE_KEY, key.trim());
}


