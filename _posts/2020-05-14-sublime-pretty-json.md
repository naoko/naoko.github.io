---
layout: post
title: Pretty JSON in Sublime on Linux
description: pretty JSON in Sublimie on Linux
tags: [pretty, json, linux, sublime]
modified: 2020-05-14
---

I've been using [JSONLint](https://jsonlint.com/) for every JSON prettifier needs.
This site is super because it even format invalid JSON.
For example, standard JSON prettifier won't prettify JSON with key or value enclosed in single quote but this site does but having your local editor do quick prettifier if you have valid JSON or willing to quickly fix with find and replace.

Sublime is my go to text editor - taking note, prettify JSON etc. So let's do that real quick.


Install Pretty JSON package. Assuming you are using Linux. If you are using other OS, key combination is different.

`CTL + SHIFT + P` > type "Install package" > 
Select `Install package` > Search for `Pretty JSON` > select it (this will install the package) 

Okay now the package is installed, copy and paste into this UGLY JSON
```
[{"fav_fruit": "banana","fav_color":"red?","age":29}]
```

then hit  `CTL + ALT + J` it will re-format to
```
[
  {
    "fav_fruit": "banana",
    "fav_color": "red?",
    "age": 29
  }
]
```

Whoohoo!


Cheers!
