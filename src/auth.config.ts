import type {NextAuthOptions} from 'next-auth';
import KeycloakProvider from "next-auth/providers/keycloak";
import {clearCart, maybeMergeCart} from "@/utils/cart";

export const authConfig = {
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/api/sign-in",
  },
  events: {
    async signIn({user, account}) {
      await maybeMergeCart({user});
    },

    async signOut() {
      await clearCart();
    }
  },
  callbacks: {
    async jwt({token, account}) {
      if (account) {
        token = Object.assign({}, token, { access_token: account.access_token });
      }
      return token
    },
    async session({session, token}) {
      if(session) {
        session = Object.assign({}, session, {access_token: token.access_token})
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
