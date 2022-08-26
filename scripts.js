let state = []

function loadTasksFromDb() {
    showSpinner(true);
    return fetch('http://localhost:3000/tasks')
        .then(result => result.json())
        .then(tasks => {
            state = tasks;
            updatePage(state);
            showSpinner(false);
        });
}

loadTasksFromDb();

function addTasksToDb(task) {
    return fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(task)
    })
}

function updateTaskInDb(task) {
    return fetch(`http://localhost:3000/tasks/` + task.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(task)
    });
}

function deleteTaskInDb(taskId) {
    return fetch(`http://localhost:3000/tasks/` + taskId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    })
}

const createTask = (name, description, dueDate) => {
    return {
        name: name,
        done: false,
        description: description || null,
        dueDate: dueDate || null,
    }
}

const addTaskBtnEl = document.getElementById("add-task-btn");

const taskNameEl = document.getElementById("create-task-name");
const taskLNameLabelEl = document.getElementsByClassName("task-name-label")[0];

const taskDescriptionEl = document.getElementById("create-description");

const taskDueDateEl = document.getElementById("create-dueDate");


addTaskBtnEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (!taskNameEl.value) {
        taskNameEl.className = "require";
        taskLNameLabelEl.className = "require"
        return
    }
    const task = createTask(taskNameEl.value, taskDescriptionEl.value, taskDueDateEl.value);


    taskNameEl.className = "";
    taskLNameLabelEl.className = "task-name-label"
    allowCreateTaskFormEdition(e.target.parentElement, false);
    showSpinner(true);
    addTasksToDb(task)
        .then(_ => loadTasksFromDb())
        .then(_ => {
            taskNameEl.value = "";
            taskDescriptionEl.value = "";
            taskDueDateEl.value = "";

            allowCreateTaskFormEdition(e.target.parentElement, true);
            showSpinner(false);
        }, _ => {
            allowCreateTaskFormEdition(e.target.parentElement, true)
            showSpinner(false)
        });
})

const taskListEl = document.getElementById("tasks")

const currentDate = new Date();
currentDate.setHours(0);
currentDate.setMinutes(0);
currentDate.setSeconds(0);

const hide = document.getElementById("hide-task");
hide.onclick = () => updatePage(state);

function onDoneClick(taskId) {
    const t = state.find(t => t.id === taskId)
    t.done = !t.done;
    showSpinner(true);
    updateTaskInDb(t)
        .then(_ => {
            const oldTask = document.getElementById(`task-${taskId}`);
            const newTask = createTaskBlock(t);

            taskListEl.replaceChild(newTask, oldTask);
            showSpinner(false);
        })
}

function onDeleteBtnClick(taskId) {
    showSpinner(true);
    deleteTaskInDb(taskId)
        .then(_ => loadTasksFromDb(),
            _ => {
            const task = document.getElementById(`task-${taskId}`);
            task.style.borderColor = "purple";
            Array.from(task.getElementsByTagName("button"))[0].disabled = false;
        })
}

function updatePage(state) {
    if (state.length === 0) {
        taskListEl.innerHTML = 'no tasks';
    } else {
        taskListEl.innerHTML = '';
        state.forEach(task => taskListEl.append(createTaskBlock(task)))
    }
}

function createTaskBlock(task) {
    if (!task.deleted) {
        const taskDetailsEl = document.createElement("div");
        taskDetailsEl.id = `task-${task.id}`

        let taskDueDateEl = document.createElement("h4");
        taskDetailsEl.append(updateTaskDueDateEl(taskDueDateEl, task.dueDate))

        let doneCheckboxEl = document.createElement("input");
        taskDetailsEl.append(updateTaskDoneCheckboxEl(doneCheckboxEl, task.done, task.id));

        let taskNameEl = document.createElement("label");
        taskDetailsEl.append(updateTaskNameEl(taskNameEl, task.name, task.done));

        let taskDescriptionEl = document.createElement("p");
        taskDetailsEl.append(updateTaskDescriptionEl(taskDescriptionEl, task.description));

        let deleteBtnEl = document.createElement("button");
        taskDetailsEl.append(updateDeleteBtnEl(deleteBtnEl, task.id));

        let taskStripEl = document.createElement("div");
        taskDetailsEl.prepend(updateTaskStripEl(taskStripEl, taskDueDateEl, task.done, task.dueDate));

        taskDetailsEl.className = hide.checked && task.done ? "done" : "task-details";

        return taskDetailsEl;
    }
    return ""
}

function updateTaskDueDateEl(taskDueDateEl, dueDate) {
    const taskDate = new Date(dueDate).getTime();

    if (dueDate !== null) {
        taskDueDateEl.className = taskDate < currentDate.getTime() ? "task-details-dueDate" : "";
    }
    taskDueDateEl.innerText = dueDate ? new Date(dueDate).toLocaleDateString() : "[no dueDate]";

    return taskDueDateEl;
}

function updateTaskDoneCheckboxEl(doneCheckboxEl, done, id) {
    doneCheckboxEl.type = "checkbox";
    doneCheckboxEl.className = done ? "checkbox" : "";
    doneCheckboxEl.onclick = () => {
        doneCheckboxEl.disabled = true
        onDoneClick(id)
    };
    doneCheckboxEl.checked = done;

    return doneCheckboxEl;
}

function updateTaskNameEl(taskNameEl, name, done) {
    taskNameEl.innerText = name;
    taskNameEl.className = done ? "task-details-done" : "";

    return taskNameEl;
}

function updateTaskDescriptionEl(taskDescriptionEl, description) {
    taskDescriptionEl.innerText = description ? description : "[no description]";

    return taskDescriptionEl;
}

function updateTaskStripEl(taskStripEl, taskDueDateEl, done, dueDate) {
    const taskDate = new Date(dueDate).getTime() || null;

    if (done) {
        taskStripEl.className = "task-details-strip-green";
        taskDueDateEl.className = "";
    } else if (taskDate !== null && taskDate < currentDate.getTime() && !done) {
        taskDueDateEl.className = "task-details-dueDate";
        taskStripEl.className = "task-details-strip-red";
    } else {
        taskStripEl.className = "task-details-strip-grey";
    }

    return taskStripEl;
}

function updateDeleteBtnEl(deleteBtnEl, id) {
    deleteBtnEl.innerText = "Delete";
    deleteBtnEl.onclick = () => {
        deleteBtnEl.disabled = true;
        onDeleteBtnClick(id);
    }
    const span = document.createElement("span");
    span.className = "delete-button";
    span.append(deleteBtnEl);

    return span;
}

function allowCreateTaskFormEdition(formEl, allowed) {
    Array.from(formEl.children).forEach(child => child.disabled = !allowed);
}

function showSpinner(status) {
    const spinner = document.getElementById('loader');
    const tasks = document.getElementById('tasks');
    if (!status) {
        spinner.style.display = "none";
        tasks.style.filter = "none";
    } else {
        spinner.style.display = "block";
        tasks.style.filter = "blur(3px)";
    }
}