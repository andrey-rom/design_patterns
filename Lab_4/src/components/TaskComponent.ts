import { Task } from '../models/Task';
import { UpdateTaskStatusCommand } from '../patterns/command/UpdateTaskStatusCommand';
import { DeleteTaskCommand } from '../patterns/command/DeleteTaskCommand';
import { PreviousTaskStatusCommand } from '../patterns/command/PreviousTaskStatusCommand';
import type { Command } from '../patterns/command/Command';

export interface ITaskComponent {
    render(): HTMLElement;
}

export class TaskComponent implements ITaskComponent {
    constructor(protected task: Task) {}

    render(): HTMLElement {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item priority-${this.task.priority}`;
        
        taskElement.innerHTML = `
            <div class="task-item-details">
                <h3>${this.task.title}</h3>
                <p>${this.task.description}</p>
                <div class="task-meta">
                    <span class="task-badge priority-badge ${this.task.priority}">Priority: ${this.task.priority}</span>
                    <span class="task-badge status-badge ${this.task.status.replace(' ', '')}">Status: ${this.task.status}</span>
                    <span>Created: ${this.task.createdAt.toLocaleString()}</span>
                </div>
            </div>
            <div class="task-item-actions">
                ${this.getActionButtons()}
            </div>
        `;

        this.addEventListeners(taskElement);

        return taskElement;
    }

    private getActionButtons(): string {
        const buttons = [];
        
        // Previous button (only for In Progress tasks)
        if (this.task.status === 'In Progress') {
            buttons.push(`<button class="btn btn-previous" data-task-id="${this.task.id}" title="Move back to To Do">←</button>`);
        }
        
        // Next button (only for To Do and In Progress tasks)
        if (this.task.status !== 'Completed') {
            buttons.push(`<button class="btn btn-next" data-task-id="${this.task.id}" title="Move to next status">→</button>`);
        }
        
        // Delete button (always available)
        buttons.push(`<button class="btn btn-delete" data-task-id="${this.task.id}" title="Delete task">🗑️</button>`);
        
        return buttons.join('');
    }

    private addEventListeners(element: HTMLElement): void {
        element.querySelector('.btn-delete')?.addEventListener('click', (e) => {
            const taskId = (e.target as HTMLElement).closest('button')?.dataset.taskId;
            if (taskId) {
                this.executeCommand(new DeleteTaskCommand(taskId));
            }
        });

        element.querySelector('.btn-next')?.addEventListener('click', (e) => {
            const target = (e.target as HTMLElement).closest('button');
            const taskId = target?.dataset.taskId;
            if (taskId) {
                this.executeCommand(new UpdateTaskStatusCommand(taskId));
            }
        });

        element.querySelector('.btn-previous')?.addEventListener('click', (e) => {
            const target = (e.target as HTMLElement).closest('button');
            const taskId = target?.dataset.taskId;
            if (taskId) {
                this.executeCommand(new PreviousTaskStatusCommand(taskId));
            }
        });
    }

    private executeCommand(command: Command): void {
        command.execute();
    }
} 