---
layout: post
title: Secret Management with Vault
description: Simple Secret Management
tags: [devops]
modified: 2017-10-28
image:
  feature: 2017-10-28-vault.png
---

### The problem:

Where do you store your config/deployment management script?
I've done 2 ways:
- Put along with application/repo.
- Put all the config/deployment script in one repo separately from apps.

Each approach has its own Pros and Cons and I prefer the first approach 
which IMO is simpler but creates some duplication which is okay... 

I have some shared secrets that I encrypt with `Ansible Vault`
but when I had to copy and pasted this secret on a few repos 
I started to look for better way to do this.


### Key Management Service with Vault by HashiCorp

#### VAULT:
- handles any type of secret data, 
including database credentials, API Keys, PKI keys and encryption keys.
- is an option source tool that can be deployed to any environment and does not require any special hardware.
- is not tied to any specific configuration management system. You can read secrets from configuration management, 
but you can also use the API directly to read secrets from applications. 
This means that configuration management requires fewer secrets, and in many cases doesn't ever have to persist them to disk.

You can see more details [here on official doc](https://www.vaultproject.io/intro/index.html)

### Get Vault up and running

You can download precompiled binary from [here](https://www.vaultproject.io/downloads.html)

```bash
# unarchive
$ unzip vault_<version>_darwin_<arch>.zip

# move binary to desired path
$ mv vault <desired-dir>/
$ cd <desired-dir>
$ ./vault -v

# start server with Dev mode
$ ./vault server -dev
```

The official doc of Getting Started is very good so you can just follow from [here](https://www.vaultproject.io/intro/getting-started/dev-server.html_)

During the startup of vault server, it print VAULT_ADDR, Unseal Key and Root Token.
Let's set it some variable
```bash
$ VAULT_ADDR='http://127.0.0.1:8200'
$ ROOT_TOKEN="93132495-abc0-8eac-4e9e-92cba9f7d0b1"
```

Normally you don't want to use Root Token but just for quick and dirty demo purpose...
```bash
# Create secret
$ curl -X POST -H "X-Vault-Token:${ROOT_TOKEN}" -d '{"bar":"baz"}' ${VAULT_ADDR}/v1/secret/foo

# Read secret
$ curl -X GET -H "X-Vault-Token:${ROOT_TOKEN}" ${VAULT_ADDR}/v1/secret/foo
{
	"request_id": "e1bedb5e-a288-d066-e336-ee4850ac76a2",
	"lease_id": "",
	"renewable": false,
	"lease_duration": 2764800,
	"data": {
		"bar": "baz"
	},
	"wrap_info": null,
	"warnings": null,
	"auth": null
}
```
