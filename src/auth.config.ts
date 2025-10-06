import type {NextAuthOptions} from 'next-auth';
import KeycloakProvider from "next-auth/providers/keycloak";

export const authConfig = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/api/sign-in",
  },

  callbacks: {


    // authorized({auth, request: {nextUrl}}) {
    //   const isLoggedIn = !!auth?.user;
    //   const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    //   if (isOnDashboard) {
    //     if (isLoggedIn) return true;
    //     return false; // Redirect unauthenticated users to login page
    //   } else if (isLoggedIn) {
    //     return Response.redirect(new URL('/dashboard', nextUrl));
    //   }
    //   return true;
    // },
  },
  // events: {
  //
  //
  //   async signOut({ token }: { token:any }) {
  //     if (token.provider === "keycloak") {
  //       const issuerUrl =  `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`; //((this).providers.find(p => p.id === "keycloak")).options!.issuer!
  //       const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`);
  //       logOutUrl.searchParams.set("id_token_hint", token.id_token!);
  //
  //       console.log('Robi sie ten event?', token);
  //
  //       void fetch(logOutUrl);
  //     }
  //   }
  // },
  providers: [
    KeycloakProvider({
      clientSecret: process.env.KEYCLOAK_SECRET,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
    })
  ],
} satisfies NextAuthOptions;
