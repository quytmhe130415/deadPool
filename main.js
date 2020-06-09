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
    mainWindow.loadFile("./search/search.html");
    mainWindow.webContents.openDevTools();
};
ipcMain.on("search-gifs", async(event, arg) => {
    const keyWord = await fetchGifSearch(arg);
    event.reply("rely-search", keyWord);
});
app.whenReady().then(() => {
    createWindow();
});