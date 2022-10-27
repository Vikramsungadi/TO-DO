const body = document.querySelector("body");
const button = document.querySelector(".btn");
const taskinput = document.querySelector(".input");
const main = document.querySelector(".main");
const trashicon = document.querySelector("i");
const bottomCard = document.querySelector(".bottom--card");
const pa = document.querySelectorAll(".para");
const theme_icon = document.querySelector(".theme");
const dropdown = document.querySelector(".dropdown");
const bottomCards = document.querySelector(".main");
const overlay = document.querySelector(".overlay");
const app = document.querySelector(".app");
const option = document.querySelector(".option");
const dropinput = document.querySelector(".drop-input");

//                          Event Listeners

button.addEventListener("click", addTask);
main.addEventListener("click", removeTask);
main.addEventListener("click", checkTask);
main.addEventListener("click", edit);
theme_icon.addEventListener("click", changeTheme);
document.addEventListener("DOMContentLoaded", loadTasksFromLS);
dropinput.addEventListener("click", toggling);
option.addEventListener("click", filter);

//                            Dark Mode Detection

darkmode = window.matchMedia("(prefers-color-scheme: dark)");
if (darkmode.matches) {
  body.classList.add("dark--theme");
}

//                          CREATING TASK COMPONENT

function creatingTaskComponent(text, id) {
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
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  span.classList.add("time");
  span2.classList.add("id");
  const time = getDateTime(Date());
  span.innerText = time;
  span2.innerText = id;

  icon.append(check, trash, edit, span);
  card.append(p, icon, span, span2);
  main.appendChild(card);
}

//              LOADING  FROM LOCAL STORAGE TO DOM

function loadTasksFromLS() {
  // theme restore
  if (localStorage.getItem("theme") !== null) {
    theme = JSON.parse(localStorage.getItem("theme"));
    if (theme === "dark") {
      body.classList.add("dark--theme");
    } else {
      body.classList.remove("dark--theme");
    }
  }
  // task restoration
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
      const span = document.createElement("span");
      const span2 = document.createElement("span");
      span.classList.add("time");
      span2.classList.add("id");
      span2.innerText = task.id;
      span.innerText = getDateTime(task.time);
      icon.append(check, trash, edit);
      card.append(p, icon, span, span2);
      main.appendChild(card);
    });
  }
}

//                          ADDING TASK TO DOM and STORING TO LS

function addTask() {
  if (taskinput.value === "") {
    //creating modal
    let modal = document.createElement("div");
    let div = document.createElement("div");
    let span1 = document.createElement("span");
    let span2 = document.createElement("span");
    let i = document.createElement("i");
    let i2 = document.createElement("i");
    let p = document.createElement("p");

    i.classList.add("fa-solid", "fa-xmark");
    modal.classList.add("modal");
    i2.classList.add("fa-solid", "fa-pen");
    p.innerText = "Write something to add.....";
    span1.classList.add("close");
    span2.classList.add("pen");

    span1.append(i);
    span2.append(i2);
    div.append(span2, p);
    modal.append(span1, div);
    overlay.append(modal);
    app.classList.add("modalopened");

    return closingModal();
  } else {
    valueid = storeTaskinLS(taskinput.value);
    creatingTaskComponent(taskinput.value, valueid);
    taskinput.value = "";
  }
}
// function for closing modal
function closingModal() {
  const closed = document.querySelector(".close");
  closed.addEventListener("click", (e) => {
    let modal = e.target.parentElement.parentElement;

    if (modal.classList.contains("modal")) {
      modal.classList.toggle("fadeoutt");
      app.classList.remove("modalopened");

      setTimeout(() => {
        modal.remove();
      }, 770);
    }
  });
}

function storeTaskinLS(enteredText) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  if (tasks.length === 0) {
    obj = { Text: enteredText, strike: false, time: new Date(), id: 1 };
  } else {
    let id = tasks[tasks.length - 1].id;
    obj = { Text: enteredText, strike: false, time: new Date(), id: id + 1 };
  }

  tasks.push(obj);
  x = obj.id;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  return x;
}

//                      REMOVING TASK COMPONENT FROM DOM

