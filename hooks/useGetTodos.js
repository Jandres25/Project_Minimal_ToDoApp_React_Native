import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setTodosReducer } from "../redux/todosSlice";
import { useDispatch } from "react-redux";
import moment from "moment";

export const useGetTodos = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem("Todos");
        if (todos !== null) {
          const todosData = JSON.parse(todos);
          // Remove todos whose date has already passed
          const todosDataFiltered = todosData.filter((item) =>
            moment(item.hour).isSameOrAfter(moment(), "day")
          );
          await AsyncStorage.setItem("Todos", JSON.stringify(todosDataFiltered));
          dispatch(setTodosReducer(todosDataFiltered));
        }
      } catch (e) {
        console.log(e);
      }
    };
    getTodos();
  }, []);
  return;
};
