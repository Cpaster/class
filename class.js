var util = require("lib/util.js");

var bridge = function() {
};
var hash = {
	inherit: function(parent, init) {
		if(typeof parent == "function"){
			for(var i in parent){
				this[i] = parent[i];
			}
			bridge.prototype = parent.prototype;
			this.prototype = new bridge;
			this._super = parent;
			if(!this.__init__) {
				this.__init__ = [parent];
			}
		}
		this.__init__ = (this.__init__ || []).concat();
		if(init){
			this.__init__.push(init);
		}
		var proto = this.fn = this.prototype;
		proto.extend = hash.extend;
		return proto.constructor = this;
	},

	extend: function(obj) {
		var target = this;
		Object.keys(obj).forEach(function(name){
			var fn = target[name], fn2 = obj[name];
			if(!fn){
				target[name] = fn2;
			}
		})
	}
}
var Class = function(obj) {
	if(typeof obj == "object"){
		var statics = obj.statics,
			inherit = obj.inherit,
			init = obj.init;
			delete obj.statics;
			delete obj.inherit;
			delete obj.init;

		var klass = function() {
			for(var i=0, init; init = klass.__init__[i++];){
				init.apply(this, arguments);
			}
		}

		hash.inherit.call(klass, inherit, init);
		util.mix(klass, statics);
		var __init__ = klass.__init__;
		klass.prototype = klass.fn;
		klass.fn.extend(obj);
		return klass;

	}else{
		throw new Error("请输入对象类型");
	}
}

module.exports = Class;