import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'
import { createDispatch, createZustandBridge } from '@zubridge/electron/main';
import { actionHandlers } from '../../src/store';
import { store } from '../../src/store/store';

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

let storeSubscribe
let storeUnsubscribe
let handlers

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win1: BrowserWindow | null = null
let win2: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow(window, dimensions) {
  window = new BrowserWindow({
    title: 'Main window',
    ...dimensions,
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    window.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    window.webContents.openDevTools()
  } else {
    window.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  window.webContents.on('did-finish-load', () => {
    window?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  console.log('Return window', window)
  return window
}

app.whenReady().then(async () => {
  const height = 512
  const width = 768
    const createWindows = async () => {
    const createdWindows =  await Promise.all([win1, win2].map((item, index) => {
      const dimensions = {
        height,
        width,
        x: height + (index * width),
        y: height,
      }
      return createWindow(item, dimensions)
    }))
      console.log('Created windows!', createdWindows)
      return createdWindows
  }
  const windows = await createWindows()
  console.log('Windows?', windows)
  handlers = actionHandlers(store)
  const { unsubscribe, subscribe } = createZustandBridge(
    store,
    // windows,
    // {
    //   handlers,
    // },
  )
  subscribe([win1])
  subscribe([win2])
  storeUnsubscribe = unsubscribe
  storeSubscribe = subscribe

})

app.on('window-all-closed', () => {
  win1 = null
  win2 = null
  if (process.platform !== 'darwin') app.quit()
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
