# line-ending-corrector
Line Ending Corrector - A utility that makes sure your files have consistent line endings.

It converts all those pesky `\r\n` (a.k.a `CRLF`) line endings in Microsoft Windows operating systems into the more commonly used and recognized `\n` (a.k.a `LF`). Though it lets you do the opposite as well ( converting `LF` to `CRLF` ). It supports `\r` (a.k.a `CR`) as well for the sake of completion.

You should definitely have this in your build process especially if someone in your team works from a non UNIX system.

# Features

* Supports recusive mode for all files in a directory
* Can be used from the command line using `lec`. [See Here](https://github.com/iShafayet/line-ending-corrector)
* Has a gulp module
* Exposes a programmatic API.

# Installation

For using programmatically

```bash
[sudo] npm install line-ending-corrector
```
    
# Programmatic Usage

## To require

CoffeeScript
```CoffeeScript
{ LineEndingCorrector } = require 'line-ending-corrector'
```

JavaScript
```JavaScript
LineEndingCorrector = require('line-ending-corrector').LineEndingCorrector
```

## Methods

### LineEndingCorrector.correctSync(contents, options)
returns `[ wasAltered Boolean, modifiedContents String ]`

CoffeeScript
```CoffeeScript
contentsOfSomeFile = arbitaryFunctionToLoadFile()
[ wasAltered, modifiedContents ] = LineEndingCorrector.correctSync contentsOfSomeFile
if wasAltered
  arbitaryFunctionToSaveFile modifiedContents
```

JavaScript
```JavaScript
contentsOfSomeFile = arbitaryFunctionToLoadFile();
res = LineEndingCorrector.correctSync(contentsOfSomeFile);
if(res.wasAltered) {
  arbitaryFunctionToSaveFile(res.modifiedContents);
}
```

ES6
```JavaScript
contentsOfSomeFile = arbitaryFunctionToLoadFile();
{ wasAltered, modifiedContents } = LineEndingCorrector.correctSync(contentsOfSomeFile);
if(wasAltered) {
  arbitaryFunctionToSaveFile(modifiedContents);
}
```

### LineEndingCorrector.correctStream(contentStream, options)
returns `modifiedContentStream stream.Readable`

CoffeeScript
```CoffeeScript
contentStream = arbitaryFunctionToLoadFileAsStream()
modifiedContentStream = LineEndingCorrector.correctStream contentStream, { encoding: 'utf8', eolc: 'LF'}
arbitaryFunctionToSaveFileFromStream modifiedContents
```


### LineEndingCorrector.correct(content, options, callbackFunction)
`callbackFunction` is called with `(err Error, wasAltered boolean, modifiedContent String)`

CoffeeScript
```CoffeeScript
content = arbitaryFunctionToLoadFile()
LineEndingCorrector.correct content, { eolc: 'LF' }, (err, wasAltered, modifiedContent)=>
  throw err if err
  if wasAltered
    arbitaryFunctionToSaveFileFromStream modifiedContent
```

## Options

`eolc`
Desired End of Line character. can be `CR` (`\r`), `LF`(`\n`) (Default), `CRLF`(`\r\n`)

`encoding`
Any meaningful encoding that nodejs supports. Default `utf8`. It is advisable to use `utf8` since others are not tested by the devs.

# Gulp

See [gulp-line-ending-corrector](https://github.com/ishafayet/gulp-line-ending-corrector)

# Testing

You need [mocha](https://github.com/mochajs/mocha)

`npm test`


# Contributing

We actively check for issues even for the least used repositories (unless explicitly abandoned). All of our opensource repositories are being used in commercial projects by teamO4 or bbsenterprise. So, it is very likely that we will sort out important issues not long after they are posted.

Please create a github issue if you find a bug or have a feature request.

Pull requests are always welcome for any of our public repos.



