"use strict";
const { ipcRenderer } = require("electron");
const displayGif = document.querySelector(".show");
const urlLoad = "https://i.imgur.com/gVX3yPJ.gif";
// let lstDownload = [];

//* Set favorites
document.querySelector("#tab-favorites").innerText = `Favorites(${localStorage.length})`;
//* add event for search
document.querySelector("#tab-search").addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-search");

});
//* add event to open upload
document.querySelector("#tab-upload").addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("show-upload");

});
//* load image fav
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

        //* create img fav
        const favou = document.createElement('img');
        favou.classList.add('imgFav');
        favou.src = '../unlike.png';

        divImgCard.appendChild(favou);

        //*add event for div 'cover img'
        divImgCard.onmouseover = function() {
            favou.style.display = 'block';
        }
        divImgCard.onmouseout = function() {
            favou.style.display = 'none';
        }

        //* check img loaded?
        img.onload = () => {
            divImgCard.style.backgroundImage = `url('${lstUrl[i]}')`;
        };
        //* add img like to list
        favou.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem(lstUrl[i]);
            displayGif.removeChild(divImgCard);
            document.querySelector("#tab-favorites").innerText = `Favorites(${localStorage.length})`;
        });

        //*add url image to lstDownload
        // lstDownload.push(lstUrl[i]);

        displayGif.appendChild(divImgCard);

    }
}
loadImg();
//* add event for btn export 'download'
document.querySelector('#btnDownload').addEventListener('click', async(e) => {
    e.preventDefault();
    if (!localStorage.length) {
        ipcRenderer.send('no-item');
    } else {
        ipcRenderer.send('downloadFav', localStorage);
    }

})
console.log(localStorage);