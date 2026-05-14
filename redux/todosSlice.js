import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
  hideCompleted: false,
};

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodosReducer: (state, action) => {
      state.todos = action.payload;
    },
    addTodoReducer: (state, action) => {
      state.todos.push(action.payload);
    },
    hideCompletedReducer: (state) => {
      state.hideCompleted = !state.hideCompleted;
    },
    updateTodoReducer: (state, action) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.isCompleted = !todo.isCompleted;
      }
    },
    deleteTodoReducer: (state, action) => {
      const id = action.payload;
      const todos = state.todos.filter((todo) => todo.id !== id);
      state.todos = todos;
    },
  },
});

export const {
  setTodosReducer,
  addTodoReducer,
  updateTodoReducer,
  hideCompletedReducer,
  deleteTodoReducer,
} = todosSlice.actions;
export default todosSlice.reducer;
