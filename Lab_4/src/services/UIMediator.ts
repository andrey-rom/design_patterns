import type { TaskList } from '../components/TaskList';
import type { FilterStrategy } from '../patterns/FilterStrategy';

export class UIMediator {
    private taskList!: TaskList;

    public registerTaskList(taskList: TaskList): void {
        this.taskList = taskList;
    }

    public notifyFilterChanged(strategy: FilterStrategy): void {
        if (this.taskList) {
            this.taskList.setFilterStrategy(strategy);
        }
    }
} 