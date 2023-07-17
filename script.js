const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displaItems() {
  const itemFromStorage = getItemFromStorage();
  itemFromStorage.forEach((item) => addItemToDom(item));

  clearUi();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  let newItem = itemInput.value;
  if (newItem === "") {
    alert("please enter the item name");
  }
  //check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
    clearUi();
  }
  clearUi();

  //add item to dom
  addItemToDom(newItem);

  //add item to localstorage
  addItemToStorage(newItem);

  itemInput.value = "";
}

function addItemToDom(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  let itemFromStorage = getItemFromStorage();

  itemFromStorage.push(item);

  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function getItemFromStorage() {
  let itemFromStorage;

  if (localStorage.getItem("items") === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  //remove item from Dom
  if (confirm("are you sure")) {
    item.remove();

    //remove item from storage
    removeItemFromStorage(item.textContent);

    clearUi();
  }
}
function removeItemFromStorage(item) {
  let itemFromStorage = getItemFromStorage();

  itemFromStorage = itemFromStorage.filter((i) => i !== item);

  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function removeAllItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);

    localStorage.removeItem("items");
    clearUi();
  }
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function clearUi() {
  itemInput.value = "";

  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = "<i class ='fa-solid fa-plus'></i> Add Item";
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

itemForm.addEventListener("submit", onAddItemSubmit);
itemList.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", removeAllItems);
itemFilter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", displaItems);

clearUi();
