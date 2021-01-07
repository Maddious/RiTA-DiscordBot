# gulp-line-ending-corrector

Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings) 

# about line-editing-corrector

It converts all those pesky `\r\n` (a.k.a `CRLF`) line endings in Microsoft Windows operating systems into the more commonly used and recognized `\n` (a.k.a `LF`). Though it lets you do the opposite as well ( converting `LF` to `CRLF` ). It supports `\r` (a.k.a `CR`) as well for the sake of completion.

You should definitely have this in your build process especially if someone in your team works from a non UNIX system.

[View the repo here](https://github.com/iShafayet/line-ending-corrector)

# Installation

For using programmatically

```bash
[sudo] npm install gulp-line-ending-corrector
```

# Usage

requiring it. the lec variable itself is a function.

```node
lec = require 'gulp-line-ending-corrector'
```

simplest version

```node
.pipe(lec())
```

with all options

```node
.pipe(lec({verbose:true, eolc: 'LF', encoding:'utf8'}))
```

## Options

`eolc`
Desired End of Line character. can be `CR` (`\r`), `LF`(`\n`) (Default), `CRLF`(`\r\n`)

`encoding`
Any meaningful encoding that nodejs supports. Default `utf8`. It is advisable to use `utf8` since others are not tested by the devs.

# Troubleshooting

1. If you need to ignore binary files, take a look at this - https://github.com/iShafayet/gulp-line-ending-corrector/issues/2#issuecomment-392745133

# Contributing

We actively check for issues even for the least used repositories (unless explicitly abandoned). All of our opensource repositories are being used in commercial projects by teamO4 or bbsenterprise. So, it is very likely that we will sort out important issues not long after they are posted.

Please create a github issue if you find a bug or have a feature request.

Pull requests are always welcome for any of our public repos.

