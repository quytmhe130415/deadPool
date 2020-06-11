const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { fetchGifSearch, fetchGifs } = require("./app.js");
const fs = require("fs-extra");
const Axios = require("axios");
const pLimit = require("p-limit");
const https = require("https");
const path = require("path");
const UPLOAD_ROOT = "https://upload.giphy.com/v1/gifs";

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
        icon: __dirname + "./tiktok.png",
    });
    // mainWindow.setMenu(null);
    // mainWindow.webContents.openDevTools();

    mainWindow.loadFile("./search/search.html");

    //* fetch more
    ipcMain.on("search-gifs", async(event, keyWordSearch) => {
        const keyWord = await fetchGifSearch(keyWordSearch);
        event.reply("rely-search", keyWord);
    });

    //* show-search
    ipcMain.on("show-search", async(event, arg) => {
        mainWindow.loadFile("./search/search.html");
    });

    //* like
    ipcMain.on("show-favorites", async(event, arg) => {
        mainWindow.loadFile("./favourites/fav.html");
    });

    //* upload
    ipcMain.on('show-upload', async(event, arg) => {
        mainWindow.loadFile('./upload/upload.html');
    })

    //* open file to upload
    ipcMain.on('show-openFile', (event, arg) => {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
            .then(path => {
                if (path) {
                    post(path);
                }
            }).catch(err => console.log(err));
    });
    //* download img
    ipcMain.on('downloadFav', (event, urlImg) => {
        dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] })
            .then(async path => {
                if (!path.canceled) {
                    const limit = pLimit(5);
                    const imgPromise = urlImg.map((url) => {
                        return limit(() => {
                            return downloadImage(url, `${path.filePaths[0]}.gif`);
                        })
                    })
                    console.log(imgPromise);
                    await Promise.all(imgPromise);
                    dialog.showMessageBox({ message: "Download successful!!!" });
                } else {
                    throw new Error("open folder to export ...!");
                }
            }).catch(err => dialog.showMessageBox({ message: "download fail!" }))
    })

    //* function download img
    async function downloadImage(url, path) {
        const respose = await Axios({
            url,
            method: 'GET',
            resposeType: "stream"
        })
        const ws = fs.createWriteStream(path);
        return new Promise((resolve, reject) => {
            ws.once("close", resolve);
            ws.once("error", reject);
            respose.data.pipe(ws);
        })
    }
};
app.whenReady().then(() => {
    createWindow();
});