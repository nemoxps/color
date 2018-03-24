let test = require('tape');

let color = require('../src');
let Color = require('../src/Color');


test('color', (t) => {
    t.deepEqual(color('aqua'), { c: ['aqua'], modelName: 'keyword' });
    
    t.test('color.random', (t) => {
        t.equal(color.random() instanceof Color, true);
        t.notDeepEqual(color.random(), color.random());
        
        t.end();
    });
    
    t.end();
});