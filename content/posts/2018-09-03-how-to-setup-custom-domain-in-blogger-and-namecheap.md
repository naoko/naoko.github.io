---
title: "How to setup custom domain in Blogger via Namecheap"
date: 2018-09-03
lastmod: 2018-09-03
description: "Setup custom domain in Blogger via Namechape"
tags: ["namecheap", "blogger", "domain", "subdomain"]
---

### The Goal:

You got blog going with Blogger and now ready to setup custom domain!


### How to setup custom domain?


First, you will need to register your domain.
To register your domain, you want to go through domain registrar.
To become the domain registrar, you will need ICANN Acrediation so you want to go ahead register through registrar instead of becoming one.

Now there are many of them out there. The popular ones are likely GoDaddy. 
I see Google is providing this service too.
I decided go to with [NameCheap.com](https://www.namecheap.com/) 
for a few reasons:
- [The company mission to stand for Internet Freedom](https://www.namecheap.com/about/mission-vision-values/) 
- Great pricing
- Free WhoisGuard forever so your data is protected from whois database.

### Now you've registered your domain. What's next?

1. Sign in to Blogger.
2. From Upper left drop-down, Select the blog you want to update
3. On the left menu, click Settings and then Basic.
3. Under "Publishing," click "+ Setup a 3rd party URL for your blog".
    ![](/images/2018-09-03/1_Click_setup_3rd_party.png)
4. Type the URL of the domain you've purchased.
5. Click Save.
6. You'll see an error with two CNAMEs.
    ![](/images/2018-09-03/6_error-after-save.png)	
    On "Name, Label or Host" column, 1st row it should show the subdomain you entered, 
    like "blog" or "www". For the case of this example, it is "subdomain" 
    For destination, it should show "ghs.googlehosted.com" and common to everyone.
	
    On 2nd row destination, it is s different for each person and is specific to 
    your blog and your Google Account.	
	
7. Now login to Cheapname and go to dashboard -> Domain List -> Advanced DNS
    ![](/images/2018-09-03/7_Cname_record_entry.png)

    1. Click "Add New Record" link at the bottom and select "CNAME Record"
    2. Enter value from "Name, Label or Host," on Blogger as Host
    3. Enter value from "Destination, Target or Points to," on Blogger
    which is "ghs.googlehosted.com" as value.
    4. Repeat the same for 2nd row on Blogger

9. Wait for at least an hour for your DNS settings to activate.
10. Repeat steps 1 through 5. Once you click 'save' (step 5) You should not get an error this time. 
    Your blogspot.com address will redirect to your custom domain. 
    It may take to 24 hours.


Cheers!