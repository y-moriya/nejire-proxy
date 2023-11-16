function splitCookies(cookieString: string) {
  try {
    return cookieString.split(";");
  } catch (_error) {
    // console.error("Cookie parse failed");
    return [];
  }
}

function getCookieValueForKey(cookies: string[], key: string) {
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(key + "=")) {
      return cookie.substring(key.length + 1);
    }
  }
  return null;
}

function getCookieValue(cookieString: string, key: string) {
  const cookies = splitCookies(cookieString);
  return getCookieValueForKey(cookies, key);
}

export function getHeaders(cookies: string) {
  const loginCookie = getCookieValue(cookies, "login");
  const headers = new Headers();
  headers.append("Cookie", `login=${loginCookie}`);
  return headers;
}
