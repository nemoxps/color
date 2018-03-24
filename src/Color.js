let numClamp = require('lodash/clamp');
let strUpperFirst = require('lodash/upperFirst');

let _models = require('./_models');
let convert = require('./convert');
let getColorModel = require('./getColorModel');
let parseColor = require('./parseColor');
let util = require('./util');


/**
 * Class representing a color.
 */
class Color {
    /**
     * Creates a new Color.
     *
     * @param {Array} c A color array.
     * @param {string} modelName The color's model.
     */
    constructor(c, modelName) {
        this.c = c;
        this.modelName = modelName;
        Object.defineProperty(this, 'model', {
            value: _models[modelName],
        });
    }
    
    /**
     * Creates a Color from a color format.
     *
     * @param {(Color|string|Array)} o
     * @returns {Color}
     * @throws {Error} Color: Unsupported color model.
     */
    static from(o) {
        if (o instanceof Color)
          return o.clone();
        
        let modelName = getColorModel(o);
        if (!modelName)
          throw new Error('Color: Unsupported color model.');
        return new Color(parseColor(o, modelName), modelName);
    }
    
    /**
     * @param {Color} C
     * @returns {number} [0;1]
     */
    static luma(C) {
        return util.lumaOf(C.toRgb().c);
    }
    /**
     * @param {Color} C
     * @returns {number} [0;255]
     */
    static yiq(C) {
        return util.yiqOf(C.toRgb().c);
    }
    /**
     * @param {Color} C1
     * @param {Color} C2
     * @returns {Object}
     */
    static wcag(C1, C2) {
        return util.wcagOf(C1.toRgb().c, C2.toRgb().c);
    }
    /**
     * @param {Color} C1
     * @param {Color} C2
     * @returns {number} Brightness difference [0;255]
     */
    static brightnessDifference(C1, C2) {
        return Math.abs(Color.yiq(C1) - Color.yiq(C2));
    }
    /**
     * @param {Color} C1
     * @param {Color} C2
     * @returns {int} Color difference [0;765]
     */
    static colorDifference(C1, C2) {
        let [r1, g1, b1] = C1.toRgb().c,
            [r2, g2, b2] = C2.toRgb().c;
        return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    }
    /**
     * @param {Color} C1
     * @param {Color} C2
     * @param {Object} [options={}]
     * @param {int} [options.brightnessThreshold=125]
     * @param {int} [options.colorThreshold=500]
     * @returns {string} 'yes'|'sort of'|'no'
     */
    static isCompliant(C1, C2, { brightnessThreshold = 125, colorThreshold = 500 } = {}) {
        let brightnessDifference = Color.brightnessDifference(C1, C2);
        let colorDifference = Color.colorDifference(C1, C2);
        return (
          (brightnessDifference >= brightnessThreshold && colorDifference >= colorThreshold) ? 'yes' :
          (brightnessDifference >= brightnessThreshold || colorDifference >= colorThreshold) ? 'sort of' :
          'no'
        );
    }
    
    /**
     * @returns {boolean} `true` if the Color has an active alpha channel.
     */
    hasAlpha() {
        return this.c.length > this.model.channels;
    }
    /**
     * Adds the alpha channel if the model supports one.
     *
     * @returns {this}
     */
    useAlpha() {
        if (this.model.supportsAlpha && !this.hasAlpha())
          this.c[this.model.channels] = 1;
        return this;
    }
    /**
     * Removes the alpha channel.
     *
     * @returns {this}
     */
    removeAlpha() {
        if (this.model.supportsAlpha && this.hasAlpha())
          this.c.splice(this.model.channels, 1);
        return this;
    }
    
    /**
     * Clones the Color.
     *
     * @returns {Color}
     */
    clone() {
        return new Color(this.c, this.modelName);
    }
    /**
     * Stringifies the Color.
     *
     * @returns {string}
     */
    toString() {
        return this.model.toString(this.c);
    }
    /**
     * Removes the alpha channel.
     *
     * @returns {Color}
     */
    nofade() {
        return this.clone().removeAlpha();
    }
    
    /**
     * @param {(Color|string|Array)} o
     * @param {number} [alpha=1]
     * @returns {Color}
     */
    blend(o, alpha = 1) {
        alpha = numClamp(alpha, 0, 1);
        let C = this.toRgb().useAlpha();
        let oC = Color.from(o).toRgb().useAlpha();
        
        C.c = C.model.round(C.c.map((channel, index) => channel * (1 - alpha) + oC.c[index] * alpha));
        
        return C;
    }
    
