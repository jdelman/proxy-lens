/**
 * A "lens" is a proxy wrapper for an object that lets you
 * go deep into an object hierarchy without worrying about
 * hitting 'undefined' values.
 * 
 * You can safely write your accessor code for the value
 * you expect, and then call `valueOf` to get the unproxied
 * value at that location.
 */

const lens = (object, value) => new Proxy(object, {
  get: (target, name) => {
    // console.log('[get]', target, name, target[name], typeof target[name]);
    if (name === 'valueOf') {
      // terminated - return a function that returns the naked value
      return key => {
        if (!key) {
          return value;
        }
        else {
          // try to get the value @ 'key', but I'm warning you...
          return target[key];
        }
      };
    }
    else if (name === Symbol.toPrimitive) {
      // allows you to call (+value) instead of (.valueOf())
      return hint => {
        // console.log(hint, value);
        if (hint === 'number') {
          return !!value ? 1 : 0;
        }
        else if (hint === 'string') {
          return String(value);
        }
        return value;
      }
    }
    else if (target.hasOwnProperty(name)) {
      const value = target[name];
      if (['object', 'function'].includes(typeof value)) {
        // keep digging
        return lens(value, value);
      }
      else {
        // THIS MAY NOT WORK WHEN THERE ARE ARRAYS IN THE OBJECT?
        // got a scalar value, but we want to allow
        // deep inspection to prevent runtime errors
        return lens({}, value);
      }
    }
    else if (name in target) {
      // unproxy - usually a function or some other object property
      return target[name];
    }
    else {
      // isNothing
      return lens({}, false);
    }
  }
});

module.exports = lens;
