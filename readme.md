# data-state [![NPM version](https://badge.fury.io/js/data-state.svg)](https://npmjs.org/package/data-state) [![Build Status](https://travis-ci.org/jamen/data-state.svg?branch=master)](https://travis-ci.org/jamen/data-state)

> Fast state based on top of typed arrays.

A simple typed array state container that is fast and scalable.

```js
var state = createState({
  type: Float32Array
}, function dispatch (index, value, oldValue) {
  // Handle value changes on the data
})

for (var i = 0; i < 100; i++) {
  state.stage(i, Math.random())
}

state.update()
```

I might use it in managing coordinates in canvas, and videos/audio processing. Or maybe any time I want a fast/simple `Set`:

```js
var state = createState()

state.set(0, 123)
state.get(0) === 123
```

## Installation

```sh
$ npm install --save data-state
```

## Usage

### `createState([options], dispatch)`

Create `state` and container for data.  Returns `state` functions.

#### Parameters

 - `options` (`Object`): Options for your state and data.
   - `type` ([_`TypedArray`_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)): A _`TypedArray`_ interface for the data backing your state.  Defaults to `Float32Array`.
   - `data` ([`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)): A buffer to initialize the typed array with. (Note: overrides `length` if set)
   - `length` (`Number`): Alternative to `data`, initialize empty typed array at specified length. Defaults to `10000`.
   - `lowSecurity` (`Boolean`): Makes the `dump()` return state internals. Defaults to `false`.
 - `dispatch` (`Function`): Dispatch function triggered every time you update.

### Dispatch

Updates are called on your function like `dispatch(index, value, oldValue)`.  This is called by both `state.set()` and `state.update()`.

#### Example

```js
var state = createState({
  type: Uint16Array,
  length: 500 // Maximum amount of data.
}, function (i, value, oldValue) {
  // Dispatch on update
})
```

### `state.get(index)`

Return value at the given `index` number.

#### Example

```js
var foo = state({ data: someExistingData })

var value = foo.get(10)
```

### `state.set(index, value)`

Set value at the given `index` number.  This calls a dispatch after (opposed to `state.stage()`).

#### Example

```js
var state = createState({ type: Float32Array })

state.set(0, 100)
state.get(0) === 100

state.set(1, 0.005)
```

### `state.stage(index, value)`

Stages the setting of `value` at the given `index` number.  Values are dispatched when `state.update()` is called.

#### Example

```js
var state = createState()

state.stage(1, 123)
stage.get(1) !== 123
// Update it, set staged values
stage.update()
stage.get(1) === 123
```

### `state.update()`

Sets staged values, dispatching them in ascending order of their index numbers.

#### Example

```js
var state = createState({
  type: Float32Array
}, function dispatch (index, value, oldValue) {
  // Handle value changes on the data
})

for (var i = 0; i < 100) {
  state.stage(i, Math.random())
}

state.update()
```

### `state.length()`

Get length of state's array.

#### Example

```js
var state = createState({ length: 10 })

// Get length
state.length() === 10
```

### `state.dump()`

This only returns `null` by default.  It can be a risk if you do not want access to any of the data below (i.e. passing to plugins).  It can be useful for debugging and unit testing though.

Returns an object containing `data`, `staging`, `dispatch`, and `options`.

#### Example

```js
var state = createState({ lowSecurity: true })

var internals = state.dump()
internals.staging[0] = 123
internals.data.buffer
internals.dispatch(10, 0.101, 0.001)
// ...
```

## License

MIT © [Jamen Marz](https://git.io/jamen)