    /**
     * @param {(Color|string|Array)} o
     * @param {int} [weight=50]
     * @returns {Color}
     */
    mix(o, weight = 50) {
        weight = numClamp(weight, 0, 100);
        let C = this.toRgb().useAlpha();
        let oC = Color.from(o).toRgb().useAlpha();
        
        let sw = weight / 100;
        let w = 2 * sw - 1;
        let a = C.c[3] - oC.c[3];
        let w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
        let w2 = 1 - w1;
        C.c = C.model.round([
            ...C.c.slice(0, 3).map((channel, index) => channel * w1 + oC.c[index] * w2),
            sw * C.c[3] + (1 - sw) * oC.c[3],
        ]);
        
        return C;
    }
    
    /**
     * @param {(Color|string|Array)} [oDark='#000']
     * @param {(Color|string|Array)} [oLight='#FFF']
     * @param {int} [threshold=43]
     * @returns {Color}
     */
    contrast(oDark = '#000', oLight = '#FFF', threshold = 43) {
        threshold = numClamp(threshold, 0, 100);
        let darkC = Color.from(oDark);
        let lightC = Color.from(oLight);
        if (Color.luma(darkC) > Color.luma(lightC))
          [darkC, lightC] = [lightC, darkC];
        
        return (Color.luma(this) * 100 >= threshold) ? darkC : lightC;
    }
    /**
     * @returns {Color}
     */
    yiqcontrast() {
        return Color.from((Color.yiq(this) >= 128) ? '#000' : '#FFF');
    }
    
    /**
     * @returns {Color}
     */
    grayscale() {
        return this.nofade().desaturate(100);
    }
}

let _convertTo = function (toName) {
    return convert[this.modelName][toName](this.c);
};
for (let [modelName, model] of Object.entries(_models))
{
  Color.prototype[`to${strUpperFirst(modelName)}`] = function () {
      return new Color(_convertTo.call(this, modelName), modelName);
  };
  Color.prototype[modelName] = function () {
      return model.toString(_convertTo.call(this, modelName));
  };
  if (model.altToString)
    for (let [altName, altFn] of Object.entries(model.altToString))
      Color.prototype[altName] = function () {
          return altFn(_convertTo.call(this, modelName));
      };
}

let createCalcFunctions = ({
    keys: [addKey, subKey],
    channelIndex,
    getColor,
    preCalc,
    ..._calcOptions
}) => {
    let createWithMode = (mode) => {
        let calcOptions = Object.assign({}, _calcOptions, { mode });
        
        return function (val) {
            let C = getColor.call(this);
            let { c } = C;
            
            if (preCalc)
              preCalc(C);
            c[channelIndex] = C.model.sanitize(util.calc(c[channelIndex], val, calcOptions), channelIndex);
            
            return C;
        };
    };
    
    return Object.assign(
        { [addKey]: createWithMode('+') },
        (subKey) ? { [subKey]: createWithMode('-') } : {}
    );
};
Object.assign(Color.prototype, createCalcFunctions({
    keys: ['unfade', 'fade'],
    channelIndex: 3,
    getColor() {
        return (this.model.supportsAlpha) ? this.clone() : this.toRgb();
    },
    preCalc: (C) => { C.useAlpha(); },
    pattern: ['num', '%', '%%'],
    pcBase: 1,
    round: 3,
}));
Object.assign(Color.prototype, createCalcFunctions({
    keys: ['spin'],
    channelIndex: 0,
    getColor() {
        return (['hsl', 'hsv'].includes(this.modelName)) ? this.clone() : this.toHsl();
    },
    pattern: ['sint', 's%', 's%%'],
    pcBase: 360,
    round: true,
}));
Object.assign(Color.prototype, createCalcFunctions({
    keys: ['saturate', 'desaturate'],
    channelIndex: 1,
    getColor() {
        return (['hsl', 'hsv'].includes(this.modelName)) ? this.clone() : this.toHsl();
    },
    pattern: ['int', '%', '%%'],
    pcBase: 100,
    round: true,
}));
Object.assign(Color.prototype, createCalcFunctions({
    keys: ['lighten', 'darken'],
    channelIndex: 2,
    getColor() {
        return this.toHsl();
    },
    pattern: ['int', '%', '%%'],
    pcBase: 100,
    round: true,
}));
Object.assign(Color.prototype, createCalcFunctions({
    keys: ['envalue', 'devalue'],
    channelIndex: 2,
    getColor() {
        return this.toHsv();
    },
    pattern: ['int', '%', '%%'],
    pcBase: 100,
    round: true,
}));


module.exports = Color;