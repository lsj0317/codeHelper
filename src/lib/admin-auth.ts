import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 4; // 4시간

/**
 * 관리자 비밀번호 검증
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

/**
 * 세션 토큰 생성 (비밀번호 + 시크릿 기반 간단 해시)
 */
export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "default";
  const payload = `admin_${secret}_${Date.now()}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 세션 쿠키 설정
 */
export async function setAdminSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * 세션 쿠키 확인
 */
export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/**
 * 세션 쿠키 삭제 (로그아웃)
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
