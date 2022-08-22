const state = [
    {
        id: 1,
        name: "Go outside",
        done: false,
        description: "Description for task with name: Go Outside",
        dueDate: "2022-08-24",
    },
    {
        id: 2,
        name: "Buy some fruits",
        done: false,
        description: "Description for task with name: Buy some fruits",
        dueDate: "2022-08-23",
    },
    {
        id: 3,
        name: "Describe an array of tasks in JavaScript ",
        done: true,
        description: "Description for task with name: Describe an array of tasks in JavaScript",
        dueDate: "2022-08-22",
    },
    {
        id: 4,
        name: "Go on event",
        done: false,
        description: "Description for task with name: Go on event",
        dueDate: "2022-08-25",
    },
    {
        id: 5,
        name: "overdue task",
        done: false,
        description: null,
        dueDate:"2022-08-21",
    }
]

const taskListEl = document.getElementById("tasks")
const currentDate = new Date();
currentDate.setHours(0);
currentDate.setMinutes(0);
currentDate.setSeconds(0);

function onDoneClick(taskId) {
    const t = state.find(t => t.id === taskId)
    t.done = !t.done;
    update(state);
}

function update(state) {
    taskListEl.innerHTML = '';
    state.forEach(task => taskListEl.appendChild(createTaskBlock(task)))
}

function createTaskBlock(task) {
    const taskDate = new Date(task.dueDate);

    const taskDetailsEl = document.createElement("div")
    taskDetailsEl.className = "task-details";

    let taskDueDateEl = document.createElement("h4");
    taskDueDateEl.className = taskDate.getTime() < currentDate.getTime() ? "task-details-dueDate": "";
    taskDueDateEl.innerText = task.dueDate;
    taskDetailsEl.appendChild(taskDueDateEl)

    let doneCheckboxEl = document.createElement("input");
    doneCheckboxEl.type = "checkbox";
    doneCheckboxEl.onclick = () => onDoneClick(task.id);
    doneCheckboxEl.checked = task.done;
    taskDetailsEl.appendChild(doneCheckboxEl);

    let taskNameEl = document.createElement("label");
    taskNameEl.innerText = task.name;
    taskNameEl.className = task.done ? "task-name-done": "";
    taskDetailsEl.appendChild(taskNameEl);

    let taskDescriptionEl = document.createElement("p");
    taskDescriptionEl.innerText = task.description;
    taskDetailsEl.appendChild(taskDescriptionEl);

    return taskDetailsEl;
}
update(state);

//     const checked = task.done ? "checked" : "";
//     const taskNameStyle = checked ? "color:grey;text-decoration:line-through;" : "";
//     const dueDateStyle = taskDate.getTime() < date.getTime() ? "color:red;" : "";
//     const description = task.description || ""
//
//
//     return `
//             <div class="task-details" style="">
//                 <h4 class="task-details-dueDate" style="${dueDateStyle}" >${task.dueDate}</h4>
//                 <input type="checkbox" class="task-details-name" name="checkbox" onclick="onDoneClick(${task.id})" ${checked}>
//                 <label for="checkbox" id="task-name" style=${taskNameStyle}>${task.name}</label>
//                 <p class="task-details-description">${description}</p>
//             </div>
// `


