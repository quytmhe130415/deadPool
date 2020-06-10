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
        icon: __dirname + "./skype.png",
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

};
app.whenReady().then(() => {
    createWindow();
});