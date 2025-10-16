import {
  AddItemToCartEvent,
  CartChangeEvent,
  CartEvents,
  RemoveItemFromCartEvent
} from "@/app/@navbar/_components/Navbar.types";

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
      NEXT_PUBLIC_INPOST_TOKEN?: string;
    }
  }

  interface DocumentEventMap {
    [CartEvents.addItem]: AddItemToCartEvent;
    [CartEvents.removeItem]: RemoveItemFromCartEvent;
    [CartEvents.change]: CartChangeEvent;
  }
}

