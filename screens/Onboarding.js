import React, { useMemo } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Onboarding() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleContinue = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
    if (Notifications.setNotificationChannelAsync) {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("onboarding.title")}</Text>
      <View style={styles.featureContainer}>
        <Image style={[styles.icon, { tintColor: colors.text }]} source={require("../assets/arrows.png")} />
        <View style={{ flex: 1 }}>
          <Text style={styles.subTitle}>{t("onboarding.feature1Title")}</Text>
          <Text style={styles.subHeadline}>{t("onboarding.feature1Body")}</Text>
        </View>
      </View>
      <View style={styles.featureContainer}>
        <Image style={[styles.icon, { tintColor: colors.text }]} source={require("../assets/bell.png")} />
        <View style={{ flex: 1 }}>
          <Text style={styles.subTitle}>{t("onboarding.feature2Title")}</Text>
          <Text style={styles.subHeadline}>{t("onboarding.feature2Body")}</Text>
        </View>
      </View>
      <View style={styles.featureContainer}>
        <Image style={[styles.icon, { tintColor: colors.text }]} source={require("../assets/design.png")} />
        <View style={{ flex: 1 }}>
          <Text style={styles.subTitle}>{t("onboarding.feature3Title")}</Text>
          <Text style={styles.subHeadline}>{t("onboarding.feature3Body")}</Text>
        </View>
      </View>
      <View style={{ flex: 1, alignSelf: "stretch", alignItems: "center", justifyContent: "flex-end", paddingBottom: 20 }}>
        <TouchableOpacity onPress={handleContinue} style={styles.button}>
          <Text style={[styles.subTitle, { color: colors.primaryButtonText }]}>{t("common.continue")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginTop: 40,
      marginBottom: 40,
      color: colors.text,
    },
    subTitle: {
      fontSize: 15,
      fontWeight: "600",
      lineHeight: 22,
      color: colors.text,
    },
    subHeadline: {
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 20,
      color: colors.textMuted,
    },
    featureContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 30,
    },
    icon: {
      width: 42,
      height: 42,
      marginRight: 20,
      resizeMode: "contain",
    },
    button: {
      backgroundColor: colors.primaryButton,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      borderRadius: 12,
    },
  });
