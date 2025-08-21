const { app, Tray, Menu, nativeImage, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let tray = null;
let serverProcess = null;
let isLaunchAtStartup = false;

// Hide the dock icon on macOS
if (app.dock) {
  app.dock.hide();
}

function createTray() {
  const iconPath = path.join(__dirname, 'src', 'assets', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);

  // Check current startup settings
  const settings = app.getLoginItemSettings();
  isLaunchAtStartup = settings.openAtLogin;

  updateMenu(false);
  tray.setToolTip('PAGE X Server');
}

function updateMenu(isServerRunning) {
  const statusLabel = isServerRunning ? 'Server Status: Running' : 'Server Status: Stopped';

  // 1x1 pixel PNG data URIs
  const greenDotUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  const redDotUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5/hPwAIAgL/4d1j1wAAAABJRU5ErkJggg==';

  const statusIcon = nativeImage.createFromDataURL(isServerRunning ? greenDotUri : redDotUri);

  const contextMenu = Menu.buildFromTemplate([
    { 
      label: statusLabel, 
      icon: statusIcon.resize({ width: 12, height: 12 }),
      enabled: false 
    },
    { type: 'separator' },
    { label: 'Start Server', enabled: !isServerRunning, click: startServer },
    { label: 'Stop Server', enabled: isServerRunning, click: stopServer },
    { type: 'separator' },
    { label: 'Open Bookmakers', click: openBookmakersFolder },
    {
        label: 'Launch at startup',
        type: 'checkbox',
        checked: isLaunchAtStartup,
        click: toggleLaunchAtStartup
    },
    { type: 'separator' },
    { label: 'Exit', click: () => {
        if (serverProcess) {
            stopServer();
        }
        app.quit();
    }}
  ]);

  tray.setContextMenu(contextMenu);
}

function startServer() {
  if (serverProcess) {
    console.log('Server is already running.');
    return;
  }

  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  
  serverProcess = spawn(command, ['run', 'dev'], {
    cwd: app.getAppPath(),
    shell: true
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server stdout: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server stderr: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    serverProcess = null;
    updateMenu(false);
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server process.', err);
    serverProcess = null;
    updateMenu(false);
  });

  console.log('Server process started with PID:', serverProcess.pid);
  updateMenu(true);
}

function stopServer() {
  if (!serverProcess) {
    console.log('Server is not running.');
    return;
  }

  console.log('Stopping server process with PID:', serverProcess.pid);
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", serverProcess.pid, '/f', '/t']);
  } else {
    serverProcess.kill();
  }
  
  // The 'close' event on the process will handle updating the menu
}

function openBookmakersFolder() {
    const bookmakersPath = path.join(app.getAppPath(), 'Bookmakers');
    shell.openPath(bookmakersPath).catch(err => console.error("Failed to open path", err));
}

function toggleLaunchAtStartup(menuItem) {
    const appPath = app.getPath('exe');
    const settings = {
        openAtLogin: menuItem.checked,
        path: appPath,
        args: []
    };
    
    app.setLoginItemSettings(settings);
    isLaunchAtStartup = menuItem.checked;
}

app.on('ready', createTray);

app.on('window-all-closed', () => {
  // Prevent app from quitting when all windows are closed
});

app.on('before-quit', () => {
    if (serverProcess) {
        stopServer();
    }
});
