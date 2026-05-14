import * as React from "react";
import { FlatList } from "react-native";
import Todo from "./Todo";

function TodoList({ todosData }) {
  return (
    <FlatList
      data={todosData}
      renderItem={({ item }) => <Todo {...item} />}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
    />
  );
}

export default React.memo(TodoList);
