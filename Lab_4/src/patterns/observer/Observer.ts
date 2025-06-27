import type { Task } from "../../models/Task";

export interface Observer {
    update(tasks: Task[]): void;
} 