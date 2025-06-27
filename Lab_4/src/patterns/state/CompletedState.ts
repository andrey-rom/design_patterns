import type { TaskState, TaskStateContext } from "./TaskState";
import type { Status } from "../../models/Task";

export class CompletedState implements TaskState {
    public readonly status: Status = 'Completed';

    setContext(_context: TaskStateContext): void {
    }

    next(): void {
    }

    previous(): void {
    }
} 