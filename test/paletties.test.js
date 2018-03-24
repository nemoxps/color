let objEvery = require('lodash/every');
let test = require('tape');

let paletties = require('../src/paletties');
let Color = require('../src/Color');


test('paletties', (t) => {
    t.equal(
        objEvery(paletties, (obj) => [
            'keys', 'base', 'all', 'names',
        ].every((prop) => Object.hasOwnProperty.call(obj, prop))),
        true
    );
    t.equal(
        objEvery(paletties, (obj) => objEvery(obj.all, (arr) => arr.every((o) => {
            try
            {
              Color.from(o);
              return true;
            }
            catch (e)
            {
              return false;
            }
        }))),
        true
    );
    
    t.end();
});