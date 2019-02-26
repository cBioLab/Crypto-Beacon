# Crypt Beacon

# 概要
秘匿計算を用いてBeacon検索を安全に行う．

# 動作環境
* Ubuntu 18.04
* Node.js v8.10.0
* python 3.6.7

# 流れ
ユーザ(Beacon利用者)はブラウザを用いてCrypto BeaconのWebページにアクセスする．
Webページ上で検索対象を指定し，クエリをアプリケーションサーバに投げる．
この際，クエリは暗号化されている．
アプリケーションサーバ上で秘匿計算を行い，検索結果を暗号化したままユーザに返す．
ブラウザが暗号を復号し，ユーザに検索結果を通知する．

# リポジトリの説明
* WebServerフォルダ : Crypto BeaconのWebページを表示するためのWebサーバに必要なデータが入っている．
* ApplicationServerフォルダ : アプリケーションサーバに必要なデータが入っている．
* その他 : アプリケーションサーバが依存しているリポジトリ群

# インストール方法
### 本リポジトリはブラウザ，Webサーバ,アプリケーションサーバ全てが同一マシンで動作している状況を想定している．(設定を変更することで別マシンで動作させることは可能)

## ダウンロード

    sudo apt install libgmp-dev libssl-dev
    git clone --recursive https://github.com/cBioLab/Crypto-Beacon.git

## Webサーバのインストール

    cd Crypto-Beacon/WebServer
    ./init.sh

## アプリケーションサーバのインストール

    cd Crypto-Beacon/ApplicationServer/src
    make
    cd ..
    mkdir tmp
    npm install express body-parser morgan

# 利用方法

## Webサーバの起動

    cd Crypto-Beacon/WebServer
    python -m http.server 80

## アプリケーションサーバの起動

    cd Crypto-Beacon/ApplicationServer
    node she_server.js

上記の2つのサーバを起動した後，ブラウザでhttp://localhostにアクセスすることでデモを確認することができます．