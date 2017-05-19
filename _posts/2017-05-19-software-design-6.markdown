---
layout: post
title:  "Software Design 6月号読書メモ"
date:   2017-05-19 23:00:00
category: book
---

# Linux カーネル観光ガイド

Persistent Reserve とは複数のマシン間で1つのストレージを今日共有するような環境でストレージの排他制御を行うための SCSI の機能である．
Persistent Reserve を獲得することで他のマシンからのアクセスを禁止できる．

Linux の Persistent Reserve を扱える `sg_persist` は `ioctl(SG_IO)` を使って直接 SCSI を使っている．
これでは LVM で論理ボリュームを構築した場合，論理ボリュームにどの物理デバイスが対応しているかの扱いが面倒になる．
そこで，SCSI，LVM，NVMe どれに対しても動く `ioctl(IOC_PR_*)` が追加されている．
