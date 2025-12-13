import React, { createContext, type PropsWithChildren } from "react";
import {
  useLocation,
  useParams,
  type Location,
  type Params,
} from "react-router";

interface RouterContextProps {
  location: Location;
  params: Params;
}
const AppRouterContext = createContext<RouterContextProps | null>(null);
const AppRouterProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const params = useParams();

  return (
    <AppRouterContext.Provider value={{ location, params }}>
      {children}
    </AppRouterContext.Provider>
  );
};

export { AppRouterProvider, AppRouterContext };
