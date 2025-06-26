import type { Command } from "./Command";
import { TaskManager } from "../../services/TaskManager";

export class DeleteTaskCommand implements Command {
    constructor(private taskId: string) {}

    execute(): void {
        TaskManager.getInstance().removeTask(this.taskId);
    }
} 