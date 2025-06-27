import type { Status } from "../../models/Task";

export interface TaskStateContext {
    changeState(state: TaskState): void;
}

export interface TaskState {
    status: Status;
    setContext(context: TaskStateContext): void;
    next(): void;
    previous(): void;
} 