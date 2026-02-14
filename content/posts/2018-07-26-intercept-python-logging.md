---
title: "Intercept Python Logging"
date: 2018-07-26
lastmod: 2018-07-26
description: "Filter Handle python logging with Custom Logic"
tags: ["python", "logging"]
---

### The problem:

I need to ship specific log record and had formatter written in python.
It is pretty complex transformation.

I thought of using Logstash but I then need to either convert this python logic or write a plugin
to use already written python parser. Plus I need to install logstash... 
I wanted a simpler solution


### How to solve it

Use custom python logging Handler and Filter!

```python
import logging

messages = []
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class ListenFilter(logging.Filter):

    def filter(self, record):
        """Determine which log records to output.
        Returns 0 for no, nonzero for yes.
        """
        if record.getMessage().startswith('dont: '):
            return False
        return True


class RequestsHandler(logging.Handler):
    def emit(self, record):
        """Send the log records (created by loggers) to
        the appropriate destination.
        """
        messages.append(record.getMessage())


handler = RequestsHandler()
logger.addHandler(handler)

filter_ = ListenFilter()
logger.addFilter(filter_)

# log I want
logger.info("logme: Howdy!")


# log i want to skip
logger.info("dont: I'm doing great!")

# prints ['logme: Howdy!']
print(messages)

```

Cheers!