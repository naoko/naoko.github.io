---
layout: post
title: Python Project Install
description: Wha't the difference between setup.py develop vs install vs pip install -e 
tags: [python]
modified: 2018-03-05
---

### The problem:

- I don't understand the difference between `setup.py develop` and `setup.py install`
- I don't understand the difference between `setup.py develop` and `pip install -e [dir]` 
- I don't see the changes to my code when I import my code 


### The difference between `setup.py develop` and `setup.py install`

In short, you want to run `setup.py develop` when you are editing code because when you run 
`setup.py install`, it will copy your code into `site-packages` thus if you want to test use your
latest code you will need to `install` again. On the other hand, with `develop`, it creates
a link to your source code so that when you import your code, it always linking to your latest code.

Let's take a look.

note: to keep it simple, I'm going to assume that you have created virtual environment and using python3.
```bash
cd [project-dir]
python3 -m venv env
source env/bin/activate
pip install -U setuptools
easy_install --version
setuptools 38.5.1 from [project-dir]/env/lib/python3.6/site-packages (Python 3.6)
```

`setup.py develop` simply creates a special `.egg-link` file in site-packages directory which 
links to your project's source code.

```bash
$ cd [project-dir]
$ python setup.py develop
$ ls -l env/lib/python3.6/site-packages | grep myproject
-rw-r--r--    1 nreeves  staff      44 Mar  5 14:11 myproject.egg-link
$ cat env/lib/python3.6/site-packages/myproject.egg-link
[project-dir]/src
../
```

When you `list` package, you can see it shows source directory instead of package name
```bash
$ pip list --format=columns | grep myproject
myproject                                0.1    [project-dir]/src
```

and when you see path to source code, it is the file under my project folder and not inside `site-package`
```python
>>> import myproject
>>> myproject.__file__
'[project-dir]/src/myproject/__init__.py'
```

Let's uninstall that for now so that we can see what `install` will do.
You can see it is simply removing `.egg-link` file
```bash
$ python setup.py develop --uninstall
running develop
Removing [project-dir]/env/lib/python3.6/site-packages/myproject.egg-link (link to src)
```
Spoiler alert!
if you run `find . -name 'myproject.*'`, you will see residual but this is good enough for now.

Now to install with `install`.
You will see `build` process then copying bunch of files to `site-packages`
```bash
$ python setup.py install
running install
running build
running build_py
...
copying build... -> [project-dir]/env/lib/python3.6/site-packages/myproject/...
...
```

When you `list` package, you only see package name unlike the one with `develop`
```bash
pip list --format=columns | grep myproject
myproject                               0.1
```

and when you see path to source code, the path to the file is inside of `site-packages`
```python
>>> import myproject
>>> myproject.__file__
'[project-dir]/env/lib/python3.6/site-packages/myproject/__init__.py'
```

### So that reason you might not see your new code could be:
* At one point you might have ran `python setup.py install` so make sure to remove them.
* You made change and forgot to restarted program. 
Python will load files when program started, compile it to bytecode and keep it internally.

### But wait... instead of `setup.py`, use `pip`

It is highly recommended to use `pip` instead of `setup.py`.
`pip install .` instead of `setup.py install` and
`pip install -e .` instead of `setup.py develop`.

Because `setup.py` will do the wrong things for dependencies such as:
* Setuptools uses easy_install to fulfill these dependencies and it [skip pip's hash-checking](https://pip.pypa.io/en/latest/reference/pip_install/#hash-checking-mode)
* [`easy_install` does not exclude pre and post release versions as pip does](https://github.com/pypa/setuptools/issues/1009#issuecomment-293254466).
* `easy_install` make the package hard to uninstall things or may not do clean job. Remember the spoiler alert? if you install with 
`pip install -e .` and run `pip uninstall mypackage` then `find . -name 'myproject.*'` won't find anything.

Cheers!
