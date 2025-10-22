import type {NextAuthConfig} from 'next-auth';
import KeycloakProvider from "next-auth/providers/keycloak";
import {clearCart, maybeMergeCart} from "@/utils/cart";
import {refreshAccessToken} from './services/jwt';


class NoRefreshTokenError extends Error {
  constructor(message = '') {
    super(message);
    this.name = "NoRefreshTokenError";
  }
}

export const authConfig = {
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/api/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn({account}) {
      await maybeMergeCart({account});
    },
    async signOut() {
      await clearCart();
      ///realms/{realm-name}/protocol/openid-connect/logout
    },
  },
  callbacks: {
    async jwt({token, account}) {
      if (account) {

        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        }
      } else if (Date.now() < (token.expires_at as number) * 1000) {


        return token
      } else {
        try {
          console.log('REFRESH_TOKENA', {
            stary_access_token: token?.access_token,
            stary_refresh_token: token?.refresh_token
          });

          // Subsequent logins, but the `access_token` has expired, try to refresh it
          if (!token.refresh_token) {
            throw new NoRefreshTokenError();
          }

          const refreshedTokens = await refreshAccessToken(token);

          console.log('REFRESH_TOKENA', {
            nowy_access_token: refreshedTokens?.access_token,
            nowy_refresh_token: refreshedTokens?.refresh_token
          })

          if (refreshedTokens.error) {
            throw refreshedTokens;
          }

          return {
            ...token,
            access_token: refreshedTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
            // Some providers only issue refresh tokens once, so preserve if we did not get a new one
            refresh_token: refreshedTokens.refresh_token
              ? refreshedTokens.refresh_token
              : token.refreshToken,
          }
        } catch (error) {
          // console.error("Error refreshing access_token", error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          // token.error = "RefreshTokenError"

          if (error instanceof NoRefreshTokenError) {
            return {
              error: `NoRefreshTokenError`
            }
          }

          return {
            error: `RefreshTokenError`
          }
        }
      }
    },
    async session({session, token}) {
      session.error = token.error as string;
      session.access_token = token.access_token;
      return session
    },

    //
    // async jwt({token, account}) {
    //   if (account) {
    //     console.log(account);
    //     token = Object.assign({}, token, {
    //       accessToken: account.access_token,
    //       accessTokenExpires: (account.expires_at as number) * 1000, // Date.now() + account.expires_at * 1000,
    //       refreshToken: account.refresh_token,
    //       idToken: account.id_token,
    //       tokenType: account.token_type,
    //     });
    //   }
    //
    //   if (!token.refreshToken) throw new TypeError("Missing refresh_token")
    //
    //   const tokenExpired = +Date.now() >= (token.accessTokenExpires as number);
    //   console.log('tokenExpired', tokenExpired);
    //
    //   if (!tokenExpired) {
    //     return token
    //   }
    //
    //   const refreshedTokens = await refreshAccessToken(token);
    //
    //   token = Object.assign({}, token, {
    //     accessToken: refreshedTokens.access_token,
    //     accessTokenExpires: (refreshedTokens.expires_at as number) * 1000, // Date.now() + account.expires_at * 1000,
    //     refreshToken: refreshedTokens.refresh_token,
    //     idToken: refreshedTokens.id_token,
    //     tokenType: refreshedTokens.token_type,
    //   });
    //   return token
    // },
    // async session({session, token}) {
    //   if (session) {
    //     session = Object.assign({}, session, {
    //       accessToken: token.accessToken,
    //       accessTokenExpires: token.accessTokenExpires, // new Date(token.accessTokenExpires!), // Date.now() + account.expires_at * 1000,
    //       refreshToken: token.refreshToken,
    //       idToken: token.idToken,
    //       tokeType: token.tokenType,
    //     })
    //   }
    //
    //   return session;
    // }
  },
  providers: [
    KeycloakProvider({
      clientSecret: process.env.KEYCLOAK_SECRET,
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
    })
  ],
} satisfies NextAuthConfig;
