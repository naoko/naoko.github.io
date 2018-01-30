---
layout: post
title: Remote Edit with PyCharm
description: Edit Remote Linux file with PyCharm on OS X
tags: [pycharm, sshfs]
modified: 2018-01-30
---

### The Problem:

I have powerful Linux machine and semi-powerful mac-book pro.
I have need of editing code on Linux box from mac-book.

PyCharm has `deploy` method for pushing code but that requires sftp to setup etc.
I just want to use ssh to do it...
I've done rsync method but sometimes manual sync was needed.
I want more transparent method...


### The Solution:

The easiest and most effective way for me was to mount linux directory via `sshfs`.
It was amazingly easy. Assuming that you have established ssh connection with ssh-key with the remote machine.
All you have to do was to install `osxfuse` and `sshfs` with brew.
```bash
brew cask install osxfuse
brew install sshfs
```

then mount with `sshfs` command. without installing `osxfuse` you will get an error
because `osxfuse` install library that `sshfs` depends on.

```bash
mkdir [path-you-want-to-mount]
sshfs [username]@[server-addr]:[remote-dir] [path-you-want-to-mount]
```

Success? or you got `remote host has disconnected` error?
Get more verbose error with following flags:
```bash
sshfs -odebug,sshfs_debug,loglevel=debug [username]@[server-addr]:[remote-dir] [path-you-want-to-mount]
```

Now, all you have to do is to open the directory you desire with PyCharm <3
