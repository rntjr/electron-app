import { app, BrowserWindow, nativeImage } from 'electron'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'

import {
  getWindowBounds,
  setWindowBounds
} from '../src/utils/windowBoundsCountroller'

let mainWindow: Electron.BrowserWindow | null

function createWindow() {
  const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/icon.png`)

  if (app.dock) {
    app.dock.setIcon(icon)
  }

  mainWindow = new BrowserWindow({
    ...getWindowBounds(),
    minWidth: 800,
    minHeight: 600,
    // frame: false,
    // transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('close', () => {
    setWindowBounds(mainWindow?.getBounds())
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app
  .on('ready', () => {
    createWindow()
    autoUpdater.checkForUpdatesAndNotify()
  })
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err))
      installExtension(REDUX_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err))
    }
  })

app.allowRendererProcessReuse = true
