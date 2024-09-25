document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => renderTask(task));

  
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

        li.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed;
            li.classList.toggle('completed');
            li.querySelector('.complete-btn').innerText = task.completed ? 'Desfazer' : 'Complete';
            updateLocalStorage();
        });

        
        li.querySelector('.delete-btn').addEventListener('click', () => {
            taskList.removeChild(li);
            tasks = tasks.filter(t => t.id !== task.id);
            updateLocalStorage();
        });

        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragenter', handleDragEnter);
        li.addEventListener('dragleave', handleDragLeave);
        li.addEventListener('dragend', handleDragEnd);
    }

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

   
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);  
    }

    function handleDragOver(e) {
        e.preventDefault();  
    }

    function handleDragEnter(e) {
        if (this !== draggedItem) {
            this.classList.add('over');  
        }
    }

    function handleDragLeave() {
        this.classList.remove('over');
    }

    function handleDrop() {
        this.classList.remove('over');

        
        if (this !== draggedItem) {
            taskList.insertBefore(draggedItem, this);
            updateTaskOrder();
        }
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
    }

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
