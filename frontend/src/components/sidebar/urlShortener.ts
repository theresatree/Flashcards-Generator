// Updated urlShortener.ts with debugging
export async function shortenUrl(longUrl: string): Promise<string> {
  
  // Check if URL is valid before encoding
  try {
    new URL(longUrl);
  } catch (e) {
    throw new Error(`Invalid URL format: ${longUrl}`);
  }
  
  // Some URL shorteners have issues with hash fragments
  // Let's try encoding the entire URL properly
  const param = encodeURIComponent(longUrl);
  
  const apiUrl = `https://is.gd/create.php?format=json&url=${param}`;
  
  const resp = await fetch(apiUrl);
  
  if (!resp.ok) {
    throw new Error(`Network error: ${resp.status} ${resp.statusText}`);
  }
  
  const data: {
    shorturl?: string;
    errorcode?: number;
    errormessage?: string;
  } = await resp.json();
  
  if (data.errorcode) {
    throw new Error(data.errormessage || "Unknown error from URL shortener");
  }
  
  return data.shorturl!;
}
