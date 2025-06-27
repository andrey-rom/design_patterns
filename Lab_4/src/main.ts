import './style.css';
import { TaskManager } from './services/TaskManager';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { FilterControls } from './components/FilterControls';

document.addEventListener('DOMContentLoaded', () => {
    const taskManager = TaskManager.getInstance();

    const taskListElement = document.getElementById('task-list') as HTMLElement;
    const taskList = new TaskList(taskListElement);

    taskManager.addObserver(taskList);

    new TaskForm('add-task-form');
    new FilterControls('.filters', taskList);

    const resetAllButton = document.getElementById('reset-all') as HTMLButtonElement;
    resetAllButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            taskManager.resetAllTasks();
        }
    });

    taskManager.notifyObservers();
}); 