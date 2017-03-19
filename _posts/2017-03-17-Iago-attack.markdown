---
layout: post
title:  "Iago attacks 走り書き"
date:   2017-03-17 23:00:00
category: book
---

[Iago attacks][1](ASPLOS '13) は malicious kernel による trusted application への攻撃手法である．
一見当たり前に感じるものだが，その threat model はとても面白い．
時間を見つけて攻撃手法について確認したいと思う．

## 概要

システム系におけるセキュリティの検討では TCB (trusted computing base) が重要である．

TCB を小さくすることで，malicious kernel 上で trusted code を実行する方法を提唱してされていた
(参考[1][2], [2][3], [3][4], [4][5])
が， application と kernel との RPC インタフェースとして system call APIが定義されている．

Iago attacks は malicious kernel が system call の戻り値を選ぶことによって application に不正な動作をさせる攻撃である．

## Threat model

application は

* unmodified
* unmodified あるいは一部関数が保護機構によって編集されている library にリンクされている．

また，kernel は保護機構によって直接 application を読んだり改変したりすることはできないが， system call をハンドルし，application の代わりに処理を行う．

kernel の Goal は system call の return value を選ぶことで trusted application 下で任意の computation を行うこととなる．
このとき，シンプルな DoS はスコープに含まない．これは， malicious な kernel はいつでもクラッシュさせたりブートしないといったことが可能なため．

[1]: http://dl.acm.org/citation.cfm?id=2451145
[2]: http://dl.acm.org/citation.cfm?id=945463
[3]: http://dl.acm.org/citation.cfm?id=1264213
[4]: http://dl.acm.org/citation.cfm?id=1346285
[5]: http://dl.acm.org/citation.cfm?id=1352625
