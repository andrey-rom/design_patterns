import type { Observer } from '../patterns/observer/Observer';
import { Task } from '../models/Task';
import type { FilterStrategy } from '../patterns/strategy/FilterStrategy';
import { AllFilterStrategy } from '../patterns/strategy/AllFilterStrategy';
import { TaskManager } from '../services/TaskManager';
import { TaskComponent } from './TaskComponent';
import { PriorityHighlightDecorator } from '../patterns/decorator/PriorityHighlightDecorator';

export class TaskList implements Observer {
    private tasks: Task[] = [];
    private filterStrategy: FilterStrategy = new AllFilterStrategy();

    constructor(private element: HTMLElement) {}

    public setFilterStrategy(strategy: FilterStrategy) {
        this.filterStrategy = strategy;
        this.render();
    }

    update(tasks: Task[]): void {
        this.tasks = tasks;
        this.render();
    }

    private render(): void {
        this.element.innerHTML = '';
        const filteredTasks = this.filterStrategy.filter(this.tasks);

        if (filteredTasks.length === 0) {
            this.element.innerHTML = '<p>No tasks found.</p>';
            return;
        }

        filteredTasks.forEach(task => {
            const component = new TaskComponent(task);
            const decoratedComponent = new PriorityHighlightDecorator(component, task);
            const taskElement = decoratedComponent.render();
            this.element.appendChild(taskElement);
        });

        this.element.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const taskId = (e.target as HTMLElement).closest('button')?.dataset.taskId;
                if (taskId) {
                    TaskManager.getInstance().removeTask(taskId);
                }
            });
        });

        this.element.querySelectorAll('.btn-complete').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = (e.target as HTMLElement).closest('button');
                const taskId = target?.dataset.taskId;
                if (taskId) {
                    const taskManager = TaskManager.getInstance();
                    const task = taskManager.getTasks().find(t => t.id === taskId);
                    if (task) {
                        task.nextState();
                        taskManager.updateTask(task);
                    }
                }
            });
        });
    }
} 