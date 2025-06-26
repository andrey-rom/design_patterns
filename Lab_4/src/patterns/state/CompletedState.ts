import type { TaskState, TaskStateContext } from "./TaskState";
import type { Status } from "../../models/Task";

export class CompletedState implements TaskState {
    public readonly status: Status = 'Completed';
    private context!: TaskStateContext;

    setContext(context: TaskStateContext): void {
        this.context = context;
    }

    next(): void {
    }

    previous(): void {
    }
} 