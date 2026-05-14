import React, { useEffect } from "react";
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

  useEffect(() => {
    requestNotificationPermissions();
    checkFirstLaunch();
  }, []);

  const requestNotificationPermissions = async () => {
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
  };

  const checkFirstLaunch = async () => {
    const firstLaunch = await AsyncStorage.getItem("@FirstLaunch");
    if (firstLaunch) {
      return;
    }
    await AsyncStorage.setItem("@FirstLaunch", "true");
    navigation.navigate("Onboarding");
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity onPress={handleHideCompleted}>
          <Text style={{ color: "#3478F6" }}>
            {hideCompleted ? "Show Completed" : "Hide Completed"}
          </Text>
        </TouchableOpacity>
      </View>
      {todayTodos.length > 0 ? (
        <TodoList todosData={todayTodos} />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Image
            source={require("../assets/nothingTomorrow.png")}
            style={{
              width: 150,
              height: 150,
              marginBottom: 20,
              resizeMode: "contain",
            }}
          />
          <Text style={{ fontSize: 13, color: "#000", fontWeight: "bold" }}>
            CONGRATS!
          </Text>
          <Text style={{ fontSize: 13, color: "#737373", fontWeight: "500" }}>
            You don't have any task, enjoy your day.
          </Text>
        </View>
      )}
      <Text style={styles.title}>Tomorrow</Text>
      {tomorrowTodos.length > 0 ? (
        <TodoList todosData={tomorrowTodos} />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Image
            source={require("../assets/nothingToday.png")}
            style={{
              width: 150,
              height: 150,
              marginBottom: 20,
              resizeMode: "contain",
            }}
          />
          <Text style={{ fontSize: 13, color: "#000", fontWeight: "bold" }}>
            NICE!
          </Text>
          <Text style={{ fontSize: 13, color: "#737373", fontWeight: "500" }}>
            Nothing is scheduled for tomorrow..
          </Text>
        </View>
      )}
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Image
          source={require("../assets/nothing.png")}
          style={{
            width: 200,
            height: 200,
            marginBottom: 20,
            resizeMode: "contain",
          }}
        />
        <Text style={{ fontSize: 13, color: "#000", fontWeight: "bold" }}>
          NICE!
        </Text>
        <Text style={{ fontSize: 13, color: "#737373", fontWeight: "500" }}>
          Nothing is scheduled.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 10,
  },
  pic: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignSelf: "flex-end",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
