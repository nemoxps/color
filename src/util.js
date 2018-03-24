let mathRound = require('lodash/round');


/**
 * @param {string} str
 * @returns {string}
 */
let toNormalizedHex = (str) => {
    return str.toUpperCase().replace(/^#([\da-f])([\da-f])([\da-f])$/i, '#$1$1$2$2$3$3');
};
/**
 * @param {string} str
 * @returns {string}
 */
let toShortHex = (str) => {
    return str.toUpperCase().replace(/^#([\da-f])\1([\da-f])\2([\da-f])\3$/i, '#$1$2$3');
};

/**
 * @param {int} num
 * @returns {int}
 */
let toNormalizedHue = (num) => {
    return (num % 360 + 360) % 360;
};

/**
 * @param {Array} rgb
 * @returns {number} Luma [0;1]
 */
let lumaOf = ([r, g, b]) => {
    let [sr, sg, sb] = [r, g, b].map((channel) => {
        channel /= 255;
        return (channel <= 0.03928) ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * sr + 0.7152 * sg + 0.0722 * sb;
};

/**
 * @param {Array} rgb
 * @returns {number} YIQ [0;255]
 */
let yiqOf = ([r, g, b]) => {
    return (299 * r + 587 * g + 114 * b) / 1000;
};

/**
 * Calculates the WCAG (Web Content Accessibility Guidelines) 2.0 color contrast compliance result of two colors.
 *
 * @param {Array} rgb1
 * @param {Array} rgb2
 * @returns {Object} .ratio [1;21]
 */
let wcagOf = (rgb1, rgb2) => {
    let luma1 = lumaOf(rgb1),
        luma2 = lumaOf(rgb2);
    let ratio = (Math.max(luma1, luma2) + 0.05) / (Math.min(luma1, luma2) + 0.05);
    return {
        ratio,
        // font-size: 12pt (16px) + font-weight: normal
        normalaa: ratio >= 4.5,
        normalaaa: ratio >= 7,
        // font-size: 18pt (24px) + font-weight: normal
        // font-size: 14pt (18.6667px) + font-weight: bold
        bigaa: ratio >= 3,
        bigaaa: ratio >= 4.5,
    };
};

let calc = (() => {
    let isNum = (str) => /^\d+(?:\.\d+)?$/.test(str);
    let isInt = (str) => /^\d+$/.test(str);
    let isSignedInt = (str) => /^[+-]?\d+$/.test(str);
    let isPc = (str) => /^(?:\d{1,2}|100)%$/.test(str);
    let isSignedPc = (str) => /^[+-]?(?:\d{1,2}|100)%$/.test(str);
    let isRelativePc = (str) => /^\d+%%$/.test(str);
    let isSignedRelativePc = (str) => /^[+-]?\d+%%$/.test(str);
    let calculate = (operator) => (num1, num2) => {
        if (operator === '+')
          return num1 + num2;
        if (operator === '-')
          return num1 - num2;
    };
    
    /**
     * @param {number} num
     * @param {(string|number)} input
     * @param {Object} options
     * @param {string} options.mode
     * @param {string[]} options.pattern
     * @param {int} [options.pcBase]
     * @param {(boolean|int)} [options.round=false]
     * @returns {number}
     * @throws {Error} Color~calc: Bad input.
     */
    return (num, input, { mode, pattern, pcBase, round = false }) => {
        input = String(input);
        
        switch (true)
        {
          case pattern.includes('num') && isNum(input):
          case pattern.includes('int') && isInt(input):
          case pattern.includes('sint') && isSignedInt(input):
            num = calculate(mode)(num, Number(input));
            break;
          
          case pattern.includes('%') && isPc(input):
          case pattern.includes('s%') && isSignedPc(input):
            num = calculate(mode)(num, pcBase / 100 * Number(input.slice(0, -1)));
            break;
          
          case pattern.includes('%%') && isRelativePc(input):
          case pattern.includes('s%%') && isSignedRelativePc(input):
            num = calculate(mode)(num, Math.abs(num) / 100 * Number(input.slice(0, -2)));
            break;
          
          default:
            throw new Error('Color~calc: Bad input.');
        }
        
        if (round)
          num = (round === true) ? Math.round(num) : mathRound(num, round);
        
        return num;
    };
})();


module.exports = {
    /* eslint-disable object-property-newline */
    toNormalizedHex, toShortHex, toNormalizedHue,
    lumaOf, yiqOf, wcagOf,
    calc,
    /* eslint-enable object-property-newline */
};