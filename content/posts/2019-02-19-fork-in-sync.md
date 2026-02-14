---
title: "How to fork and keeping your github repo in sync"
date: 2019-02-19
lastmod: 2019-01-19
description: "How to fork and keeping your github repo in sync"
tags: ["fork", "github"]
---

## Forking a Github Repository
Just click "fork" button on upper right corner 

![](/images/2019-02-19/fork-button.png)
*black tea*
    

## Making a Local Clone
```bash
$ git clone https://github.com/YOUR_USERNAME/YOUR_FORK.git
```

## Adding a Remote
```bash
# list current configured remote repository for your fork
$ git remote -v

# add upstream
$ git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git

# list again to see upstream is added
$ git remote -v
origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)	
origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (fetch)
upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (push)
```

## Working in a Branch
Create and checkout a feature branch.
Personally, I like to set github issue number followed by 
summary of issue. This notation `GH-${issue_num}` will create a link
to the issue on github.
```bash
$ issue_num=100
$ git checkout -b GH-${issue_num}_summary_of_issue
```
When ready, commit and push changes to GitHub.
```bash
$ git push origin GH-${issue_num}_summary_of_issue
```

## Keeping Your Fork in Sync
```bash
$ git pull upstream master
$ git push origin master
```

Cheers!