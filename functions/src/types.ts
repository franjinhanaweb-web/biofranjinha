export interface SessionRequest {
  idToken: string;
}

export interface SessionResponse {
  ok: boolean;
  message?: string;
}

export interface LogoutResponse {
  ok: boolean;
  message?: string;
}

export interface CheckResponse {
  ok: boolean;
  hasSession: boolean;
}

export interface FirebaseSessionCookieResponse {
  sessionCookie: string;
}

export interface FirebaseSessionCookieRequest {
  idToken: string;
  validDuration: number;
}
