# Minimal To-Do App

A clean and minimal task management mobile application built with React Native and Expo.

## Features

- Create tasks with a custom time and day (today or tomorrow)
- Mark tasks as completed
- Hide/show completed tasks
- Local notifications as reminders at the scheduled time
- Persistent storage — tasks survive app restarts
- Onboarding screen on first launch

## Tech Stack

| Layer            | Technology                                         |
| ---------------- | -------------------------------------------------- |
| Framework        | React Native 0.81 + Expo 54                        |
| State management | Redux Toolkit + React Redux                        |
| Navigation       | React Navigation v6 (Native Stack)                 |
| Persistence      | AsyncStorage                                       |
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
├── App.js                  # Root component, navigation setup
├── screens/
│   ├── Home.js             # Task list screen (today & tomorrow)
│   ├── AddTodo.js          # Create task screen
│   └── Onboarding.js       # First-launch onboarding
├── component/
│   ├── Todo.js             # Individual task item
│   └── TodoList.js         # FlatList wrapper
├── redux/
│   ├── store.js            # Redux store
│   └── todosSlice.js       # Todos state slice and reducers
├── hooks/
│   └── useGetTodos.js      # Hook to load tasks from AsyncStorage
└── assets/                 # Images and icons
```

## Acknowledgements

Inspired by the [Minimal ToDoApp](https://github.com/betomoedano/Minimal-ToDoApp) series by **Beto Moedano**.
