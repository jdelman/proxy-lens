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

### FAQ

#### Do I have to do something special if I want to test the truthiness of the value?

Unfortunately, yes. It's the one and only flaw of this solution. There is no way in JavaScript to have a plain JavaScript object or function evaluate to false without overriding its `valueOf` and/or `Symbol.toPrimitive` methods. And even then, to invoke those, you need to call `obj.valueOf()` or `+obj` in your `if` statement.

#### Yeah but Ramda already has this functionality and it's actually a Turing complete DSL.

That's not a question. And I get your point, pointdexter, but that requires learning a new set of functions, which I do grant are much more powerful. But `proxy-lens` provides a small subset of that functionality for an extremely common pattern that arises frequently. See, for example, dealing with JSON collected externally whose object structure cannot be guaranteed.

#### Why not use Elm or Haskell instead? They guarantee type safety, and--

Sure, ok. Who's in charge of your codebase rewrite? Also, did you read the last FAQ question? You're overthinking it. This is a tool for JavaScript developers to use native object accessor syntax, i.e. dot or bracket syntax, to grab values deep inside nested objects.

#### I don't want to use this... I have a method that creates a new object type, there are four different object types, and they're monadic, and you just bind or map off each level to return the default value for the object if it doesn't exist, and it works really well.

OK, fine. So use that. But no one else wants to.

#### Shouldn't this be built into the language?

Yes. How about a `guard` keyword?