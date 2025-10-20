import type {NextAuthOptions} from 'next-auth';
import KeycloakProvider from "next-auth/providers/keycloak";
import {clearCart, maybeMergeCart} from "@/utils/cart";
import {JWT} from "next-auth/jwt";

async function refreshAccessToken(token: JWT) {
  try {
    const url = //realms/test/protocol/openid-connect/token
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Authorization: `Bearer ${token.accessToken}`,
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        refresh_token: token.refreshToken as string,
        grant_type: "refresh_token",
      }).toString(),
    });

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authConfig = {
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/api/sign-in",
  },
  events: {
    async signIn({user, account, }) {
      await maybeMergeCart({user, account});
    },

    async signOut() {
      await clearCart();
    }
  },
  callbacks: {
    async jwt({token, account}) {
      if (account) {

        token = Object.assign({}, token, {
          // access_token: account.access_token,
          accessToken: account.access_token,
          accessTokenExpires: (account.expires_at as number) * 1000, // Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,

        });
      }

      if (+Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({session, token}) {
      if (session) {
        session = Object.assign({}, session, {
          accessToken: token.accessToken,
          accessTokenExpires: token.accessTokenExpires, // new Date(token.accessTokenExpires!), // Date.now() + account.expires_at * 1000,
          refreshToken: token.refreshToken,
        })
      }

      return session
    }
  },
  providers: [
    KeycloakProvider({
      clientSecret: process.env.KEYCLOAK_SECRET,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
    })
  ],
} satisfies NextAuthOptions;
