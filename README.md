# miss-minutes

How long does my code take? ⏱

This package provides two simple class:

-   `Chrono` whose purpose is to time the elapsed time between two points in the code
-   `TimeValue` whose purpose is to convert elapsed time between differents units (ms, sec, min, hour)

[&rightarrow; See it on NPM &leftarrow;](https://www.npmjs.com/package/miss-minutes)

**More to come 👍**

## Basics examples

### Chrono

```js
import Chrono from "miss-minutes";
// or import {Chrono} from "miss-minutes"

// Create a new chrono
const c = Chrono.create();

c.start(); // start the chrono

// some code

c.stop(); // stop the chrono

console.log(c.value);
// elapsed time between .start() and .stop() in millisecond
```

### TimeValue

```js
import { TimeValue } from "miss-minutes";

const t = TimeValue.from(75, "s"); // 75 seconds

console.log(t.to("ms")); // output: 75000
console.log(t.to("min")); // output: 1.25
```

---

## Chrono object

### Instanciate

```js
const c1 = Chrono.create(); // create a new Chrono
const c2 = Chrono.start(); // create AND start a new chrono
```

### States

Chrono can be in one of three states :

-   `not started` : chrono created but never started
-   `running` : chrono started
-   `stopped` : chrono started and stopped (not running)

```js
const c = Chrono.create();

c.state; // = 'not started' | 'running' | 'stopped'

c.isStarted; // true | false
c.isRunning; // true | false
c.isStopped; // true | false
```

|             | `not started` | `running` | `stopped` |
| ----------- | :-----------: | :-------: | :-------: |
| `isStarted` |     false     |   true    |   true    |
| `isRunning` |     false     |   true    |   false   |
| `iStopped`  |     false     |   false   |   true    |

### start/stop

```js
const c = Chrono.create();

c.start(); // start the chrono (re-start if chrono is running or stopped)
c.stop(); // stop the chrono
```

If you start an already running or stopped Chrono, it is re-started (reset). Stored laps (see below) are cleared

### Laps

Chrono can store laps, for each lap, you can get the elasped time since the previous lap (relative time) and the elasped time since start (absolute time)

```js
const c = Chrono.start();

// some code

const lap1 = c.lap();

// some code

const lap2 = c.lap();

console.log(lap1);
// output: [225,225]
// first lap so 'last lap' is start time !
// => [millisec since start, millisec since start]

console.log(lap2);
// output: [843,1068]
// => [millisec since lap1, millisec since start]

// ...

const allLaps = c.laps;
// get all stored laps
// [[225,225],[843,1068]]
```

### rawValue / timeValue

-   `rawValue` propertie is the actual value of the Chrono in millisecond
-   `timeValue` propertie is a TimeValue object which contain the value of the Chrono
-   `stop()` method return the final `rawValue` of the Chrono

**You can get the current value even if the chrono is running**

-   `'not started'` &rightarrow; 0
-   `'running'` &rightarrow; current value (and grow with time)
-   `'stopped'` &rightarrow; final value (don't change)

```js
const c = Chrono.start();

c.rawValue; // raw value of the Chrono in millisecond (ex: 123456)
c.stop(); // stop the chrono and return the final raw value

c.timeValue; // TimeValue object

c.timeValue.to("min"); // value of the Chrono in minutes
```

---

## TimeValue Object

### Instanciate

```js
// Build with a number of millisecond
const t1 = TimeValue.from(123); // or TimeValue.from(123,"ms")

// Build with another unit
const t2 = TimeValue.from(123, "min");

// Build with multiple components
const t3 = TimveValue.from({
    h: 1,
    min: 23,
    s: 45,
    ms: 654,
});
```

### Available units

-   "h": hours
-   "min": minutes
-   "s": seconds,
-   "ms": milliseconds

### Convert to

TimeValue store the value in millisecond, you can then covert it in another unit

```js
const t = TimeValue.from("123"); // 123 ms

t.to("s"); // 0.123 (123 ms == 0.123 s)
```

Sometimes conversion can give a result with many decimals (when you convert in minutes or hours). So you can adjust the number of decimals as you want with `decimal` option :

-   `true` : [default] return the full value
-   `false` : indentical to `decimal:0` &rightarrow; rounded to an integer
-   `number` : value is rounded with the `number` of decimal wanted
-   `"trunc"` : value is truncated (keep only the integer part)

```js
const t = TimeValue.from(1234567); // 1234567 ms

t.to("min"); // 20.576116666666667
t.to({ unit: "min", decimal: 5 }); // 20.57612
t.to({ unit: "min", decimal: 2 }); // 20.58
t.to({ unit: "min", decimal: false }); // 21
t.to({ unit: "min", decimal: "trunc" }); // 20
```

You can also have a 'bounded' value (value % limit) :

-   `"ms"` bound is 1000
-   `"s"` bound is 60
-   `"min"` bound is 60

```js
const t = TimeValue.from(1.25, "min");

t.to("s"); // 75
t.to({ unit: "s", bounded: true }); // 15

// 75 s => 60 s + 15 s => 1 min + 15 s
```
