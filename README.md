# uni-app-template-ui

### 1、目录结构

```
┌─components            uni-app组件目录
├─hybrid                App端存放本地html文件的目录
├─platforms             存放各平台专用页面的目录
├─pages                 业务页面文件存放的目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─list.vue        list页面
├─static                存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
├─wxcomponents          存放微信小程序的目录
├─common                存放css公共资源
├─utils                 存放js公共资源
├─api                   接口文件
├─store                 状态管理
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听 应用生命周期
├─manifest.json         配置应用名称、appid、logo、版本等打包信息
└─pages.json            配置页面路由、导航条、选项卡等页面类信息
```

### 2、开发工具

- 1.HBuilderX，建议下载App开发版，可开箱即用；如下载标准版，在运行或发行uni-app时，会提示安装uni-app插件，插件下载完成后方可使用。
- 2.建议选择3.0以上，因为3.0以下的版本不支持云打包。
- 3.HBuilderX安装路径中不要包含如（）等特殊字符。否则运行项目时将无法编译。错误示例：D:\Program Files (x86)\HBuilderX。
	
### 3、运行项目

1.安装依赖
```
npm install
```

2.项目配置
```javascript
//  配置开发及正式环境接口地址（utils/request.js）
process.env.NODE_ENV === 'development' ? '开发环境' : '部署环境'
```

3.各端运行方式及配置

- H5运行：

> 打开HbuilderX编辑器 --> 运行 --> 运行到浏览器

- 真机运行：

> 打开安卓手机 -->设置 --> 开发者选项 --> 开启USB调试，并使用数据线连接电脑即可
> 
> 打开HbuilderX编辑器 --> 运行 --> 运行到手机或模拟器(运行中如果自动安装HBuilder调试基座失败，需要手动去安装到手机端)

- 微信小程序运行：
> 打开微信开发者工具 -->设置-->安全设置，打开服务端口
> 
> 打开HbuilderX编辑器 -->工具-->设置-->运行配置-->小程序运行配置，在微信开发者工具路径栏填写微信开发工具的安装路径


### 4、条件编译

uni-app已将常用的组件、js API封装到框架中按照uni-app规范开发即可保证多平台兼容，大部分业务可直接满足。
但由于每个平台存在一些特性，因此会出现一些无法跨平台的情况，针对该问题的解决方案为：使用条件编译，在编译代码时，会将代码编译到不同的平台。
条件编译是利用注释实现的，在不同语法里注释写法不一样，js使用 // 注释、css 使用 /* 注释 */、vue/nvue 模板里使用 <!-- 注释 -->。

示例：

1：仅出现在app平台下的代码
```
// #ifdef APP-PLUS
需要条件编译的代码
// #endif
```
2：除了H5平台，仅出现在其他平台的代码
```
// #ifndef H5
需要条件编译的代码
// #endif
```
3：在H5或微信小程序平台存在的代码
```
// #ifdef H5 || MP-WEIXIN
需要条件编译的代码
// #endif
```

除此之外，static静态资源目录也可以存在条件编译，只需在static下创建以平台名称命名的子目录，专有目录下的静态资源只有在特定平台才会编译进去，示例：

> static/app-plus/a.png			APP静态资源
> 
> static/h5/b.png				H5静态资源
> 
> static/mp-weixin/c.png		微信小程序静态资源

如果想把各平台的页面文件更彻底的分开，也可以在platforms目录中进行整体目录条件编译，即在platforms目录中进一步创建app-plus、mp-weixin、h5等子目录，存放不同平台的文件。

platforms目录下只支持放置页面文件（即页面vue文件），如果需要对其他资源条件编译建议使用static 目录的条件编译。

Android 和 iOS 平台不支持通过条件编译来区分，如果需要区分 Android、iOS 平台，请通过调用 uni.getSystemInfo 来获取平台信息。支持ifios、ifAndroid代码块，可方便编写判断。

### 5、打包发行项目

- 1.打包为原生app

> 打开项目的manifest.json文件生成一个DCloud AppID。
> 
> 在开发者中心[DCloud开发者中心](https://dev.dcloud.net.cn/)找到自己创建的应用。
>
> 点击要打开的应用进行创建证书，生成证书的时候较长需耐心等待。
> 
> 打开HbuilderX编辑器--> 发行--> 原生App-云打包--> 勾选使用云端证书、打正式包、安心打包--> 点击打包按钮。
> 
> 打包完成后在unpackage文件中找到.apk文件，安装至手机进行访问。
>

- 2.发布为H5

> HBuilderX菜单栏 > 发行 > 网站-PC Web或手机H5 ，网站名称和网站域名默认，点击发行按钮。
> 
> 打包完成后在unpackage文件中找到h5文件夹，将文件部署到web服务器访问，不要使用资源管理器直接打开，除非进行相对路径配置。
> 
> 相对路径配置：打开项目的manifest.json文件 > h5配置 > 运行的基础路径栏填入'./'，路由模式栏填入'hash'。
>

- 3.打包为微信小程序

> 在HBuilderX编辑器 > 发行 > 小程序-微信，填入微信小程序名称及appid后点击发行，生成微信小程序项目。
> 
> 微信开发工具自动打开小程序包，可以进行测试及上传代码等操作。
> 
### 6、开发规范

为了实现多端兼容，综合考虑编译速度、运行性能等因素，uni-app 约定了如下开发规范：

- 页面文件遵循 [Vue 单文件组件 (SFC) 规范](https://vue-loader.vuejs.org/zh/spec.html)，注意：uni-app虽为vue语法，但是编译为小程序和app时不是SPA而是MPA，编译为H5时为SPA。
- 组件标签靠近小程序规范，详见[uni-app 组件规范](https://uniapp.dcloud.io/component/README)。
- 接口能力（JS API）靠近微信小程序规范，但需将前缀 wx 替换为 uni，详见[uni-app接口规范](https://uniapp.dcloud.io/api/README)。
- 数据绑定及事件处理同 Vue.js 规范，同时补充了App及页面的生命周期。
- 为兼容多端运行，建议使用flex布局进行开发。

### 7、附录

- [官方IDE下载地址](https://www.dcloud.io/hbuilderx.html)
- [脚手架空白工程](https://www.uviewui.com/components/resource.html)
- [uView 多平台快速开发的UI框架](https://www.uviewui.com/components/intro.html)
- [uni-app 官网](https://uniapp.dcloud.io/README)
- [uni-app 部署 H5 到相对路径（含file协议打开）](https://ask.dcloud.net.cn/article/37432)