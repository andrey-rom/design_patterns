import type { Priority, Status } from '../models/Task';
import { TaskBuilder } from '../patterns/TaskBuilder';
import { TaskManager } from '../services/TaskManager';

export class TaskForm {
    private form: HTMLFormElement;
    private titleInput: HTMLInputElement;
    private descriptionInput: HTMLTextAreaElement;
    private priorityInput: HTMLSelectElement;
    private statusInput: HTMLSelectElement;

    constructor(formId: string) {
        this.form = document.getElementById(formId) as HTMLFormElement;
        this.titleInput = document.getElementById('title') as HTMLInputElement;
        this.descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
        this.priorityInput = document.getElementById('priority') as HTMLSelectElement;
        this.statusInput = document.getElementById('status') as HTMLSelectElement;

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();

        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const priority = this.priorityInput.value as Priority;
        const status = this.statusInput.value as Status;

        try {
            const newTask = new TaskBuilder()
                .withTitle(title)
                .withDescription(description)
                .withPriority(priority)
                .withStatus(status)
                .build();
            
            TaskManager.getInstance().addTask(newTask);
            this.form.reset();
            this.titleInput.focus();

        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    }
} 