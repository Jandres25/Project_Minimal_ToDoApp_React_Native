import * as React from "react";
import { useDispatch } from "react-redux";
import { loadTodosThunk } from "../redux/todosSlice";

export const useGetTodos = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(loadTodosThunk());
  }, []);
};
