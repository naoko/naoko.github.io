---
title: "Docker Image / Container Cleaning"
date: 2019-08-25
lastmod: 2019-08-25
description: "Docker image and container clean up on your computer"
tags: ["docker", "purge", "df"]
---

Unused Docker image and container can quickly take up your disk spaces.


### Let's check disk usage
Summary of data used. You can add `-v` flag for detailed info.
```bash
$ docker system df
TYPE                TOTAL               ACTIVE              SIZE                RECLAIMABLE
Images              87                  1                   63.39GB             63.17GB (99%)
Containers          1                   0                   0B                  0B
Local Volumes       69                  1                   2.732GB             2.683GB (98%)
Build Cache         0                   0                   0B                  0B

```

### Remove unused data
The following command will remove:
- all stopped containers
- all networks not used by at least one container
- all **dangling images** (see below fo dangling images)
- all build cache
By default, volumes are not removed to prevent important data from being deleted.

```
$ docker system prune
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache

Are you sure you want to continue? [y/N] y
Deleted Containers:
...
Total reclaimed space: 13.91GB
```
Options:
- `--all`, `-a`: Remove all unsued images not just dnaling ones.
- `--volumes`: prune volumes.

### What's dangling images?

Docker images consist of multiple layers. Dangling images, are layers that have no relationship to any tagged images. 
They no longer serve a purpose and consume disk space.

You can list dangling iamges:
```bash
$ docker images -f dangling=true
```


Cheers!
