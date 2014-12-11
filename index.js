module.exports = Definer;

var support = true;
try { Object.defineProperty({}, 'x', {}); } catch (e) { support = false; }

var dummy = {};
var defineProperty = support ? Object.defineProperty : function defineProperty(obj, prop, descriptor) {
	obj[prop] = descriptor ? descriptor.value : undefined;
};

function Definer(obj) {
	if (!(this instanceof Definer)) return new Definer(obj);
	this.obj = obj;
}

Definer.prototype.type = function type(name, descriptor) {
	this[name] = function (prop, value) {
		this.define(prop, value, descriptor);
		return this;
	};
	return this;
};

Definer.prototype.define = function define(prop, value, descriptor) {
	descriptor = descriptor || dummy;
	delete this.obj[prop];
	delete descriptor.value;
	delete descriptor.get;
	delete descriptor.set;
	if (value && typeof value.get === 'function') {
		descriptor.get = value.get;
		descriptor.set = value.set;
	} else {
		descriptor.value = value;
	}
	defineProperty(this.obj, prop, descriptor);
	return this;
};