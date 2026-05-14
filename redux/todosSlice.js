import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const initialState = {
  todos: [],
  hideCompleted: false,
};

export const loadTodosThunk = createAsyncThunk("todos/load", async () => {
  const data = await AsyncStorage.getItem("Todos");
  if (!data) return [];
  const parsed = JSON.parse(data);
  const filtered = parsed.filter((item) =>
    moment(item.hour).isSameOrAfter(moment(), "day")
  );
  await AsyncStorage.setItem("Todos", JSON.stringify(filtered));
  return filtered;
});

export const addTodoThunk = createAsyncThunk(
  "todos/add",
  async (todo, { getState }) => {
    const { todos } = getState().todos;
    await AsyncStorage.setItem("Todos", JSON.stringify([...todos, todo]));
    return todo;
  }
);

export const toggleTodoThunk = createAsyncThunk(
  "todos/toggle",
  async (id, { getState }) => {
    const { todos } = getState().todos;
    const updated = todos.map((t) =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    await AsyncStorage.setItem("Todos", JSON.stringify(updated));
    return id;
  }
);

export const deleteTodoThunk = createAsyncThunk(
  "todos/delete",
  async (id, { getState }) => {
    const { todos } = getState().todos;
    const updated = todos.filter((t) => t.id !== id);
    await AsyncStorage.setItem("Todos", JSON.stringify(updated));
    return id;
  }
);

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    hideCompletedReducer: (state) => {
      state.hideCompleted = !state.hideCompleted;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTodosThunk.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(addTodoThunk.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(toggleTodoThunk.fulfilled, (state, action) => {
        const todo = state.todos.find((t) => t.id === action.payload);
        if (todo) todo.isCompleted = !todo.isCompleted;
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      });
  },
});

export const { hideCompletedReducer } = todosSlice.actions;
export default todosSlice.reducer;
