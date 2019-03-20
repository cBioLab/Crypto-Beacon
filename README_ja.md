# Crypt Beacon

# 概要
秘匿計算を用いてBeacon検索を安全に行う．

# 動作環境 (確認済)
* Ubuntu 18.04
* Node.js v8.10.0
* python 3.6.7
* Google Chrome 72.0.3626.121

# 流れ
ユーザ(Beacon利用者)はブラウザを用いてCrypto BeaconのWebページにアクセスする．
Webページ上で検索対象を指定し，クエリをアプリケーションサーバに投げる．
この際，クエリは暗号化されている．
アプリケーションサーバ上で秘匿計算を行い，検索結果を暗号化したままユーザに返す．
ブラウザが暗号を復号し，ユーザに検索結果を通知する．

# リポジトリの説明
* WebServerフォルダ : Crypto BeaconのWebページを表示するためのWebサーバに必要なファイルが入っている．
* ApplicationServerフォルダ : アプリケーションサーバに必要なファイルが入っている．
* その他 : **アプリケーションサーバ**が依存しているリポジトリ群

# インストール方法

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
**デフォルトではWebサーバ，アプリケーションサーバ，ブラウザすべて同じマシン上で動作させることを想定したパラメータとなっている．（パラメータの変更方法は下の項目で説明する）**
## Webサーバの起動

    cd Crypto-Beacon/WebServer
    python -m http.server 8080

## アプリケーションサーバの起動

    cd Crypto-Beacon/ApplicationServer
    node she_server.js dummy0  #dummy0.bedをデータベースとする

上記の2つのサーバを起動した後，ブラウザでhttp://localhost:8080 にアクセスすることでデモを確認することができる．

**Webサーバ，アプリケーションサーバ，ブラウザをそれぞれ別のマシンで動作させる場合**

+ WebServer/crypt-beacon.jsのl.294，'http://localhost' を 'http://[アプリケーションサーバのIPアドレス]' に変更する
+ ブラウザでhttp://[WebサーバのIPアドレス]:8080 にアクセスする

# データの説明

## bedファイル→posファイル

    cd Crypto-Beacon/ApplicationServer/data
    mkdir [directory for posfile]
    python bed2list.py GRCh37.tsv [bedfile].bed [directory for posfile]

GRCh37.tsvは各染色体の塩基数を記録している．ここを変更した場合はWebServer/crypt-beacon.js内のパラメータも変更する必要がある．

dummy0のデータベースは以下のコマンドで作成した．

    cd Crypto-Beacon/ApplicationServer/data
    mkdir dummy0
    python bed2list.py GRCh37.tsv bed/dummy0.bed dummy0/

## posファイルの仕様

    1行目 総要素数 (N)
    2行目 1番目の要素
    ・・・
    N+1行目 N番目の要素

* i.posは*i*番目の染色体の情報。(23がchrX,24がchrY,25がchrM)
* i.posの*k*番目の要素を*e(i,k)*とすると、*e(i,k)/4*が染色体上の座標、*e(i,k) mod 4*が変異を表している(A:0,C:1,G:2,T:3)。
* 例えば、*e(23,k) = 1001* => chrXの250番目の塩基にCの変異が存在する
