import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import moment from "moment";
import i18n from "./index";

const LANG_STORAGE_KEY = "@LanguagePreference";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [preference, setPreferenceState] = useState("system");
  const [hydrated, setHydrated] = useState(false);

  const systemLanguage = () => {
    const code = getLocales()[0]?.languageCode ?? "en";
    return code === "es" ? "es" : "en";
  };

  useEffect(() => {
    AsyncStorage.getItem(LANG_STORAGE_KEY)
      .then((stored) => {
        if (stored === "en" || stored === "es" || stored === "system") {
          setPreferenceState(stored);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const setPreference = async (value) => {
    setPreferenceState(value);
    await AsyncStorage.setItem(LANG_STORAGE_KEY, value);
  };

  const toggle = () => {
    const next = language === "es" ? "en" : "es";
    setPreference(next);
  };

  const language = preference === "system" ? systemLanguage() : preference;

  useEffect(() => {
    if (!hydrated) return;
    i18n.changeLanguage(language);
    moment.locale(language);
  }, [language, hydrated]);

  if (!hydrated) return null;

  return (
    <LanguageContext.Provider value={{ language, preference, setPreference, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
