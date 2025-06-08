import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../api/supabase";
import type { Session } from "@supabase/supabase-js";

type AuthContext = {
  session: Session | null;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) =>
        setSession(initialSession)
      );
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) =>
      setSession(currentSession)
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }

  return context;
};
