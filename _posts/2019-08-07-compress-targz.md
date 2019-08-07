---
layout: post
title: Create and Extract tar.gz on Ubuntu
description: Just a quick reference to create and extract tar.gz on Ubuntu
tags: [ubuntu tar.gz archive]
modified: 2019-08-07
---
### Create tar.gz archives
```
tar czf new-tar-file-name.tar.gz file-or-folder-to-archive
```
c - create new archive
z - compress the archive using gzip
f - use archive file

### Extract archives
```
tar -xzf tar-file-name.tar.gz
```
x - extract the archive.
z - uncompress the archive using gzip.
f - use archive file.

### Let's do it.
I only want to compress 3 files.
When I extract archive what I want to see is files in the directory.
```
$ tree file_dir/
file_dir/
├── file1.txt
├── file2.txt
└── file3.txt

$ cd file_dir
$ tar czf files.tar.gz .
tar: .: file changed as we read it

# moved files.tar.gz to different directory
$ tar -xzf files.tar.gz 
$ ls
file1.txt  file2.txt  file3.txt  file_dir  files.tar.gz

```

Cheers!
