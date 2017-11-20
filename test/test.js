const assert = require('assert');
const lens = require('../index');

const myTestObj = {
  a: {
    b: {
      c: {
        d: 'e'
      }
    },
    f: {
      g: () => {
        return 'g'
      }
    },
    h: [
      {
        i: {
          j: 'k'
        }
      },
      'l',
      'm',
      'n'
    ]
  }
};

describe('Lens proxy', function() {
  const lensed = lens(myTestObj);

  it('should allow normal access', function() {
    assert.equal('e', lensed.a.b.c.d);
  });

  it('shouldn\'t throw when accessing a non-extant deep property', function() {
    assert.doesNotThrow(() => {
      const someValue = lensed.z.z.z.z.z.q.x;
    });
  });

  it('should allow functions to be called if they exist', function() {
    const func = lensed.a.f.g;
    assert.equal('g', func());
  });

  it('should return a naked value for an extant key', function() {
    const shouldBeE = lensed.a.b.c.d;
    assert.equal('e', shouldBeE);
  });

  it('unfortunately wont work if you try to check non-existence for non-extant key', function() {
    const nothing = lensed.z.z.z.z.z;
    if (!nothing) {
      throw new Error();
    }
    else {
      assert.ok(true);
    }
  });

  describe('#valueOf', function() {
    it('works for if statements and non-extant keys if you call valueOf...', function() {
      const nothing = lensed.z.z.z.z.z;
      if (!nothing.valueOf()) {
        assert.ok(true);
      }
      else {
        throw new Error();
      }
    });

    it('should return false for a non-extant object property', function() {
      const exists = lensed.z.z.z.z.z.q.valueOf();
      assert.equal(exists, false);
    });

    it('should return false for a non-extant array index', function() {
      const exists = lensed.a.h[5].valueOf();
      assert.equal(exists, false);
    });

    it('should return a naked value for an extant key', function() {
      const shouldBeE = lensed.a.b.c.d.valueOf();
      assert.equal('e', shouldBeE);
    });
  });


  describe('#Symbol.primitive', function() {
    it('works for if statements and non-extant keys if you prefix with +', function() {
      const nothing = lensed.z.z.z.z.z;
      if (!+nothing) {
        assert.ok(true);
      }
      else {
        throw new Error();
      }
    });

    it('should return the true value if you prefix with +', function() {
      const shouldBeK = lensed.a.h[0].i.j;
      if (shouldBeK) {
        assert.equal('k', shouldBeK);
      }
      else {
        throw new Error();
      }
    });
  });
});
