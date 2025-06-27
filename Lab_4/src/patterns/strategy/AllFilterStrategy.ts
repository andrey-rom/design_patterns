import type { FilterStrategy } from "./FilterStrategy";
import type { Task } from "../../models/Task";

export class AllFilterStrategy implements FilterStrategy {
    filter(tasks: Task[]): Task[] {
        return tasks;
    }
} 