const body = document.querySelector("body");
const button = document.querySelector(".btn");
const taskinput = document.querySelector(".input");
const main = document.querySelector(".main");
const trashicon = document.querySelector("i");
const bottomCard = document.querySelector(".bottom--card");
const pa = document.querySelectorAll(".para");
const theme_icon = document.querySelector(".theme");

//                          Event Listeners

button.addEventListener("click", addTask);
main.addEventListener("click", removeTask);
main.addEventListener("click", checkTask);
main.addEventListener("click", edit);
theme_icon.addEventListener("click", changeTheme);
document.addEventListener("DOMContentLoaded", loadTasksFromLS);

//                          CREATING TASK COMPONENT

function creatingTaskComponent(text) {
  const card = document.createElement("div");
  card.classList.add("top--card", "bottom--card");
  const p = document.createElement("p");
  p.className = "para";
  p.innerText = text;
  const trash = document.createElement("i");
  trash.className = "fa-solid fa-trash";
  const check = document.createElement("i");
  check.className = "fa-regular fa-circle-check";
  const edit = document.createElement("i");
  edit.className = "fa-solid fa-pen-to-square";
  const icon = document.createElement("div");
  icon.className = "icon";
  icon.append(check, trash, edit);
  card.append(p, icon);
  main.appendChild(card);
}

//              LOADING TASKS FROM LOCAL STORAGE TO DOM

function loadTasksFromLS() {
  if (localStorage.getItem("tasks") !== null) {
    let tasks;
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(function (task) {
      const card = document.createElement("div");
      card.classList.add("top--card", "bottom--card");

      const p = document.createElement("p");
      p.className = "para";
      if (task.strike === true) {
        card.classList.add("strike--card");
        p.classList.add("strike");
      }
      p.innerText = task.Text;

      const trash = document.createElement("i");
      trash.className = "fa-solid fa-trash";
      const check = document.createElement("i");
      check.className = "fa-regular fa-circle-check";
      const edit = document.createElement("i");
      edit.className = "fa-solid fa-pen-to-square";
      const icon = document.createElement("div");
      icon.className = "icon";
      icon.append(check, trash, edit);
      card.append(p, icon);

      main.appendChild(card);
    });
  }
}

//                          ADDING TASK TO DOM

function addTask() {
  if (taskinput.value === "") {
    alert("Add a Task");
  } else {
    creatingTaskComponent(taskinput.value);
    storeTaskinLS(taskinput.value);
    taskinput.value = "";
  }
}

//                     STORING USER GIVEN TASK IN LOCAL STORAGE

function storeTaskinLS(task) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  obj = { Text: task, strike: false };
  tasks.push(obj);

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//                      REMOVING TASK COMPONENT FROM DOM

function removeTask(e) {
  let bottomCardDiv = e.target.parentElement.parentElement;
  if (
    bottomCardDiv.classList.contains("bottom--card") &&
    e.target.classList.contains("fa-trash")
  ) {
    bottomCardDiv.classList.toggle("animation");
    bottomCardDiv.addEventListener("transitionend", function () {
      bottomCardDiv.remove();
      removeTaskFromLS(bottomCardDiv.textContent);
    });
  }
}

//                   function for REMOVING TASK INPUT IN LOCAL STORAGE

function removeTaskFromLS(text) {
  let tasks;
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task, index) {
    if (text === task.Text) {
      tasks.splice(index, 1);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}

//                                      MarkingTask

function checkTask(e) {
  const card = e.target.parentElement.parentElement;
  if (
    card.classList.contains("bottom--card") &&
    e.target.classList.contains("fa-circle-check")
  ) {
    const p = card.querySelector("p");
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    if (p.classList.contains("strike")) {
      p.classList.remove("strike");
      card.classList.remove("strike--card");
      storeStrikesToLS(p.textContent);
    } else {
      p.classList.add("strike");
      card.classList.add("strike--card");
      storeStrikesToLS(p.textContent);
    }
  }
}

//                    Storing Marked Tasks to LS

function storeStrikesToLS(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task) {
    if (task.Text === text) {
      if (task.strike === true) {
        task.strike = false;
      } else {
        task.strike = true;
      }
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });
}

//                    Editing Task and Storing to LS

function edit(e) {
  let grandparent = e.target.parentElement.parentElement;
  let parent = e.target.parentElement;
  if (
    grandparent.classList.contains("bottom--card", "top--card") &&
    e.target.classList.contains("fa-pen-to-square")
  ) {
    let p = parent.previousElementSibling;
    let textp = p.textContent;

    grandparent.innerHTML = `<div class="input--holder">
          <div class="btn--div">
            <input class="input input2"  value="${textp}" type="text" />
            <button type="submit" class="btn2">Done</button>
          </div>
        </div>`;

    return main.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn2")) {
        let text = e.target.previousElementSibling.value;
        let x = e.target.closest(".bottom--card");

        UpdateTask(x, textp, text);
      }
    });
  }
}

//                           function for Updating task in LS and DOM

function UpdateTask(x, previousvalue, text) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task) {
    if (task.Text === previousvalue) {
      task.Text = text;
      let striked = task.strike;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // creating div after editing
      let p = document.createElement("p");
      p.classList.add("para");
      //        if edit opiton is to be enabled even after striking use below

      // if (striked) {
      //   p.classList.add("para", "strike");
      // } else {
      //   p.classList.add("para");
      // }
      p.innerText = text;
      div = document.createElement("div");
      div.classList.add("icon", "checked--icons");
      div.innerHTML = `<i class="fa-regular fa-circle-check"></i
                    ><i class="fa-solid fa-trash"></i><i class="fa-solid fa-pen-to-square">`;

      x.innerHTML = "";
      x.append(p, div);
    }
  });
}

function changeTheme(e) {
  let card_wrap = body.querySelector(".card-wrapper");

  body.classList.toggle("dark--theme");
  theme_icon.style.animation = "rotatee 3s";
  card_wrap.style.animation = "myfade 4s";

  setTimeout(() => {
    if (e.target.classList.contains("fa-sun")) {
      e.target.parentElement.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    } else if (e.target.classList.contains("fa-moon")) {
      e.target.parentElement.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }
  }, 1500);

  setTimeout(() => {
    theme_icon.style.animation = "";
    card_wrap.style.animation = "";
  }, 4000);
}
