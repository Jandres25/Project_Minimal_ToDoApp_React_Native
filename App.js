import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Home from "./screens/Home";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import AddTodo from "./screens/AddTodo";
import Onboarding from "./screens/Onboarding";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import React, { useMemo } from "react";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useTranslation } from "react-i18next";
import "./i18n";

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <Home />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Add")}
      >
        <Text style={styles.plus} adjustsFontSizeToFit>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ThemedApp() {
  const { mode, colors } = useTheme();
  const { t } = useTranslation();

  const navTheme = useMemo(() => ({
    ...(mode === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  }), [mode, colors]);

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add"
            component={AddTodo}
            options={{
              presentation: "modal",
              headerTitle: t("addTodo.headerTitle"),
            }}
          />
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <SafeAreaProvider>
            <ThemedApp />
          </SafeAreaProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    button: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primaryButton,
      position: "absolute",
      bottom: 40,
      right: 20,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    },
    plus: {
      fontSize: 32,
      color: colors.primaryButtonText,
      lineHeight: 36,
    },
  });
