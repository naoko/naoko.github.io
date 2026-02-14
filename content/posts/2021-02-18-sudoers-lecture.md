---
title: "Smile every time you sudo"
date: 2021-02-18
lastmod: 2021-02-18
description: "Customized groot sudoers lecture give you smile every time."
tags: ["linux", "sudo", "sudoers", "lecture", "ubuntu"]
---

![groot](/images/2021-02-18-groot.png)

If you want your terminal prompt to look like this every time you sodo, please continue reading.
note: i did on ubuntu so for other flavor, file path might be slightly different

### step 1. download this amazing ascii art text and move to /etc/sudoers.d/sudoers.lecture

    ❯ curl -O https://caferock.org/chris/groot.txt
    ❯ sudo cp groot.txt /etc/sudoers.d/sudoers.lecture

### step 2. edit /etc/sudoers (or /etc/sudoers.d/privacy)

    Defaults     lecture = always
    Defaults     lecture_file = /etc/sudoers.d/sudoers.lecture    

### Let's see this magnificent art <3

    # reset timestamp
    ❯ sudo -k  
    # some sudo command
    ❯ sudo -l

Cheers!
