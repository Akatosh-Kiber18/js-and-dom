let state = [
    {
        id: 1,
        name: "Go outside",
        done: false,
        description: "Description for task with name: Go Outside",
        dueDate: "2022-08-26",
        deleted: false
    },
    {
        id: 2,
        name: "Buy some fruits",
        done: false,
        description: "Description for task with name: Buy some fruits",
        dueDate: "2022-08-26",
        deleted: false
    },
    {
        id: 3,
        name: "Describe an array of tasks in JavaScript ",
        done: true,
        description: "Description for task with name: Describe an array of tasks in JavaScript",
        dueDate: "2022-08-26",
        deleted: false
    },
    {
        id: 4,
        name: "Go on event",
        done: false,
        description: "Description for task with name: Go on event",
        dueDate: null,
        deleted: false
    },
    {
        id: 5,
        name: "overdue task",
        done: false,
        description: null,
        dueDate: "2022-08-21",
        deleted: false
    },
]

const inc = (init = 5) => () => ++init
const genTaskId = inc();

const createTask = (name, description, dueDate) => {
    return {
        id: genTaskId(),
        name: name,
        done: false,
        description: description,
        dueDate: dueDate,
        deleted: false
    }
}

const addTaskBtnEl = document.getElementById("add-task-btn");

const taskNameEl = document.getElementById("create-task-name");
const taskLNameLabelEl = document.getElementsByClassName("task-name-label")[0];

const taskDescriptionEl = document.getElementById("create-description");

const taskDueDateEl = document.getElementById("create-dueDate");


addTaskBtnEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (taskNameEl.value) {
        const task = createTask(taskNameEl.value, taskDescriptionEl.value, taskDueDateEl.value);
        state.push(task);
        console.log(task);
        taskNameEl.value = "";
        taskDescriptionEl.value = "";
        taskDueDateEl.value = "";

        taskNameEl.className = "";
        taskLNameLabelEl.className = "task-name-label"

        updatePage(state);

    }
    else {
        taskNameEl.className= "require";
        taskLNameLabelEl.className = "require"
    }
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

    const oldTask = document.getElementById(`task-${taskId}`);
    const newTask = createTaskBlock(t);

    taskListEl.replaceChild(newTask, oldTask);
}

function onDeleteBtnClick(taskId) {
    const id = `task-${taskId}`;
    document.getElementById(id).outerHTML = "";
    const t = state.find(t => t.id === taskId);
    t.deleted = true;
    updatePage(state);
}

function updatePage(state) {
    taskListEl.innerHTML = '';
    state.forEach(task => taskListEl.append(createTaskBlock(task)))
}

updatePage(state);

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
    taskDueDateEl.innerText = dueDate ? dueDate : "[no dueDate]";

    return taskDueDateEl;
}

function updateTaskDoneCheckboxEl(doneCheckboxEl, done, id) {
    doneCheckboxEl.type = "checkbox";
    doneCheckboxEl.className = done ? "checkbox" : "";
    doneCheckboxEl.onclick = () => onDoneClick(id);
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
    deleteBtnEl.onclick = () => onDeleteBtnClick(id);
    const span = document.createElement("span");
    span.className = "delete-button";
    span.append(deleteBtnEl);

    return span;
}