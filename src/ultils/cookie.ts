
import Cookies from 'js-cookie';

export function setCookie(
  name: string,
  value: string,
  expiresInMinutes?: number | null
) {
  if (expiresInMinutes === null) {
    
    Cookies.set(name, value, { expires: 36500 });
  } else if (typeof expiresInMinutes === 'number') {
  
    const expiresInDays = expiresInMinutes / (60 * 24);
    Cookies.set(name, value, { expires: expiresInDays });
  } else {
    Cookies.set(name, value);
  }
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function deleteCookie(name: string): void {
  Cookies.remove(name);
}
