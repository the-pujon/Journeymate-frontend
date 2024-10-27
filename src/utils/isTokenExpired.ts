//import { jwtDecode } from "jwt-decode";

export function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  console.log(jsonPayload);

  return JSON.parse(jsonPayload);
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decodedToken = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return true;
  }
};
