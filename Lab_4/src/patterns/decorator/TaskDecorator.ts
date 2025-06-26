import type { ITaskComponent } from "../../components/TaskComponent";

export abstract class TaskDecorator implements ITaskComponent {
    constructor(protected component: ITaskComponent) {}

    abstract render(): HTMLElement;
} 