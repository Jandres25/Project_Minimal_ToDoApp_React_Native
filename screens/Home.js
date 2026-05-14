import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoList from "../component/TodoList";
import { useGetTodos } from "../hooks/useGetTodos";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { hideCompletedReducer } from "../redux/todosSlice";
import * as Notifications from "expo-notifications";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../i18n/LanguageContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Home() {
  useGetTodos();
  const todos = useSelector((state) => state.todos.todos);
  const hideCompleted = useSelector((state) => state.todos.hideCompleted);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { mode, toggle, colors } = useTheme();
  const { t } = useTranslation();
  const { language, toggle: toggleLanguage } = useLanguage();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const firstLaunch = await AsyncStorage.getItem("@FirstLaunch");
      if (firstLaunch) {
        return;
      }
      await AsyncStorage.setItem("@FirstLaunch", "true");
      navigation.navigate("Onboarding");
    } catch (e) {
      if (__DEV__) console.log(e);
    }
  };

  const handleHideCompleted = () => {
    dispatch(hideCompletedReducer());
  };

  const visibleTodos = hideCompleted ? todos.filter((t) => !t.isCompleted) : todos;
  const todayTodos = visibleTodos.filter((todo) =>
    moment(todo.hour).isSame(moment(), "day")
  );
  const tomorrowTodos = visibleTodos.filter((todo) =>
    moment(todo.hour).isSame(moment().add(1, "day"), "day")
  );

  return todos.length > 0 ? (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t("home.today")}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleHideCompleted} style={styles.hideBtn}>
            <Text style={{ color: colors.accent }}>
              {hideCompleted ? t("home.showCompleted") : t("home.hideCompleted")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleLanguage}>
            <Text style={styles.langToggle}>{language === "es" ? "EN" : "ES"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggle}>
            <Ionicons
              name={mode === "dark" ? "sunny-outline" : "moon-outline"}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
      {todayTodos.length > 0 ? (
        <TodoList todosData={todayTodos} />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={require("../assets/nothingToday.png")}
            style={[styles.emptyImage, { tintColor: colors.text }]}
          />
          <Text style={styles.emptyTitle}>{t("home.emptyTodayTitle")}</Text>
          <Text style={styles.emptySubtitle}>{t("home.emptyTodaySubtitle")}</Text>
        </View>
      )}
      <Text style={styles.title}>{t("home.tomorrow")}</Text>
      {tomorrowTodos.length > 0 ? (
        <TodoList todosData={tomorrowTodos} />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={require("../assets/nothingTomorrow.png")}
            style={[styles.emptyImage, { tintColor: colors.text }]}
          />
          <Text style={styles.emptyTitle}>{t("home.emptyTomorrowTitle")}</Text>
          <Text style={styles.emptySubtitle}>{t("home.emptyTomorrowSubtitle")}</Text>
        </View>
      )}
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <View style={styles.emptyFullScreen}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.langToggleAbsolute}>
          <Text style={styles.langToggle}>{language === "es" ? "EN" : "ES"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggle} style={styles.toggleAbsolute}>
          <Ionicons
            name={mode === "dark" ? "sunny-outline" : "moon-outline"}
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <Image
          source={require("../assets/nothing.png")}
          style={[styles.emptyImage, { width: 200, height: 200, tintColor: colors.text }]}
        />
        <Text style={styles.emptyTitle}>{t("home.emptyAllTitle")}</Text>
        <Text style={styles.emptySubtitle}>{t("home.emptyAllSubtitle")}</Text>
      </View>
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
    },
    title: {
      fontSize: 34,
      fontWeight: "bold",
      marginBottom: 35,
      marginTop: 10,
      color: colors.text,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    hideBtn: {},
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyFullScreen: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    emptyImage: {
      width: 150,
      height: 150,
      marginBottom: 20,
      resizeMode: "contain",
    },
    emptyTitle: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "bold",
    },
    emptySubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    toggleAbsolute: {
      position: "absolute",
      top: 10,
      right: 0,
    },
    langToggleAbsolute: {
      position: "absolute",
      top: 10,
      right: 34,
    },
    langToggle: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
  });
