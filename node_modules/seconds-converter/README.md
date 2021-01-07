# seconds-converter

Convert milliseconds or seconds to days, hours, minutes, and seconds in node.js. In only 25 lines of code and no dependencies!

Originally created for use in download eta calculations. But this can be used anywhere there is a need to make seconds or milliseconds human readable.

## Installation
```js
npm install seconds-converter
```

## API

```js
convertedTime = secondsConverter(number, unitOfTime)
```

**number** is the amount of milliseconds or seconds.

**unitOfTime** is optional (defaults to milliseconds) and can be one of:

  + "ms" || "milliseconds" (string)
  + "sec" || "seconds" (string)
  + undefined (will default to milliseconds)

**Returned object**:

```js
  { days: num, hours: num, minutes: num, seconds: num}
```

## Usage

**Using milliseconds**:
```js
const secConverter = require("seconds-converter")

const convertedTime = secConverter(35127658, "ms")
// { days: 0, hours: 9, minutes: 45, seconds: 27 }

convertedTime.days
//0

convertedTime.hours
//9

convertedTime.minutes
//45

convertedTime.seconds
//27

```

**Using seconds**:
```js
const secConverter = require("seconds-converter")

const convertedTime = secConverter(35127658, "sec")
 // { days: 406, hours: 13, minutes: 40, seconds: 58 }

convertedTime.days
//406

convertedTime.hours
//13

convertedTime.minutes
//40

convertedTime.seconds
//58

```

**Milliseconds or seconds not specified (defaults to milliseconds)**:
```js
const secConverter = require("seconds-converter")

const convertedTime = secConverter(35127658)
// { days: 0, hours: 9, minutes: 45, seconds: 27 }

convertedTime.days
//0

convertedTime.hours
//9

convertedTime.minutes
//45

convertedTime.seconds
//27

```
