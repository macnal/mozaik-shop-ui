import {AddItemToCartEvent, CartEvents} from "@/components/global/Navbar.types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_URL: string;
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

  interface DocumentEventMap {
    [CartEvents.addItem]: AddItemToCartEvent;
  }
}

