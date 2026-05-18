import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "./en";
import { pl } from "./pl";
import type { Locale } from "./en";

type Lang = "en" | "pl";

const LOCALES: Record<Lang, Locale> = { en, pl };
const STORAGE_KEY = "vf-lang";

interface LangContext {
  t: Locale;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LangContext>({ t: en, lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "pl" ? "pl" : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
  }

  return (
    <Ctx.Provider value={{ t: LOCALES[lang], lang, setLang }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  return useContext(Ctx);
}
