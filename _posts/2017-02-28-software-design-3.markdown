---
layout: post
title:  "Software Design 3月号読書メモ"
date:   2017-02-28 23:00:00
category: book
---

# Linux カーネル観光ガイド

Linux 4.3 に入った新機能の解説

## membarrier システムコール

RCU クリティカルセクションの解決にカーネルでは割り込み防止とスケジューラへのフックで対応する．
ユーザスペースではそのようなテクニックを使うことは当然できないが，
membarrier システムコールでは他の全ての CPU が一度スケジューラに割り込まれるまでカーネルで待機してからユーザスペースに返ってくる．
これによって暗黙的なメモリバリアを達成している．

```C
#include <assert.h>

int done = 0;
int result = 0;

void worker()
{
    // do something;
    result = 42;
    // compile_barrier();
    done = 1;
}

void client()
{
    int x;
    while (done == 0) continue;
    // memory_barrier();
    assert(result == 42);
}
```

## PIDs CGroup

PIDs CGroup によって fork によるプロセス数を制限することができる．

## サスペンド時のディスク同期を省略

Linux ではサスペンドの際に sync を呼び出していたが， Android などでの省電力が重要でサスペンドが安定している状況では省略できると色々と捗る．
