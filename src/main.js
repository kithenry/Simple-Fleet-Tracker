const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");

function createWindow() {
  // creates window with provided size using electron API's BrowserWindow
  // Its in this that the html will be rendered
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // the webpreferences:
    // - for part of electron that runs the HTML , JS and CSS
    // - they define how this part, the renderer interacts with node.js and the electron environment.(defining what parts of node
    // - (modules) to integrate into browser)
    webPreferences: {
      nodeIntegration: true, // allows renderer to access node modules like: path, fs .. to interact with supabase client for CRUD ops
      contextIsolation: false, // setting nodeInt to true is insecure, a preload sript can solve this insecurity
      // contextIsolation determines if the renderer and node access the same JS context, controlling access to node's globals.
      // its set to false for simplicity for the start..
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
  // if no window was created, create window
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
