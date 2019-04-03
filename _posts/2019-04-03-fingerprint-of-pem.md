---
layout: post
title: Fingerprint of PEM ssh key
description: Generate fingerprint of PEM ssh key
tags: [aws PEM fingerprint]
---

### The problem

I was on AWS and needed to select SSH Key pair. 
It has been a while that I needed to create one that might require SSH Key pair.
So to be sure I got the correct key, I needed to compare md5 fingerprint listed on Key Pair list.
I do have `pem` key with name contain `aws` so I want to generate md5 finger print for that key.

### How to solve it

First, you need public key of the `pem` key but AWS won't give you when you generated the key.
So let's generate public key from private pem key.
```bash
ssh-keygen -yf path/to/private_key_file > path/to/store/public_key_file
```
Now you can generate the fingerprint to compare. 
Previously the fingerprint was given as a hexed md5 hash. 
Starting with OpenSSH 6.8 the fingerprint is now displayed as base64 SHA256 (by default).
AWS list as md5 so you want to add flag to to format as md5 (`-E md5`).
```bash
ssh-keygen -E md5 -lf path/to/store/public_key_file
``` 
That's it!

Cheers!