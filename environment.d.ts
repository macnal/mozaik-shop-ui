namespace NodeJS {
  interface ProcessEnv {

    API_BASE: string;
    NEXTAUTH_SECRET: string; // not keycloack secret!
    NOTION_TOKEN: string;
    NOTION_PAGES_DATA_SOURCE_ID: string;

    KEYCLOAK_URL: string;
    KEYCLOAK_REALM: string;
    KEYCLOAK_CLIENT_ID: string;
    KEYCLOAK_SECRET: string;
  }
}
