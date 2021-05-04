# 准备三个文件
├── package.json
├── main.js
└── index.html
## 首先
、、、
package.json:
    {
  "name"    : "your-app",
  "version" : "0.1.0",
  "main"    : "main.js"
}

main.js:
var app = require('app');  // 控制应用生命周期的模块。
var BrowserWindow = require('browser-window');  // 创建原生浏览器窗口的模块

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {
  // 创建浏览器窗口。
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // 加载应用的 index.html
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // 打开开发工具
  mainWindow.openDevTools();

  // 当 window 被关闭，这个事件会被发出
  mainWindow.on('closed', function() {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    mainWindow = null;
  });
});

index.html
    自行添加
、、、
## 全局安装electron
-- electron-packager . app --win --out presenterTool --arch=x64 

## 文件目录下执行命令
-- electron-packager . app --win --out demoapp --arch=x64 --electron-version 1.4.14 --overwrite --ignore=node_modules
                                                                     （ 此处为版本号）


## --------------------------------------------------------------------教程版--------------------------------------------------------------------
## 同样准备文件
package.json：
{
  "name"    : "your-app",
  "version" : "0.1.0",
  "main"    : "main.js"
}

main.js:
var app = require('app');  // 控制应用生命周期的模块。
var BrowserWindow = require('browser-window');  // 创建原生浏览器窗口的模块

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {
  // 创建浏览器窗口。
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // 加载应用的 index.html
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // 打开开发工具
  mainWindow.openDevTools();

  // 当 window 被关闭，这个事件会被发出
  mainWindow.on('closed', function() {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    mainWindow = null;
  });
});

index.html
```
<html>
  <head>
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using io.js <script>document.write(process.version)</script>
    and Electron <script>document.write(process.versions['electron'])</script>.
  </body>
</html>
```

## npm 全局安装 electron-prebuilt
 -- npm install -g electron-prebuilt 
## 安装完成后运行
 -- electron .

## ------------------------------------在完成vue的项目创建后进行的electron-vue------------------------------------

## 第一步先把其它人基础下载
-- git clone https://github.com/electron/electron-quick-start



## 然后cnpm install下载依赖 然后 npm run start 运行 尝试是否成功

## vue打包exe安装
-- cnpm install electron-packager --save-dev 

## 最后配置package.json中的npm脚本命令，
"scripts": { 
"start": "electron .", 
"packager": "electron-packager ./ App --platform=win32 --arch=x64  --overwrite"//此处为添加命令
} 

## 然后输入命令
npm run packager


