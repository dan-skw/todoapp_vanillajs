let userTasks = [];

const addTask = (input) => {
  const task = {
    input,
    done: false,
    id: Date.now(),
  };

  userTasks.push(task);
  createList(task);
};

const submitForm = document.querySelector(".submit-form");
submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector(".input-text");
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = "";
    input.focus();
  } else {
    replayAnimation();
    stopAnimation();
  }
});

const list = document.querySelector(".task-list");

const createList = (task) => {
  localStorage.setItem("userTasksRef", JSON.stringify(userTasks));
  const item = document.querySelector(`[data-key='${task.id}']`);
  if (task.deleted) {
    item.remove();
    return;
  }
  const isDone = task.done ? "done" : "";

  const listItem = createElem("li", `list-item ${isDone}`, task.id);

  const doneButton = createElem("button", "done-button", "done-button");
  const removeButton = createElem("button", "remove-button", "remove-button");
  const listItemContent = createElem(
    "div",
    "listitem-content",
    "listitem-content"
  );
  listItemContent.textContent = `${task.input}`;
  listItem.prepend(doneButton);
  listItem.append(listItemContent);
  listItem.append(removeButton);

  if (item) {
    list.replaceChild(listItem, item);
  } else {
    list.append(listItem);
  }
};

const createElem = (tag, classN, dataK) => {
  const newItem = document.createElement(tag);
  newItem.setAttribute("class", classN);
  newItem.setAttribute("data-key", dataK);

  return newItem;
};

const clearButton = document.querySelector(".delete-tasks");

clearButton.addEventListener("click", (event) => {
  if (list.hasChildNodes()) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }
  localStorage.clear();
});

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("done-button")) {
    const datakey = e.target.parentElement.dataset.key;
    markAsDone(datakey);
  }

  if (e.target.classList.contains("remove-button")) {
    const datakey = e.target.parentElement.dataset.key;
    removeTask(datakey);
  }
});

const markAsDone = (datakey) => {
  const index = userTasks.findIndex((item) => item.id === Number(datakey));
  userTasks[index].done = !userTasks[index].done;
  createList(userTasks[index]);
};

const removeTask = (datakey) => {
  const index = userTasks.findIndex((item) => item.id === Number(datakey));
  const task = {
    deleted: true,
    ...userTasks[index],
  };

  userTasks = userTasks.filter((item) => item.id !== Number(datakey));
  createList(task);
};

const replayAnimation = () => {
  const modal = document.querySelector(".my-modal");
  modal.className = "my-modal";
  window.requestAnimationFrame((time) => {
    window.requestAnimationFrame((time) => {
      modal.className = "my-modal slide";
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const locstor = localStorage.getItem("userTasksRef");
  if (locstor) {
    userTasks = JSON.parse(locstor);
    userTasks.forEach((task) => {
      createList(task);
    });
  }
});
