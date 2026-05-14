import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { toggleTodoThunk } from "../redux/todosSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "../theme/ThemeContext";

function Checkbox({ id, isCompleted, isToday }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const handleCheckbox = React.useCallback(() => {
    dispatch(toggleTodoThunk(id));
  }, [id]);

  return isToday ? (
    <TouchableOpacity
      onPress={handleCheckbox}
      style={isCompleted ? styles.checked : styles.unChecked}
    >
      {isCompleted && <Entypo name="check" size={16} color={colors.checkmark} />}
    </TouchableOpacity>
  ) : (
    <View style={styles.isToday} />
  );
}

export default React.memo(Checkbox);

const makeStyles = (colors) =>
  StyleSheet.create({
    checked: {
      width: 20,
      height: 20,
      marginRight: 13,
      borderRadius: 6,
      backgroundColor: colors.checkboxFill,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    unChecked: {
      width: 20,
      height: 20,
      marginRight: 13,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 6,
      backgroundColor: colors.surface,
      marginLeft: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    isToday: {
      width: 10,
      height: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      backgroundColor: colors.dotToday,
      marginRight: 13,
      marginLeft: 15,
    },
  });
