import type { FilterStrategy } from "./FilterStrategy";
import type { Task } from "../../models/Task";

export class InProgressFilterStrategy implements FilterStrategy {
    filter(tasks: Task[]): Task[] {
        return tasks.filter(task => task.status === 'In Progress');
    }
} 