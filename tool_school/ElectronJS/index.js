const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  // when ipcmain receives ping, it sends pong..
  ipcMain.handle("ping", () => "pong");
  createWindow();
  // if no windows are open, create on ; implemented below
  // windows cant be created before ready, hence all code is wrapped in here
  // on app readiness, only listen for activate events
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
