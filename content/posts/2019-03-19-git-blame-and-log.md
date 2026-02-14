---
title: "list changes of specific line(s) with git"
date: 2019-03-19
description: "list changes of specific line(s) with git blame and git log"
tags: ["git", "blame", "log", "changes"]
---


If you only need to know who was the last person to change the line, 
`git blame` will do 

To see who modified the code on line # 85 and next 5 lines
```bash
git blame ${path-to-the-file} -L 85,+5
```
output would look like this
```bash
f1f66980053 (Naoko         2019-02-25 17:32:25 -0700 85)                 text = re.sub(r'{([^\n]+?)}', r'{0[\1]}', template["text"])
50ccaf0f3b8 (Naoko         2019-02-16 10:44:54 -0700 86)                 template["text"] = text.format(template_vars)
f373fd241db (Tom Bocklisch 2018-07-10 14:33:18 +0200 87)             except KeyError as e:
f373fd241db (Tom Bocklisch 2018-07-10 14:33:18 +0200 88)                 logger.exception(
390792a0008 (Tom Bocklisch 2018-11-16 12:51:21 +0100 89)                     "Failed to fill utterance template '{}'. "
```

But often the above information is not good enough.

Since Git 1.8.4, git log has -L to view the evolution of a range of lines.
```bash
git log --pretty=short -u -L 85,+5:${path-to-the-file}
```

The output would look like this
```
diff --git a/rasa_core/nlg/template.py b/rasa_core/nlg/template.py
--- a/rasa_core/nlg/template.py
+++ b/rasa_core/nlg/template.py
@@ -80,7 +85,5 @@
-                # blacklist characters that probably should not be
-                # part of slot name and replace with old %-formatting
-                text = re.sub(r'{([^\n,]+?)}', r'{0[\1]}', template["text"])
+                text = re.sub(r'{([^\n]+?)}', r'{0[\1]}', template["text"])
                 template["text"] = text.format(template_vars)
             except KeyError as e:
                 logger.exception(
                     "Failed to fill utterance template '{}'. "

commit 50ccaf0f3b86c65bfcd857ebf4c64f64b9b7c4a0
Author: Naoko

    Resolve #1720
    Handles slot name contains character that is invalid as python variable name (e.g. dot) in template
```


Cheers!