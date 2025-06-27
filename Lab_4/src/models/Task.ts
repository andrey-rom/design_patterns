import { CompletedState } from "../patterns/state/CompletedState";
import { InProgressState } from "../patterns/state/InProgressState";
import type { TaskState, TaskStateContext } from "../patterns/state/TaskState";
import { ToDoState } from "../patterns/state/ToDoState";

export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To Do' | 'In Progress' | 'Completed';

export class Task implements TaskStateContext {
    public id: string;
    public title: string;
    public description: string;
    public priority: Priority;
    public createdAt: Date;
    private state: TaskState;

    constructor(
        id: string,
        title: string,
        description: string,
        priority: Priority,
        createdAt: Date,
        status: Status
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.createdAt = createdAt;
        this.state = this.createState(status);
        this.state.setContext(this);
    }

    get status(): Status {
        return this.state.status;
    }

    nextState(): void {
        this.state.next();
    }

    previousState(): void {
        this.state.previous();
    }

    changeState(newState: TaskState): void {
        this.state = newState;
        this.state.setContext(this);
    }

    private createState(status: Status): TaskState {
        switch (status) {
            case 'To Do':
                return new ToDoState();
            case 'In Progress':
                return new InProgressState();
            case 'Completed':
                return new CompletedState();
            default:
                return new ToDoState();
        }
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            priority: this.priority,
            createdAt: this.createdAt.toISOString(),
            status: this.status
        };
    }
} 