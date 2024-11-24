// Global Variables
var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var addBtn = document.getElementById("addBtn");
var bookmarksTable = document.getElementById("bookmarksTable");
var bookmarksData = document.getElementById("bookmarksData");
var emptyDashboard = document.getElementById("emptyDashboard");
var inputDialog = document.getElementById("inputDialog");
var infoDialog = document.getElementById("infoDialog");
var duplicationDialog = document.getElementById("duplicationDialog");
var infoOverlay = document.getElementById("infoOverlay");
var bookmarkList = [];

// Check if bookmarks exist in localStorage and load them
if (localStorage.getItem("bookmarks")) {
  bookmarkList = JSON.parse(localStorage.getItem("bookmarks"));
  // If the bookmark list is empty, remove it from localStorage
  if (bookmarkList.length === 0) {
    localStorage.removeItem("bookmarks");
  } else {
    displayBookmark(); // Display bookmarks if the list is not empty
  }
}

// Function to add a bookmark to the list
function addBookmark() {
  // Check if both the site name and URL are provided
  if (!siteName.value || !siteUrl.value) {
    triggerInfo();
    return;
  }

  // If the URL or Name is invalid, show the error dialog and stop
  if (!isValidInput(siteUrl) || !isValidInput(siteName)) {
    inputDialog.classList.remove("d-none");
    emptyDashboard.classList.add("d-none");
    bookmarksTable.classList.add("d-none");
    return;
  }

  if (checkDuplication()) {
    return;
  }

  var bookmark = {
    name: siteName.value,
    url: siteUrl.value,
  };

  bookmarkList.push(bookmark);
  clearForm();
  displayBookmark();
  updateLocalStorage();
  closeDialog();
}

// Function to display the list of bookmarks in the HTML
function displayBookmark() {
  var box = ``;

  // Loop through the bookmark list and create HTML for each bookmark
  for (var i = 0; i < bookmarkList.length; i++) {
    box += `
      <tr class="align-middle">
        <th class="text-start" scope="row">${i + 1}</th>
        <td class="text-end">${bookmarkList[i].name}</td>
        <td>
          <div class="d-flex justify-content-end">
            <a
              href="${bookmarkList[i].url}"
              target="_blank"
              class="btn-visit d-flex align-items-center"
            >
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </td>
        <td>
          <div class="d-flex justify-content-end">
            <button onclick = "deleteBookmark(${i});"
              class="btn-delete d-flex align-items-center"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  bookmarksData.innerHTML = box;
  toggleBookmarkDisplay();
}

// Function to clear the form inputs after adding a bookmark
function clearForm() {
  siteName.value = "";
  siteUrl.value = "";
}

// Function to delete a bookmark from the list
function deleteBookmark(deleteIndex) {
  bookmarkList.splice(deleteIndex, 1);
  updateLocalStorage();
  displayBookmark();
}

// Function to check if the URL & Name are valid
function isValidInput(element) {
  var regex = {
    siteName: /^[A-Z][\w]{1,30}(?:\s[\w]{1,30})?$/,
    siteUrl: /^(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$/
  }
    
  if (element.value && !regex[element.id].test(element.value)) {
    element.classList.add("form-invalid");
    return false;
  } else {
    element.classList.remove("form-invalid");
    return true;
  }
}

// Function to check if a bookmark already exists
function checkDuplication() {
  for (var i = 0; i < bookmarkList.length; i++) {
    if (bookmarkList[i].name.toLowerCase() === siteName.value.toLowerCase()) {
      duplicationDialog.classList.remove("d-none");
      infoOverlay.classList.remove("d-none");
      return true; // Return true to stop the bookmark from being added
    }
  }
  return false; // Return false if no duplications found
}

// Function to toggle the display of bookmarks (showing the empty dashboard if there are no bookmarks)
function toggleBookmarkDisplay() {
  if (bookmarkList.length === 0) {
    emptyDashboard.classList.remove("d-none");
    bookmarksTable.classList.add("d-none");
  } else {
    emptyDashboard.classList.add("d-none");
    bookmarksTable.classList.remove("d-none");
  }
}

// Function to update the bookmarks list in localStorage
function updateLocalStorage() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
}

// Function to trigger the display of the info dialog
function triggerInfo() {
  infoDialog.classList.remove("d-none");
  infoOverlay.classList.remove("d-none");
}

// Function to close the info dialog
function closeInfo() {
  infoDialog.classList.add("d-none");
  infoOverlay.classList.add("d-none");
  closeDialog();
  toggleBookmarkDisplay();
}

// Function to close the URL validation dialog
function closeDialog() {
  inputDialog.classList.add("d-none");
  toggleBookmarkDisplay();
}

// Function to close the duplication warning dialog
function closeDuplicationDialog() {
  duplicationDialog.classList.add("d-none");
  infoOverlay.classList.add("d-none");
  closeDialog();
  toggleBookmarkDisplay();
}
