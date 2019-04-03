---
layout: post
title: Install Python on Ubuntu
description: Install latest python on ubuntu
tags: [python install 3.7 3.6 ubuntu]
modified: 2018-10-15
---

Check the latest version [here](https://www.python.org/)
At the time of writing, 3.7.0 is the latest and 3.7.1 has release candidate.

```bash
version=3.7.0
wget https://www.python.org/ftp/python/${version}/Python-${version}.tgz
tar xzvf Python-${version}.tgz
cd Python-${version}
# Linux (or any Unix-like system), the default prefix and exec-prefix are /usr/local.
# thus you should be able to omit --prefix here
./configure --prefix /usr/local
make
sudo make install
```

Cheers!