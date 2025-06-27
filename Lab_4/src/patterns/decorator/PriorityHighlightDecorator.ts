import { TaskDecorator } from "./TaskDecorator";
import type { ITaskComponent } from "../../components/TaskComponent";
import type { Task } from "../../models/Task";

export class PriorityHighlightDecorator extends TaskDecorator {
    constructor(component: ITaskComponent, private task: Task) {
        super(component);
    }

    render(): HTMLElement {
        const element = this.component.render();
        const titleElement = element.querySelector('h3');

        if (titleElement) {
            let icon = '';
            switch (this.task.priority) {
                case 'High':
                    icon = '🔥 ';
                    break;
                case 'Medium':
                    icon = '⚠️ ';
                    break;
            }
            titleElement.prepend(icon);
        }

        return element;
    }
} 