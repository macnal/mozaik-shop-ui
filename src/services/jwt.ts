import {JWT} from "next-auth/jwt";

export async function refreshAccessToken(token: JWT) {
  try {
    const url = //realms/test/protocol/openid-connect/token
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`
    console.log('refreshAccessToken11 =>', token.refresh_token)
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Authorization: `Bearer ${token.accessToken}`,
      },
      method: "POST",
      body: new URLSearchParams({
        // grant_type=urn:ietf:params:oauth:grant-type:token-exchange&
        // subject_token=$SUBJECT_TOKEN&
        // subject_token_type=urn:ietf:params:oauth:token-type:access_token&
        // requested_token_type=urn:ietf:params:oauth:token-type:access_token

        refresh_token: token.refresh_token as string,
        grant_type: "refresh_token",

        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_SECRET as string,
      }).toString(),
    });

    const refreshedTokens = await response.json()

    console.log('refreshAccessToken -', refreshedTokens);

    return refreshedTokens
  } catch (error) {

    return {
      error: "RefreshAccessTokenError",
    }
  }
}