function removeTask(e) {
  let bottomCardDiv = e.target.parentElement.parentElement;
  let cardId = bottomCardDiv.querySelector(".id");

  let paratext = bottomCardDiv.querySelector("p");
  if (
    bottomCardDiv.classList.contains("bottom--card") &&
    e.target.classList.contains("fa-trash")
  ) {
    bottomCardDiv.classList.toggle("animation");

    bottomCardDiv.addEventListener("transitionend", function () {
      bottomCardDiv.remove();
      removeTaskFromLS(cardId.innerText);
    });
  }
}

//removing task func

function removeTaskFromLS(id) {
  let tasks;
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task, index) {
    if (parseInt(id) === task.id) {
      tasks.splice(index, 1);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}

//                                      MarkingTask

function checkTask(e) {
  const card = e.target.parentElement.parentElement;
  let cardId = card.querySelector(".id");
  if (
    card.classList.contains("bottom--card") &&
    e.target.classList.contains("fa-circle-check")
  ) {
    const p = card.querySelector("p");
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    if (p.classList.contains("strike")) {
      p.classList.remove("strike");
      card.classList.remove("strike--card");
      storeStrikesToLS(cardId.innerText);
    } else {
      p.classList.add("strike");
      card.classList.add("strike--card");
      storeStrikesToLS(cardId.innerText);
    }
  }
}

//                    Storing Marked Tasks to LS

function storeStrikesToLS(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task) {
    if (task.id === parseInt(id)) {
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
    let idspan = grandparent.querySelector(".id");
    let value_id = idspan.innerText;
    let p = grandparent.querySelector("p");
    let textp = p.innerText;

    grandparent.innerHTML = `<div class="input--holder">
          <div class="btn--div">
            <input class="input input2"  value="${textp}" type="text" />
            <button type="submit" class="btn2">Done</button>
          </div>
        </div>`;

    return main.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn2")) {
        let bottomcard = e.target.parentElement.parentElement.parentElement;
        let input = bottomcard.querySelector("input");
        let UpdatedText = input.value;
        let x = e.target.closest(".bottom--card");

        UpdateTask(x, value_id, UpdatedText);
      }
    });
  }
}

//                           function for Updating task in LS and DOM

function UpdateTask(x, value_id, text) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task) {
    if (task.id === parseInt(value_id)) {
      task.Text = text;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // creating div after editing
      let span = document.createElement("span");
      let span2 = document.createElement("span");
      let p = document.createElement("p");
      span.classList.add("time");
      span2.classList.add("id");
      span.innerText = getDateTime(Date());
      span2.innerText = value_id;
      p.classList.add("para");

      //        if edit opiton is to be enabled even after striking use below

      // let striked = task.strike;
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
      x.append(p, div, span, span2);
      return;
    }
  });
}

//                                  Function to Change Theme
function changeTheme(e) {
  let card_wrap = body.querySelector(".card-wrapper");

  if (body.classList.contains("dark--theme")) {
    body.classList.remove("dark--theme");
    preserveTheme("light");
  } else {
    body.classList.add("dark--theme");
    preserveTheme("dark");
  }

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

function preserveTheme(bool) {
  let theme;
  if (localStorage.getItem("theme") == null) {
    theme = "";
  } else {
    theme = JSON.parse(localStorage.getItem("theme"));
  }
  theme = bool;
  localStorage.setItem("theme", JSON.stringify(theme));
}

//                                    TIME STAMP
function getDateTime(data) {
  let weekday = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sat",
  };

  const date = new Date(data);
  return `${date.toTimeString().slice(0, 5)} `;
  //${weekday[date.getDay()]}
}

//                                          FILTER FUNCTION

function filter(e) {
  option.classList.toggle("none");

  let todos = Array.from(bottomCards.children);
  todos.forEach(function (todo) {
    if (todo.classList.contains("none")) {
      todo.classList.remove("none");
    }
  });
  choice = e.target.innerText;
  dropinput.value = choice;
  switch (choice) {
    case "All":
      todos.forEach(function (todo) {
        if (todo.classList.contains("none")) {
          todo.classList.remove("none");
        }
      });
      break;

    case "Completed":
      todos.forEach(function (todo) {
        if (!todo.classList.contains("strike--card")) {
          todo.classList.add("none");
        }
      });
      break;

    case "Incompleted":
      todos.forEach(function (todo) {
        if (todo.classList.contains("strike--card")) {
          todo.classList.add("none");
        }
      });
      break;
    default:
      break;
  }
}
function toggling(e) {
  if (e.target.classList.contains("drop-input")) {
    option.classList.toggle("none");
  }
}
