const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

// アプリを閉じた時にquit
app.on('window-all-closed', function () {
  app.quit();
});

// アプリ起動後の処理
app.on('ready', function () {
  let subpy = require('child_process').spawn('python', ['./app.py']);

  const mainAddr = 'http://localhost:5000';

  const openWindow = function () {
    mainWindow = new BrowserWindow({
      width: 400,
      height: 300,
      webPreferences: {
        nodeIntegration: true,
      }
    });
    mainWindow.loadURL(mainAddr);

    // 終了処理
    mainWindow.on('closed', function () {

      // キャッシュを削除
      electron.session.defaultSession.clearCache(() => {})
      mainWindow = null;
    });
  };

  const startUp = function () {
    fetch(mainAddr, { signal: AbortSignal.timeout(5000) })
      .then(response => {
        if (!response.ok) throw new Error(`Backend returned HTTP ${response.status}`);
        return response.text();
      })
      .then(function (htmlString) {
        console.log('server started');
        openWindow();
      })
      .catch(function (err) {
        setTimeout(startUp, 100);
      });
  };

  startUp();
});