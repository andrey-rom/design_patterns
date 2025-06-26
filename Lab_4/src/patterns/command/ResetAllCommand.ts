import type { Command } from "./Command";
import { TaskManager } from "../../services/TaskManager";

export class ResetAllCommand implements Command {
    execute(): void {
        TaskManager.getInstance().resetAllTasks();
    }
} 