import * as nextAuth from 'next-auth'
import * as nextAuthJwt from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    access_token: accessToken;
    expires_at: number;
    refresh_token: refreshToken;
    error?: string;
  }

  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
  }
}

declare module 'next-auth/jwt' {

}
