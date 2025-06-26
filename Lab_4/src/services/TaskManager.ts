import { Task } from "../models/Task";
import type { Observer } from "../patterns/observer/Observer";
import type { Subject } from "../patterns/observer/Subject";

// Memento pattern for TaskManager
export class TaskManagerMemento {
    constructor(public readonly tasksSnapshot: Task[]) {}
}

export class TaskManagerHistory {
    private undoStack: TaskManagerMemento[] = [];
    private redoStack: TaskManagerMemento[] = [];

    save(memento: TaskManagerMemento) {
        this.undoStack.push(memento);
        this.redoStack = [];
    }

    undo(current: TaskManagerMemento): TaskManagerMemento | null {
        if (this.undoStack.length === 0) return null;
        this.redoStack.push(current);
        const prev = this.undoStack.pop();
        return prev || null;
    }

    redo(current: TaskManagerMemento): TaskManagerMemento | null {
        if (this.redoStack.length === 0) return null;
        this.undoStack.push(current);
        const next = this.redoStack.pop();
        return next || null;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}

export class TaskManager implements Subject {
    private static instance: TaskManager;
    private tasks: Task[] = [];
    private observers: Observer[] = [];
    private history = new TaskManagerHistory();

    private constructor() {
        this.loadTasks();
        this.saveHistory();
    }

    public static getInstance(): TaskManager {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    removeObserver(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex !== -1) {
            this.observers.splice(observerIndex, 1);
        }
    }

    notifyObservers(): void {
        this.observers.forEach(observer => observer.update(this.tasks));
        this.saveTasks();
    }

    getTasks(): Task[] {
        return this.tasks;
    }

    addTask(task: Task): void {
        this.saveHistory();
        this.tasks.push(task);
        this.notifyObservers();
    }

    removeTask(taskId: string): void {
        this.saveHistory();
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.notifyObservers();
    }

    updateTask(updatedTask: Task): void {
        this.saveHistory();
        const index = this.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.notifyObservers();
        }
    }

    resetAllTasks(): void {
        this.saveHistory();
        this.tasks = [];
        this.notifyObservers();
    }

    private saveTasks(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    private loadTasks(): void {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const plainTasks = JSON.parse(savedTasks);
            this.tasks = plainTasks.map((task: any) => new Task(
                task.id,
                task.title,
                task.description,
                task.priority,
                new Date(task.createdAt),
                task.status
            ));
        }
    }

    // --- Memento pattern integration ---
    private saveHistory() {
        // Save a deep copy of the current tasks
        const snapshot = this.tasks.map(task => new Task(
            task.id,
            task.title,
            task.description,
            task.priority,
            new Date(task.createdAt),
            task.status
        ));
        this.history.save(new TaskManagerMemento(snapshot));
    }

    undo() {
        const current = new TaskManagerMemento(this.tasks.map(task => new Task(
            task.id,
            task.title,
            task.description,
            task.priority,
            new Date(task.createdAt),
            task.status
        )));
        const prev = this.history.undo(current);
        if (prev) {
            this.tasks = prev.tasksSnapshot.map(task => new Task(
                task.id,
                task.title,
                task.description,
                task.priority,
                new Date(task.createdAt),
                task.status
            ));
            this.notifyObservers();
        }
    }

    redo() {
        const current = new TaskManagerMemento(this.tasks.map(task => new Task(
            task.id,
            task.title,
            task.description,
            task.priority,
            new Date(task.createdAt),
            task.status
        )));
        const next = this.history.redo(current);
        if (next) {
            this.tasks = next.tasksSnapshot.map(task => new Task(
                task.id,
                task.title,
                task.description,
                task.priority,
                new Date(task.createdAt),
                task.status
            ));
            this.notifyObservers();
        }
    }
} 