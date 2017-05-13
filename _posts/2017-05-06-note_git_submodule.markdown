---
layout: post
title:  "Git submodule 覚書"
date:   2017-05-06 15:00:00
category: note
---
GitSubmodule についての正確かつ体系的な知識が欲しい場合，この記事を読まずに [GitBook][1] を読む．

作業ログと動作のメモ

```
$ git --version
git version 2.11.0 (Apple Git-81)
```

Client A

```
~/main_repo/ (master) $ git checkout -b test_branch
~/main_repo/ (test_branch) $ git submodule add sub_repo
~/main_repo/ (test_branch) $ ls
sub_repo
~/main_repo (test_branch) $ ls sub_repo
file0.txt
~/main_repo/ (test_branch) $ git commit -m "Add submodule"
~/main_repo/ (test_branch) $ git push origin test_branch
~/main_repo/ (test_branch) $ cd ../sub_repo
~/sub_repo/ (master) $ git checkout -b test_branch
~/sub_repo/ (test_branch) $ echo Modified! >> sample.txt
~/sub_repo/ (test_branch) $ git commit -am "Add file"
~/sub_repo/ (test_branch) $ git push origin test_branch
```

Client B

```
~/ $ git clone main_repo
~/main_repo (master) $ git checkout -b test_branch origin/test_branch
~/main_repo (test_branch) $ ls sub_repo
~/main_repo (test_branch) $ git submodule init
~/main_repo (test_branch) $ git submodule update
~/main_repo (test_branch) $ ls sub_repo
file0.txt
```

Client A

```
~/main_repo/ (test_branch) $ cd sub_repo
~/main_repo/sub_repo (master) $ git checkout -b test_branch origin/test_branch
~/main_repo/sub_repo (test_branch) $ ls
file0.txt sample.txt
~/main_repo/sub_repo (test_branch) $ cd ..
~/main_repo/ (test_branch) $ git status
    modified:   sub_repo (new commits)
~/main_repo/ (test_branch) $ git add .
~/main_repo/ (test_branch) $ git commit -m "Update submodule"
~/main_repo/ (test_branch) $ git push origin test_branch
```

Client B

```
~/main_repo (test_branch) $ git pull origin test_branch
~/main_repo (test_branch) $ ls sub_repo/
file0.txt
~/main_repo (test_branch) $ git submodule update
~/main_repo (test_branch) $ ls sub_repo/
file0.txt sample.txt
~/main_repo (test_branch) $ echo Add >> sub_repo/sample.txt
~/main_repo (test_branch) $ git status
    modified:   sub_repo (modified content)
    
~/main_repo/ (test_branch) $ cd sub_repo
~/main_repo/sub_repo (test_branch) $ git commit -am "Update sample"
~/main_repo/sub_repo (test_branch) $ git push origin test_branch
~/main_repo/sub_repo (test_branch) $ cd ..
~/main_repo (test_branch) $ git status
    modified:   sub_repo (new commits)
~/main_repo (test_branch) $ git commit -am "Update submodule"
~/main_repo (test_branch) $ git push origin test_branch
```

Client A

```
~/main_repo (test_branch) $ git pull origin test_branch
~/main_repo (test_branch) $ git status
    modified:   sub_repo (new commits)
~/main_repo (test_branch) $ git submodule update
~/main_repo (test_branch) $ git status
On branch test_branch
nothing to commit, working tree clean
```

[1]: https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E3%82%B5%E3%83%96%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB
