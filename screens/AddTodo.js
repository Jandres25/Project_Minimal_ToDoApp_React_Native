import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { addTodoReducer } from "../redux/todosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

export default function AddTodo() {
  const [name, setName] = React.useState("");
  const [timePicker, setTimePicker] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [isToday, setIsToday] = React.useState(false);
  const [withAlert, setWithAlert] = React.useState(false);
  // const [listTodos, setListTodos] = React.useState([]);
  const listTodos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const addTodo = async () => {
    const newTodo = {
      id: Date.now().toString(),
      text: name,
      hour: isToday
        ? date.toISOString()
        : new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      isToday: isToday,
      isCompleted: false,
    };
    try {
      let todoToSave = newTodo;
      if (withAlert) {
        const notificationId = await scheduleTodoNotification(newTodo);
        if (notificationId) {
          todoToSave = { ...newTodo, notificationId };
        }
      }
      await AsyncStorage.setItem(
        "Todos",
        JSON.stringify([...listTodos, todoToSave])
      );
      dispatch(addTodoReducer(todoToSave));
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  function showTimePicker() {
    setTimePicker(true);
  }

  function onTimeSelected(event, value) {
    setDate(value);
    setTimePicker(false);
  }

  const scheduleTodoNotification = async (todo) => {
    const triggerDate = new Date(todo.hour);
    if (triggerDate <= new Date()) {
      alert("The alert time has already passed. Please select a future time.");
      return;
    }
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "It's time! You have a task to do!!!",
          body: todo.text,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });
      return notificationId;
    } catch (e) {
      console.log(e);
      alert("The notification failed to schedule, make sure the hour is valid.");
      return null;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add Task</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Task"
            placeholderTextColor="#00000030"
            onChangeText={(text) => {
              setName(text);
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Hour</Text>
          {timePicker && (
            <DateTimePicker
              value={date}
              mode={"time"}
              is24Hour={false}
              onChange={onTimeSelected}
              display={Platform.OS === "ios" ? "spinner" : "default"}
            />
          )}
          {!timePicker && (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={showTimePicker}
            >
              <Text style={{ color: "white" }}>Time</Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: 0, alignItems: "center" },
          ]}
        >
          <View>
            <Text style={styles.inputTitle}>Today</Text>
            <Text
              style={{
                color: "#00000040",
                fontSize: 12,
                maxWidth: "85%",
                paddingBottom: 10,
              }}
            >
              If you disable today, the task will be considered as tomorrow
            </Text>
          </View>
          <Switch
            value={isToday}
            onValueChange={(value) => {
              setIsToday(value);
            }}
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: 0, alignItems: "center" },
          ]}
        >
          <View>
            <Text style={styles.inputTitle}>Alert</Text>
            <Text style={{ color: "#00000040", fontSize: 12, maxWidth: "85%" }}>
              You will receive an alert at the time you set for this reminder
            </Text>
          </View>
          <Switch
            value={withAlert}
            onValueChange={(value) => {
              setWithAlert(value);
            }}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={{ color: "white" }}>Done</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 10,
  },
  textInput: {
    borderBottomColor: "#00000030",
    borderBottomWidth: 1,
    width: "80%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 30,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
  },
  inputContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 30,
  },
  button: {
    marginTop: 30,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    height: 46,
    borderRadius: 11,
  },
  buttonContainer: {
    backgroundColor: "#000000",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});
