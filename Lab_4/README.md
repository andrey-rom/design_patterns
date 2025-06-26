# Task Manager

A modern, responsive, and UX-friendly Task Manager web app built with **TypeScript** and **Vite**. This project demonstrates advanced software design patterns (including Singleton, Builder, Observer, Command, Strategy, State, Mediator, Decorator, and Memento) in a real-world, maintainable application with a beautiful Material-inspired UI.

## Features

- **Add, update, and delete tasks** with title, description, priority, and status.
- **Status flow:** "To Do" ⇄ "In Progress" → "Completed", with undo/redo support.
- **Undo/Redo** for all task actions (using the Memento pattern).
- **Filter tasks** by status (All, To Do, In Progress, Completed).
- **Modern, responsive UI** with Material Design color palette and dark/light theme support.
- **Priority and status badges** with distinct, visually appealing styles.
- **Keyboard shortcuts** for Undo/Redo.
- **Persistent storage** using localStorage.

## Screenshots

> _Add your screenshots here!_

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone <your-repo-url>
cd laba_2
npm install
```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
laba_2/
  ├── index.html
  ├── package.json
  ├── src/
  │   ├── components/         # UI components (TaskForm, TaskList, etc.)
  │   ├── models/             # Task model and types
  │   ├── patterns/           # All design pattern implementations
  │   │   ├── command/        # Command pattern (Add, Delete, Update, etc.)
  │   │   ├── decorator/      # Decorator pattern for task highlighting
  │   │   ├── observer/       # Observer/Subject interfaces
  │   │   ├── state/          # State pattern for task status
  │   │   ├── strategy/       # Strategy pattern for filtering
  │   │   └── TaskBuilder.ts  # Builder pattern for tasks
  │   ├── services/           # TaskManager (Singleton, Memento), UIMediator (Mediator)
  │   ├── style.css           # Material-inspired, responsive styles
  │   └── main.ts             # App entry point
  └── tsconfig.json
```

## Design Patterns Used

- **Singleton:** `TaskManager` ensures a single source of truth for all tasks.
- **Builder:** `TaskBuilder` for flexible and safe task creation.
- **Observer:** `TaskList` observes `TaskManager` for real-time UI updates.
- **Command:** Encapsulates all task actions (add, delete, update, reset, status change).
- **Strategy:** Filtering logic for task lists (All, To Do, In Progress, Completed).
- **State:** Manages task status transitions and logic.
- **Mediator:** `UIMediator` coordinates UI components (e.g., filters).
- **Decorator:** Adds visual highlighting to tasks based on priority.
- **Memento:** Enables Undo/Redo for all task actions.

## Customization

- **Theme:** Easily switch between dark and light modes.
- **Color Palette:** Uses Material Design colors, easily adjustable in `src/style.css`.

## License

MIT 