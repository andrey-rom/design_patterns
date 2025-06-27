import type { FilterStrategy } from "./FilterStrategy";
import type { Task } from "../models/Task";

export class CompletedFilterStrategy implements FilterStrategy {
    filter(tasks: Task[]): Task[] {
        return tasks.filter(task => task.status === 'Completed');
    }
}