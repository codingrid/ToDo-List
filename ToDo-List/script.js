document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks on page load
    tasks.forEach(task => renderTask(task));

    // Add new task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        renderTask(newTask);
        taskInput.value = '';
        updateLocalStorage();
    });

    // Render task in UI
    function renderTask(task) {
        const li = document.createElement('li');
        li.className = `task ${task.completed ? 'completed' : ''}`;
        li.setAttribute('draggable', true);
        li.dataset.id = task.id;
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete-btn">${task.completed ? 'Desfazer' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);

        // Complete task
        li.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed;
            li.classList.toggle('completed');
            li.querySelector('.complete-btn').innerText = task.completed ? 'Desfazer' : 'Complete';
            updateLocalStorage();
        });

        // Delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            taskList.removeChild(li);
            tasks = tasks.filter(t => t.id !== task.id);
            updateLocalStorage();
        });

        // Drag and drop functionality
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragenter', handleDragEnter);
        li.addEventListener('dragleave', handleDragLeave);
        li.addEventListener('dragend', handleDragEnd);
    }

    // Local storage update
    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Drag and drop functionality
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);  // Hide the item temporarily while dragging
    }

    function handleDragOver(e) {
        e.preventDefault();  // Necessary to allow dropping
    }

    function handleDragEnter(e) {
        if (this !== draggedItem) {
            this.classList.add('over');  // Visual feedback for the drop target
        }
    }

    function handleDragLeave() {
        this.classList.remove('over');
    }

    function handleDrop() {
        this.classList.remove('over');

        // Insert the dragged item before the current item
        if (this !== draggedItem) {
            taskList.insertBefore(draggedItem, this);
            updateTaskOrder();
        }
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
    }

    // Update task order in the array based on UI changes
    function updateTaskOrder() {
        const newTasksOrder = [];
        taskList.querySelectorAll('.task').forEach(li => {
            const taskId = li.dataset.id;
            const task = tasks.find(t => t.id == taskId);
            newTasksOrder.push(task);
        });
        tasks = newTasksOrder;
        updateLocalStorage();
    }
});
