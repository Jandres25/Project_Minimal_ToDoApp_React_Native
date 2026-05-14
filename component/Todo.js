import moment from "moment";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Checkbox from "./Checkbox";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { deleteTodoThunk } from "../redux/todosSlice";
import * as Notifications from "expo-notifications";
import { useTheme } from "../theme/ThemeContext";

function Todo({ id, text, isCompleted, hour, notificationId }) {
  const thisTodoIsToday = hour ? moment(hour).isSame(moment(), "day") : false;
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const handleDeletedTodo = React.useCallback(async () => {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      dispatch(deleteTodoThunk(id));
    } catch (e) {
      if (__DEV__) console.log(e);
    }
  }, [id, notificationId]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox
          id={id}
          isCompleted={isCompleted}
          isToday={thisTodoIsToday}
        />
        <View>
          <Text
            selectable
            style={
              isCompleted
                ? [styles.text, { textDecorationLine: "line-through", color: colors.textDisabled }]
                : styles.text
            }
          >
            {text}
          </Text>
          <Text
            style={
              isCompleted
                ? [styles.time, { textDecorationLine: "line-through", color: colors.textDisabled }]
                : styles.time
            }
          >
            {moment(hour).format("LT")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleDeletedTodo}>
        <MaterialIcons name="delete-outline" size={24} color={colors.textDisabled} />
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(Todo);

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    text: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    time: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: "500",
    },
  });
