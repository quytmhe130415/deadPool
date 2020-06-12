"use strict";
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
    ipcMain.on("show-search", async() => {
        mainWindow.loadFile("./search/search.html");
    });

    //* like
    ipcMain.on("show-favorites", async() => {
        mainWindow.loadFile("./favourites/fav.html");
    });

    //* upload
    ipcMain.on('show-upload', async() => {
        mainWindow.loadFile('./upload/upload.html');
    })

    //* open file to upload
    ipcMain.on('show-openFile', () => {
        dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
            .then(path => {
                if (path) {
                    post(path);
                }
            }).catch(err => console.log(err));
    });

    //* check img to download
    ipcMain.on("no-item", () => {
        dialog.showMessageBox({
            type: "error",
            message: "No img favorites to download!!!"
        }).catch(console.log);
    });

    //* download img
    ipcMain.on('downloadFav', (event, dataImg) => {
        dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] })
            .then((data) => {
                console.log(data.filePaths[0]);
                if (!data.filePaths[0]) return;
                downloadAllFile(data.filePaths[0], dataImg)
                    .then(() => {
                        dialog.showMessageBox({
                            title: "Message",
                            message: "Download Done!!!"
                        }).catch(console.log);
                    }).catch(console.log);
            })
    });

    //* function download img
    const downloadOneImg = ({ url, filePath }) => {

        return new Promise(async(resolve, reject) => {
            const response = await Axios({
                responseType: 'stream',
                method: 'GET',
                url: url,
            })

            const ws = fs.createWriteStream(filePath)
            ws.once('close', resolve)
            ws.once('error', reject)
            response.data.pipe(ws)
        })
    }

    //* function download allFile
    function downloadAllFile(folder, storage) {
        if (!folder) return;
        const images = Object.keys(storage).map((imageKey) => {
            const filePath = path.resolve(folder, `${Math.floor(Math.random() * Number.MAX_VALUE)}.gif`)
            return {
                filePath,
                url: storage[imageKey],
            }
        })
        return Promise.all(images.map(image => downloadOneImg(image)))
            .catch((e) => { console.log(e) });
    }
};

app.whenReady().then(() => {
    createWindow();
});