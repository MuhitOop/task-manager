// dom elements


const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTask = document.querySelector("#total-tasks");
const remainingTask = document.querySelector("#remaining-tasks");
const completedTask = document.querySelector("#completed-tasks");
const mainInput = document.querySelector("#todo-form input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (tasks.length > 0) {
  tasks.forEach((task) => createTask(task));
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value.trim();

  if (inputValue.trim() === "") return;

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(task);
  todoForm.reset();
  mainInput.focus();
});

function createTask(task) {
  const taskEl = document.createElement("li");

  taskEl.setAttribute("id", task.id);

  if (task.isCompleted) {
    taskEl.classList.add("complete");
  }

  const taskMarkup = ` 

                    <div>
                        <input type="checkbox" name="tasks" id="${task.id}" ${
    task.isCompleted ? "checked" : ""
  }>
                        <span ${!task.isCompleted ? "contenteditable" : ""}>${
    task.name
  }</span>
                    </div>
                    <button title="Remove the ${
                      task.name
                    } task" class="remove-task"><i class="fa-solid fa-xmark"></i></button>


    `;

  taskEl.innerHTML = taskMarkup;
  todoList.appendChild(taskEl);
  countTasks();
}

todoList.addEventListener("click", (e) => {
    const removeBtn = e.target.closest('.remove-task') || e.target.parentElement.classList.contains('remove-task');
    if (removeBtn) {
        const taskId = removeBtn.closest("li").id; 
        removeTask(taskId);
    }
});




function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted);

  completedTask.textContent = completedTasksArray.length;

  totalTask.textContent = tasks.length;
  remainingTask.textContent = tasks.filter((task) => !task.isCompleted).length;
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));

  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(taskId).remove();
  countTasks();
}

todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;

  updateTask(taskId, e.target);
});


function updateTask(taskId, el) { 
    const task = tasks.find(task => task.id === parseInt(taskId));

    if (el.hasAttribute("contenteditable")) { 
        task.name = el.textContent.trim();
    } else {
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted;

        if (task.isCompleted) {
            span.removeAttribute("contenteditable");
            parent.classList.add("complete");
        } else {
            span.setAttribute("contenteditable", true);
            parent.classList.remove("complete");
        }
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    countTasks();
}
