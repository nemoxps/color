let objEvery = require('lodash/every');
let test = require('tape');

let models = require('../src/_models');


test('models', (t) => {
    t.equal(
        objEvery(models, (obj) => [
            'alias', 'channels', 'labels',
            'toString', 're', 'test', 'parse', 'round',
            'supportsAlpha', 'noRound',
        ].every((prop) => Object.hasOwnProperty.call(obj, prop))),
        true
    );
    
    let suites = {
        hex: {
            toString: [
                [['DE', 'AD', 'ED'], '#DEADED'],
                [['DE', 'AD', 'ed'], '#DEADed'],
                [['D', 'A', 'D'], '#DAD'],
                [['D', 'a', 'D'], '#DaD'],
            ],
            test: [
                ['#DEADED', true],
                ['#DEADed', true],
                ['#DAD', true],
                ['#DaD', true],
                ['#', false],
                ['#DEAD', false],
            ],
            parse: [
                ['#DEADED', ['DE', 'AD', 'ED']],
                ['#DEADed', ['DE', 'AD', 'ED']],
                ['#DAD', ['DD', 'AA', 'DD']],
                ['#DaD', ['DD', 'AA', 'DD']],
                ['#', null],
                ['#DEAD', null],
            ],
        },
        rgb: {
            toString: [
                [[200, 100, 50], 'rgb(200, 100, 50)'],
                [[200, 100, 50, 0.4], 'rgba(200, 100, 50, 0.4)'],
                [[200, 100, 50, 0], 'rgba(200, 100, 50, 0)'],
            ],
            test: [
                ['rgb(200, 100, 50)', true],
                ['rgba(200, 100, 50, 0.4)', true],
                ['rgb(100%, 50%, 25%)', true],
                ['rgba(100%, 50%, 25%, 0.4)', true],
                ['rgb(200, 100, 50, 0.4)', false],
                ['rgba(200, 100, 50)', false],
            ],
            parse: [
                ['rgb(200, 100, 50)', [200, 100, 50]],
                ['rgba(200, 100, 50, 0.4)', [200, 100, 50, 0.4]],
                ['rgb(100%, 50%, 25%)', [255, 127, 64]],
                ['rgba(100%, 50%, 25%, 0.4)', [255, 127, 64, 0.4]],
                ['rgb(200, 100, 50, 0.4)', null],
                ['rgba(200, 100, 50)', null],
            ],
        },
        hsl: {
            toString: [
                [[200, 100, 50], 'hsl(200, 100%, 50%)'],
                [[200, 100, 50, 0.4], 'hsla(200, 100%, 50%, 0.4)'],
                [[200, 100, 50, 0], 'hsla(200, 100%, 50%, 0)'],
            ],
            test: [
                ['hsl(0, 100%, 50%)', true],
                ['hsl(200, 100%, 50%)', true],
                ['hsl(1280, 100%, 50%)', true],
                ['hsl(+200, 100%, 50%)', true],
                ['hsl(+1280, 100%, 50%)', true],
                ['hsl(-160, 100%, 50%)', true],
                ['hsl(-1240, 100%, 50%)', true],
                ['hsla(0, 100%, 50%, 0.4)', true],
                ['hsla(200, 100%, 50%, 0.4)', true],
                ['hsla(1280, 100%, 50%, 0.4)', true],
                ['hsla(+200, 100%, 50%, 0.4)', true],
                ['hsla(+1280, 100%, 50%, 0.4)', true],
                ['hsla(-160, 100%, 50%, 0.4)', true],
                ['hsla(-1240, 100%, 50%, 0.4)', true],
                ['hsl(200, 100%, 50%, 0.4)', false],
                ['hsla(200, 100%, 50%)', false],
            ],
            parse: [
                ['hsl(0, 100%, 50%)', [0, 100, 50]],
                ['hsl(200, 100%, 50%)', [200, 100, 50]],
                ['hsl(1280, 100%, 50%)', [200, 100, 50]],
                ['hsl(+200, 100%, 50%)', [200, 100, 50]],
                ['hsl(+1280, 100%, 50%)', [200, 100, 50]],
                ['hsl(-160, 100%, 50%)', [200, 100, 50]],
                ['hsl(-1240, 100%, 50%)', [200, 100, 50]],
                ['hsla(0, 100%, 50%, 0.4)', [0, 100, 50, 0.4]],
                ['hsla(200, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsla(1280, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsla(+200, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsla(+1280, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsla(-160, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsla(-1240, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsl(200, 100%, 50%, 0.4)', null],
                ['hsla(200, 100%, 50%)', null],
            ],
        },
        hsv: {
            toString: [
                [[200, 100, 50], 'hsv(200, 100%, 50%)'],
                [[200, 100, 50, 0.4], 'hsva(200, 100%, 50%, 0.4)'],
                [[200, 100, 50, 0], 'hsva(200, 100%, 50%, 0)'],
            ],
            test: [
                ['hsv(0, 100%, 50%)', true],
                ['hsv(200, 100%, 50%)', true],
                ['hsv(1280, 100%, 50%)', true],
                ['hsv(+200, 100%, 50%)', true],
                ['hsv(+1280, 100%, 50%)', true],
                ['hsv(-160, 100%, 50%)', true],
                ['hsv(-1240, 100%, 50%)', true],
                ['hsva(0, 100%, 50%, 0.4)', true],
                ['hsva(200, 100%, 50%, 0.4)', true],
                ['hsva(1280, 100%, 50%, 0.4)', true],
                ['hsva(+200, 100%, 50%, 0.4)', true],
                ['hsva(+1280, 100%, 50%, 0.4)', true],
                ['hsva(-160, 100%, 50%, 0.4)', true],
                ['hsva(-1240, 100%, 50%, 0.4)', true],
                ['hsv(200, 100%, 50%, 0.4)', false],
                ['hsva(200, 100%, 50%)', false],
            ],
            parse: [
                ['hsv(0, 100%, 50%)', [0, 100, 50]],
                ['hsv(200, 100%, 50%)', [200, 100, 50]],
                ['hsv(1280, 100%, 50%)', [200, 100, 50]],
                ['hsv(+200, 100%, 50%)', [200, 100, 50]],
                ['hsv(+1280, 100%, 50%)', [200, 100, 50]],
                ['hsv(-160, 100%, 50%)', [200, 100, 50]],
                ['hsv(-1240, 100%, 50%)', [200, 100, 50]],
                ['hsva(0, 100%, 50%, 0.4)', [0, 100, 50, 0.4]],
                ['hsva(200, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsva(1280, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsva(+200, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsva(+1280, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsva(-160, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsva(-1240, 100%, 50%, 0.4)', [200, 100, 50, 0.4]],
                ['hsv(200, 100%, 50%, 0.4)', null],
                ['hsva(200, 100%, 50%)', null],
            ],
        },
        gray: {
            toString: [
                [[50], 'gray(50)'],
            ],
            test: [
                ['gray(50)', true],
            ],
            parse: [
                ['gray(50)', [50]],
            ],
        },
        lumagray: {
            toString: [
                [[50], 'lumagray(50)'],
            ],
            test: [
                ['lumagray(50)', true],
            ],
            parse: [
                ['lumagray(50)', [50]],
            ],
        },
        keyword: {
            toString: [
                [['aqua'], 'aqua'],
            ],
            test: [
                ['aqua', true],
                ['aqua()', false],
            ],
            parse: [
                ['aqua', ['aqua']],
                ['aqua()', null],
            ],
        },
    };
    for (let [modelName, suite] of Object.entries(suites))
      t.test(`models.${modelName}`, (t) => {
          for (let [arg, expected] of Object.values(suite.toString))
            t.equal(models[modelName].toString(arg), expected);
          for (let [arg, expected] of Object.values(suite.test))
            t.equal(models[modelName].test(arg), expected);
          for (let [arg, expected] of Object.values(suite.parse))
            t.deepEqual(models[modelName].parse(arg), expected);
          
          t.end();
      });
    
    t.end();
});