---
layout: post
title: Elasticsearch Access
description: Configure Elasticsearch and Server to be able to access from outside
tags: [es, elasticsesarch, firewall, ufw, netstat, nmap]
modified: 2018-08-22
---

### The problem:

You installed Elasticsearch on server. You can run
`curl localhost:9200` and all looks good but the access is denied from outside 
when `curl <server-ip>:9200`.


### How to solve it

So first thing first. Elasticsearch do need to listen to ip you are accessing.
To make it listen to all, you can simply change / add
 `network.host: 0.0.0.0` to 
 `/etc/elasticsearch/elasticsearch.yml`
 and restart elasticsearch server.
Try `curl <server-ip>:9200` and works? That's great. Your server is configured / ready for port 9200.

If your access is rejected then there are several things you can check:

#### Is server running? 
Make sure to run `systemctl status elasticsearch` (assuming that you are managing the service via systemctl)
If it says `active` then you are good. If not, let's start and test again.
```bash
● elasticsearch.service - Elasticsearch
   Loaded: loaded (/usr/lib/systemd/system/elasticsearch.service; disabled; vendor preset: enabled)
   Active: active (running) since Wed 2018-08-22 11:21:30 MST; 58min ago
```

#### Is port listening?
This is where I stuck. So you see `9200` is `LISTEN` only on `tcp6` and not for ipv4.
I got stuck with this idea of ES is not bind to `ipv4`. Later I found this is good.
See [here](https://unix.stackexchange.com/questions/237731/why-are-ipv4-tcp-connections-showing-as-tcp6/237747#237747) 
for more details. but if you google "es not binding to ipv4" there are quite hit and 
I was trying to apply the suggestion (e.g. set environment variable to force using 
ipv4 etc `export ES_JAVA_OPTS="-Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Addresses"`) 
and had no luck of course because that wasn't the problem as mentioned above.

```bash
root@bd-gpu01-s02:~# netstat -p tcp -na | grep 9200
tcp        0      0 10.102.111.221:43180    192.168.202.121:9200    ESTABLISHED 31786/node
tcp        0      0 10.102.111.221:43178    192.168.202.121:9200    ESTABLISHED 31786/node
tcp        0      0 10.102.111.221:43270    192.168.202.121:9200    ESTABLISHED 31786/node
tcp6       0      0 :::9200                 :::*                    LISTEN      113888/java
tcp6       0      0 10.102.111.221:9200     10.101.95.238:59009     ESTABLISHED 113888/java
tcp6       0      0 10.102.111.221:9200     10.101.95.238:59002     ESTABLISHED 113888/java
unix  3      [ ]         STREAM     CONNECTED     4089200  140511/python3.6
```

#### Is firewall allowing?
Yes, this is first thing I did right? but I was running Ubuntu so used `ufw` (Ubuntu Firewall).
When I check the status, 9200 is is there to "ALLOW" as expected.
```bash
root@bd-gpu01-s02:~# ufw status
Status: active

To                         Action      From
--                         ------      ----
8899                       ALLOW       Anywhere
22                         ALLOW       Anywhere
5000                       ALLOW       Anywhere
80                         ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
Nginx HTTP                 ALLOW       Anywhere
9200                       ALLOW       Anywhere
8899 (v6)                  ALLOW       Anywhere (v6)
22 (v6)                    ALLOW       Anywhere (v6)
5000 (v6)                  ALLOW       Anywhere (v6)
80 (v6)                    ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
Nginx HTTP (v6)            ALLOW       Anywhere (v6)
9200 (v6)                  ALLOW       Anywhere (v6)
```

but I just could not access!
So just to be sure, from my host, I checked to see if `9200` is open on server
```bash
➜  ~ sudo nmap -p 9200 10.102.111.221
Password:

Starting Nmap 7.60 ( https://nmap.org ) at 2018-08-22 10:24 MST
Nmap scan report for es-01 (10.102.111.221)
Host is up (0.091s latency).

PORT     STATE    SERVICE
9200/tcp filtered wap-wsp
```
Then it shows "filtered"... wha~~~t???
Grrrr...

Okay, back to basic. Let's check with `iptable` and see if all is good.
```bash
iptables -S
```
Note: 
`-S option (or --list-rules) [chain]: Print all rules in the selected chain. 
If no chain is selected, all chains are printed like iptables-save. 
Like every other iptables command, it applies to the specified table 
(filter is the default).`

Then I finally see the issue. 
```bash
# iptables -S INPUT
-P INPUT DROP
-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
...
-A INPUT -j REJECT --reject-with icmp-host-prohibited
...
-A ufw-user-input -p tcp -m tcp --dport 9200 -j ACCEPT
```

The iptables rules will be processed in line order of the file.
My newly added `ufw-user-input` (INPUT chain entered via `ufw`) was added at the very bottom.
Below `REJECT` which rejects the packet. 

`ufw` do have `insert <position-number>` but still puts below the `INPUT REJECT` on iptables.
So what I end up doing is to insert at position 1 using `iptables` and finally worked... phew.
```bash
# insert a rule at line 1
iptables -I INPUT 1 -p tcp --dport 9200 -j ACCEPT
```

`ufw` is nice syntax but I guess in order to be able to use it, you want to have clean iptables 
to starts with.
 

Cheers!