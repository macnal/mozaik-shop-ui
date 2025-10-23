'use client'
import {createContext, PropsWithChildren, useContext} from "react";
import config from "@/../public/config.json";

export const AppConfigContext = createContext(config)

export const useAppConfig = () => {
  const config = useContext(AppConfigContext);

  return config;
}

export const AppConfigContextProvider = ({children}: PropsWithChildren) => <AppConfigContext.Provider value={config}>
  {children}
</AppConfigContext.Provider>
