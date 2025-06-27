import { AllFilterStrategy } from '../patterns/strategy/AllFilterStrategy';
import { ToDoFilterStrategy } from '../patterns/strategy/ToDoFilterStrategy';
import { InProgressFilterStrategy } from '../patterns/strategy/InProgressFilterStrategy';
import { CompletedFilterStrategy } from '../patterns/strategy/CompletedFilterStrategy';
import type { TaskList } from './TaskList';

export class FilterControls {
    private buttons: NodeListOf<HTMLButtonElement>;

    constructor(containerSelector: string, private taskList: TaskList) {
        const container = document.querySelector(containerSelector) as HTMLElement;
        this.buttons = container.querySelectorAll('.filter-btn');
        container.addEventListener('click', this.handleFilterClick.bind(this));
    }

    private handleFilterClick(event: Event): void {
        const target = event.target as HTMLButtonElement;
        if (!target.matches('.filter-btn')) return;

        this.buttons.forEach(button => button.classList.remove('active'));
        target.classList.add('active');

        const filter = target.dataset.filter;
        let strategy;

        switch (filter) {
            case 'To Do':
                strategy = new ToDoFilterStrategy();
                break;
            case 'In Progress':
                strategy = new InProgressFilterStrategy();
                break;
            case 'Completed':
                strategy = new CompletedFilterStrategy();
                break;
            default:
                strategy = new AllFilterStrategy();
                break;
        }

        this.taskList.setFilterStrategy(strategy);
    }
} 