---
layout: post
title: Upgrade from Debian Jessie to Stretch
description: Upgrade from Debian Jessie to Stretch
tags: [debian, stretch, jessie]
modified: 2018-01-30
---

### The Problem:

I was running Debian Jessie (debian 8) and the package I needed to install was in debian testing repo.
So I added testing repo and installed the package (`libsnappy1v5`) and I got scold by my super sysadmin boss:
"Naoko, don't make a [FrankenDebian](https://wiki.debian.org/DontBreakDebian)!"


### The Solution:
The package I needed is now available in Stretch (debian 9) stable so I need to upgrade to it.

First, I need to remove `testing` repo I've added
```bash
cd /etc/apt
grep -r testing *
```
This should find a file that lists testing repo.
Get rid of it. In my case, the ansible script created the file here:
`/etc/apt/sources.list.d/ftp_us_debian_org_debian.list`.
So just ran `rm sources.list.d/ftp_us_debian_org_debian.list`

Then change jessie stable to stretch stable.

Edit `sources.list` with your favorite editor and replace `jessie` with `stretch`.
My file look like this now:
```bash
# Line commented out by installer because it failed to verify:
# deb http://security.debian.org/ stretch/updates main
# Line commented out by installer because it failed to verify:
# deb-src http://security.debian.org/ stretch/updates main

deb http://ftp.us.debian.org/debian stretch main
deb-src http://ftp.us.debian.org/debian/ stretch main

deb http://security.debian.org/ stretch/updates main
deb-src http://security.debian.org/ stretch/updates main

deb http://ftp.us.debian.org/debian/ stretch-updates main
deb-src http://ftp.us.debian.org/debian/ stretch-updates main
```

Then you want to update all packages with stretch stable
```bash
apt update
apt upgrade
```
`apt upgrade` will NOT generally install new releases, 
where major changes (including removal of packages or GRUB update is required). 
For example, when a new Linux kernel is available, the package will not get installed.
In order to install the new kernel, you will need to run `apt dist-upgrade`.

```bash
apt dist-upgrade
```
Then reboot machine
```bash
reboot
```
When it comes back, verify version:
```bash
$ cat /etc/debian_version
9.3
```

Yay
