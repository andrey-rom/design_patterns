import type { TaskState, TaskStateContext } from "./TaskState";
import type { Status } from "../../models/Task";
import { CompletedState } from "./CompletedState";
import { ToDoState } from "./ToDoState";

export class InProgressState implements TaskState {
    public readonly status: Status = 'In Progress';
    private context!: TaskStateContext;

    setContext(context: TaskStateContext): void {
        this.context = context;
    }

    next(): void {
        this.context.changeState(new CompletedState());
    }

    previous(): void {
        this.context.changeState(new ToDoState());
    }
} 