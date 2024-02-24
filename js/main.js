const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList")

let tasks = [];

if (localStorage.getItem('tasks')) { 
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}




checkEmptyList();

//добавление задачи
form.addEventListener("submit", addTask);

//удаление задачи
tasksList.addEventListener('click', deleteTask)

//отмечаем задачу завершеной
tasksList.addEventListener('click', doneTask)

function addTask(event) {
  //отменяем отправку(обновления) формы
  event.preventDefault();

  //достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //добавляем задачу в массив
  tasks.push(newTask)

  saveToLOcalStorage();

  renderTask(newTask);

  //очищаем поле ввода и возвращаем на него фокус
  taskInput.value = ""
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  //проверяем если клик был не по кнопке "удалить задачу"
  if (event.target.dataset.action !== 'delete') return;



  const parenNode = event.target.closest('.list-group-item');

  //определяем ID задачи
  const id = Number(parenNode.id);

  //удаляем задачу через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id);

  saveToLOcalStorage();

  //удаляем задачу из разметки
  parenNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  //проверяем что клик был не по кнопке "задача выполнена"
  if (event.target.dataset.action !== "done") return;

  //проверяем что клик был по кнопке "задача выполнена"
  const parentNode = event.target.closest('.list-group-item');

  //определяем ID задачи
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLOcalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');

}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
    <li id="emptyList" class="list-group-item empty-list">
       <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
       <div class="empty-list__title">Список дел пуст</div>
    </li>`
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLOcalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    //формируем css класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    //формируем разметку для новой задачи
    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
          <div class="task-item__buttons">
             <button type="button" data-action="done" class="btn-action">
                 <img src="./img/tick.svg" alt="Done" width="18" height="18">
             </button>
             <button type="button" data-action="delete" class="btn-action">
                 <img src="./img/cross.svg" alt="Done" width="18" height="18">
             </button>
         </div>
     </li>`;
  
    //добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

