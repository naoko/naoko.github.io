---
layout: post
title: Fix screen resolution after 18.04 LTS upgrade on System 76
description: After the upgrade to 10.04 LST, I saw ugly lowest resolution
tags: [ubuntu,upgrade,18.04-lst]
modified: 2018-03-05
---

### The problem:

Ubuntu prompt me that 18.04 LST is available so I clicked `Upgrade` to initiate upgrade.
When upgrade is completed, the system was rebooted and came back with lowest screen resolution you can ever imagine.


### Fix

In summary....
This is only good for System 76 system.
Looks like driver update was necessary. Anyhow...

So upgrade was completed
```bash
$ lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 18.04 LTS
Release:	18.04
Codename:	bionic
```

and looks like I lost lsb module. so restoring that...
```bash
sudo apt-get install lsb-core
```

```bash
$ lsb_release -a
LSB Version:	core-9.20170808ubuntu1-noarch:security-9.20170808ubuntu1-noarch
Distributor ID:	Ubuntu
Description:	Ubuntu 18.04 LTS
Release:	18.04
Codename:	bionic
```

Download and install the current System76 Driver. 
```bash
sudo apt-add-repository -ys ppa:system76-dev/stable
sudo apt-get update
sudo apt-get install -y system76-driver
```

If you ordered a system with a discrete NVIDIA graphics card, 
you will need to manually install the closed source drivers for your card to get 
the optimum performance. 
Please run the following command:
```bash
sudo apt install system76-driver-nvidia
```

Restart the computer and you should have your nice set of resolutions back.

Cheers!
