import {addTasks, deleteTask, updateTask} from "./fetchApi/tasks.js";
import {addLists, deleteLists, getLists} from "./fetchApi/lists.js";

let state = {
    showCompletedTasks: false,
    lists: []
};

const currentDate = new Date();
currentDate.setHours(0);
currentDate.setMinutes(0);
currentDate.setSeconds(0);

const mainBar = document.getElementById('main-bar');

function updatePage(state) {
    if (state.lists.length === 0) {
        mainBar.innerText = "[NO LISTS]"
        return
    }
    mainBar.innerHTML = "";
    state.lists.forEach(l => mainBar.prepend(createListBlock(l)))
}

const showEl = document.getElementById('hide-task');
showEl.onclick = () => {
    state.showCompletedTasks = showEl.checked;
    updatePage(state);
}

getLists()
    .then(lists => {
        state.lists = lists
        updatePage(state)
    });

const listNameEl = document.getElementById('create-list');
const listNameLabelEl = document.getElementById('create-list-label');
const createListBtnEl = document.getElementById('create-list-btn');
createListBtnEl.onclick = (e) => {
    e.preventDefault();
    showSpinner(true);
    if (listNameEl.value.trim() === "") {
        listNameLabelEl.className = 'require';
        listNameLabelEl.style.display = 'flex'
        listNameEl.className = 'require';
        showSpinner(false);
        return
    }
    addLists({name: listNameEl.value.trim()})
        .then(_ => getLists(), _ => {
            showSpinner(true);
        })
        .then(lists => {
            state.lists = lists
            updatePage(state)
        })
        .then(_ => showSpinner(false));
}

function createListBlock(list) {
    const listBlockEl = document.createElement('div');
    listBlockEl.className = "list-name";
    listBlockEl.id = `list-${list.id}`
    const listNameEl = document.createElement('h2');
    listNameEl.innerText = list.name;
    listBlockEl.append(listNameEl)

    const listMenuContainerEl = document.createElement('div');
    listMenuContainerEl.id = 'menu-container';

    const listMenuBtnEl = document.createElement('button');
    listMenuBtnEl.id = `list-menu-button-${list.id}`;
    listMenuBtnEl.type = "button";
    listMenuBtnEl.innerText = "Show menu";
    listMenuBtnEl.onclick = (event) => {
        const listId = event.target.parentElement.parentElement.id.split('-')[1];
        onListMenuBtnClick(listId)
    }

    listMenuContainerEl.append(listMenuBtnEl);
    listMenuContainerEl.append(updateListMenuEl(list.id))
    listBlockEl.append(listMenuContainerEl);

    if (list.tasks.length > 0) {
        list.tasks.forEach(t => listBlockEl.append(createTaskBlock(t)));
    } else  {
        listBlockEl.append("[NO TASKS]");
    }

    return listBlockEl;
}

function onListMenuBtnClick(listId) {
    const formContainerEl = document.getElementById(`list-menu-${listId}`);
    const btnEl = document.getElementById(`list-menu-button-${listId}`);
    if (formContainerEl.style.display === "none") {
        formContainerEl.style.display = "flex";
        btnEl.innerText = "Hide menu";
    } else {
        formContainerEl.style.display = "none";
        btnEl.innerText = "Show menu";
    }
}

function updateListMenuEl(listId) {
    const listMenu = document.createElement('div');
    listMenu.id = `list-menu-${listId}`;
    listMenu.style.display = "none";
    listMenu.innerText = 'Add new task';

    const formEl = document.createElement('form');

    const nameInputEl = document.createElement('input');
    nameInputEl.type = "text";
    nameInputEl.id = `create-task-name-${listId}`;
    nameInputEl.placeholder = "Task name";

    const nameLabelEl = document.createElement('label')
    nameLabelEl.className = 'task-name-label';
    nameLabelEl.innerText = '*';
    nameLabelEl.id = `task-name-label-${listId}`;

    const descriptionInputEl = document.createElement('input');
    descriptionInputEl.type = "text";
    descriptionInputEl.id = `create-description-${listId}`;
    descriptionInputEl.placeholder = "Description";

    const dueDateInputEl = document.createElement('input');
    dueDateInputEl.type = "date";
    dueDateInputEl.id = `create-dueDate-${listId}`;

    const addTaskBtnEl = document.createElement('button');
    addTaskBtnEl.type = "button";
    addTaskBtnEl.id = `add-task-btn-${listId}`;
    addTaskBtnEl.innerText = "Add";
    addTaskBtnEl.onclick = () => {
        onAddTaskBtnClick(listId)
    }

    const deleteListBtnEl = document.createElement('button');
    deleteListBtnEl.type = "button";
    deleteListBtnEl.id = `delete-list-btn-${listId}`;
    deleteListBtnEl.innerText = "Delete list";
    deleteListBtnEl.style.color = "red"
    deleteListBtnEl.onclick = () => {
        onDeleteListBtnClick(listId)
    }

    formEl.append(nameInputEl);
    formEl.append(nameLabelEl);
    formEl.append(descriptionInputEl);
    formEl.append(dueDateInputEl);
    formEl.append(addTaskBtnEl);

    listMenu.append(formEl);
    listMenu.append(deleteListBtnEl);

    listMenu.style.flexDirection = 'column';

    return listMenu;
}

