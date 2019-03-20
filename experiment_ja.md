# 実験の説明

## 概要
アプリケーションサーバ側はデモ用のコードをそのまま利用したが，ブラウザ側はexperiment.htmlを読み込んで計測を行った．(デモ用のコードはindex.html)

## 実験用コードの説明

+ WebServer/experiment.html : 実験用のhtmlファイル．染色体番号を隠さず各染色体に対してBeacon検索を行い，最後に染色体番号を隠してBeacon検索を行う．各検索ごとに，暗号化にかかった時間，復号化にかかった時間，検索にかかった総時間，送受信した暗号文の個数を出力するようになっている．
+ WebServer/experiment.js : 実験用のjsファイル．基本的にデモ用のコード(crypt-beacon.js)と中身は同じだが，一回検索が終わったら次の検索を自動で実行するようになっているのと，余分な出力を無くしているところが異なっている．

## 実験に用いたデータの説明
+ 人工データ
ApplicationServer/data/ex_bed/makeSampleBED.py を用いてbedファイルを生成した．総塩基数に対してどのくらいの割合で置換を発生させるかを指定し，ランダムでbedファイルを生成した．その後，bed2list.pyを用いてposファイルに変換し実験を行った．
+ 実データ
4種類の実データのbedファイルをbed2list.pyを用いてそれぞれposファイルに変換し実験を行った．

## 実験環境

+ Webサーバ，アプリケーションサーバ (同一マシンで2種類のサーバを走らせた)
    - OS : Ubuntu 18.04
    - CPU : Intel(R) Xeon(R) CPU E5-2643 v3 @ 3.40GHz × 2
    - RAM : 128GB
    - 遅延 : 15ms (tcコマンド使用)

+ ブラウザ側 (2パターン実験を行った)
    - iPhone7
        - ブラウザ : safari
    - DELL xps13
        - OS : Windows10
        - ブラウザ : Google Chrome
        - CPU : Intel(R) Core(TM) i5-7Y54 CPU @ 1.20GHz
        - RAM : 8GB