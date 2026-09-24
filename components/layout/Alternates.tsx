"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/routing";

/** Per-page map from locale to the translated document's path. */
export type AlternatePaths = Partial<Record<Locale, string>>;

type Ctx = { alternates: AlternatePaths | null; setAlternates: (a: AlternatePaths | null) => void };

const AlternatesContext = createContext<Ctx>({ alternates: null, setAlternates: () => {} });

export function AlternatesProvider({ children }: { children: ReactNode }) {
  const [alternates, setAlternates] = useState<AlternatePaths | null>(null);
  return (
    <AlternatesContext.Provider value={{ alternates, setAlternates }}>
      {children}
    </AlternatesContext.Provider>
  );
}

export function useAlternates() {
  return useContext(AlternatesContext).alternates;
}

/** Rendered by pages whose slug differs between languages. */
export function SetAlternates({ paths }: { paths: AlternatePaths }) {
  const { setAlternates } = useContext(AlternatesContext);
  const key = JSON.stringify(paths);
  useEffect(() => {
    setAlternates(JSON.parse(key) as AlternatePaths);
    return () => setAlternates(null);
  }, [key, setAlternates]);
  return null;
}
