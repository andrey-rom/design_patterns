import type { TaskState, TaskStateContext } from "./TaskState";
import type { Status } from "../../models/Task";
import { InProgressState } from "./InProgressState";

export class ToDoState implements TaskState {
    public readonly status: Status = 'To Do';
    private context!: TaskStateContext;

    setContext(context: TaskStateContext): void {
        this.context = context;
    }

    next(): void {
        this.context.changeState(new InProgressState());
    }

    previous(): void {
    }
}