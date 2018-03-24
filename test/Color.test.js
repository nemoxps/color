let test = require('tape');

let Color = require('../src/Color');


test('Color', (t) => {
    t.test('Color.from', (t) => {
        t.deepEqual(Color.from('aqua'), { c: ['aqua'], modelName: 'keyword' });
        t.deepEqual(Color.from(['keyword', 'aqua']), { c: ['aqua'], modelName: 'keyword' });
        t.deepEqual(Color.from(Color.from('aqua')), { c: ['aqua'], modelName: 'keyword' });
        
        t.end();
    });
    
    t.test('Color#hasAlpha', (t) => {
        t.equal(Color.from('#000').hasAlpha(), false);
        t.equal(Color.from('rgb(0, 0, 0)').hasAlpha(), false);
        t.equal(Color.from('rgba(0, 0, 0, 0)').hasAlpha(), true);
        
        t.end();
    });
    
    t.test('Color#useAlpha', (t) => {
        t.deepEqual(Color.from('#000').useAlpha(), { c: ['00', '00', '00'], modelName: 'hex' });
        t.deepEqual(Color.from('rgb(0, 0, 0)').useAlpha(), { c: [0, 0, 0, 1], modelName: 'rgb' });
        t.deepEqual(Color.from('rgba(0, 0, 0, 0)').useAlpha(), { c: [0, 0, 0, 0], modelName: 'rgb' });
        
        t.end();
    });
    
    t.test('Color#removeAlpha', (t) => {
        t.deepEqual(Color.from('#000').removeAlpha(), { c: ['00', '00', '00'], modelName: 'hex' });
        t.deepEqual(Color.from('rgb(0, 0, 0)').removeAlpha(), { c: [0, 0, 0], modelName: 'rgb' });
        t.deepEqual(Color.from('rgba(0, 0, 0, 0)').removeAlpha(), { c: [0, 0, 0], modelName: 'rgb' });
        
        t.end();
    });
    
    t.test('Color#clone', (t) => {
        let C = Color.from('#000'); let CC = C.clone();
        t.notEqual(C, CC);
        t.deepEqual(C, CC);
        
        t.end();
    });
    
    t.test('Color#toString', (t) => {
        t.equal(Color.from('#000').toString(), '#000000');
        t.equal(Color.from('rgb(0, 0, 0)').toString(), 'rgb(0, 0, 0)');
        
        t.end();
    });
    
    t.test('Color#blend', (t) => {
        t.deepEqual(Color.from('#000').blend('#FFF', 1), { c: [255, 255, 255, 1], modelName: 'rgb' });
        t.deepEqual(Color.from('#000').blend('#FFF', 0.5), { c: [128, 128, 128, 1], modelName: 'rgb' });
        t.deepEqual(Color.from('#000').blend('#FFF', 0), { c: [0, 0, 0, 1], modelName: 'rgb' });
        t.deepEqual(Color.from('rgba(200, 100, 50, 0.4)').blend('rgba(50, 100, 200, 0.7)', 0.5), { c: [125, 100, 125, 0.55], modelName: 'rgb' });
        
        t.end();
    });
    
    t.test('Color#mix', (t) => {
        t.deepEqual(Color.from('#000').mix('#FFF', 100), { c: [0, 0, 0, 1], modelName: 'rgb' });
        t.deepEqual(Color.from('#000').mix('#FFF', 50), { c: [128, 128, 128, 1], modelName: 'rgb' });
        t.deepEqual(Color.from('#000').mix('#FFF', 0), { c: [255, 255, 255, 1], modelName: 'rgb' });
        t.deepEqual(Color.from('rgba(200, 100, 50, 0.4)').mix('rgba(50, 100, 200, 0.7)', 50), { c: [103, 100, 147, 0.55], modelName: 'rgb' });
        
        t.end();
    });
    
    t.test('Color#contrast', (t) => {
        t.deepEqual(Color.from('#00F').contrast(), { c: ['FF', 'FF', 'FF'], modelName: 'hex' });
        t.deepEqual(Color.from('#00F').contrast('#111', '#EEE'), { c: ['EE', 'EE', 'EE'], modelName: 'hex' });
        t.deepEqual(Color.from('#00F').contrast('#EEE', '#111'), { c: ['EE', 'EE', 'EE'], modelName: 'hex' });
        t.deepEqual(Color.from('#00F').contrast(undefined, undefined, 5), { c: ['00', '00', '00'], modelName: 'hex' });
        
        t.end();
    });
    
    t.test('Color#yiqcontrast', (t) => {
        t.deepEqual(Color.from('#00F').yiqcontrast(), { c: ['FF', 'FF', 'FF'], modelName: 'hex' });
        t.deepEqual(Color.from('#0F0').yiqcontrast(), { c: ['00', '00', '00'], modelName: 'hex' });
        
        t.end();
    });
    
    t.test('Color#grayscale', (t) => {
        t.deepEqual(Color.from('rgba(0, 0, 255, 0)').grayscale(), { c: [240, 0, 50], modelName: 'hsl' });
        
        t.end();
    });
    
    t.test('Color#unfade & Color#fade', (t) => {
        t.deepEqual(Color.from('rgba(0, 0, 0, 0.1)').unfade(0.4), { c: [0, 0, 0, 0.5], modelName: 'rgb' });
        t.deepEqual(Color.from('rgba(0, 0, 0, 0.1)').unfade('10%'), { c: [0, 0, 0, 0.2], modelName: 'rgb' });
        t.deepEqual(Color.from('rgba(0, 0, 0, 0.1)').unfade('10%%'), { c: [0, 0, 0, 0.11], modelName: 'rgb' });
        
        t.deepEqual(Color.from('rgba(0, 0, 0, 0.5)').fade(0.4), { c: [0, 0, 0, 0.1], modelName: 'rgb' });
        t.deepEqual(Color.from('rgba(0, 0, 0, 0.5)').fade('10%'), { c: [0, 0, 0, 0.4], modelName: 'rgb' });
        t.deepEqual(Color.from('rgba(0, 0, 0, 0.5)').fade('10%%'), { c: [0, 0, 0, 0.45], modelName: 'rgb' });
        
        t.end();
    });
    
    t.test('Color#spin', (t) => {
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').spin(320), { c: [200, 100, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').spin(-40), { c: [200, 100, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').spin('10%'), { c: [276, 100, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').spin('-10%'), { c: [204, 100, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').spin('10%%'), { c: [264, 100, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').spin('-10%%'), { c: [216, 100, 50], modelName: 'hsl' });
        
        t.deepEqual(Color.from('hsv(240, 100%, 100%)').spin(320), { c: [200, 100, 100], modelName: 'hsv' });
        
        t.end();
    });
    
    t.test('Color#saturate & Color#desaturate', (t) => {
        t.deepEqual(Color.from('hsl(240, 10%, 50%)').saturate(40), { c: [240, 50, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 10%, 50%)').saturate('10%'), { c: [240, 20, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 10%, 50%)').saturate('10%%'), { c: [240, 11, 50], modelName: 'hsl' });
        
        t.deepEqual(Color.from('hsl(240, 50%, 50%)').desaturate(40), { c: [240, 10, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 50%, 50%)').desaturate('10%'), { c: [240, 40, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 50%, 50%)').desaturate('10%%'), { c: [240, 45, 50], modelName: 'hsl' });
        
        t.deepEqual(Color.from('hsv(240, 10%, 100%)').saturate(40), { c: [240, 50, 100], modelName: 'hsv' });
        t.deepEqual(Color.from('hsv(240, 50%, 100%)').desaturate(40), { c: [240, 10, 100], modelName: 'hsv' });
        
        t.end();
    });
    
    t.test('Color#lighten & Color#darken', (t) => {
        t.deepEqual(Color.from('hsl(240, 100%, 10%)').lighten(40), { c: [240, 100, 50], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 10%)').lighten('10%'), { c: [240, 100, 20], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 10%)').lighten('10%%'), { c: [240, 100, 11], modelName: 'hsl' });
        
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').darken(40), { c: [240, 100, 10], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').darken('10%'), { c: [240, 100, 40], modelName: 'hsl' });
        t.deepEqual(Color.from('hsl(240, 100%, 50%)').darken('10%%'), { c: [240, 100, 45], modelName: 'hsl' });
        
        t.end();
    });
    
    t.test('Color#envalue & Color#devalue', (t) => {
        t.deepEqual(Color.from('hsv(240, 100%, 10%)').envalue(40), { c: [240, 100, 50], modelName: 'hsv' });
        t.deepEqual(Color.from('hsv(240, 100%, 10%)').envalue('10%'), { c: [240, 100, 20], modelName: 'hsv' });
        t.deepEqual(Color.from('hsv(240, 100%, 10%)').envalue('10%%'), { c: [240, 100, 11], modelName: 'hsv' });
        
        t.deepEqual(Color.from('hsv(240, 100%, 50%)').devalue(40), { c: [240, 100, 10], modelName: 'hsv' });
        t.deepEqual(Color.from('hsv(240, 100%, 50%)').devalue('10%'), { c: [240, 100, 40], modelName: 'hsv' });
        t.deepEqual(Color.from('hsv(240, 100%, 50%)').devalue('10%%'), { c: [240, 100, 45], modelName: 'hsv' });
        
        t.end();
    });
    
    t.test('Color#to{modelName}', (t) => {
        t.deepEqual(Color.from('#000').toHex(), { c: ['00', '00', '00'], modelName: 'hex' });
        t.deepEqual(Color.from('#000').toRgb(), { c: [0, 0, 0], modelName: 'rgb' });
        t.deepEqual(Color.from('#000').toHsl(), { c: [0, 0, 0], modelName: 'hsl' });
        t.deepEqual(Color.from('rgba(0, 0, 0, 0)').toHsl(), { c: [0, 0, 0, 0], modelName: 'hsl' });
        
        t.end();
    });
    
    t.test('Color#{modelName}', (t) => {
        t.equal(Color.from('#000').hex(), '#000000');
        t.equal(Color.from('#000').shex(), '#000');
        t.equal(Color.from('#000').rgb(), 'rgb(0, 0, 0)');
        t.equal(Color.from('#000').hsl(), 'hsl(0, 0%, 0%)');
        t.equal(Color.from('rgba(0, 0, 0, 0)').hsl(), 'hsla(0, 0%, 0%, 0)');
        
        t.end();
    });
    
    t.test('Color~*', (t) => {
        let C = Color.from('#000'); let C2 = Color.from('#FFF');
        t.doesNotThrow(() => { Color.luma(C); });
        t.doesNotThrow(() => { Color.yiq(C); });
        t.doesNotThrow(() => { Color.wcag(C, C2); });
        t.doesNotThrow(() => { Color.isCompliant(C, C2); });
        
        t.equal(Color.brightnessDifference(C, C), 0);
        t.equal(Color.brightnessDifference(C, C2), 255);
        
        t.equal(Color.colorDifference(C, C), 0);
        t.equal(Color.colorDifference(C, C2), 765);
        
        t.end();
    });
    
    t.end();
});