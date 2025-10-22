
  interface Session {
    access_token: accessToken;
    expires_at: number;
    refresh_token: refreshToken;
  }

  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
  }

