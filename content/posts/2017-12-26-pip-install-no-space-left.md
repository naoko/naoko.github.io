---
title: "No Space Left Error when pip install"
date: 2017-12-26
lastmod: 2017-12-26
description: "Solving the problem of tiny /tmp directory"
tags: ["python", "pip"]
---

### The Problem:

Got 
```bash
OSError: [Errno 28] No space left on device
```
When your home directory where your virtual environment located
has more than enough space...


### Why?:

The culprit is likely that your `/tmp` directory do not have enough space for
some reason.
During the pip installation, pip will use temporarily directory
to perform what is necessary to perform installation (e.g. download source etc).
Thus if you do not have enough space in `/tmp` that package installation requires then
you will get disk space error.


### The Solution:

If you can clean up `/tmp` to create enough space, that's good but..
if you are like me and had limited `/tmp` space, pip allow user to
define temp directory location. To do so just set environment variable
`TMPDIR`.
e.g.
```bash
export TMPDIR=/bigass/space
```
Problem should be solved.
