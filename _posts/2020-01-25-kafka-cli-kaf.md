---
layout: post
title: Kafka CLI kaf
description: Kafka cli kaf to make you more productive
tags: [kafka kaf]
modified: 2020-01-25
---

Kafka is super popular and powerful data streaming platform but I'm surprised by lack of easy cli tool.

To find out version, there is no such thing as `kafka --version` you do:

```bash
$ find /opt/kafka/libs/ -name kafka_\* | head -1
/opt/kafka/libs/kafka_2.13-2.4.0-test-sources.jar
```
where 2.13 is scala version and 2.4.0 is kafka version.

One tool that I played with is lovely called [kaf](https://github.com/birdayz/kaf), "Modern CLI for Kafka".

to list topics, you do:
```bash
sudo bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```
whereas with kaf you do:
```bash
$ kaf topics  
```
to consume on console you do:
```bash
sudo bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test_topic
```
whereas with kaf you do:
```bash
kaf consume test_topic
```

just be able to omit --bootstrap-server etc makes you type less thus productive ;)

### To install
 ```bash
go get github.com/birdayz/kaf/cmd/kaf
```
set auto-complete for zsh
```bash
echo 'source <(kaf completion zsh)' >> ~/.zshrc
```
for shell
```bash
echo 'source <(kaf completion bash)' >> ~/.bashrc
```

**ADD and SELECT cluster**
ADD config for local
```bash
kaf config add-cluster local -b localhost:9092
```
This will create config file here:
```bash
~/.kaf/config 
```
Then you can SELECT to use this config
```bash
kafka kaf config select-cluster 
Use the arrow keys to navigate: ↓ ↑ → ← 
? Select cluster: 
  ▸ local
    prod-kafka
    dev-kafka
```

**LIST Kafka node**
```bash
kaf node ls
```

**LIST Kafka topics**
```bash
kaf topics
```

**LIST Kafka node**
```bash
kaf node ls
```

**LIST Kafka send message**
```bash
kafka echo '{"a": 123}' | kaf produce test_topic
```

**LIST Kafka consume message**
```bash
kafka echo '{"a": 123}' | kaf produce test_topic
```

Easy to install, easy to use, less typing and cluster def in yaml config. So why not use this!

Cheers!