function onDeleteListBtnClick(listId) {
    showSpinner(true);
    deleteLists(listId)
        .then(_ => getLists())
        .then(lists => {
            state.lists = lists;
            updatePage(state);
            showSpinner(false);
        }, _ => showSpinner(false))
}

function createTask(name, description, dueDate, listId) {
    return {
        name: name,
        done: false,
        description: description || null,
        listId: listId || 5,
        dueDate: dueDate || null,
    }
}

function onAddTaskBtnClick(listId) {
    showSpinner(true);
    const formContainerEl = document.getElementById(`list-menu-${listId}`);
    const formEl = formContainerEl.getElementsByTagName('form')[0];

    const taskNameEl = document.getElementById(`create-task-name-${listId}`);
    const taskNameLabelEl = document.getElementById(`task-name-label-${listId}`)
    const taskDescriptionEl = document.getElementById(`create-description-${listId}`);
    const taskDueDateEl = document.getElementById(`create-dueDate-${listId}`);

    if (taskNameEl.value.trim() === "") {
        taskNameEl.className = "require";
        taskNameLabelEl.className = "require";
        showSpinner(false)
    } else {
        const task = createTask(taskNameEl.value.trim(), taskDescriptionEl.value.trim(), taskDueDateEl.value.trim(), listId);
        taskNameEl.className = "";
        taskNameLabelEl.className = "task-name-label";

        allowCreateTaskFormEdition(formEl, false, listId);
        addTasks(task)
            .then(_ => getLists())
            .then(lists => {
                state.lists = lists
                updatePage(state)
            })
            .then(_ => {
                taskNameEl.value = "";
                taskDescriptionEl.value = "";
                taskDueDateEl.value = "";

                allowCreateTaskFormEdition(formEl, true, listId);
            }, _ => {
                allowCreateTaskFormEdition(formEl, true, listId)
            })
            .then(_ => showSpinner(false))
    }
}

function onDoneClick(taskId, listId) {
    showSpinner(true);
    let list = state.lists.find(l => l.id === listId);
    let task = list.tasks.find(t => t.id === taskId);
    task.done = !task.done;

    updateTask(task)
        .then(_ => {
            const taskListEl = document.getElementById(`list-${listId}`);
            const oldTask = document.getElementById(`task-${taskId}`);
            const newTask = createTaskBlock(task);

            taskListEl.replaceChild(newTask, oldTask);
            showSpinner(false)
        }, _ => {
            showSpinner(false);
        })
}

function onDeleteBtnClick(taskId) {
    showSpinner(true);
    deleteTask(taskId)
        .then(_ => getLists())
        .then(lists => {
            state.lists = lists
            updatePage(state)
            showSpinner(false);
        }, _ => {
            const task = document.getElementById(`task-${taskId}`);
            task.style.borderColor = "purple";
            task.style.borderWidth = "3px";
            Array.from(task.getElementsByTagName("button"))[0].disabled = false;
            showSpinner(false);
        })
}

function createTaskBlock(task) {

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

    taskDetailsEl.className = !state.showCompletedTasks && task.done ? "done" : "task-details";

    return taskDetailsEl;
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
    doneCheckboxEl.onclick = (event) => {
        const listId = parseInt(event.target.parentElement.parentElement.id.split('-')[1]);
        doneCheckboxEl.disabled = true
        onDoneClick(id, listId)
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

function allowCreateTaskFormEdition(formEl, allowed, listId) {
    const deleteListBtnEl = document.getElementById(`delete-list-btn-${listId}`)
    deleteListBtnEl.disabled = !allowed;
    Array.from(formEl.children).forEach(child => child.disabled = !allowed);
}

function showSpinner(status) {
    const spinner = document.getElementById('loader');
    if (!status) {
        spinner.style.display = "none";
        mainBar.style.filter = "none";
    } else {
        spinner.style.display = "block";
        mainBar.style.filter = "blur(3px)";
    }
}