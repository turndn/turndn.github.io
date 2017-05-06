---
layout: post
title:  "Source code reading: SimpleVisor"
date:   2017-05-06 15:10:00
category: note
---

LXR を導入したので，[SimpleVisor][1] を読んでいく．

VM-Exit handler を見ると SimpleVisor が VM Exit のイベントの内何をエミュレーションするかが分かる．
また， `VpState->ExitReason` となっているが，`PSHV_VP_STATE` の指す `SHV_VP_STATE` 構造体には VMCS は入っていない．
`SHV_VP_STATE` 構造体については後に述べる．

`ShvVmxHandleExit` は次のようなことを行っている．

1. VMCS から読み取った VM Exit reason を用いてハンドラを実行．(CPUID, INVD, XSETBV, instructions related VMX)
1. VMCS から VM Exit の原因となった命令の命令長を読み取る．
1. VM Exit の原因となった命令の命令長を Guest の EIP に加算して書き込む．

SimpleVisor の VM Exit のハンドラがこのような簡潔さを保ているのは単純にハンドルする命令が限られているからである．
SimpleVisor によってハンドルされる命令は全て VMCS から命令長を取得することができる [^1] [^2] ．
そのため，命令エミュレーション後に命令長を VMCS から読み取って Guest EIP に加算するという方法を採れている．

デバイス関連のエミュレーションを行おうとすると，エミュレートのために命令を Guest EIP からフェッチする必要があるためこの方法は採れなくなる．

```C
VOID
ShvVmxHandleExit (
    _In_ PSHV_VP_STATE VpState
    )
{
    //
    // This is the generic VM-Exit handler. Decode the reason for the exit and
    // call the appropriate handler. As per Intel specifications, given that we
    // have requested no optional exits whatsoever, we should only see CPUID,
    // INVD, XSETBV and other VMX instructions. GETSEC cannot happen as we do
    // not run in SMX context.
    //
    switch (VpState->ExitReason)
    {
    case EXIT_REASON_CPUID:
        ShvVmxHandleCpuid(VpState);
        break;
    case EXIT_REASON_INVD:
        ShvVmxHandleInvd();
        break;
    case EXIT_REASON_XSETBV:
        ShvVmxHandleXsetbv(VpState);
        break;
    case EXIT_REASON_VMCALL:
    case EXIT_REASON_VMCLEAR:
    case EXIT_REASON_VMLAUNCH:
    case EXIT_REASON_VMPTRLD:
    case EXIT_REASON_VMPTRST:
    case EXIT_REASON_VMREAD:
    case EXIT_REASON_VMRESUME:
    case EXIT_REASON_VMWRITE:
    case EXIT_REASON_VMXOFF:
    case EXIT_REASON_VMXON:
        ShvVmxHandleVmx(VpState);
        break;
    default:
        break;
    }

    //
    // Move the instruction pointer to the next instruction after the one that
    // caused the exit. Since we are not doing any special handling or changing
    // of execution, this can be done for any exit reason.
    //
    VpState->GuestRip += ShvVmxRead(VM_EXIT_INSTRUCTION_LEN);
    __vmx_vmwrite(GUEST_RIP, VpState->GuestRip);
}
```

```C
typedef struct _SHV_VP_STATE
{
    PCONTEXT VpRegs;
    uintptr_t GuestRip;
    uintptr_t GuestRsp;
    uintptr_t GuestEFlags;
    UINT16 ExitReason;
    UINT8 ExitVm;
} SHV_VP_STATE, *PSHV_VP_STATE;
```

`SHV_VP_STATE` 構造体は上のようになっていて，`PSHV_VP_STATE` は VMCS そのものではない．
ここでは， `ShvVmxHandleExit` の callee を見る．
`ShvVmxEntryHandler` は `SHV_VP_STATE` 構造体のアドレスを引数にして， `ShvVmxHandleExit` を呼んでいる．
VMCS から情報を読み取っているのはその前の部分で `ShvVmxRead()` 関数を用いている．
`ShvVmxRead()` 関数の引数は VMCS field で `vmread` を使って読んでいるだけである．

```C
DECLSPEC_NORETURN
VOID
ShvVmxEntryHandler (
    _In_ PCONTEXT Context
    )
{
    SHV_VP_STATE guestContext;
    PSHV_VP_DATA vpData;

    /* omit */

    //
    // Build a little stack context to make it easier to keep track of certain
    // guest state, such as the RIP/RSP/RFLAGS, and the exit reason. The rest
    // of the general purpose registers come from the context structure that we
    // captured on our own with RtlCaptureContext in the assembly entrypoint.
    //
    guestContext.GuestEFlags = ShvVmxRead(GUEST_RFLAGS);
    guestContext.GuestRip = ShvVmxRead(GUEST_RIP);
    guestContext.GuestRsp = ShvVmxRead(GUEST_RSP);
    guestContext.ExitReason = ShvVmxRead(VM_EXIT_REASON) & 0xFFFF;
    guestContext.VpRegs = Context;
    guestContext.ExitVm = FALSE;

    //
    // Call the generic handler
    //
    ShvVmxHandleExit(&guestContext);

    /* omit */
}
```

[1]: https://github.com/ionescu007/SimpleVisor

[^1]: VM-exit instruction information (32 bits). This field is used for VM exits due to attempts to execute INS, INVEPT, INVVPID, LIDT, LGDT, LLDT, LTR, OUTS, SIDT, SGDT, SLDT, STR, VMCLEAR, VMPTRLD, VMPTRST, VMREAD, VMWRITE, or VMXON
[^2]: VM-exit instruction length. CLTS, CPUID, ENCLS, GETSEC, HLT, IN, INS, INVD, INVEPT, INVLPG, INVPCID, INVVPID, LGDT, LIDT, LLDT, LMSW, LTR, MONITOR, MOV CR, MOV DR, MWAIT, OUT, OUTS, PAUSE, RDMSR, RDPMC, RDRAND, RDSEED, RDTSC, RDTSCP, RSM, SGDT, SIDT, SLDT, STR, VMCALL, VMCLEAR, VMLAUNCH, VMPTRLD, VMPTRST, VMREAD, VMRESUME, VMWRITE, VMXOFF, VMXON, WBINVD, WRMSR, XRSTORS, XSETBV, and XSAVES.

