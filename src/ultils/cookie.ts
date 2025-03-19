import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function setCookie(
  name: string,
  value: string,
  expiresInMinutes?: number | null
) {
  if (expiresInMinutes === null) {
    Cookies.set(name, value, { expires: 36500 });
  } else if (typeof expiresInMinutes === "number") {
    const expiresInDays = expiresInMinutes / (60 * 24);
    Cookies.set(name, value, { expires: expiresInDays });
  } else {
    Cookies.set(name, value);
  }
}

// setCookie("user", "JohnDoe", 60); // Cookie lưu trong 60 phút
// setCookie("theme", "dark", null); // Cookie tồn tại 100 năm
// setCookie("session", "abc123"); // Cookie hết khi đóng trình duyệt

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function deleteCookie(name: string): void {
  Cookies.remove(name);
}

export function decodedCookie(token: string | undefined) {
  if (token) {
    const decoded: any = jwtDecode(token);
    return decoded;
  } else {
    return undefined;
  }
}
