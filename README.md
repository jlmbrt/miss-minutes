# miss-minutes

How long does my code take?

This package provides a simple class `Chrono` whose purpose is to time the elapsed time between two points in the code

## Basic example

```js
	import Chrono from "miss-minutes"

	// Create a new chrono
	const c = Chrono.create()

	c.start() // start the chrono

	{...} // some code

	c.stop() // stop the chrono

	console.log(c.value)
	// elapsed time between .start() and .stop() in millisecond
```

### Create a chrono

```js
const c1 = Chrono.create(); // create a new Chrono
const c2 = Chrono.start(); // create AND start a new chrono
```

### State of a chrono

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

### Value of a chrono

You can get the current value even if the chrono is running :

-   `state == 'not started'` &rightarrow; 0
-   `state == 'running` &rightarrow; current value (and grow with time)
-   `state == 'stopped` &rightarrow; final value (don't change)

returned value is the number of milliseconds elapsed

```js
c.value; // return the value of the chrono
c.stop(); // stop the chrono and return the final value
```
