let test = require('tape');

let util = require('../src/util');
let {
    toNormalizedHex, toShortHex, toNormalizedHue,
    lumaOf, yiqOf, wcagOf,
    calc,
} = util;


test('util', (t) => {
    t.test('util.toNormalizedHex', (t) => {
        t.equal(toNormalizedHex('#123456'), '#123456');
        t.equal(toNormalizedHex('#112233'), '#112233');
        t.equal(toNormalizedHex('#123'), '#112233');
        
        t.end();
    });
    
    t.test('util.toShortHex', (t) => {
        t.equal(toShortHex('#123456'), '#123456');
        t.equal(toShortHex('#112233'), '#123');
        t.equal(toShortHex('#123'), '#123');
        
        t.end();
    });
    
    t.test('util.toNormalizedHue', (t) => {
        t.equal(toNormalizedHue(0), 0);
        t.equal(toNormalizedHue(200), 200);
        t.equal(toNormalizedHue(1280), 200);
        t.equal(toNormalizedHue(-160), 200);
        t.equal(toNormalizedHue(-1240), 200);
        
        t.end();
    });
    
    t.test('util.lumaOf', (t) => {
        t.equal(lumaOf([0, 0, 0]), 0);
        t.equal(lumaOf([255, 255, 255]), 1);
        
        t.end();
    });
    
    t.test('util.yiqOf', (t) => {
        t.equal(yiqOf([0, 0, 0]), 0);
        t.equal(yiqOf([255, 255, 255]), 255);
        
        t.end();
    });
    
    t.test('util.wcagOf', (t) => {
        t.equal(wcagOf([0, 0, 0], [0, 0, 0]).ratio, 1);
        t.equal(wcagOf([0, 0, 0], [255, 255, 255]).ratio, 21);
        
        t.end();
    });
    
    t.test('util.calc', (t) => {
        t.equal(calc(0, 1, { mode: '+', pattern: ['int'] }), 1);
        t.equal(calc(1, 1, { mode: '-', pattern: ['int'] }), 0);
        t.equal(calc(1, -1, { mode: '+', pattern: ['sint'] }), 0);
        
        t.equal(calc(0, 0.5, { mode: '+', pattern: ['num'] }), 0.5);
        
        t.equal(calc(10, '10%', { mode: '+', pattern: ['%'], pcBase: 100 }), 20);
        t.equal(calc(10, '-10%', { mode: '+', pattern: ['s%'], pcBase: 100 }), 0);
        
        t.equal(calc(10, '10%%', { mode: '+', pattern: ['%%'] }), 11);
        t.equal(calc(10, '-10%%', { mode: '+', pattern: ['s%%'] }), 9);
        
        t.notEqual(calc(0.1, 0.2, { mode: '+', pattern: ['num'] }), 0.3);
        t.equal(calc(0.1, 0.2, { mode: '+', pattern: ['num'], round: true }), 0);
        t.equal(calc(0.1, 0.2, { mode: '+', pattern: ['num'], round: 1 }), 0.3);
        
        t.end();
    });
    
    t.end();
});