---
title: "Get started with Cython"
date: 2019-03-24
description: "Quick intro to how you can use Cython"
tags: ["cython"]
---

Cython is designed as a C-extension for Python. 
The developers can use Cython to speed up Python code execution. 
Performance gains are most significant in CPU-bound programs. 

Here is some cpu-intense code in python
```python
# cat compute_it.py 
import datetime
import math


def main():
    t0 = datetime.datetime.now()
    do_math(num=30_000_000)
    dt = datetime.datetime.now() - t0
    print("Done in {:,.2f} sec".format(dt.total_seconds()))


def do_math(start=0, num=10):
	pos = start
	k_sq = 1000 * 1000
	while pos < num:
		pos += 1
		math.sqrt((pos - k_sq) * (pos - k_sq))


if __name__ == '__main__':
    main()

```
Took 7.39 sec
```bash
python compute_it.py 
Done in 7.39 sec

```

Let's convert this to cython and run without GIL

Step 1. Write move do_math to cython code
```python
# cat math_core.pyx 

from libc.math cimport sqrt
import cython


def do_math(start:cython.int = 0, num:cython.int = 10):
    pos: cython.int = start
    k_sq: cython.int = 1000 * 1000
    
    with nogil:
        while pos < num:
            pos += 1
            sqrt((pos - k_sq) * (pos - k_sq))
```

```python
# cat compute_w_cython.py 
import datetime
from math_core import do_math


def main():
    t0 = datetime.datetime.now()
    do_math(num=30_000_000)
    dt = datetime.datetime.now() - t0
    print("Done in {:,.2f} sec".format(dt.total_seconds()))


if __name__ == '__main__':
    main()

```

Step 2. Create a setup, setup.py
```python
# cat setup.py 
from distutils.core import setup
from Cython.Build import cythonize


setup(ext_modules = cythonize("math_core.pyx"))

```

Step 3. Compile the cython via setup
```bash
$ pip install -U cython
$ python setup.py build_ext --inplace
Compiling math_core.pyx because it changed.
[1/1] Cythonizing math_core.pyx
...
math_core.cpython-36m-x86_64-linux-gnu.so

```

Step 4. Run the code
```bash
$ python compute_w_cython.py 
Done in 0.09 sec
```
This is quite impressive isn't it?

Note: it is important that before you convert to cython 
profile that code and ensure it is bottle-neck and cpu-bound.

Cheers!