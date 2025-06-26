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
    public state: TaskState;

    constructor(id: string, title: string, description: string, priority: Priority, createdAt: Date, status?: Status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.createdAt = createdAt;
        
        this.state = this.getStateFromStatus(status);
        this.state.setContext(this);
    }

    public get status(): Status {
        return this.state.status;
    }

    public changeState(state: TaskState): void {
        this.state = state;
        this.state.setContext(this);
    }
    
    public nextState(): void {
        this.state.next();
    }

    public previousState(): void {
        this.state.previous();
    }

    private getStateFromStatus(status?: Status): TaskState {
        switch (status) {
            case 'In Progress':
                return new InProgressState();
            case 'Completed':
                return new CompletedState();
            case 'To Do':
            default:
                return new ToDoState();
        }
    }

    // This is for JSON serialization, as we can't store the state object directly.
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            priority: this.priority,
            createdAt: this.createdAt.toISOString(),
            status: this.status,
        };
    }
} 