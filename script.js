document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskImageInput = document.getElementById('task-image');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const savePdfBtn = document.getElementById('save-pdf-btn');

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskClick);
    savePdfBtn.addEventListener('click', saveTasksAsPDF);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Eliminar';

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'task-controls';
        controlsDiv.appendChild(checkbox);
        controlsDiv.appendChild(deleteBtn);

        li.appendChild(controlsDiv);
        li.appendChild(span);

        const file = taskImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'task-image';
                li.appendChild(img);
            }
            reader.readAsDataURL(file);
        }

        taskList.appendChild(li);

        taskInput.value = '';
        taskImageInput.value = '';
    }

    function handleTaskClick(e) {
        if (e.target.classList.contains('delete-btn')) {
            e.target.parentElement.parentElement.remove();
        } else if (e.target.classList.contains('task-checkbox')) {
            e.target.parentElement.parentElement.classList.toggle('completed');
        }
    }

    async function saveTasksAsPDF() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        let y = 10;
        const tasks = taskList.getElementsByTagName('li');

        for (const task of tasks) {
            const text = task.querySelector('.task-text').textContent;
            const completed = task.classList.contains('completed') ? '[X] ' : '[ ] ';
            pdf.text(completed + text, 10, y);

            const img = task.querySelector('.task-image');
            if (img) {
                const imgData = img.src;
                const imgProps = pdf.getImageProperties(imgData);
                const imgWidth = 50; // Adjust the width as needed
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                y += 5; // Adjust the spacing as needed
                pdf.addImage(imgData, 'JPEG', 10, y, imgWidth, imgHeight);
                y += imgHeight + 10; // Adjust the spacing as needed
            } else {
                y += 10;
            }
        }

        pdf.save('tareas.pdf');
    }
});
