---
layout: post
title:  "Software Design 2月号読書メモ"
date:   2017-01-27 02:00:00
category: book
---

## いまはじめる Docker

* Google Container Engine で五目並べアプリケーションの API サーバを作るデモ
    * http://enakai00.hatenablog.com/entry/2016/08/10/152334
* 3章のは割と面白そう．
* 55 ページの図の KVM の説明が変．なぜ VT-x 前提の KVM がエミュレート型に分類されてしまうのか…

## Linux ファイルシステムの教科書

### Ext3

* Ext3 で使われているジャーナリング機能は JBD という名前のシステムに分離されている．
* JBD だとデフォルトではメタデータジャーナリングで `data=journal` モードだとデータジャーナリングする．

### Ext4

* flex_bg とか発想はそのままな気がする．
* マッピング: Extent tree
* ディレクトリ表現: Hash tree
* JBD2 ではチェックサムを用いてジャーナリングを軽い処理へ．

### XFS

* ジャーナルでは論理的な操作を記録

### F2FS

* Flash Translation Layer (FTL) による効率化
* ログFS でパラレルな書き込み
* FTL のための GC における Hot/Warm/Cold の分類
    * Cold にはマルチメディアファイルが該当し，apk も含まれる (Android 向けの最適化)

### Btrfs

* Copy-on-write による整合性の保護
* スナップショットの図


## Black Hat のトレーニングから学ぶペネトレーションテスト

* 各種ツール群について書いてあった．
