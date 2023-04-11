// UI elements
const modal = document.querySelector(".modal");
const addBookForm = document.querySelector("#bookForm");
const inputTitle = document.querySelector("#title");
const inputAuthor = document.querySelector("#author");
const inputPages = document.querySelector("#pages");
const inputRead = document.querySelector("#read");
const cardContainer = document.querySelector(".card-container");
const closeBtn = document.querySelector(".btn-close");

// event listeners
document.querySelector("#addBook").addEventListener("click", openModal);
document.querySelector(".btn-close").addEventListener("click", closeModal);
addBookForm.addEventListener("submit", addNewBook);
cardContainer.addEventListener("click", handleClick);

let myLibrary = [];
let currentActiveElement;

// Book Constructor
function Book(id, title, author, pages, read) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// initial demo data
const demoData = [
  {
    id: 0,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    pages: 290,
    read: true,
  },
  {
    id: 1,
    title: "Dad Jokes",
    author: "U.B. Laffing",
    pages: 50,
    read: true,
  },
  {
    id: 2,
    title: "Lost in Time",
    author: "A Seiko",
    pages: 178,
    read: false,
  },
  {
    id: 3,
    title: "The chronicles of Lord Selbington the 3rd",
    author: "N. Owen and L. Glover",
    pages: 9999,
    read: false,
  },
];

// push demo data into myLibrary as book objects
myLibrary = demoData.map(
  ({ id, title, author, pages, read }) =>
    new Book(id, title, author, pages, read)
);

// openModal
function openModal() {
  //get active element
  currentActiveElement = document.activeElement;
  clearForm();
  modal.classList.remove("hidden");

  //get list of focusable elements
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tanindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  firstFocusable.focus();

  modal.addEventListener("keydown", (e) => {
    modalKeyTrap(e, firstFocusable, lastFocusable, currentActiveElement);
  });
  document.querySelector("section.modal").addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.className === "modal") {
      closeModal();
    }
  });
}

// closeModal
function closeModal() {
  modal.classList.add("hidden");
  currentActiveElement.focus();
}

function modalKeyTrap(e, firstFocusable, lastFocusable) {
  if (e.key === "Escape") {
    e.preventDefault();
    closeModal();
  }

  if (e.key !== "Tab") return;
  if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
      lastFocusable.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      firstFocusable.focus();
      e.preventDefault();
    }
  }
}

// addNewBook
function addNewBook(e) {
  e.preventDefault();
  const id = myLibrary[myLibrary.length - 1].id + 1;
  const newBook = new Book(
    id,
    inputTitle.value,
    inputAuthor.value,
    inputPages.value,
    inputRead.checked
  );
  myLibrary.push(newBook);
  displayCard(newBook);
  clearForm();
  closeModal();
}

function clearForm() {
  inputTitle.value = "";
  inputAuthor.value = "";
  inputPages.value = "";
  inputRead.checked = false;
}

function deleteBook(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  card.remove();

  // delete from the library
  myLibrary.splice(id, 1);
}

function handleClick(e) {
  const id = e.target.closest(".card").getAttribute("data-id");
  if (
    e.target.parentElement.classList.contains("delete-button") ||
    e.target.classList.contains("delete-button")
  ) {
    deleteBook(id);
  }
  if (e.target.className === "toggle-checkbox") {
    myLibrary[id].toggleRead();
  }
}

function displayCard(book) {
  const card = document.createElement("article");
  card.setAttribute("data-id", book.id);
  card.classList.add("card");

  const cardHeading = document.createElement("header");
  cardHeading.classList.add("card-header");
  card.appendChild(cardHeading);

  const title = document.createElement("h2");
  title.textContent = book.title;
  cardHeading.appendChild(title);

  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");
  card.appendChild(cardContent);

  const authorHeading = document.createElement("span");
  authorHeading.textContent = "Author";
  authorHeading.classList.add("card-content-heading");
  cardContent.appendChild(authorHeading);

  const author = document.createElement("p");
  author.textContent = book.author;
  cardContent.appendChild(author);

  const pagesHeading = document.createElement("span");
  pagesHeading.textContent = "Pages";
  pagesHeading.classList.add("card-content-heading");
  cardContent.appendChild(pagesHeading);

  const pages = document.createElement("p");
  pages.textContent = book.pages;
  cardContent.appendChild(pages);

  const cardFooter = document.createElement("footer");
  cardFooter.classList.add("card-footer");
  card.appendChild(cardFooter);

  const toggleLabel = document.createElement("label");
  toggleLabel.classList.add("toggle1");
  toggleLabel.textContent = "Have Read?";
  cardFooter.appendChild(toggleLabel);

  const toggleCheckbox = document.createElement("input");
  toggleCheckbox.setAttribute("type", "checkbox");
  toggleCheckbox.setAttribute("name", "toggle");
  toggleCheckbox.classList.add("toggle-input");
  book.read
    ? (toggleCheckbox.checked = true)
    : (toggleCheckbox.checked = false);
  toggleLabel.appendChild(toggleCheckbox);

  const toggleDisplay = document.createElement("span");
  toggleDisplay.classList.add("toggle-display");
  toggleDisplay.setAttribute("hidden", "true");
  toggleLabel.appendChild(toggleDisplay);

  const onIcon = document.createElement("i");
  onIcon.classList.add("bi", "bi-check");
  onIcon.setAttribute("aria-hidden", "true");
  toggleDisplay.appendChild(onIcon);

  const offIcon = document.createElement("i");
  offIcon.classList.add("bi", "bi-x");
  offIcon.setAttribute("aria-hidden", "true");
  toggleDisplay.appendChild(offIcon);

  const deleteBookButton = document.createElement("button");
  deleteBookButton.setAttribute("type", "button");
  deleteBookButton.classList.add("delete-button");
  deleteBookButton.setAttribute("aria-label", "Delete Book");
  deleteBookButton.innerHTML = "<i class='bi bi-trash3'></i>";
  cardFooter.appendChild(deleteBookButton);

  cardContainer.appendChild(card);
}

myLibrary.forEach(displayCard);
