var Definer = require('definer');
var assert = require('assert');

function isEnumerable(obj, prop) {
	for (var key in obj) if (key === prop) return true;
	return false;
}

function isWritable(obj, prop) {
	var tmp = obj[prop];
	var num = Math.random();
	obj[prop] = num;
	if (obj[prop] === num) return true;
	else {
		obj[prop] = tmp;
		return false;
	}
}

function isConfigurable(obj, prop) {
	var tmp = obj[prop];
	delete obj[prop];
	if (prop in obj) return false;
	else {
		prop[obj] = tmp;
		return true;
	}
}

describe('Definer(obj)', function () {
	it('should create a Definer instance', function () {
		assert(new Definer() instanceof Definer);
	});
	it('should not require a new keyword' , function () {
		assert(Definer() instanceof Definer);
	});

	describe('#define(prop, value, [descriptor])', function () {
		it('should create a property with specified value', function () {
			var obj = {};
			Definer(obj).define('foo', 42);
			assert(obj.foo === 42);
		});
		it('should use a default descriptor with everything disabled', function () {
			var obj = {};
			Definer(obj).define('foo', 42);
			assert(!isEnumerable(obj, 'foo'));
			assert(!isWritable(obj, 'foo'));
			assert(!isConfigurable(obj, 'foo'));
		});
		it('should use passed descriptor', function () {
			var obj = {};
			Definer(obj).define('foo', 42, {
				writable: true,
				enumerable: true,
				configurable: true
			});
			assert(isEnumerable(obj, 'foo'));
			assert(isWritable(obj, 'foo'));
			assert(isConfigurable(obj, 'foo'));
		});
		it('should be chainable', function () {
			var define = Definer({});
			assert(define === define.define('foo', 42));
		});
	});

	describe('#type(name, descriptor)', function () {
		it('should create a custom define method', function () {
			var obj = {};
			var define = Definer(obj);
			define.type('e', {
				enumerable: true
			});
			define.e('foo', 42);
			assert(isEnumerable(obj, 'foo'));
			assert(!isWritable(obj, 'foo'));
			assert(!isConfigurable(obj, 'foo'));
		});
		it('should make the method chainable', function () {
			var define = Definer({});
			var descriptor = {
				enumerable: true
			};
			define.type('foo', descriptor);
			assert(define === define.foo('bar', 42));
		});
		it('should be chainable', function () {
			var define = Definer({});
			var descriptor = {
				enumerable: true
			};
			assert(define === define.type('foo', descriptor));
		});
	});
});