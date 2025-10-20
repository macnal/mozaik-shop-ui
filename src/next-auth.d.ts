import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // access_token: accessToken;

    accessToken: accessToken;
    accessTokenExpires: number;
    refreshToken: refreshToken;

    // user: DefaultSession["user"];
  }

  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
  }
}

