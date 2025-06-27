import type { Task } from "../../models/Task";

export interface FilterStrategy {
    filter(tasks: Task[]): Task[];
} 