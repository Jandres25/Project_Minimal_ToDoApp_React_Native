import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { light, dark, THEME_STORAGE_KEY } from "./colors";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState("system");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const setPreference = async (value) => {
    setPreferenceState(value);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, value);
  };

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setPreference(next);
  };

  const mode =
    preference === "system" ? (systemScheme ?? "light") : preference;
  const colors = mode === "dark" ? dark : light;

  if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={{ mode, colors, preference, setPreference, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
