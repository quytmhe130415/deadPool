"use strict";
const { ipcRenderer } = require("electron");

//* add event for search
document.querySelector("#tab-search").addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-search");

});

//* add event for Favorites
document.querySelector("#tab-favorites").addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-favorites");
});
//* add event open

document.querySelector("#openFile").addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-openFile");

});

