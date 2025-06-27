import { Task } from "../models/Task";
import type { Observer } from "../patterns/observer/Observer";
import type { Subject } from "../patterns/observer/Subject";

export class TaskManager implements Subject {
    private static instance: TaskManager;
    private tasks: Task[] = [];
    private observers: Observer[] = [];

    private constructor() {
        this.loadTasks();
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
        this.tasks.push(task);
        this.notifyObservers();
    }

    removeTask(taskId: string): void {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.notifyObservers();
    }

    updateTask(updatedTask: Task): void {
        const index = this.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.notifyObservers();
        }
    }

    resetAllTasks(): void {
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
} 