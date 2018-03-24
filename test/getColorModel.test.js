let test = require('tape');

let getColorModel = require('../src/getColorModel');


test('getColorModel', (t) => {
    let suites = {
        hex: [
            '#000000',
            '#000',
            ['#', '00', '00', '00'],
            ['hex', '00', '00', '00'],
            ['#', '0', '0', '0'],
            ['hex', '0', '0', '0'],
        ],
        rgb: [
            'rgb(0, 0, 0)',
            'rgba(0, 0, 0, 0)',
            'rgb(0%, 0%, 0%)',
            'rgba(0%, 0%, 0%, 0)',
            ['rgb', 0, 0, 0],
            ['rgba', 0, 0, 0, 0],
            ['rgb', '0%', '0%', '0%'],
            ['rgba', '0%', '0%', '0%', 0],
        ],
        hsl: [
            'hsl(0, 0%, 0%)',
            'hsla(0, 0%, 0%, 0)',
            ['hsl', 0, 0, 0],
            ['hsla', 0, 0, 0, 0],
        ],
        hsv: [
            'hsv(0, 0%, 0%)',
            'hsva(0, 0%, 0%, 0)',
            ['hsv', 0, 0, 0],
            ['hsva', 0, 0, 0, 0],
        ],
        gray: [
            'gray(0)',
            ['gray', 0],
        ],
        lumagray: [
            'lumagray(0)',
            ['lumagray', 0],
        ],
        keyword: [
            'aqua',
            ['keyword', 'aqua'],
        ],
    };
    for (let [modelName, suite] of Object.entries(suites))
      t.test(`getColorModel: ${modelName}`, (t) => {
          for (let arg of suite)
            t.equal(getColorModel(arg), modelName);
          
          t.end();
      });
    
    t.end();
});