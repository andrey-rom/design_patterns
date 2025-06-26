import './style.css';
import { TaskManager } from './services/TaskManager';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { FilterControls } from './components/FilterControls';
import { ResetAllCommand } from './patterns/command/ResetAllCommand';
import { UIMediator } from './services/UIMediator';

document.addEventListener('DOMContentLoaded', () => {
    // Singleton TaskManager
    const taskManager = TaskManager.getInstance();

    // Mediator
    const mediator = new UIMediator();

    // UI Components
    const taskListElement = document.getElementById('task-list') as HTMLElement;
    const taskList = new TaskList(taskListElement);
    mediator.registerTaskList(taskList);

    // Observer Pattern: TaskList observes TaskManager
    taskManager.addObserver(taskList);

    // Initialize other UI components
    new TaskForm('add-task-form');
    new FilterControls('.filters', mediator);

    // Command Pattern for Reset All
    const resetAllButton = document.getElementById('reset-all') as HTMLButtonElement;
    resetAllButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            new ResetAllCommand().execute();
        }
    });

    // Undo/Redo buttons
    const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement;
    const redoBtn = document.getElementById('redo-btn') as HTMLButtonElement;
    if (undoBtn) undoBtn.addEventListener('click', () => taskManager.undo());
    if (redoBtn) redoBtn.addEventListener('click', () => taskManager.redo());

    // Initial render
    taskManager.notifyObservers();
}); 