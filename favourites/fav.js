"use strict";
const { ipcRenderer } = require("electron");
const divDisplay = document.querySelector(".showGif");

document.querySelector("#tab-favorites").innerText = `Favorites(${localStorage.length})`;
//* add event for search
document.querySelector("#tab-search").addEventListener("click", (e) => {
  e.preventDefault();
  ipcRenderer.send("show-search");

});

console.log(localStorage);
