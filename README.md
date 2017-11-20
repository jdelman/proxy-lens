## proxy-lens

Use ES6 JavaScript proxies to provide lens-like support in JavaScript.

Often you need to access a property deep in a JavaScript object. At any point in the chain you may run into an undefined value. To guard against this we have the classic JS syntax:

```js
const val = object && object.a && object.a.b && object.a.b.c;
if (val) {
  // do something with val
}
```

There has to be a better way -- it's called `proxy-lens`, and it's based on the concept of lenses from functional style programming. But these lenses aren't Monadic Funktors. They're simply an object proxy that makes truthiness and guarding a lot easier:

```js
const val = lens(object).a.b.c;
if (val.valueOf()) {
  // do something with val
}
```

