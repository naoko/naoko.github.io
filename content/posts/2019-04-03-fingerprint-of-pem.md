---
title: "Fingerprint of PEM ssh key"
date: 2019-04-03
description: "Generate fingerprint of PEM ssh key"
tags: ["aws", "PEM", "fingerprint"]
---

### The problem

I was on AWS and needed to select SSH Key pair. 
It has been a while that I needed to create one that might require SSH Key pair.
So to be sure I got the correct key, I needed to compare fingerprint listed on Key Pair list.
I do have `pem` key with name contain `aws` so I want to generate finger print for that key.

### How to solve it


```bash
openssl pkcs8 -in path/to/private_key_file -nocrypt -topk8 -outform DER | openssl sha1 -c
```

or use AWS tool
```bash
sudo apt install ec2-api-tools
ec2-fingerprint-key path/to/private_key_file
```
That's it!

Cheers!