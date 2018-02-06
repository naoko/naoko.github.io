---
layout: post
title: Upgrade vagrant to latest
description: Upgrade vagrant to latest
tags: [vagrant, ubuntu]
modified: 2018-01-30
---

### The Problem:

I love vagrant. I am so dependent on testing my ansible before I run against `mutable` boxes.
Yes, I'm still living in place where Ops provision VM and the box stays `mutable`. 
It is okay though... change should be coming.
Anyhow, I installed vagnrat on my new Ubuntu machine (ubuntu-17.10) but the version was 1.9.
It was working fine until I upgraded the box to `debian/stretch64`. It says that 
`The box 'debian/stretch64' could not be found`. 
And noticed that it was trying to look in the old repo 
`https://atlas.hashicorp.com` instead of this `https://app.vagrantup.com`.


### The Solution:

I'm sure specifying `config.vm.box_url` would have fixed it but why not upgrade to latest?

You can download from official site but I chose to use ppa provided by Wolfgang.
```bash
$ sudo bash -c 'echo deb https://vagrant-deb.linestarve.com/ any main > /etc/apt/sources.list.d/wolfgang42-vagrant.list'
$ sudo apt-key adv --keyserver pgp.mit.edu --recv-key AD319E0F7CFFA38B4D9F6E55CE3F3DE92099F7A4
$ sudo apt update
$ sudo apt install vagrant 
$ vagrant --version
Vagrant 2.0.1
```

If you have `synced_folder` configured then you might get the error says 
```bash
Vagrant was unable to mount VirtualBox shared folders. This is usually
because the filesystem "vboxsf" is not available. This filesystem is
made available via the VirtualBox Guest Additions and kernel module.
Please verify that these guest additions are properly installed in the
guest. This is not a bug in Vagrant and is usually caused by a faulty
Vagrant box. For context, the command attempted was:

mount -t vboxsf -o uid=1000,gid=1000 srv_digicon /srv/digicon

The error output from the command was:

mount: unknown filesystem type 'vboxsf'
```

You can install guest additions as follows. (tested on ubuntu 16.4 and 17.10)
```bash
sudo apt-get update
sudo apt-get install virtualbox-guest-dkms
```

Cheers!
