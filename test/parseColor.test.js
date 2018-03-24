let test = require('tape');

let parseColor = require('../src/parseColor');


test('parseColor', (t) => {
    let suites = {
        hex: [
            ['#000000', ['00', '00', '00']],
            ['#000', ['00', '00', '00']],
            [['#', '00', '00', '00'], ['00', '00', '00']],
            [['hex', '00', '00', '00'], ['00', '00', '00']],
            [['#', '0', '0', '0'], ['00', '00', '00']],
            [['hex', '0', '0', '0'], ['00', '00', '00']],
        ],
        rgb: [
            ['rgb(0, 0, 0)', [0, 0, 0]],
            ['rgba(0, 0, 0, 0)', [0, 0, 0, 0]],
            ['rgb(0%, 0%, 0%)', [0, 0, 0]],
            ['rgba(0%, 0%, 0%, 0)', [0, 0, 0, 0]],
            [['rgb', 0, 0, 0], [0, 0, 0]],
            [['rgba', 0, 0, 0, 0], [0, 0, 0, 0]],
            [['rgb', '0%', '0%', '0%'], [0, 0, 0]],
            [['rgba', '0%', '0%', '0%', 0], [0, 0, 0, 0]],
        ],
        hsl: [
            ['hsl(0, 0%, 0%)', [0, 0, 0]],
            ['hsla(0, 0%, 0%, 0)', [0, 0, 0, 0]],
            [['hsl', 0, 0, 0], [0, 0, 0]],
            [['hsla', 0, 0, 0, 0], [0, 0, 0, 0]],
        ],
        hsv: [
            ['hsv(0, 0%, 0%)', [0, 0, 0]],
            ['hsva(0, 0%, 0%, 0)', [0, 0, 0, 0]],
            [['hsv', 0, 0, 0], [0, 0, 0]],
            [['hsva', 0, 0, 0, 0], [0, 0, 0, 0]],
        ],
        gray: [
            ['gray(0)', [0]],
            [['gray', 0], [0]],
        ],
        lumagray: [
            ['lumagray(0)', [0]],
            [['lumagray', 0], [0]],
        ],
        keyword: [
            ['aqua', ['aqua']],
            [['keyword', 'aqua'], ['aqua']],
        ],
    };
    for (let [modelName, suite] of Object.entries(suites))
      t.test(`parseColor: ${modelName}`, (t) => {
          for (let [arg, expected] of suite)
            t.deepEqual(parseColor(arg), expected);
          
          t.end();
      });
    
    t.end();
});