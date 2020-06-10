const btnFetch = document.querySelector("#btnSearch");
const { ipcRenderer, dialog } = require("electron");
const showGif = document.querySelector(".show");
const urlLoad =
  "https://i.imgur.com/gVX3yPJ.gif";
// const clipboard = require('electron-clipboard-extended');



btnFetch.addEventListener("click", (e) => {
  e.preventDefault();
  btnFetch.disabled = true;
  const txtSearch = document.querySelector("#txtSearch").value;
  ipcRenderer.send("search-gifs", txtSearch);
});

//* accept enter!
document.querySelector("#txtSearch").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const txtSearch = document.querySelector("#txtSearch").value;
    ipcRenderer.send("search-gifs", txtSearch);
  }
});

//*form
let lastKeyword = "";
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const txtSearch = document.querySelector("#txtSearch").value;
  if (txtSearch === lastKeyword) return;
  showGif.innerHTML = "";
  lastKeyword = txtSearch;
  ipcRenderer.send("search-gifs", txtSearch);
});

//* loading image
ipcRenderer.on("rely-search", async (event, arg) => {
  const lstImage = arg.images;
  for (const item of lstImage) {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card";
    imageCard.style.backgroundImage = `url(${urlLoad})`;
    showGif.append(imageCard);

    const img = document.createElement("img");
    img.src = item.url;
    img.classList.add("imgCss");
    imageCard.appendChild(img);

    const favou = document.createElement("img");
    favou.classList.add("imgFav");
    favou.src = "../download.png";

    imageCard.appendChild(favou);

    img.onload = () => {
      imageCard.style.backgroundImage = `url('${item.url}')`;
    };
    showGif.appendChild(imageCard);
  }
  btnFetch.disabled = false;
});
//* focus txtSearch
document.querySelector("#tab-search").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#txtSearch").focus();
});

onscroll = (e) => {
  e.preventDefault();
  observer.observe(document.querySelector('#btnSearch'));
};

const observer = new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting === true) {
    const txtSearch = document.querySelector("#txtSearch").value;
    ipcRenderer.send("search-gifs", txtSearch);

  }
}, {threshold: [1]});
