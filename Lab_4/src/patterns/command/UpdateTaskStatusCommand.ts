import type { Command } from "./Command";
import { TaskManager } from "../../services/TaskManager";

export class UpdateTaskStatusCommand implements Command {
    constructor(private taskId: string) {}

    execute(): void {
        const taskManager = TaskManager.getInstance();
        const task = taskManager.getTasks().find(t => t.id === this.taskId);
        if (task) {
            task.nextState();
            // The state has changed, so we need to "update" the task in the manager
            // to trigger notification and save to local storage.
            taskManager.updateTask(task);
        }
    }
} 