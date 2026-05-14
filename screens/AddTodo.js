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
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { addTodoThunk } from "../redux/todosSlice";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import moment from "moment";
import { useTheme } from "../theme/ThemeContext";

export default function AddTodo() {
  const [name, setName] = React.useState("");
  const [timePicker, setTimePicker] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [timeSelected, setTimeSelected] = React.useState(false);
  const [isToday, setIsToday] = React.useState(false);
  const [withAlert, setWithAlert] = React.useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const handleAlertToggle = async (value) => {
    if (value) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          alert("Notification permissions are required to set alerts.");
          return;
        }
      }
    }
    setWithAlert(value);
  };

  const addTodo = async () => {
    if (!name.trim()) {
      alert("Please enter a task name.");
      return;
    }
    if (!timeSelected) {
      alert("Please select a time for the task.");
      return;
    }
    if (isToday && date <= new Date()) {
      alert("The selected time has already passed. Please pick a future time.");
      return;
    }
    const newTodo = {
      id: Date.now().toString(),
      text: name,
      hour: isToday
        ? date.toISOString()
        : new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      isToday,
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
      dispatch(addTodoThunk(todoToSave));
      navigation.goBack();
    } catch (e) {
      if (__DEV__) console.log(e);
    }
  };

  function onTimeSelected(event, value) {
    if (Platform.OS === "android") {
      setTimePicker(false);
      if (event.type === "set" && value) {
        setDate(value);
        setTimeSelected(true);
      }
    } else {
      if (value) {
        setDate(value);
        setTimeSelected(true);
      }
    }
  }

  const scheduleTodoNotification = async (todo) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "It's time! You have a task to do!!!",
          body: todo.text,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(todo.hour),
        },
      });
      return notificationId;
    } catch (e) {
      if (__DEV__) console.log(e);
      alert("The notification failed to schedule, make sure the hour is valid.");
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Task</Text>
          <View style={[styles.inputContainer, { alignItems: "center" }]}>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Task"
              placeholderTextColor={colors.placeholder}
              onChangeText={setName}
            />
          </View>
          <View style={[styles.inputContainer, { alignItems: "center" }]}>
            <Text style={styles.inputTitle}>Hour</Text>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => setTimePicker(true)}
            >
              <Text style={{ color: colors.primaryButtonText }}>
                {timeSelected ? moment(date).format("LT") : "Pick time"}
              </Text>
            </TouchableOpacity>
          </View>
          {timePicker && (
            <View>
              <DateTimePicker
                value={date}
                mode="time"
                is24Hour={false}
                onChange={onTimeSelected}
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={[styles.button, { marginTop: 0, marginBottom: 20 }]}
                  onPress={() => setTimePicker(false)}
                >
                  <Text style={{ color: colors.primaryButtonText }}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={[styles.inputContainer, { paddingBottom: 0, alignItems: "center" }]}>
            <View>
              <Text style={styles.inputTitle}>Today</Text>
              <Text style={styles.caption}>
                If you disable today, the task will be considered as tomorrow
              </Text>
            </View>
            <Switch
              value={isToday}
              onValueChange={setIsToday}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
          <View style={[styles.inputContainer, { paddingBottom: 0, alignItems: "center" }]}>
            <View>
              <Text style={styles.inputTitle}>Alert</Text>
              <Text style={styles.caption}>
                You will receive an alert at the time you set for this reminder
              </Text>
            </View>
            <Switch
              value={withAlert}
              onValueChange={handleAlertToggle}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={addTodo}>
            <Text style={{ color: colors.primaryButtonText }}>Done</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    title: {
      fontSize: 34,
      fontWeight: "bold",
      marginBottom: 35,
      marginTop: 10,
      color: colors.text,
    },
    textInput: {
      borderBottomColor: colors.divider,
      borderBottomWidth: 1,
      width: "60%",
      paddingBottom: 4,
      color: colors.text,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 30,
    },
    inputTitle: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 24,
      color: colors.text,
    },
    inputContainer: {
      justifyContent: "space-between",
      flexDirection: "row",
      paddingBottom: 30,
    },
    caption: {
      color: colors.captionText,
      fontSize: 12,
      maxWidth: "85%",
      paddingBottom: 10,
    },
    button: {
      marginTop: 30,
      marginBottom: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primaryButton,
      height: 46,
      borderRadius: 11,
    },
    buttonContainer: {
      backgroundColor: colors.primaryButton,
      height: 40,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
    },
  });
