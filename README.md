# definer

Easier and less verbose wrapper for `Object.defineProperty` & `Object.defineProperties`.

#### Compatibility

Falls back to a dumb `obj.prop = value` assignment for older browsers.

## Install

With [component(1)](https://github.com/component/component):

```bash
component install darsain/definer
```

## Usage

```js
var definer = require('definer');
```

Basic:

```js
definer(obj)
	.define('foo', 42)
	.define('bar', 43, { writable: true });
```

Custom definer types:

```js
definer(obj)
	.type('enumerable', { enumerable: true })
	.enumerable('foo', 'bar');
```

Using getter/setter as a value:

```js
var value;
definer(obj).define('foo', {
	get: function () { return value; },
	set: function (newValue) { value = newValue; }
});
```

Real world example:

```js
function Foo () {}

var proto = definer(Foo.prototype);

// create a custom definer type for properties
proto.type('prop', { enumerable: true, writable: true });

// create a custom definer type for constants
proto.type('const', { enumerable: true });

// create a custom definer type for methods
// (basically just an alias of define() with default descriptor options)
proto.type('method');

// define a property
proto.prop('name', 'John');

// define a constant
proto.const('FOO', 42);

// define a method
proto.method('bar', function bar () {
	this; // Foo instance
});
```

Simplified with chaining:

```js
function Foo () {}

definer(Foo.prototype)

	// types
	.type('prop', { enumerable: true, writable: true })
	.type('const', { enumerable: true })
	.type('method')

	// property definitions
	.prop('name', 'John')
	.const('FOO', 42)
	.method('bar', function bar () {
		this; // Foo instance
	});
```

## API

### Definer(object)

Creates a Definer instance for defining properties on a passed **object**.

`new` keyword is optional.

### #obj

Passed object.

### #define(name, value, [descriptor])

Defines a property on an object.

##### name `String`

New property name.

##### value `Mixed`

New property value. It can also be a getter/setter object:

```js
definer(obj).define('foo', {
	get: function () { return value; },
	set: function (newValue) { something = newValue; }
});
```

Definer uses these duck typing conditions to figure out whether the value is a getter/setter object:

- value is an object
- value has a `get` property which is a function
- value has a `set` property which is a function

Getters/Setters work only when Object.defineProperty(ies) is supported by the browser. There is no fallback for this.
The value will be initially undefined, and getter/setter functions will have no effect.

##### [descriptor] `Object`

Descriptor options ([documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)).

Accepts:

- *configurable* - Whether property descriptor should be changeable. Default: `false`.
- *enumerable* - Whether property should show up in `for in` loops. Default: `false`.
- *writable* - Whether property should be writable. Default: `false`.

*value*, *get*, and *set* are ignored. Use the **value** argument for those instead.

#### *Returns*

Definer instance.

### #type(name, [descriptor])

Create a custom definer type shorthand that will always use passed descriptor options to define a property.

```js
definer(obj)
	.type('const', { enumerable: true }) // creates #const(name, value) method
	.const('FOO', 'bar');                // obj.FOO will be enumerable
```

Custom definer types accept 2 arguments: **name**, and **value**.

Value can be a getter/setter object, similar to `#define()`.

#### *Returns*

Definer instance.

## Testing

To run tests:

```
component build --dev
```

And open `test/index.html`

## License

MIT