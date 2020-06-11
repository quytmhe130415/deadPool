const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { fetchGifSearch, fetchGifs } = require("./app.js");
const fs = require("fs-extra");
const Axios = require("axios");
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
    ipcMain.on("search-gifs", async(event, arg) => {
        const keyWord = await fetchGifSearch(arg);
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
          if(path){
            post(path);
          }
        }).catch(err => console.log(err));
    })
};
app.whenReady().then(() => {
    createWindow();
});