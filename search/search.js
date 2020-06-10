const btnFetch = document.querySelector("#btnSearch");
const showGif = document.querySelector(".show");
const urlLoad = "https://i.imgur.com/gVX3yPJ.gif";
const { ipcRenderer, dialog } = require("electron");
// var localStorage = require("localStorage");
// const { saveGif } = require('../storageGif.js');

// const clipboard = require('electron-clipboard-extended');

//* add event for Favorites
document.querySelector("#tab-favorites").addEventListener("click", (e) => {
  e.preventDefault();
  ipcRenderer.send("show-favorites");
});

//* add event for upload
document.querySelector("#tab-upload").addEventListener("click", (e) => {
  e.preventDefault();
  ipcRenderer.send("show-upload");
});

//* add event for button
btnFetch.addEventListener("click", (e) => {
  e.preventDefault();
  btnFetch.disabled = true;
  const txtSearch = document.querySelector("#txtSearch").value;
  ipcRenderer.send("search-gifs", { txtSearch: txtSearch, status: false });
});

//* accept enter!
document.querySelector("#txtSearch").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const txtSearch = document.querySelector("#txtSearch").value;
    ipcRenderer.send("search-gifs", txtSearch);
  }
});

//* submit form
let lastKeyword = "";
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const txtSearch = document.querySelector("#txtSearch").value;
  if (txtSearch === lastKeyword) return;
  showGif.innerHTML = "";
  lastKeyword = txtSearch;
  ipcRenderer.send("search-gifs", { txtSearch: txtSearch, status: true });
});

//* loading image
ipcRenderer.on("rely-search", (event, arg) => {
  const lstImage = arg.images;
  for (const item of lstImage) {
    const divImgCard = document.createElement("div");
    divImgCard.className = "image-card";
    divImgCard.style.backgroundImage = `url(${urlLoad})`;

    showGif.append(divImgCard);

    const img = document.createElement("img");
    img.src = item.url;
    img.classList.add("imgCss");
    divImgCard.appendChild(img);
    img.style.display = "none";

    const favou = document.createElement("img");
    favou.classList.add("imgFav");
    favou.src = "../like.png";

    divImgCard.appendChild(favou);

    divImgCard.onmouseover = function () {
      favou.style.display = "block";
    };
    divImgCard.onmouseout = function () {
      favou.style.display = "none";
    };
    img.onload = () => {
      divImgCard.style.backgroundImage = `url('${item.url}')`;
    };
    favou.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem(item.url, item.url);
      document.querySelector(
        "#tab-favorites"
      ).innerText = `Favorites(${localStorage.length})`;
    });
    showGif.appendChild(divImgCard);
  }
  btnFetch.disabled = false;
});
//* focus txtSearch
document.querySelector("#tab-search").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#txtSearch").focus();
});

//* infinite scroll
onscroll = (e) => {
  e.preventDefault();
  observer.observe(document.querySelector("#btnSearch"));
};

const observer = new IntersectionObserver(
  function (entries) {
    if (entries[0].isIntersecting === true) {
      const txtSearch = document.querySelector("#txtSearch").value;
      ipcRenderer.send("search-gifs", { txtSearch: txtSearch, status: false });
    }
  },
  { threshold: [1] }
);
