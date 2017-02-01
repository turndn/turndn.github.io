---
layout: post
title:  "7 ways we harden our KVM hypervisor at Google Cloud: Security in plaintext (Google Cloud Platform Blog) 読書メモ"
date:   2017-02-01 15:00:00
category: book
---

[Google Cloud kicked QEMU to the kerb to harden KVM][1]
と
[7 ways we harden our KVM hypervisor at Google Cloud: Security in plaintext][2]
を読んだ．

## 概要

Google では KVM を Google Compute Engine and Google Container Engine で使ってる．

色々とやってる．

* 日頃から KVM の脆弱性を探してる．
* Attack surface を減らす．
    * 古いマウスドライバや古い interrupt controller のような使わないコンポーネントを削っている．
    * エミュレートする命令セットを制限している．
* QEMU を使わない．QEMU は KVM を使う際に user space 用の VMM として動作しているが，代わりに自社製のものを使っている．
    * QEMU では多くの host 及び guest のアーキテクチャをサポートしているがその必要はない．
    * QEMU では多くのドライバをサポートしているがその必要はない．
    * エミュレーションのコードをシンプルにすることができる．
    * cross-architecture host/guest の組み合わせをサポートしないことで複雑さと脆弱性の可能性を回避している．
    * QEMU と違ってユニットテスト書きやすい VMM を使っている．
* Boot and Jobs Communication
    * machine の boot 時の保証を行っている．
    * p2p の暗号鍵を作成し，host と host 上で実行している job の通信は明示的に認証されて認可されている．
* Code Provenance
* 脆弱性に対してちゃんと反応する
    * ここ3年では KVM の critical security vulnerability はなかったらしい．
* リリースには気をつける

## FAQ （一部）

* [Rowhammer][3] 対策に double refresh してエラーを減らしたり， ECC RAM （よく知らず）で誤り訂正をしたりしているらしい．
* KVM 用のファジングツールがあるらしい．ここ3年で見つけた KVM のバグの内半分はコードレビューで発見して，半分はファジングで発見したそう．


[1]: https://www.theregister.co.uk/2017/01/30/google_cloud_kicked_qemu_to_the_kerb_to_harden_kvm/
[2]: https://cloudplatform.googleblog.com/2017/01/7-ways-we-harden-our-KVM-hypervisor-at-Google-Cloud-security-in-plaintext.html
[3]: https://googleprojectzero.blogspot.jp/2015/03/exploiting-dram-rowhammer-bug-to-gain.html
