const btnFetch = document.querySelector("#btnSearch");
const { ipcRenderer, dialog } = require("electron");
const showGif = document.querySelector(".show");
const urlLoad = "https://i.pinimg.com/originals/67/08/fc/6708fcc75056864713bb1675dca82034.gif";
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

ipcRenderer.on("rely-search", async(event, arg) => {
    const lstImage = arg.images;
    for (const item of lstImage) {
        const imageCard = document.createElement("div");
        imageCard.className = "image-card";
        imageCard.style.backgroundImage = `url(${urlLoad})`;
        showGif.append(imageCard);


        const img = document.createElement('img');
        img.src = item.url;
        img.classList.add('imgCss');
        imageCard.appendChild(img);


        const favou = document.createElement('img');
        favou.classList.add('imgFav');
        favou.src = '../download.png';


        imageCard.appendChild(favou);

        img.onload = () => {
            imageCard.style.backgroundImage = `url('${item.url}')`;
        }
        showGif.appendChild(imageCard);

    }
});
//* focus txtSearch
document.querySelector("#tab-search").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#txtSearch").focus();
});

// const { images, isLastPage } = arg;
// console.log('infor' + images);
// const gifs = document.querySelectorAll('.gif');
// console.log(gifs);
// for (let j = 0; j < images.length; j++) {
//     let check = false;
//     console.log("check 1: " + check);
//     if (gifs.length !== 0) {
//         for (let i = 0; i < gifs.length; i++) {
//             if (gifs[i].id === images[j].id) {
//                 check = true;
//             }
//         }
//     }
//     console.log("check 2 " + check);
//     if (!check) {
//         console.log("check 3" + check);
//         //* create div
//         const divGif = document.createElement("div");
//         divGif.setAttribute("id", images[j].id);
//         console.log('id div: ' + images[j].id);
//         divGif.setAttribute("class", "container");
//         divGif.style.backgroundImage = `url('${gifLoad}')`;
//         //*create img
//         const imgGifs = document.createElement("img");
//         imgGifs.src = images[j].url;
//         console.log('url img : ' + imgGifs.src);
//         imgGifs.classList.add("imgCss");
//         imgGifs.style.display = "none";
//         divGif.appendChild(imgGifs);
//         console.log('info divGif' + divGif);
//         imgGifs.onload = (e) => {
//             divGif.style.backgroundImage = `url('${images[j].url}')`;
//         };
//         showGif.appendChild(divGif);
//         console.log('infor parent' + divGif.parentNode);
//     }
// }