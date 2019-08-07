---
layout: post
title: Install Python on Ubuntu
description: Install latest python on ubuntu
tags: [python install 3.7 3.6 ubuntu]
modified: 2019-06-14
---

Check the latest version [here](https://www.python.org/)
At the time of writing, 3.7.0 is the latest and 3.7.1 has release candidate.

Also make sure you have sqlite3 installed
```bash
sudo apt-get install libsqlite3-dev
```

```bash
version=3.7.0
wget https://www.python.org/ftp/python/${version}/Python-${version}.tgz
tar xzvf Python-${version}.tgz
cd Python-${version}
# Linux (or any Unix-like system), the default prefix and exec-prefix are /usr/local.
# thus you should be able to omit --prefix here
# --enable-optimizations option for significant speed boost (10-20%) but much
# slower build process
./configure --prefix /usr/local --enable-optimizations
make
sudo make install
```

in case you want to remove and re-install it again cause some software
was missing before installation
```bash
rm -f /usr/local/bin/python${version}
rm -rf /usr/local/lib/python${version}
```

Cheers!
