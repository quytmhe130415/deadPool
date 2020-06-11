"use strict";
const { ipcRenderer } = require("electron");
const displayGif = document.querySelector(".show");
const urlLoad = "https://i.imgur.com/gVX3yPJ.gif";

document.querySelector("#tab-favorites").innerText = `Favorites(${localStorage.length})`;
//* add event for search
document.querySelector("#tab-search").addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-search");

});
//* add event for search
document.querySelector("#tab-upload").addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-upload");

});
function loadImg() {
    const lstUrl = Object.values(localStorage);
    for (let i = 0; i < lstUrl.length; i++) {
        //* create div cover img
        const divImgCard = document.createElement('div');
        divImgCard.className = 'image-card';
        divImgCard.style.backgroundImage = `url(${urlLoad})`;

        displayGif.appendChild(divImgCard);

        //* create img
        const img = document.createElement('img');
        img.src = lstUrl[i];
        divImgCard.appendChild(img);
        img.style.display = 'none';

        const favou = document.createElement('img');
        favou.classList.add('imgFav');
        favou.src = '../unlike.png';

        divImgCard.appendChild(favou);

        divImgCard.onmouseover = function() {
            favou.style.display = 'block';
        }
        divImgCard.onmouseout = function() {
            favou.style.display = 'none';
        }

        img.onload = () => {
            divImgCard.style.backgroundImage = `url('${lstUrl[i]}')`;
        }

        favou.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem(lstUrl[i]);
            displayGif.removeChild(divImgCard);
            document.querySelector("#tab-favorites").innerText = `Favorites(${localStorage.length})`;
        });
        displayGif.appendChild(divImgCard);

    }
}

loadImg();
console.log(localStorage);