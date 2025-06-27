import type { Command } from "./Command";
import type { Task } from "../../models/Task";
import { TaskManager } from "../../services/TaskManager";

export class AddTaskCommand implements Command {
    constructor(private task: Task) {}

    execute(): void {
        TaskManager.getInstance().addTask(this.task);
    }
} 