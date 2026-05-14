# Minimal To-Do App

A clean and minimal task management mobile application built with React Native and Expo.

## Features

- Create tasks with a name, time and day (today or tomorrow)
- Mark tasks as completed (only available for today's tasks)
- Hide/show completed tasks
- Delete tasks
- Local notifications as reminders at the scheduled time
- Persistent storage — tasks survive app restarts
- Expired tasks (past days) are automatically removed on launch
- Onboarding screen on first launch

## Tech Stack

| Layer            | Technology                                         |
| ---------------- | -------------------------------------------------- |
| Framework        | React Native 0.81 + Expo 54                        |
| State management | Redux Toolkit (slice + async thunks) + React Redux |
| Navigation       | React Navigation v6 (Native Stack)                 |
| Persistence      | AsyncStorage (managed via Redux thunks)            |
| Notifications    | expo-notifications                                 |
| Date handling    | moment.js + @react-native-community/datetimepicker |

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your physical device, or an Android/iOS simulator

### Installation

```bash
git clone https://github.com/Jandres25/Project_Minimal_ToDoApp_React_Native.git
cd Project_Minimal_ToDoApp_React_Native
pnpm install
```

### Running the app

```bash
# Start the development server
pnpm start

# Run on Android
pnpm android

# Run on iOS
pnpm ios
```

## Project Structure

```
├── App.js                  # Root component, navigation setup, StatusBar
├── screens/
│   ├── Home.js             # Task list screen (today & tomorrow sections)
│   ├── AddTodo.js          # Create task screen with validation
│   └── Onboarding.js       # First-launch onboarding
├── component/
│   ├── Todo.js             # Individual task item (memoized)
│   ├── TodoList.js         # FlatList wrapper (memoized)
│   └── Checkbox.js         # Completion checkbox (memoized)
├── redux/
│   ├── store.js            # Redux store
│   └── todosSlice.js       # Todos slice: reducers + async thunks for persistence
├── hooks/
│   └── useGetTodos.js      # Hook to trigger todo loading on mount
└── assets/                 # Images and icons
```

## Data model

Each task is stored as a JSON object in AsyncStorage under the key `"Todos"`:

```json
{
  "id": "1715700000000",
  "text": "Buy groceries",
  "hour": "2024-05-14T15:00:00.000Z",
  "isToday": true,
  "isCompleted": false,
  "notificationId": "abc123"
}
```

| Field            | Type    | Description                                          |
| ---------------- | ------- | ---------------------------------------------------- |
| `id`             | string  | `Date.now()` at creation time — unique per task      |
| `text`           | string  | Task name                                            |
| `hour`           | string  | ISO 8601 datetime string                             |
| `isToday`        | boolean | Whether the task was scheduled for today             |
| `isCompleted`    | boolean | Completion state                                     |
| `notificationId` | string? | Expo notification ID, present only when alert is set |

## Architecture notes

- **Persistence via thunks** — all AsyncStorage reads and writes live in `todosSlice.js` as `createAsyncThunk` actions. Components only dispatch thunks and never touch AsyncStorage directly.
- **`hideCompleted` as a flag** — completed tasks are filtered in the view layer, not removed from the store, so they can be shown again without reloading from disk.
- **Notification lifecycle** — when a task with an alert is deleted, its scheduled notification is cancelled via `Notifications.cancelScheduledNotificationAsync`.

## Acknowledgements

Inspired by the [Minimal ToDoApp](https://github.com/betomoedano/Minimal-ToDoApp) series by **Beto Moedano**.
