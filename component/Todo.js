import moment from "moment";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Checkbox from "./Checkbox";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodoReducer } from "../redux/todosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export default function Todo({ id, text, isCompleted, hour, notificationId }) {
  const thisTodoIsToday = hour ? moment(hour).isSame(moment(), "day") : false;
  const todos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();

  const handleDeletedTodo = async () => {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      await AsyncStorage.setItem(
        "Todos",
        JSON.stringify(todos.filter((todo) => todo.id !== id))
      );
      dispatch(deleteTodoReducer(id));
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox
          id={id}
          text={text}
          hour={hour}
          isCompleted={isCompleted}
          isToday={thisTodoIsToday}
        />
        <View>
          <Text
            selectable
            style={
              isCompleted
                ? [
                  styles.text,
                  { textDecorationLine: "line-through", color: "#73737330" },
                ]
                : styles.text
            }
          >
            {text}
          </Text>
          <Text
            style={
              isCompleted
                ? [
                  styles.time,
                  { textDecorationLine: "line-through", color: "#73737330" },
                ]
                : styles.time
            }
          >
            {moment(hour).format("LT")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleDeletedTodo}>
        <MaterialIcons name="delete-outline" size={24} color="#73737340" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#737373",
  },
  time: {
    fontSize: 13,
    color: "#a3a3a3",
    fontWeight: "500",
  },
});
