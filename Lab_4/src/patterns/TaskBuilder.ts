import { Task } from "../models/Task";
import type { Priority, Status } from "../models/Task";

export class TaskBuilder {
    private title: string = '';
    private description: string = '';
    private priority: Priority = 'Low';
    private status: Status = 'To Do';

    withTitle(title: string): TaskBuilder {
        this.title = title;
        return this;
    }

    withDescription(description: string): TaskBuilder {
        this.description = description;
        return this;
    }

    withPriority(priority: Priority): TaskBuilder {
        this.priority = priority;
        return this;
    }

    withStatus(status: Status): TaskBuilder {
        this.status = status;
        return this;
    }

    build(): Task {
        if (!this.title) {
            throw new Error("Task title cannot be empty.");
        }

        return new Task(
            crypto.randomUUID(),
            this.title,
            this.description,
            this.priority,
            new Date(),
            this.status
        );
    }
} 