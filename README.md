# ほぼ生（素）のReactとは何かを知るための開発環境（2017年5月）

## 最初に

ちょっと時間に余裕が出てきたのでReactの知識をアップデートするかってことで学び直してます。  
以前やった学んだ時はReactを実践投入することはなかったので今回は実践で投入してサービスとして使えるところまで持っていこうと思ってます。  

[生のReactを知ろう – JSX、Flux、ES6、Webpackを使わず…](http://postd.cc/learn-raw-react-no-jsx-flux-es6-webpack/)

極端なところだけど生というか素のReactってのは何なのかを知ろうとしたらこういうアプローチがいいと思う。  
React系は細かくモジュールに分割して必要なものを必要な時に必要なだけって感じで考えられていてReactはまぁViewを作るだけになっている。  
けどまぁさすがにwebpackでBrowsersyncとES2015での記述をコンパイルだけでもと思って作ってみました。

今までv1で動けばいいかってことでやってきましたが、とうとうNode.jsも最新（v7.9.0）にしてwebpackもv2で動くようにconfigも書きました。

* [Migrating from v1 to v2](https://webpack.js.org/guides/migrating/)
* [Babel · The compiler for writing next generation JavaScript](https://babeljs.io/)

## 必要なものあるかどうか確認

```
node -v
```
まずはお決まりのNode.js入ってるか確認。

```
yarn --version
```
npmでもいいんですがyarn（Node.jsのパッケージマネージャー）が入ってるか確認。
[Yarn](https://yarnpkg.com/)

```
webpack -v
```
webpackも入っているか確認。  
もし入ってなかったら

```
npm install -g webpack
```

-gオプションはGlobalオプション。

## ファイル・フォルダ構成

```
git clone https://github.com/shigekitakeguchi/yarn-webpack-react-simple.git
```
[https://github.com/shigekitakeguchi/yarn-webpack-react-simple](https://github.com/shigekitakeguchi/yarn-webpack-react-simple)

GitHubから落として使ってください。  
カスタマイズなりなんなりして。

```
cd npm-webpack-riotjs
```
落としたフォルダ内に移動する。

```bash
├── README.md
├── app
│   ├── index.html
│   └── scripts
│       └── bundle.js
├── package.json
├── src
│   └── scripts
│       └── app.js
├── webpack.config.js
└── yarn.lock
```
ファイル・フォルダ構成はこんな感じ。  
README.mdは不要。app.jsに書けばいいだけです。

```bash
yarn install
```

これで必要なパッケージがインストールされるはず。  

## package.json

```json
{
  "name": "yarn-webpack-react-simple",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "webpack -w --config webpack.config.js"
  },
  "devDependencies": {
    "babel-core": "^6.24.1",
    "babel-loader": "^7.0.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "browser-sync-webpack-plugin": "^1.1.4",
    "webpack": "^2.4.1"
  },
  "dependencies": {
    "react": "^15.5.4",
    "react-dom": "^15.5.4"
  }
}

```
中身はこんな感じ。

### パッケージの説明

落としてきたpackage.jsonからインストールすればいいんですがそれぞれのパッケージの説明を。

```
yarn add --dev babel-core
```
[https://github.com/babel/babel/tree/master/packages/babel-core](https://github.com/babel/babel/tree/master/packages/babel-core)

言わずもがな、Babelのコンパイラのコア。

```
yarn add --dev babel-loader
```
[https://github.com/babel/babel-loader](https://github.com/babel/babel-loader)

webpackでES2015構文で書いたファイルをトランスパイルするのに必要。

```
yarn add --dev babel-preset-es2015
```
[https://github.com/babel/babel/tree/master/packages/babel-preset-es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)

ES2015を扱うためのプラグイン。

```
yarn add --dev babel-preset-react
```
[https://github.com/babel/babel/tree/master/packages/babel-preset-react](https://github.com/babel/babel/tree/master/packages/babel-preset-react)

Reactのためのプラグインですね。

```
yarn add --dev browser-sync
```
[https://github.com/browsersync/browser-sync](https://github.com/browsersync/browser-sync)

もう面倒過ぎて手動でブラウザをリロードさせるなんてできないですね。  
しかもwebpack-dev-serverも不要になります。

```
yarn add --dev browser-sync-webpack-plugin
```
[https://github.com/Va1/browser-sync-webpack-plugin](https://github.com/Va1/browser-sync-webpack-plugin)

webpackでBrowserSyncするためのプラグインです。

```
yarn add --dev webpack
```
[https://github.com/webpack/webpack](https://github.com/webpack/webpack)

Reactのインストール
```
yarn add react
```
ReactDOMもインストール

```
yarn add react-dom
```

## package.jsonの中のscriptsで何をしているか

```json
"scripts": {
  "start": "webpack -w --config webpack.config.js"
},
```

```
yarn start
```

このコマンドでローカルサーバーを立ち上げwebpackでwatchを行いJavaScriptの変更を監視しコンパイルがはじまります。以前よりもシンプルになってます。それだけwebpackへの依存が増えたってことでもありますね。

## webpack.config.json

こちらの方はまだES2015へ移行できてないです。  
部分的にはv2には対応させましたがとりあえずは動くのでそのまま。  
そのうちES2015的な書き方へ移行させたい。

```javascript
var webpack = require("webpack");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: './src/scripts/app.js',
  output: {
    path: __dirname + '/app/scripts',
    filename: 'bundle.js',
		publicPath: '/app/',
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    }),
    new BrowserSyncPlugin(
                      {
                        host: 'localhost',
                        port: 8080,
                        server: { baseDir: ['app'] }
                      }
                    )
  ]
}

```
webpack（v2）にして書き直したところです。  
これはv1でやっていた時の書き方。

```
module: {
  loaders: [
    {
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015'],
      }
    }
  ]
},
```
部分的に書き直すだけで動くようになるみたいですね。  
loadersをrulesへ変更しloader: 'babel'をloader: 'babel-loader'にしました。

```
module: {
  rules: [
    {
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015'],
      }
    }
  ]
},
```

## サンプルのソースコード

[生のReactを知ろう – JSX、Flux、ES6、Webpackを使わず…](http://postd.cc/learn-raw-react-no-jsx-flux-es6-webpack/)  

こちらで掲載されているコードを参考までに記述しておきます。

### /app/index.html
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>yarn-webpack-react-simple</title>
</head>
<body>
<div id="react-app"></div>
<script src="/scripts/bundle.js"></script>
</body>
</html>
```

### /src/scripts/index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

var rootElement =
  React.createElement('div', {},
    React.createElement('h1', {}, "Contacts"),
    React.createElement('ul', {},
      React.createElement('li', {},
        React.createElement('h2', {}, "James Nelson"),
        React.createElement('a', {href: 'mailto:james@jamesknelson.com'}, 'james@jamesknelson.com')
      ),
      React.createElement('li', {},
        React.createElement('h2', {}, "Joe Citizen"),
        React.createElement('a', {href: 'mailto:joe@example.com'}, 'joe@example.com')
      )
    )
  )

ReactDOM.render(rootElement, document.getElementById('react-app'))
```

> 基本的に、ReactはHTMLをJavaScriptでレンダリングするツールです。

これがよくわかるサンプルだと思います。

## 少しずつReactの学習を進めていけるようなコンテンツをあげていきます。

今回はシンプルにReactの機能とは何かを学べる環境を作りましたがReduxやReact Routerを少しずつでもいいので学んでいける環境をあげていきます。

